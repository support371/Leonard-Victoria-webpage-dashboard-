/**
 * Leonard Workspace — Enterprise Portal API
 *
 * All routes are Leonard-workspace-scoped. Mounted at /api/portal/leonard in server/index.js.
 * The workspace slug is injected into req.params before requireWorkspaceAccess runs.
 */
const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const { requireWorkspaceAccess } = require('../middleware/workspace');
const { createAuditLog } = require('../services/auditLog');
const db = require('../services/db');
const { z } = require('zod');

// ── Inject workspace slug so requireWorkspaceAccess can find it ────────────
router.use((req, _res, next) => {
  req.params.workspaceSlug = 'leonard';
  next();
});
router.use(requireAuth);
router.use(requireWorkspaceAccess()); // sets req.workspace, req.workspaceRole

// ── Helpers ────────────────────────────────────────────────────────────────

function leonardId(req) {
  return req.workspace.id;
}

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: result.error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
      });
    }
    req.body = result.data;
    next();
  };
}

// ============================================================
// DASHBOARD  GET /api/portal/leonard/dashboard
// ============================================================
router.get('/dashboard', async (req, res, next) => {
  try {
    const wid = leonardId(req);

    const [
      clientsR, activeClientsR,
      holdingsR, allocationR,
      rePropertyR, incidentsR, alertsR,
      revenueR, activityR,
    ] = await Promise.all([
      db.query(`SELECT COUNT(*) AS total FROM clients WHERE workspace_id = $1`, [wid]),
      db.query(`SELECT COUNT(*) AS total FROM clients WHERE workspace_id = $1 AND status = 'active'`, [wid]),

      db.query(
        `SELECT COALESCE(SUM(total_value), 0) AS total_value FROM portfolio_holdings
         WHERE workspace_id = $1 AND status = 'active'`,
        [wid]
      ),
      db.query(
        `SELECT asset_category, COALESCE(SUM(total_value), 0) AS value
         FROM portfolio_holdings
         WHERE workspace_id = $1 AND status = 'active'
         GROUP BY asset_category`,
        [wid]
      ),
      db.query(
        `SELECT COUNT(*) AS total, COALESCE(SUM(market_value), 0) AS total_value
         FROM real_estate_assets WHERE workspace_id = $1 AND status = 'active'`,
        [wid]
      ),
      db.query(
        `SELECT COUNT(*) AS total FROM security_incidents
         WHERE workspace_id = $1 AND status NOT IN ('resolved', 'closed')`,
        [wid]
      ),
      db.query(
        `SELECT severity, COUNT(*) AS total
         FROM security_incidents
         WHERE workspace_id = $1 AND status NOT IN ('resolved', 'closed')
         GROUP BY severity`,
        [wid]
      ),
      db.query(
        `SELECT COALESCE(SUM(revenue_amount), 0) AS monthly_revenue
         FROM real_estate_assets
         WHERE workspace_id = $1 AND status = 'active' AND revenue_period = 'monthly'`,
        [wid]
      ),
      db.query(
        `SELECT action, actor_email, created_at FROM audit_logs
         WHERE workspace_id = $1
         ORDER BY created_at DESC LIMIT 15`,
        [wid]
      ),
    ]);

    const allocation = {};
    for (const row of allocationR.rows) {
      allocation[row.asset_category] = parseFloat(row.value);
    }

    const alertsBySeverity = {};
    for (const row of alertsR.rows) {
      alertsBySeverity[row.severity] = parseInt(row.total, 10);
    }
    const threatLevel =
      alertsBySeverity.critical > 0 ? 'critical' :
      alertsBySeverity.high > 0 ? 'high' :
      alertsBySeverity.medium > 0 ? 'medium' : 'low';

    res.json({
      workspace: { slug: req.workspace.slug, name: req.workspace.name },
      workspace_role: req.workspaceRole,
      stats: {
        total_clients:         parseInt(clientsR.rows[0].total, 10),
        active_clients:        parseInt(activeClientsR.rows[0].total, 10),
        total_portfolio_value: parseFloat(holdingsR.rows[0].total_value) +
                               parseFloat(rePropertyR.rows[0].total_value || 0),
        digital_asset_value:   allocation.digital_asset || 0,
        crypto_asset_value:    allocation.crypto_asset || 0,
        real_estate_value:     allocation.real_estate || 0,
        property_count:        parseInt(rePropertyR.rows[0].total, 10),
        monthly_revenue:       parseFloat(revenueR.rows[0].monthly_revenue || 0),
        open_incidents:        parseInt(incidentsR.rows[0].total, 10),
        threat_level:          threatLevel,
        alerts_by_severity:    alertsBySeverity,
      },
      recent_activity: activityR.rows.map((r) => ({
        action: r.action,
        actor: r.actor_email,
        timestamp: new Date(r.created_at).toLocaleString(),
      })),
    });
  } catch (err) {
    next(err);
  }
});

// ============================================================
// CLIENTS
// ============================================================

const clientSchema = z.object({
  full_name:        z.string().min(2),
  email:            z.string().email().optional().or(z.literal('')),
  phone:            z.string().optional(),
  company:          z.string().optional(),
  status:           z.enum(['prospect', 'active', 'inactive', 'archived']).default('prospect'),
  onboarding_stage: z.enum(['inquiry', 'application', 'review', 'onboarded', 'active', 'offboarded']).default('inquiry'),
  membership_tier:  z.enum(['community', 'stewardship', 'legacy']).optional().nullable(),
  notes:            z.string().optional(),
  next_followup:    z.string().datetime({ offset: true }).optional().nullable(),
});

router.get('/clients', async (req, res, next) => {
  try {
    const { status } = req.query;
    const params = [leonardId(req)];
    let filter = '';
    if (status) { params.push(status); filter = `AND c.status = $${params.length}`; }

    const { rows } = await db.query(
      `SELECT c.*,
              (SELECT COUNT(*) FROM portfolio_holdings ph
               WHERE ph.client_id = c.id AND ph.status = 'active') AS holding_count
       FROM clients c
       WHERE c.workspace_id = $1 ${filter}
       ORDER BY c.created_at DESC`,
      params
    );
    res.json({ clients: rows });
  } catch (err) { next(err); }
});

router.post('/clients', validate(clientSchema), async (req, res, next) => {
  try {
    const { full_name, email, phone, company, status, onboarding_stage, membership_tier, notes, next_followup } = req.body;
    const { rows } = await db.query(
      `INSERT INTO clients
         (workspace_id, full_name, email, phone, company, status, onboarding_stage, membership_tier, notes, next_followup, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [leonardId(req), full_name, email || null, phone || null, company || null,
       status, onboarding_stage, membership_tier || null, notes || null,
       next_followup || null, req.user.id]
    );
    await createAuditLog({
      workspace_id: leonardId(req),
      action: 'client.created',
      actor_id: req.user.id, actor_email: req.user.email,
      resource_type: 'client', resource_id: rows[0].id,
      metadata: { full_name },
    });
    res.status(201).json({ client: rows[0] });
  } catch (err) { next(err); }
});

router.get('/clients/:id', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT * FROM clients WHERE id = $1 AND workspace_id = $2`,
      [req.params.id, leonardId(req)]
    );
    if (!rows.length) return res.status(404).json({ error: 'Client not found' });

    const [accountsR, holdingsR] = await Promise.all([
      db.query(
        `SELECT * FROM portfolio_accounts WHERE client_id = $1 AND workspace_id = $2 ORDER BY created_at`,
        [req.params.id, leonardId(req)]
      ),
      db.query(
        `SELECT asset_category, COUNT(*) AS count, COALESCE(SUM(total_value), 0) AS total_value
         FROM portfolio_holdings WHERE client_id = $1 AND workspace_id = $2 AND status = 'active'
         GROUP BY asset_category`,
        [req.params.id, leonardId(req)]
      ),
    ]);

    res.json({
      client: rows[0],
      accounts: accountsR.rows,
      holdings_summary: holdingsR.rows,
    });
  } catch (err) { next(err); }
});

router.put('/clients/:id', validate(clientSchema), async (req, res, next) => {
  try {
    const { full_name, email, phone, company, status, onboarding_stage, membership_tier, notes, next_followup } = req.body;
    const { rows } = await db.query(
      `UPDATE clients SET
         full_name=$2, email=$3, phone=$4, company=$5, status=$6,
         onboarding_stage=$7, membership_tier=$8, notes=$9, next_followup=$10, updated_at=NOW()
       WHERE id=$1 AND workspace_id=$11 RETURNING *`,
      [req.params.id, full_name, email || null, phone || null, company || null,
       status, onboarding_stage, membership_tier || null, notes || null,
       next_followup || null, leonardId(req)]
    );
    if (!rows.length) return res.status(404).json({ error: 'Client not found' });
    res.json({ client: rows[0] });
  } catch (err) { next(err); }
});

// ============================================================
// PORTFOLIO
// ============================================================

router.get('/portfolio', async (req, res, next) => {
  try {
    const wid = leonardId(req);
    const [summaryR, accountsR, recentR] = await Promise.all([
      db.query(
        `SELECT asset_category,
                COUNT(*) AS holding_count,
                COALESCE(SUM(total_value), 0) AS total_value
         FROM portfolio_holdings
         WHERE workspace_id = $1 AND status = 'active'
         GROUP BY asset_category`,
        [wid]
      ),
      db.query(
        `SELECT pa.*, c.full_name AS client_name,
                COUNT(ph.id) AS holding_count,
                COALESCE(SUM(ph.total_value), 0) AS total_value
         FROM portfolio_accounts pa
         LEFT JOIN clients c ON c.id = pa.client_id
         LEFT JOIN portfolio_holdings ph ON ph.portfolio_account_id = pa.id AND ph.status = 'active'
         WHERE pa.workspace_id = $1
         GROUP BY pa.id, c.full_name
         ORDER BY pa.created_at DESC`,
        [wid]
      ),
      db.query(
        `SELECT ph.*, c.full_name AS client_name
         FROM portfolio_holdings ph
         LEFT JOIN clients c ON c.id = ph.client_id
         WHERE ph.workspace_id = $1
         ORDER BY ph.updated_at DESC LIMIT 10`,
        [wid]
      ),
    ]);

    const totals = { digital_asset: 0, crypto_asset: 0, real_estate: 0, grand_total: 0 };
    for (const row of summaryR.rows) {
      totals[row.asset_category] = parseFloat(row.total_value);
      totals.grand_total += parseFloat(row.total_value);
    }

    res.json({ totals, accounts: accountsR.rows, recent_holdings: recentR.rows });
  } catch (err) { next(err); }
});

function holdingsRoute(category) {
  return async (req, res, next) => {
    try {
      const { client_id, status } = req.query;
      const params = [leonardId(req), category];
      const filters = [];
      if (client_id) { params.push(client_id); filters.push(`ph.client_id = $${params.length}`); }
      if (status)    { params.push(status);    filters.push(`ph.status = $${params.length}`); }
      const where = filters.length ? `AND ${filters.join(' AND ')}` : '';

      const { rows } = await db.query(
        `SELECT ph.*, c.full_name AS client_name, pa.account_name
         FROM portfolio_holdings ph
         LEFT JOIN clients c ON c.id = ph.client_id
         LEFT JOIN portfolio_accounts pa ON pa.id = ph.portfolio_account_id
         WHERE ph.workspace_id = $1 AND ph.asset_category = $2 ${where}
         ORDER BY ph.total_value DESC`,
        params
      );
      res.json({ holdings: rows, asset_category: category });
    } catch (err) { next(err); }
  };
}

router.get('/portfolio/digital-assets', holdingsRoute('digital_asset'));
router.get('/portfolio/crypto',          holdingsRoute('crypto_asset'));
router.get('/portfolio/real-estate',     holdingsRoute('real_estate'));

const holdingSchema = z.object({
  client_id:            z.string().uuid().optional().nullable(),
  portfolio_account_id: z.string().uuid().optional().nullable(),
  asset_category:       z.enum(['digital_asset', 'crypto_asset', 'real_estate']),
  asset_subtype:        z.string().optional(),
  symbol_or_name:       z.string().min(1),
  quantity:             z.number().min(0),
  unit_value:           z.number().min(0),
  currency:             z.string().default('USD'),
  acquisition_date:     z.string().optional().nullable(),
  status:               z.enum(['active', 'sold', 'pending', 'frozen']).default('active'),
  notes:                z.string().optional(),
});

router.post('/portfolio/holdings', validate(holdingSchema), async (req, res, next) => {
  try {
    const {
      client_id, portfolio_account_id, asset_category, asset_subtype,
      symbol_or_name, quantity, unit_value, currency, acquisition_date, status, notes,
    } = req.body;
    const total_value = quantity * unit_value;
    const { rows } = await db.query(
      `INSERT INTO portfolio_holdings
         (workspace_id, client_id, portfolio_account_id, asset_category, asset_subtype,
          symbol_or_name, quantity, unit_value, total_value, currency, acquisition_date, status, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING *`,
      [leonardId(req), client_id || null, portfolio_account_id || null, asset_category, asset_subtype || null,
       symbol_or_name, quantity, unit_value, total_value, currency, acquisition_date || null, status, notes || null]
    );
    res.status(201).json({ holding: rows[0] });
  } catch (err) { next(err); }
});

router.put('/portfolio/holdings/:id', validate(holdingSchema), async (req, res, next) => {
  try {
    const { symbol_or_name, quantity, unit_value, asset_subtype, currency, acquisition_date, status, notes, client_id, portfolio_account_id } = req.body;
    const total_value = quantity * unit_value;
    const { rows } = await db.query(
      `UPDATE portfolio_holdings SET
         symbol_or_name=$2, quantity=$3, unit_value=$4, total_value=$5,
         asset_subtype=$6, currency=$7, acquisition_date=$8, status=$9, notes=$10,
         client_id=$11, portfolio_account_id=$12, updated_at=NOW()
       WHERE id=$1 AND workspace_id=$13 RETURNING *`,
      [req.params.id, symbol_or_name, quantity, unit_value, total_value,
       asset_subtype || null, currency, acquisition_date || null, status, notes || null,
       client_id || null, portfolio_account_id || null, leonardId(req)]
    );
    if (!rows.length) return res.status(404).json({ error: 'Holding not found' });
    res.json({ holding: rows[0] });
  } catch (err) { next(err); }
});

router.delete('/portfolio/holdings/:id', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `DELETE FROM portfolio_holdings WHERE id=$1 AND workspace_id=$2 RETURNING id`,
      [req.params.id, leonardId(req)]
    );
    if (!rows.length) return res.status(404).json({ error: 'Holding not found' });
    res.json({ deleted: rows[0].id });
  } catch (err) { next(err); }
});

// ============================================================
// REAL ESTATE MANAGEMENT
// ============================================================

const realEstateSchema = z.object({
  property_name:    z.string().min(2),
  property_type:    z.enum(['residential', 'commercial', 'industrial', 'land', 'mixed_use', 'other']).default('residential'),
  address:          z.string().optional(),
  city:             z.string().optional(),
  state_province:   z.string().optional(),
  country:          z.string().default('US'),
  market_value:     z.number().min(0).optional().nullable(),
  acquisition_date: z.string().optional().nullable(),
  acquisition_price: z.number().min(0).optional().nullable(),
  ownership_status: z.enum(['owned', 'partial', 'leased', 'under_contract', 'pending_sale', 'sold']).default('owned'),
  occupancy_status: z.enum(['occupied', 'vacant', 'partial', 'under_renovation']).default('vacant'),
  revenue_amount:   z.number().min(0).optional().nullable(),
  expense_amount:   z.number().min(0).optional().nullable(),
  revenue_period:   z.string().optional(),
  client_id:        z.string().uuid().optional().nullable(),
  status:           z.enum(['active', 'archived', 'sold']).default('active'),
  notes:            z.string().optional(),
});

router.get('/real-estate', async (req, res, next) => {
  try {
    const { status } = req.query;
    const params = [leonardId(req)];
    let filter = '';
    if (status) { params.push(status); filter = `AND re.status = $${params.length}`; }

    const { rows } = await db.query(
      `SELECT re.*, c.full_name AS client_name
       FROM real_estate_assets re
       LEFT JOIN clients c ON c.id = re.client_id
       WHERE re.workspace_id = $1 ${filter}
       ORDER BY re.created_at DESC`,
      params
    );
    res.json({ properties: rows });
  } catch (err) { next(err); }
});

router.post('/real-estate', validate(realEstateSchema), async (req, res, next) => {
  try {
    const f = req.body;
    const { rows } = await db.query(
      `INSERT INTO real_estate_assets
         (workspace_id, client_id, property_name, property_type, address, city, state_province,
          country, market_value, acquisition_date, acquisition_price, ownership_status,
          occupancy_status, revenue_amount, expense_amount, revenue_period, status, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
       RETURNING *`,
      [leonardId(req), f.client_id || null, f.property_name, f.property_type,
       f.address || null, f.city || null, f.state_province || null, f.country,
       f.market_value ?? null, f.acquisition_date || null, f.acquisition_price ?? null,
       f.ownership_status, f.occupancy_status, f.revenue_amount ?? null,
       f.expense_amount ?? null, f.revenue_period || 'monthly', f.status, f.notes || null]
    );
    await createAuditLog({
      workspace_id: leonardId(req),
      action: 'real_estate.created',
      actor_id: req.user.id, actor_email: req.user.email,
      resource_type: 'real_estate_asset', resource_id: rows[0].id,
      metadata: { property_name: f.property_name },
    });
    res.status(201).json({ property: rows[0] });
  } catch (err) { next(err); }
});

router.get('/real-estate/:id', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT re.*, c.full_name AS client_name
       FROM real_estate_assets re
       LEFT JOIN clients c ON c.id = re.client_id
       WHERE re.id = $1 AND re.workspace_id = $2`,
      [req.params.id, leonardId(req)]
    );
    if (!rows.length) return res.status(404).json({ error: 'Property not found' });
    res.json({ property: rows[0] });
  } catch (err) { next(err); }
});

router.put('/real-estate/:id', validate(realEstateSchema), async (req, res, next) => {
  try {
    const f = req.body;
    const { rows } = await db.query(
      `UPDATE real_estate_assets SET
         client_id=$2, property_name=$3, property_type=$4, address=$5, city=$6, state_province=$7,
         country=$8, market_value=$9, acquisition_date=$10, acquisition_price=$11,
         ownership_status=$12, occupancy_status=$13, revenue_amount=$14, expense_amount=$15,
         revenue_period=$16, status=$17, notes=$18, updated_at=NOW()
       WHERE id=$1 AND workspace_id=$19 RETURNING *`,
      [req.params.id, f.client_id || null, f.property_name, f.property_type,
       f.address || null, f.city || null, f.state_province || null, f.country,
       f.market_value ?? null, f.acquisition_date || null, f.acquisition_price ?? null,
       f.ownership_status, f.occupancy_status, f.revenue_amount ?? null,
       f.expense_amount ?? null, f.revenue_period || 'monthly', f.status, f.notes || null,
       leonardId(req)]
    );
    if (!rows.length) return res.status(404).json({ error: 'Property not found' });
    res.json({ property: rows[0] });
  } catch (err) { next(err); }
});

// ============================================================
// SECURITY OPERATIONS
// ============================================================

router.get('/security', async (req, res, next) => {
  try {
    const wid = leonardId(req);
    const [assetsR, openR, bySeverityR, recentR, coverageR] = await Promise.all([
      db.query(
        `SELECT COUNT(*) AS total,
                SUM(CASE WHEN monitoring_status='active' THEN 1 ELSE 0 END) AS monitored,
                SUM(CASE WHEN protection_status='protected' THEN 1 ELSE 0 END) AS protected
         FROM security_assets WHERE workspace_id = $1`,
        [wid]
      ),
      db.query(
        `SELECT COUNT(*) AS total FROM security_incidents
         WHERE workspace_id = $1 AND status NOT IN ('resolved','closed')`,
        [wid]
      ),
      db.query(
        `SELECT severity, COUNT(*) AS total
         FROM security_incidents
         WHERE workspace_id = $1 AND status NOT IN ('resolved','closed')
         GROUP BY severity ORDER BY
           CASE severity WHEN 'critical' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3
                         WHEN 'low' THEN 4 ELSE 5 END`,
        [wid]
      ),
      db.query(
        `SELECT si.*, sa.asset_name
         FROM security_incidents si
         LEFT JOIN security_assets sa ON sa.id = si.security_asset_id
         WHERE si.workspace_id = $1
         ORDER BY si.detected_at DESC LIMIT 10`,
        [wid]
      ),
      db.query(
        `SELECT criticality,
                COUNT(*) AS total,
                SUM(CASE WHEN protection_status='protected' THEN 1 ELSE 0 END) AS protected
         FROM security_assets WHERE workspace_id = $1
         GROUP BY criticality`,
        [wid]
      ),
    ]);

    const bySev = {};
    for (const row of bySeverityR.rows) bySev[row.severity] = parseInt(row.total, 10);

    const assets = assetsR.rows[0];
    res.json({
      assets: {
        total:     parseInt(assets.total, 10),
        monitored: parseInt(assets.monitored, 10),
        protected: parseInt(assets.protected, 10),
      },
      incidents: {
        open:         parseInt(openR.rows[0].total, 10),
        by_severity:  bySev,
        threat_level: bySev.critical > 0 ? 'critical' : bySev.high > 0 ? 'high' :
                      bySev.medium > 0 ? 'medium' : 'low',
      },
      recent_incidents: recentR.rows,
      coverage_by_criticality: coverageR.rows,
    });
  } catch (err) { next(err); }
});

router.get('/security/incidents', async (req, res, next) => {
  try {
    const { status, severity } = req.query;
    const params = [leonardId(req)];
    const filters = [];
    if (status)   { params.push(status);   filters.push(`si.status = $${params.length}`); }
    if (severity) { params.push(severity); filters.push(`si.severity = $${params.length}`); }
    const where = filters.length ? `AND ${filters.join(' AND ')}` : '';

    const { rows } = await db.query(
      `SELECT si.*, sa.asset_name
       FROM security_incidents si
       LEFT JOIN security_assets sa ON sa.id = si.security_asset_id
       WHERE si.workspace_id = $1 ${where}
       ORDER BY si.detected_at DESC`,
      params
    );
    res.json({ incidents: rows });
  } catch (err) { next(err); }
});

const incidentSchema = z.object({
  title:             z.string().min(3),
  description:       z.string().optional(),
  severity:          z.enum(['critical', 'high', 'medium', 'low', 'info']).default('medium'),
  status:            z.enum(['open', 'investigating', 'contained', 'resolved', 'closed']).default('open'),
  incident_type:     z.string().optional(),
  security_asset_id: z.string().uuid().optional().nullable(),
  detected_at:       z.string().datetime({ offset: true }).optional(),
  assigned_to:       z.string().optional(),
  resolution_notes:  z.string().optional(),
});

router.post('/security/incidents', validate(incidentSchema), async (req, res, next) => {
  try {
    const f = req.body;
    const { rows } = await db.query(
      `INSERT INTO security_incidents
         (workspace_id, security_asset_id, title, description, severity, status,
          incident_type, detected_at, assigned_to)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [leonardId(req), f.security_asset_id || null, f.title, f.description || null,
       f.severity, f.status, f.incident_type || null,
       f.detected_at ? new Date(f.detected_at) : new Date(), f.assigned_to || null]
    );
    await createAuditLog({
      workspace_id: leonardId(req),
      action: 'security_incident.created',
      actor_id: req.user.id, actor_email: req.user.email,
      resource_type: 'security_incident', resource_id: rows[0].id,
      metadata: { title: f.title, severity: f.severity },
    });
    res.status(201).json({ incident: rows[0] });
  } catch (err) { next(err); }
});

router.patch('/security/incidents/:id', async (req, res, next) => {
  try {
    const { status, resolution_notes, assigned_to } = req.body;
    const resolved_at = ['resolved', 'closed'].includes(status) ? new Date() : null;
    const { rows } = await db.query(
      `UPDATE security_incidents SET
         status=COALESCE($2,status),
         resolution_notes=COALESCE($3,resolution_notes),
         assigned_to=COALESCE($4,assigned_to),
         resolved_at=COALESCE($5,resolved_at),
         updated_at=NOW()
       WHERE id=$1 AND workspace_id=$6 RETURNING *`,
      [req.params.id, status || null, resolution_notes || null, assigned_to || null,
       resolved_at, leonardId(req)]
    );
    if (!rows.length) return res.status(404).json({ error: 'Incident not found' });
    res.json({ incident: rows[0] });
  } catch (err) { next(err); }
});

router.get('/security/assets', async (req, res, next) => {
  try {
    const { criticality, monitoring_status } = req.query;
    const params = [leonardId(req)];
    const filters = [];
    if (criticality)       { params.push(criticality);       filters.push(`criticality = $${params.length}`); }
    if (monitoring_status) { params.push(monitoring_status); filters.push(`monitoring_status = $${params.length}`); }
    const where = filters.length ? `AND ${filters.join(' AND ')}` : '';

    const { rows } = await db.query(
      `SELECT sa.*,
              (SELECT COUNT(*) FROM security_incidents si
               WHERE si.security_asset_id = sa.id AND si.status NOT IN ('resolved','closed')
              ) AS open_incident_count
       FROM security_assets sa
       WHERE sa.workspace_id = $1 ${where}
       ORDER BY
         CASE criticality WHEN 'critical' THEN 1 WHEN 'high' THEN 2
                          WHEN 'medium' THEN 3 ELSE 4 END,
         sa.asset_name`,
      params
    );
    res.json({ assets: rows });
  } catch (err) { next(err); }
});

const securityAssetSchema = z.object({
  asset_name:        z.string().min(2),
  asset_type:        z.enum(['endpoint', 'server', 'network', 'cloud', 'application', 'identity', 'data', 'other']).default('endpoint'),
  criticality:       z.enum(['critical', 'high', 'medium', 'low']).default('medium'),
  owner_name:        z.string().optional(),
  monitoring_status: z.enum(['active', 'inactive', 'degraded', 'unknown']).default('active'),
  protection_status: z.enum(['protected', 'partial', 'unprotected', 'unknown']).default('protected'),
  ip_address:        z.string().optional(),
  location:          z.string().optional(),
  notes:             z.string().optional(),
});

router.post('/security/assets', validate(securityAssetSchema), async (req, res, next) => {
  try {
    const f = req.body;
    const { rows } = await db.query(
      `INSERT INTO security_assets
         (workspace_id, asset_name, asset_type, criticality, owner_name,
          monitoring_status, protection_status, ip_address, location, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [leonardId(req), f.asset_name, f.asset_type, f.criticality, f.owner_name || null,
       f.monitoring_status, f.protection_status, f.ip_address || null,
       f.location || null, f.notes || null]
    );
    res.status(201).json({ asset: rows[0] });
  } catch (err) { next(err); }
});

router.patch('/security/assets/:id', async (req, res, next) => {
  try {
    const { monitoring_status, protection_status, last_checked_at } = req.body;
    const { rows } = await db.query(
      `UPDATE security_assets SET
         monitoring_status = COALESCE($2, monitoring_status),
         protection_status = COALESCE($3, protection_status),
         last_checked_at   = COALESCE($4, last_checked_at),
         updated_at        = NOW()
       WHERE id=$1 AND workspace_id=$5 RETURNING *`,
      [req.params.id, monitoring_status || null, protection_status || null,
       last_checked_at || null, leonardId(req)]
    );
    if (!rows.length) return res.status(404).json({ error: 'Asset not found' });
    res.json({ asset: rows[0] });
  } catch (err) { next(err); }
});

// ============================================================
// REPORTS
// ============================================================
router.get('/reports', async (req, res, next) => {
  try {
    const wid = leonardId(req);

    const [holdingsR, reR, clientsR, incidentsR, assetsR] = await Promise.all([
      db.query(
        `SELECT asset_category,
                COUNT(*) AS count,
                COALESCE(SUM(total_value), 0) AS total_value,
                currency
         FROM portfolio_holdings
         WHERE workspace_id = $1 AND status = 'active'
         GROUP BY asset_category, currency`,
        [wid]
      ),
      db.query(
        `SELECT property_type, ownership_status, occupancy_status,
                COUNT(*) AS count,
                COALESCE(SUM(market_value), 0) AS total_market_value,
                COALESCE(SUM(revenue_amount), 0) AS total_revenue,
                COALESCE(SUM(expense_amount), 0) AS total_expense
         FROM real_estate_assets
         WHERE workspace_id = $1 AND status = 'active'
         GROUP BY property_type, ownership_status, occupancy_status`,
        [wid]
      ),
      db.query(
        `SELECT status, onboarding_stage, membership_tier, COUNT(*) AS count
         FROM clients WHERE workspace_id = $1
         GROUP BY status, onboarding_stage, membership_tier`,
        [wid]
      ),
      db.query(
        `SELECT severity, status, COUNT(*) AS count
         FROM security_incidents WHERE workspace_id = $1
         GROUP BY severity, status`,
        [wid]
      ),
      db.query(
        `SELECT asset_type, criticality, monitoring_status, protection_status, COUNT(*) AS count
         FROM security_assets WHERE workspace_id = $1
         GROUP BY asset_type, criticality, monitoring_status, protection_status`,
        [wid]
      ),
    ]);

    res.json({
      generated_at: new Date().toISOString(),
      workspace: req.workspace.name,
      portfolio_summary:  holdingsR.rows,
      real_estate_summary: reR.rows,
      client_summary:     clientsR.rows,
      security_incidents: incidentsR.rows,
      security_assets:    assetsR.rows,
    });
  } catch (err) { next(err); }
});

// ============================================================
// SETTINGS
// ============================================================
router.get('/settings', async (req, res, next) => {
  try {
    const [wsR, membersR] = await Promise.all([
      db.query(`SELECT * FROM workspaces WHERE id = $1`, [leonardId(req)]),
      db.query(
        `SELECT up.id, up.email, up.full_name, up.global_role,
                wm.workspace_role, wm.status AS membership_status, wm.created_at AS granted_at
         FROM workspace_memberships wm
         JOIN user_profiles up ON up.id = wm.user_id
         WHERE wm.workspace_id = $1
         ORDER BY wm.created_at`,
        [leonardId(req)]
      ),
    ]);
    res.json({
      workspace: wsR.rows[0],
      members:   membersR.rows,
    });
  } catch (err) { next(err); }
});

router.put('/settings', async (req, res, next) => {
  try {
    const { settings } = req.body;
    if (typeof settings !== 'object') {
      return res.status(400).json({ error: 'settings must be an object' });
    }
    const { rows } = await db.query(
      `UPDATE workspaces SET settings = $2 WHERE id = $1 RETURNING *`,
      [leonardId(req), JSON.stringify(settings)]
    );
    res.json({ workspace: rows[0] });
  } catch (err) { next(err); }
});

module.exports = router;

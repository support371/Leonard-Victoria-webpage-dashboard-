const { createClient } = require('@supabase/supabase-js');

let _client = null;

function getSupabaseAdmin() {
  if (!_client) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
    }
    _client = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return _client;
}

// Proxy object so existing code using `supabaseAdmin.auth.getUser()` etc. still works
const supabaseAdmin = new Proxy({}, {
  get(_target, prop) {
    return getSupabaseAdmin()[prop];
  },
});

module.exports = { supabaseAdmin };

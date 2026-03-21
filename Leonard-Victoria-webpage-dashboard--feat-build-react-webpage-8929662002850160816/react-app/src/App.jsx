import React, { useState, useMemo } from 'react';
import {
  Shield,
  Layout,
  FileText,
  Users,
  Globe,
  CheckCircle,
  AlertCircle,
  Search,
  Lock,
  Download,
  Eye,
  Server,
  Layers,
  ArrowRight,
  Clock,
  AlertTriangle,
  Circle,
  TrendingUp,
  Calendar,
  ChevronRight,
} from 'lucide-react';

const TEAM_MEMBERS = [
  { name: "Leonard M Diana", role: "Project Lead", image: "LM" },
  { name: "Victoria Eleanor", role: "Operations Director", image: "VE" },
  { name: "Bernard", role: "Legal Counsel (Agent)", image: "AB" },
];

const ALL_FILES = [
  { id: 101, name: "GDPR_Compliance_Audit_v4.pdf", category: "Legal", status: "Approved", owner: "Bernard", date: "2023-10-24", size: "4.2 MB" },
  { id: 102, name: "Terms_of_Service_Draft.docx", category: "Legal", status: "Review", owner: "Bernard", date: "2023-10-22", size: "1.1 MB" },
  { id: 103, name: "IP_Protection_Framework.pdf", category: "Legal", status: "Pending", owner: "Bernard", date: "2023-10-20", size: "3.5 MB" },
  { id: 104, name: "Data_Privacy_Addendum.pdf", category: "Legal", status: "Approved", owner: "Bernard", date: "2023-10-15", size: "2.8 MB" },
  { id: 201, name: "Project_Charter_Final.pdf", category: "Project", status: "Final", owner: "Leonard M Diana", date: "2023-09-10", size: "5.5 MB" },
  { id: 202, name: "Q4_Financial_Projections.xlsx", category: "Finance", status: "Draft", owner: "Victoria Eleanor", date: "2023-10-23", size: "8.2 MB" },
  { id: 203, name: "Brand_Identity_Assets.zip", category: "Design", status: "Final", owner: "Design Team", date: "2023-10-01", size: "156 MB" },
  { id: 204, name: "System_Architecture_Diagram.png", category: "Technical", status: "Final", owner: "Dev Team", date: "2023-10-18", size: "4.1 MB" },
];

const COMPLIANCE_ITEMS = [
  {
    id: 1,
    area: "GDPR Compliance",
    status: "Compliant",
    lastReviewed: "Oct 24, 2023",
    nextDue: "Jan 24, 2024",
    owner: "Bernard",
    notes: "Full audit completed. Data processing agreements updated.",
    severity: "low",
  },
  {
    id: 2,
    area: "Terms of Service",
    status: "In Review",
    lastReviewed: "Oct 22, 2023",
    nextDue: "Nov 5, 2023",
    owner: "Bernard",
    notes: "Section 4.2 requires revision for EU market alignment.",
    severity: "medium",
  },
  {
    id: 3,
    area: "IP Protection Framework",
    status: "Action Required",
    lastReviewed: "Oct 20, 2023",
    nextDue: "Oct 30, 2023",
    owner: "Bernard",
    notes: "Patent filings pending. Requires sign-off from project leads.",
    severity: "high",
  },
  {
    id: 4,
    area: "Data Privacy Addendum",
    status: "Compliant",
    lastReviewed: "Oct 15, 2023",
    nextDue: "Apr 15, 2024",
    owner: "Bernard",
    notes: "Addendum signed by all parties. Stored in repository.",
    severity: "low",
  },
  {
    id: 5,
    area: "Cookie Policy",
    status: "Compliant",
    lastReviewed: "Sep 30, 2023",
    nextDue: "Mar 30, 2024",
    owner: "Bernard",
    notes: "Banner and consent flows verified across all regions.",
    severity: "low",
  },
  {
    id: 6,
    area: "Security Audit (SOC 2)",
    status: "In Review",
    lastReviewed: "Oct 10, 2023",
    nextDue: "Nov 15, 2023",
    owner: "Dev Team",
    notes: "External auditor engaged. Preliminary findings under review.",
    severity: "medium",
  },
];

const RECENT_ACTIVITY = [
  { id: 1, user: "Bernard", action: "Approved GDPR Compliance Audit v4", time: "2 hours ago", type: "approve" },
  { id: 2, user: "Victoria", action: "Uploaded Q4 Financial Projections", time: "5 hours ago", type: "upload" },
  { id: 3, user: "Leonard", action: "Reviewed IP Protection Framework", time: "Yesterday", type: "review" },
  { id: 4, user: "Bernard", action: "Flagged Terms of Service for revision", time: "Yesterday", type: "flag" },
  { id: 5, user: "Dev Team", action: "Updated System Architecture Diagram", time: "2 days ago", type: "upload" },
];

const Badge = ({ children, color }) => {
  const styles = {
    green: "bg-green-100 text-green-800 border-green-200",
    blue: "bg-blue-100 text-blue-800 border-blue-200",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
    red: "bg-red-100 text-red-800 border-red-200",
    purple: "bg-purple-100 text-purple-800 border-purple-200",
    gray: "bg-gray-100 text-gray-800 border-gray-200",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[color] || styles.gray}`}>
      {children}
    </span>
  );
};

const Sidebar = ({ activeTab, setActiveTab, currentRole }) => {
  const menuItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: Layout },
    { id: 'files', label: 'Central Repository', icon: Server },
    { id: 'preview', label: 'Live Site Preview', icon: Globe },
    { id: 'compliance', label: 'Legal Status', icon: Shield },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-full shadow-xl z-20 shrink-0">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Layers className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-bold tracking-tight">Nexus<span className="text-blue-500">Dash</span></h2>
        </div>
        <p className="text-xs text-slate-500 mt-2 font-mono">Project ID: XJ-994</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 translate-x-1'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon className={`w-5 h-5 mr-3 ${activeTab === item.id ? 'text-white' : 'text-slate-500'}`} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className={`rounded-xl p-4 border ${currentRole === 'legal' ? 'bg-indigo-900/20 border-indigo-500/30' : 'bg-blue-900/20 border-blue-500/30'}`}>
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Current Access</p>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${currentRole === 'legal' ? 'bg-indigo-500' : 'bg-blue-500'}`}></div>
            <span className="font-bold text-sm">
              {currentRole === 'management' ? 'Management' : 'Legal Counsel'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Header = ({ currentRole, setCurrentRole }) => (
  <header className="bg-white border-b border-gray-200 h-16 px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm shrink-0">
    <div className="flex items-center text-gray-400">
      <Search className="w-4 h-4 mr-3" />
      <input
        type="text"
        placeholder="Search files, tasks, or regulations..."
        className="bg-transparent border-none focus:ring-0 text-sm w-80 text-gray-700 placeholder-gray-400 outline-none"
      />
    </div>

    <div className="flex items-center space-x-6">
      <div className="flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200">
        <button
          onClick={() => setCurrentRole('management')}
          className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
            currentRole === 'management' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Management View
        </button>
        <button
          onClick={() => setCurrentRole('legal')}
          className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
            currentRole === 'legal' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Legal View
        </button>
      </div>

      <div className="h-6 w-px bg-gray-200"></div>

      <div className="flex items-center space-x-3">
        <div className="text-right hidden md:block">
          <p className="text-sm font-bold text-gray-900">{currentRole === 'management' ? 'Leonard & Victoria' : 'Agent Bernard'}</p>
          <p className="text-xs text-gray-500">{currentRole === 'management' ? 'Project Owners' : 'Compliance Officer'}</p>
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md ${
          currentRole === 'management' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-r from-indigo-600 to-purple-600'
        }`}>
          {currentRole === 'management' ? 'LM' : 'AB'}
        </div>
      </div>
    </div>
  </header>
);

const FileRepository = ({ currentRole }) => {
  const [filter, setFilter] = useState('All');

  const categories = currentRole === 'legal'
    ? ['All', 'Legal']
    : ['All', 'Legal', 'Project', 'Finance'];

  const filteredFiles = useMemo(() => {
    let files = currentRole === 'legal' ? ALL_FILES.filter(f => f.category === 'Legal') : ALL_FILES;
    if (filter === 'All') return files;
    return files.filter(f => f.category === filter);
  }, [filter, currentRole]);

  const statusColor = (status) => {
    if (status === 'Approved' || status === 'Final') return 'green';
    if (status === 'Review' || status === 'Draft') return 'yellow';
    if (status === 'Pending') return 'blue';
    return 'gray';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Central Repository</h1>
          <p className="text-sm text-gray-500 mt-1">
            {currentRole === 'legal'
              ? 'Legal documents and compliance certificates under your purview.'
              : 'Core documentation, compliance certificates, and financial reports.'}
          </p>
        </div>
        <div className="flex space-x-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === cat
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">File Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Owner</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Size</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredFiles.map((file) => (
              <tr key={file.id} className="hover:bg-blue-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <FileText className={`w-5 h-5 mr-3 flex-shrink-0 ${file.category === 'Legal' ? 'text-indigo-500' : 'text-blue-500'}`} />
                    <span className="font-medium text-gray-900 text-sm">{file.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge color={file.category === 'Legal' ? 'purple' : 'gray'}>{file.category}</Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge color={statusColor(file.status)}>{file.status}</Badge>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{file.owner}</td>
                <td className="px-6 py-4 text-sm text-gray-400 font-mono">{file.date}</td>
                <td className="px-6 py-4 text-right text-sm text-gray-500 font-mono">{file.size}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-gray-900 rounded-md hover:bg-gray-100">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredFiles.length === 0 && (
          <div className="p-12 text-center text-gray-400">No files found in this category.</div>
        )}
      </div>
    </div>
  );
};

const ComplianceView = ({ currentRole }) => {
  const statusConfig = {
    'Compliant': { color: 'green', icon: CheckCircle, dot: 'bg-green-500' },
    'In Review': { color: 'yellow', icon: Clock, dot: 'bg-yellow-500' },
    'Action Required': { color: 'red', icon: AlertTriangle, dot: 'bg-red-500' },
  };

  const summary = {
    compliant: COMPLIANCE_ITEMS.filter(i => i.status === 'Compliant').length,
    inReview: COMPLIANCE_ITEMS.filter(i => i.status === 'In Review').length,
    actionRequired: COMPLIANCE_ITEMS.filter(i => i.status === 'Action Required').length,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Legal Status</h1>
        <p className="text-sm text-gray-500 mt-1">
          {currentRole === 'legal'
            ? 'Your active compliance portfolio — items requiring attention are highlighted.'
            : 'Overview of all legal and regulatory compliance areas managed by Agent Bernard.'}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center space-x-4">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{summary.compliant}</p>
            <p className="text-xs text-gray-500">Compliant</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center space-x-4">
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{summary.inReview}</p>
            <p className="text-xs text-gray-500">In Review</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center space-x-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{summary.actionRequired}</p>
            <p className="text-xs text-gray-500">Action Required</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-700">Compliance Areas</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {COMPLIANCE_ITEMS.map((item) => {
            const config = statusConfig[item.status];
            const Icon = config.icon;
            return (
              <div key={item.id} className={`px-6 py-5 hover:bg-gray-50 transition-colors ${item.severity === 'high' ? 'border-l-4 border-red-400' : item.severity === 'medium' ? 'border-l-4 border-yellow-400' : 'border-l-4 border-transparent'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1 min-w-0">
                    <div className={`mt-0.5 w-8 h-8 rounded-full ${item.severity === 'high' ? 'bg-red-100' : item.severity === 'medium' ? 'bg-yellow-100' : 'bg-green-100'} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-4 h-4 ${item.severity === 'high' ? 'text-red-600' : item.severity === 'medium' ? 'text-yellow-600' : 'text-green-600'}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="font-semibold text-gray-900 text-sm">{item.area}</h3>
                        <Badge color={config.color}>{item.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{item.notes}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>Reviewed: {item.lastReviewed}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>Next due: {item.nextDue}</span>
                        </span>
                        <span>Owner: <span className="font-medium text-gray-600">{item.owner}</span></span>
                      </div>
                    </div>
                  </div>
                  <button className="ml-4 flex items-center text-xs font-medium text-blue-600 hover:text-blue-800 shrink-0">
                    Details <ChevronRight className="w-3 h-3 ml-0.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const WebsitePreview = () => (
  <div className="h-full flex flex-col bg-gray-100 rounded-lg overflow-hidden border border-gray-300 shadow-2xl animate-in zoom-in-95 duration-500">
    <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center space-x-4 shrink-0">
      <div className="flex space-x-1.5">
        <div className="w-3 h-3 rounded-full bg-red-400"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
        <div className="w-3 h-3 rounded-full bg-green-400"></div>
      </div>
      <div className="flex-1 bg-gray-100 rounded-md px-3 py-1.5 text-xs text-gray-600 flex items-center justify-center font-mono relative">
        <Lock className="w-3 h-3 text-green-600 absolute left-3" />
        https://astra-project.dev/preview
      </div>
      <div className="w-16"></div>
    </div>

    <div className="flex-1 overflow-y-auto bg-slate-900 text-white scroll-smooth">
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black opacity-60"></div>
        <div className="relative max-w-7xl mx-auto text-center z-10">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium mb-8">
            <span className="flex h-2 w-2 rounded-full bg-indigo-400 mr-2 animate-pulse"></span>
            Compliance Intelligence Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Secure Your Future <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Without Compromise.</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
            Astra automates the legal complexity of modern enterprise.
            Built by experts, managed by intelligence.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors">
              Get Started
            </button>
            <button className="px-8 py-3 rounded-full font-bold border border-slate-700 hover:bg-slate-800 transition-colors">
              View Documentation
            </button>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Meet the Leadership</h2>
            <p className="text-slate-400">The minds behind the infrastructure.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TEAM_MEMBERS.map((member, idx) => (
              <div key={idx} className="group bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-all">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-xl font-bold text-white mb-6 group-hover:scale-110 transition-transform">
                  {member.image}
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                <p className={`text-sm font-medium ${member.role.includes("Agent") ? 'text-indigo-400' : 'text-blue-400'}`}>
                  {member.role}
                </p>
                <p className="text-slate-500 text-sm mt-4 leading-relaxed">
                  Driving the vision and ensuring strict adherence to global standards for the project's success.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 bg-black border-t border-slate-900 text-center">
        <p className="text-slate-600 text-sm">© 2024 Astra Project. All rights reserved.</p>
      </footer>
    </div>
  </div>
);

const DashboardHome = ({ currentRole }) => {
  const activityTypeConfig = {
    approve: { color: 'text-green-600 bg-green-100', icon: CheckCircle },
    upload: { color: 'text-blue-600 bg-blue-100', icon: TrendingUp },
    review: { color: 'text-yellow-600 bg-yellow-100', icon: Eye },
    flag: { color: 'text-red-600 bg-red-100', icon: AlertCircle },
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
      <div className={`rounded-2xl p-8 text-white shadow-lg ${
        currentRole === 'management'
          ? 'bg-gradient-to-r from-blue-600 to-indigo-700'
          : 'bg-gradient-to-r from-indigo-700 to-purple-700'
      }`}>
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {currentRole === 'management' ? 'Leonard' : 'Bernard'}
        </h1>
        <p className="text-blue-100 max-w-2xl">
          {currentRole === 'management'
            ? 'You have full administrative access. The legal compliance review is currently 85% complete.'
            : 'You are in Legal Mode. 2 documents require your immediate attention regarding GDPR protocols.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium text-sm">Project Health</h3>
            <span className="text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full text-xs font-bold">Good</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">94%</div>
          <p className="text-xs text-gray-400">Uptime &amp; Performance</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium text-sm">Compliance Score</h3>
            <Shield className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">A+</div>
          <p className="text-xs text-gray-400">Audited by Agent Bernard</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium text-sm">Active Users</h3>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">1,240</div>
          <p className="text-xs text-green-600 flex items-center">
            <ArrowRight className="w-3 h-3 mr-1 -rotate-45" /> +12% this week
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700">Recent Activity</h2>
            <span className="text-xs text-gray-400">{RECENT_ACTIVITY.length} events</span>
          </div>
          <div className="divide-y divide-gray-50">
            {RECENT_ACTIVITY.map((item) => {
              const conf = activityTypeConfig[item.type];
              const Icon = conf.icon;
              return (
                <div key={item.id} className="px-6 py-4 flex items-start space-x-3 hover:bg-gray-50 transition-colors">
                  <div className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${conf.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800">
                      <span className="font-semibold">{item.user}</span>{' '}
                      <span className="text-gray-600">{item.action}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700">Compliance Snapshot</h2>
            <button className="text-xs text-blue-600 font-medium hover:underline">View all</button>
          </div>
          <div className="p-6 space-y-4">
            {COMPLIANCE_ITEMS.slice(0, 4).map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    item.status === 'Compliant' ? 'bg-green-500' :
                    item.status === 'In Review' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm text-gray-700">{item.area}</span>
                </div>
                <Badge color={
                  item.status === 'Compliant' ? 'green' :
                  item.status === 'In Review' ? 'yellow' : 'red'
                }>
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [currentRole, setCurrentRole] = useState('management');
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-slate-900 overflow-hidden">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          currentRole={currentRole}
          setCurrentRole={setCurrentRole}
        />

        <main className="flex-1 overflow-y-auto p-8 relative">
          {activeTab === 'overview' && <DashboardHome currentRole={currentRole} />}
          {activeTab === 'files' && <FileRepository currentRole={currentRole} />}
          {activeTab === 'preview' && <WebsitePreview />}
          {activeTab === 'compliance' && <ComplianceView currentRole={currentRole} />}
        </main>
      </div>
    </div>
  );
};

export default App;

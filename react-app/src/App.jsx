import React, { useState, useMemo } from 'react';
import {
  Shield,
  Layout,
  FileText,
  Users,
  Globe,
  CheckCircle,
  AlertCircle,
  Menu,
  Bell,
  Search,
  ExternalLink,
  Lock,
  ChevronRight,
  Briefcase,
  Filter,
  Download,
  Eye,
  Server,
  Layers,
  ArrowRight
} from 'lucide-react';

// --- Mock Data ---

const TEAM_MEMBERS = [
  { name: "Leonard M Diana", role: "Project Lead", image: "LM" },
  { name: "Victoria Eleanor", role: "Operations Director", image: "VE" },
  { name: "Bernard", role: "Legal Counsel (Agent)", image: "AB" }
];

const ALL_FILES = [
  // Legal / Compliance Files
  { id: 101, name: "GDPR_Compliance_Audit_v4.pdf", category: "Legal", status: "Approved", owner: "Bernard", date: "2023-10-24", size: "4.2 MB" },
  { id: 102, name: "Terms_of_Service_Draft.docx", category: "Legal", status: "Review", owner: "Bernard", date: "2023-10-22", size: "1.1 MB" },
  { id: 103, name: "IP_Protection_Framework.pdf", category: "Legal", status: "Pending", owner: "Bernard", date: "2023-10-20", size: "3.5 MB" },
  { id: 104, name: "Data_Privacy_Addendum.pdf", category: "Legal", status: "Approved", owner: "Bernard", date: "2023-10-15", size: "2.8 MB" },

  // Project / Core Files
  { id: 201, name: "Project_Charter_Final.pdf", category: "Project", status: "Final", owner: "Leonard M Diana", date: "2023-09-10", size: "5.5 MB" },
  { id: 202, name: "Q4_Financial_Projections.xlsx", category: "Finance", status: "Draft", owner: "Victoria Eleanor", date: "2023-10-23", size: "8.2 MB" },
  { id: 203, name: "Brand_Identity_Assets.zip", category: "Design", status: "Final", owner: "Design Team", date: "2023-10-01", size: "156 MB" },
  { id: 204, name: "System_Architecture_Diagram.png", category: "Technical", status: "Final", owner: "Dev Team", date: "2023-10-18", size: "4.1 MB" },
];

// --- Components ---

const Badge = ({ children, color }) => {
  const styles = {
    green: "bg-green-100 text-green-800 border-green-200",
    blue: "bg-blue-100 text-blue-800 border-blue-200",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
    purple: "bg-purple-100 text-purple-800 border-purple-200",
    gray: "bg-gray-100 text-gray-800 border-gray-200",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[color] || styles.gray}`}>
      {children}
    </span>
  );
};

// 1. Sidebar
const Sidebar = ({ activeTab, setActiveTab, currentRole }) => {
  const menuItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: Layout },
    { id: 'files', label: 'Central Repository', icon: Server }, // Unified files
    { id: 'preview', label: 'Live Site Preview', icon: Globe },
    { id: 'compliance', label: 'Legal Status', icon: Shield },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-full shadow-xl z-20">
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

      {/* Role Indicator Card */}
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

// 2. Header & Role Switcher
const Header = ({ currentRole, setCurrentRole }) => (
  <header className="bg-white border-b border-gray-200 h-16 px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
    <div className="flex items-center text-gray-400">
      <Search className="w-4 h-4 mr-3" />
      <input
        type="text"
        placeholder="Search files, tasks, or regulations..."
        className="bg-transparent border-none focus:ring-0 text-sm w-96 text-gray-700 placeholder-gray-400"
      />
    </div>

    <div className="flex items-center space-x-6">
      {/* Access Control Switcher */}
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

// 3. Unified File Repository View
const FileRepository = ({ currentRole }) => {
  const [filter, setFilter] = useState('All');

  const filteredFiles = useMemo(() => {
    if (filter === 'All') return ALL_FILES;
    return ALL_FILES.filter(f => f.category === filter || (filter === 'Legal' && f.category === 'Legal'));
  }, [filter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Central Repository</h1>
          <p className="text-sm text-gray-500 mt-1">
            Access core documentation, compliance certificates, and financial reports.
          </p>
        </div>
        <div className="flex space-x-2">
          {['All', 'Legal', 'Project', 'Finance'].map(cat => (
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
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Size</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredFiles.map((file) => (
              <tr key={file.id} className="hover:bg-blue-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <FileText className={`w-5 h-5 mr-3 ${file.category === 'Legal' ? 'text-indigo-500' : 'text-blue-500'}`} />
                    <span className="font-medium text-gray-900">{file.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge color={file.category === 'Legal' ? 'purple' : 'gray'}>{file.category}</Badge>
                </td>
                <td className="px-6 py-4">
                   {file.category === 'Legal' ? (
                     <Badge color={file.status === 'Approved' ? 'green' : 'yellow'}>{file.status}</Badge>
                   ) : (
                     <span className="text-sm text-gray-500">{file.status}</span>
                   )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {file.owner}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-500 font-mono">
                  {file.size}
                </td>
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
          <div className="p-12 text-center text-gray-400">
            No files found in this category.
          </div>
        )}
      </div>
    </div>
  );
};

// 4. Enhanced Website Preview (The "Site Under Development")
const WebsitePreview = () => (
  <div className="h-full flex flex-col bg-gray-100 rounded-lg overflow-hidden border border-gray-300 shadow-2xl animate-in zoom-in-95 duration-500">
    {/* Browser Bar */}
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

    {/* The Actual Site Content */}
    <div className="flex-1 overflow-y-auto bg-slate-900 text-white scroll-smooth">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black opacity-60"></div>
        <div className="relative max-w-7xl mx-auto text-center z-10">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium mb-8">
            <span className="flex h-2 w-2 rounded-full bg-indigo-400 mr-2 animate-pulse"></span>
            Compliance Intelligence Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Secure Your Future <br/>
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

      {/* Team Section (Explicit Requirement) */}
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

       {/* Footer */}
       <footer className="py-12 bg-black border-t border-slate-900 text-center">
         <p className="text-slate-600 text-sm">© 2024 Astra Project. All rights reserved.</p>
       </footer>
    </div>
  </div>
);

// 5. Dashboard Home (Overview)
const DashboardHome = ({ currentRole }) => (
  <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
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
          <span className="text-green-500 bg-green-50 px-2 py-1 rounded text-xs font-bold">Good</span>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">94%</div>
        <p className="text-xs text-gray-400">Uptime & Performance</p>
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
        <p className="text-xs text-gray-400 text-green-600 flex items-center">
           <ArrowRight className="w-3 h-3 mr-1 -rotate-45" /> +12% this week
        </p>
      </div>
    </div>
  </div>
);

// --- Main App ---

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

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          currentRole={currentRole}
          setCurrentRole={setCurrentRole}
        />

        <main className="flex-1 overflow-y-auto p-8 relative">
           {activeTab === 'overview' && <DashboardHome currentRole={currentRole} />}
           {activeTab === 'files' && <FileRepository currentRole={currentRole} />}
           {activeTab === 'preview' && <WebsitePreview />}
           {activeTab === 'compliance' && <FileRepository currentRole={currentRole} />} {/* Reusing File Repo for compliance shortcut */}
        </main>
      </div>
    </div>
  );
};

export default App;

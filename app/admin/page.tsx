'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Settings, 
  LogOut, 
  Plus, 
  Search,
  Filter,
  ArrowUpDown,
  ExternalLink,
  Trash2,
  Edit2,
  Menu,
  X,
  TrendingUp,
  BarChart3,
  Globe,
  PieChart,
  Eye,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamically import ReactQuill for SSR compatibility with ref forwarding
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill-new');
    return ({ forwardedRef, ...props }: any) => <RQ ref={forwardedRef} {...props} />;
  },
  {
    ssr: false,
    loading: () => <div className="h-64 bg-zinc-50 animate-pulse rounded-xl" />
  }
);
import 'react-quill-new/dist/quill.snow.css';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leads' | 'listings' | 'blog'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [stats, setStats] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState<'listing' | 'blog' | null>(null);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [newListing, setNewListing] = useState({
    title: '', developer: '', location: '', priceRange: '', 
    image: '',
    images: [] as string[],
    type: 'Nigeria', overview: '', order: 0, featured: true
  });

  const [newPost, setNewPost] = useState<any>({
    title: '', content: '', excerpt: '', category: 'Investment', 
    coverImage: '',
    published: true
  });

  const router = useRouter();

  const uploadToCloudinary = async (file: File) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

    if (!cloudName || !apiKey) {
      alert('Cloudinary cloud name or API key missing in .env');
      return null;
    }

    setIsUploading(true);
    try {
      // 1. Get signature + upload_preset from our API (server uses trimmed preset)
      const signRes = await fetch('/api/admin/upload-sign');
      if (!signRes.ok) {
        const err = await signRes.json();
        alert(`Upload sign error: ${err.error} — ${err.detail ?? ''}`);
        return null;
      }
      const { signature, timestamp, upload_preset } = await signRes.json();

      // 2. Upload to Cloudinary with signed parameters
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', String(timestamp));
      formData.append('signature', signature);
      formData.append('upload_preset', upload_preset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.error) {
        console.error('Cloudinary upload error:', data.error);
        alert(`Image upload failed: ${data.error.message}`);
        return null;
      }
      return data.secure_url as string;
    } catch (error) {
      console.error('Upload error:', error);
      alert('Image upload failed — check console for details');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be an API call to /api/auth/login
    // For this implementation, we use environment variables check simulation
    if (email === 'admin@atlanticproperty.com' && password === 'atlantic_secure_admin_2026') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
    } else {
      alert('Invalid Credentials');
    }
  };

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth === 'true') setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      let endpoint = '';
      if (activeTab === 'dashboard') endpoint = '/api/admin/stats';
      else if (activeTab === 'leads') endpoint = '/api/leads';
      else if (activeTab === 'listings') endpoint = '/api/listings';
      else if (activeTab === 'blog') endpoint = '/api/blog';
      
      const res = await fetch(endpoint);
      const data = await res.json();
      
      if (!res.ok) {
        console.error('API Error:', data.error);
        if (activeTab === 'dashboard') setStats({ stats: { totalLeads: 0, nigeriaLeads: 0, ukLeads: 0, highScoringLeads: 0, totalListings: 0, totalPosts: 0, estimatedPotential: 0 }, recentLeads: [] });
        return;
      }
      
      if (activeTab === 'dashboard') setStats(data);
      else if (activeTab === 'leads') setLeads(Array.isArray(data) ? data : []);
      else if (activeTab === 'listings') setListings(Array.isArray(data) ? data : []);
      else if (activeTab === 'blog') setBlogPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
  };

  const handleAddListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newListing)
      });
      const data = await res.json();
      if (res.ok) {
        setShowModal(null);
        fetchData();
        setNewListing({ title: '', developer: '', location: '', priceRange: '', image: '', images: [], type: 'Nigeria', overview: '', order: 0, featured: true });
        alert('✅ Listing created successfully!');
      } else {
        console.error('Listing creation failed:', data);
        alert(`Failed to create listing: ${data.detail ?? data.error ?? 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding listing:', error);
      alert('Network error — check console for details');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const isEditing = !!newPost._id;
      const url = isEditing ? `/api/blog/${newPost._id}` : '/api/blog';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      });
      if (res.ok) {
        setShowModal(null);
        fetchData();
        setNewPost({ title: '', content: '', excerpt: '', category: 'Investment', coverImage: '', published: true });
      } else {
        const data = await res.json();
        alert(`Failed to save post: ${data.error}`);
      }
    } catch (error) {
      console.error('Error adding post:', error);
      alert('Network error while saving post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Custom Image Handler for Rich Text Editor
  const quillRef = React.useRef<any>(null);

  const imageHandler = React.useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        const url = await uploadToCloudinary(file);
        if (url && quillRef.current) {
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection();
          quill.insertEmbed(range.index, 'image', url);
        }
      }
    };
  }, []);

  const quillModules = React.useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), [imageHandler]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-10 rounded-3xl shadow-2xl">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-brand-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-brand-gold/20">
              <Building2 className="h-8 w-8 text-brand-gold" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 font-heading tracking-tight">Atlantic Property Admin</h1>
            <p className="text-zinc-500 text-sm">Sign in to manage your premium assets</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">Email Address</label>
              <input 
                type="email" 
                className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                placeholder="admin@atlanticproperty.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">Password</label>
              <input 
                type="password" 
                className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="w-full btn-gold py-4 rounded-xl shadow-lg shadow-brand-gold/10">Unlock Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-emerald-950 text-white p-4 flex justify-between items-center sticky top-0 z-30 shadow-lg">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-brand-gold" />
          <span className="font-bold tracking-tight">ATLANTIC <span className="text-brand-gold text-xs uppercase">Management</span></span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-white/10 rounded-lg">
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-40 md:hidden" />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-emerald-950 text-white p-6 flex flex-col z-50 transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="hidden md:flex items-center gap-2 mb-12">
          <Building2 className="h-6 w-6 text-brand-gold" />
          <span className="font-bold tracking-tight text-lg">ATLANTIC <span className="text-brand-gold uppercase text-[10px] tracking-widest">Admin</span></span>
        </div>

        <nav className="flex-1 space-y-2">
          <button onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-white/10 text-brand-gold' : 'text-emerald-100/60 hover:bg-white/5'}`}>
            <BarChart3 className="h-4 w-4" /> Analytics
          </button>
          <button onClick={() => { setActiveTab('leads'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'leads' ? 'bg-white/10 text-brand-gold' : 'text-emerald-100/60 hover:bg-white/5'}`}>
            <Users className="h-4 w-4" /> CRM Leads
          </button>
          <button onClick={() => { setActiveTab('listings'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'listings' ? 'bg-white/10 text-brand-gold' : 'text-emerald-100/60 hover:bg-white/5'}`}>
            <LayoutDashboard className="h-4 w-4" /> Properties
          </button>
          <button onClick={() => { setActiveTab('blog'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'blog' ? 'bg-white/10 text-brand-gold' : 'text-emerald-100/60 hover:bg-white/5'}`}>
            <FileText className="h-4 w-4" /> Blog CMS
          </button>
          <div className="pt-8 pb-4">
            <div className="h-[1px] bg-emerald-900 mx-4"></div>
          </div>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-emerald-100/60 hover:bg-white/5 transition-all">
            <Settings className="h-4 w-4" /> Settings
          </button>
        </nav>

        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 transition-colors text-sm font-medium mt-auto">
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 overflow-x-hidden">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-emerald-950 font-heading">
              {activeTab === 'dashboard' ? 'Business Overview' : activeTab === 'leads' ? 'Lead Pipeline' : activeTab === 'listings' ? 'Property Inventory' : 'Content Management'}
            </h2>
            <p className="text-zinc-500 text-sm mt-1">Real-time performance and control.</p>
          </div>
          
          {activeTab !== 'dashboard' && activeTab !== 'leads' && (
            <button 
              onClick={() => {
                if(activeTab === 'blog') setNewPost({ title: '', content: '', excerpt: '', category: 'Investment', coverImage: '', published: true });
                setShowModal(activeTab === 'listings' ? 'listing' : 'blog');
              }}
              className="btn-primary flex items-center justify-center gap-2 py-3 px-6 text-sm shadow-xl shadow-emerald-950/10"
            >
              <Plus className="h-4 w-4" /> Add {activeTab === 'listings' ? 'Listing' : 'Post'}
            </button>
          )}
        </header>

        {activeTab === 'dashboard' && stats && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-emerald-50 rounded-2xl text-brand-emerald">
                    <Users className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
                </div>
                <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">Total Enquiries</h3>
                <p className="text-2xl font-bold text-emerald-950">{stats?.stats?.totalLeads ?? 0}</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-brand-gold/10 rounded-2xl text-brand-gold">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold text-brand-gold bg-brand-gold/5 px-2 py-1 rounded-full">High Quality</span>
                </div>
                <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">Qualified Leads</h3>
                <p className="text-2xl font-bold text-emerald-950">{stats?.stats?.highScoringLeads ?? 0}</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-zinc-50 rounded-2xl text-zinc-600">
                    <Globe className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">NGR vs UK Split</h3>
                <p className="text-2xl font-bold text-emerald-950">{stats?.stats?.nigeriaLeads ?? 0} / {stats?.stats?.ukLeads ?? 0}</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">Pipeline Potential</h3>
                <p className="text-2xl font-bold text-emerald-950">High Yield</p>
              </div>
            </div>

            {/* Recent Leads */}
            <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-zinc-50 flex justify-between items-center">
                <h3 className="font-bold text-emerald-950">Recent Enquiries</h3>
                <button onClick={() => setActiveTab('leads')} className="text-xs text-brand-gold font-bold hover:underline">View Pipeline</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-zinc-50/50">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Name</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Market</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Score</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {stats?.recentLeads?.map((lead: any) => (
                      <tr key={lead._id}>
                        <td className="px-6 py-4">
                          <div className="font-bold text-sm text-zinc-900">{lead.name}</div>
                          <div className="text-xs text-zinc-500">{lead.email}</div>
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-zinc-600">{lead.type}</td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${lead.score > 50 ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                            {lead.score} pts
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-zinc-400">{new Date(lead.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'leads' || activeTab === 'listings' || activeTab === 'blog') && (
          <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden overflow-x-auto custom-scrollbar">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-zinc-50/50 border-b border-zinc-100">
                <tr>
                  {activeTab === 'leads' ? (
                    <>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Contact Details</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Market Interest</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Budget / Profile</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Lead Score</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Date</th>
                      <th className="px-6 py-4"></th>
                    </>
                  ) : activeTab === 'listings' ? (
                    <>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">ID</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Property Listing</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Location</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Developer</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Featured</th>
                      <th className="px-6 py-4"></th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Article Title</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Category</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Author</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Created At</th>
                      <th className="px-6 py-4"></th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-400 italic">Processing real-time data...</td>
                  </tr>
                ) : activeTab === 'leads' ? (
                  leads.map((lead: any) => (
                    <tr key={lead._id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-emerald-950">{lead.name}</div>
                        <div className="text-xs text-zinc-500">{lead.email} | {lead.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${lead.type === 'UK' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          {lead.type} Investment
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-zinc-900">{lead.budget || '—'}</div>
                        <div className="text-[10px] text-zinc-400 uppercase font-bold">{lead.data?.fundingType || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${lead.score >= 50 ? 'bg-brand-emerald text-white shadow-lg shadow-brand-emerald/20' : 'bg-orange-50 text-orange-600'}`}>
                          {lead.score} / 100
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-zinc-400">{new Date(lead.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          className="p-2 hover:bg-zinc-100 rounded-xl text-zinc-400 hover:text-brand-emerald transition-all"
                          title="View Details"
                          onClick={() => setSelectedLead(lead)}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : activeTab === 'listings' ? (
                  listings.map((listing: any) => (
                    <tr key={listing._id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className={`inline-flex px-2 py-1 rounded-lg text-[10px] font-mono font-bold tracking-wider ${
                          listing.type === 'UK' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {listing.listingId || '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {listing.image && (
                            <img src={listing.image} alt={listing.title} className="w-10 h-10 rounded-lg object-cover border border-zinc-100 flex-shrink-0" />
                          )}
                          <div>
                            <div className="font-bold text-emerald-950">{listing.title}</div>
                            <div className="text-xs text-zinc-500">{listing.type} Market</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-600">{listing.location}</td>
                      <td className="px-6 py-4 text-sm text-zinc-900 font-medium">{listing.developer}</td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold ${listing.featured ? 'bg-brand-gold/10 text-brand-gold' : 'bg-zinc-50 text-zinc-400'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${listing.featured ? 'bg-brand-gold' : 'bg-zinc-300'}`}></div>
                          {listing.featured ? 'FEATURED' : 'STANDARD'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button className="p-2 hover:bg-zinc-100 rounded-xl text-zinc-400 hover:text-emerald-600 transition-all" title="View on site">
                          <ExternalLink className="h-4 w-4" />
                        </button>
                        <button 
                          className="p-2 hover:bg-zinc-100 rounded-xl text-red-400 hover:text-red-600 transition-all"
                          title="Delete listing"
                          onClick={async (e) => {
                            e.preventDefault();
                            if (!confirm(`Delete "${listing.title}"? This cannot be undone.`)) return;
                            try {
                              const res = await fetch(`/api/listings/${listing._id}`, { method: 'DELETE' });
                              if (res.ok) {
                                fetchData();
                              } else {
                                const data = await res.json();
                                alert(`Failed to delete: ${data.error ?? 'Unknown error'}`);
                              }
                            } catch (err) {
                              alert('Network error while deleting.');
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  blogPosts.map((post: any) => (
                    <tr key={post._id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-emerald-950">{post.title}</div>
                        <div className="text-[10px] text-zinc-400 font-mono">/{post.slug}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-brand-gold bg-brand-gold/5 px-2 py-1 rounded uppercase tracking-wider">{post.category}</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-zinc-700">{post.author}</td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase ${post.published ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-500'}`}>
                          {post.published ? 'LIVE ON SITE' : 'DRAFT'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-zinc-400">{new Date(post.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button 
                          className="p-2 hover:bg-zinc-100 rounded-xl text-zinc-400 hover:text-emerald-600 transition-all"
                          title="Edit post"
                          onClick={() => {
                            setNewPost(post);
                            setShowModal('blog');
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          className="p-2 hover:bg-zinc-100 rounded-xl text-red-400 hover:text-red-600 transition-all"
                          title="Delete post"
                          onClick={async () => {
                            if (!confirm(`Delete blog post "${post.title}"?`)) return;
                            try {
                              const res = await fetch(`/api/blog/${post._id}`, { method: 'DELETE' });
                              if (res.ok) fetchData();
                              else alert('Failed to delete blog post');
                            } catch (err) {
                              alert('Network error deleting blog post');
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            
            {((activeTab === 'leads' && leads.length === 0) || (activeTab === 'listings' && listings.length === 0) || (activeTab === 'blog' && blogPosts.length === 0)) && !isLoading && (
              <div className="p-20 text-center text-zinc-400">
                <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-zinc-100">
                  <Filter className="h-5 w-5 text-zinc-300" />
                </div>
                <p className="text-sm font-medium">No records found for this section.</p>
                <p className="text-xs mt-1">Start by adding new content or capturing leads.</p>
              </div>
            )}
          </div>
        )}

        {/* MODALS */}
        <AnimatePresence>
          {showModal === 'listing' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                  <h3 className="text-xl font-bold text-emerald-950 font-heading">Add New Property</h3>
                  <button onClick={() => setShowModal(null)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors"><X className="h-5 w-5" /></button>
                </div>
                <form onSubmit={handleAddListing} className="p-8 space-y-6 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Property Hero Image</label>
                      <div className="flex items-center gap-4">
                        {newListing.image && <img src={newListing.image} className="w-16 h-16 rounded-lg object-cover border border-zinc-100" />}
                        <input 
                          type="file" 
                          accept="image/*"
                          className="text-xs text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-brand-emerald hover:file:bg-emerald-100 cursor-pointer"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = await uploadToCloudinary(file);
                              if (url) setNewListing({...newListing, image: url, images: [url]});
                            }
                          }}
                        />
                        {isUploading && <span className="text-[10px] text-brand-gold animate-pulse font-bold">Uploading...</span>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Property Title</label>
                      <input required type="text" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-emerald/10 outline-none transition-all" value={newListing.title} onChange={(e) => setNewListing({...newListing, title: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Market Type</label>
                      <select className="w-full px-4 py-2.5 rounded-xl border border-zinc-200" value={newListing.type} onChange={(e) => setNewListing({...newListing, type: e.target.value as any})}>
                        <option value="Nigeria">Nigeria</option>
                        <option value="UK">United Kingdom</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Developer</label>
                      <input required type="text" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200" value={newListing.developer} onChange={(e) => setNewListing({...newListing, developer: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Location</label>
                      <input required type="text" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200" value={newListing.location} onChange={(e) => setNewListing({...newListing, location: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Price Range</label>
                      <input required type="text" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200" value={newListing.priceRange} onChange={(e) => setNewListing({...newListing, priceRange: e.target.value})} placeholder="e.g. ₦85M - ₦250M" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Display Order</label>
                      <input type="number" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200" value={newListing.order} onChange={(e) => setNewListing({...newListing, order: parseInt(e.target.value)})} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Overview / Description</label>
                    <textarea required rows={4} className="w-full px-4 py-2.5 rounded-xl border border-zinc-200" value={newListing.overview} onChange={(e) => setNewListing({...newListing, overview: e.target.value})} />
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                    <button type="button" onClick={() => setShowModal(null)} className="px-6 py-2.5 text-sm font-bold text-zinc-400 hover:text-zinc-600 transition-colors">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="btn-primary px-8 py-2.5 text-sm">{isSubmitting ? 'Saving...' : 'Save Property'}</button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}

          {showModal === 'blog' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                  <h3 className="text-xl font-bold text-emerald-950 font-heading">Compose Insight</h3>
                  <button onClick={() => setShowModal(null)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors"><X className="h-5 w-5" /></button>
                </div>
                <form onSubmit={handleAddPost} className="p-8 space-y-6 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Article Cover Image</label>
                      <div className="flex items-center gap-4">
                        {newPost.coverImage && <img src={newPost.coverImage} className="w-16 h-16 rounded-lg object-cover border border-zinc-100" />}
                        <input 
                          type="file" 
                          accept="image/*"
                          className="text-xs text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-brand-emerald hover:file:bg-emerald-100 cursor-pointer"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = await uploadToCloudinary(file);
                              if (url) setNewPost({...newPost, coverImage: url});
                            }
                          }}
                        />
                        {isUploading && <span className="text-[10px] text-brand-gold animate-pulse font-bold">Uploading...</span>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Article Title</label>
                      <input required type="text" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200" value={newPost.title} onChange={(e) => setNewPost({...newPost, title: e.target.value})} />
                    </div>
                    <div className="flex items-end pb-1.5 justify-end">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded text-brand-emerald" checked={newPost.published} onChange={(e) => setNewPost({...newPost, published: e.target.checked})} />
                        <span className="text-sm font-medium text-zinc-600">Publish immediately</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Category</label>
                    <input required type="text" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200" value={newPost.category} onChange={(e) => setNewPost({...newPost, category: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Short Excerpt</label>
                    <input required type="text" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200" value={newPost.excerpt} onChange={(e) => setNewPost({...newPost, excerpt: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Article Content (Full Rich Text)</label>
                    <div className="bg-zinc-50 rounded-xl overflow-hidden border border-zinc-200">
                      <ReactQuill 
                        forwardedRef={quillRef}
                        theme="snow" 
                        value={newPost.content} 
                        onChange={(content: string) => setNewPost({...newPost, content})}
                        modules={quillModules}
                        className="h-64"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-12 border-t border-zinc-100">
                    <button type="button" onClick={() => setShowModal(null)} className="px-6 py-2.5 text-sm font-bold text-zinc-400 hover:text-zinc-600 transition-colors">Cancel</button>
                    <button type="submit" disabled={isSubmitting || isUploading} className="btn-primary px-8 py-2.5 text-sm">
                      {isSubmitting ? 'Publishing...' : 'Publish Article'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Lead View Modal */}
        <AnimatePresence>
          {selectedLead && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-emerald-950/40 backdrop-blur-sm" onClick={() => setSelectedLead(null)} />
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 text-brand-emerald rounded-xl flex items-center justify-center">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-emerald-950">Lead Profile</h2>
                      <p className="text-xs text-zinc-500">Submitted on {new Date(selectedLead.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedLead(null)} className="p-2 hover:bg-white rounded-full text-zinc-400 transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Full Name</p>
                        <p className="font-semibold text-zinc-900">{selectedLead.name}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Email</p>
                        <a href={`mailto:${selectedLead.email}`} className="font-semibold text-brand-emerald hover:underline">{selectedLead.email}</a>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Phone</p>
                        <a href={`tel:${selectedLead.phone}`} className="font-semibold text-zinc-900 hover:text-brand-emerald">{selectedLead.phone}</a>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Location</p>
                        <p className="font-semibold text-zinc-900">{selectedLead.location || selectedLead.data?.location || 'Not provided'}</p>
                      </div>
                    </div>

                    {/* Investment Strategy */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Target Market</p>
                        <div className={`inline-flex px-2.5 py-1 rounded-md text-xs font-bold uppercase ${selectedLead.type === 'UK' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
                          {selectedLead.type}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Budget Range</p>
                        <p className="font-semibold text-zinc-900">{selectedLead.budget || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Funding Type</p>
                        <p className="font-semibold text-zinc-900">{selectedLead.data?.fundingType || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Lead Score</p>
                        <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${selectedLead.score >= 50 ? 'bg-brand-emerald text-white shadow-lg shadow-brand-emerald/20' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                          {selectedLead.score} / 100
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Conditional Info */}
                  {(selectedLead.data?.annualIncome || selectedLead.data?.employmentStatus || selectedLead.data?.developmentInterest) && (
                    <div className="mt-8 pt-6 border-t border-zinc-100">
                      <h3 className="text-sm font-bold text-emerald-950 mb-4 flex items-center gap-2"><FileText className="h-4 w-4 text-brand-gold" /> Additional Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedLead.data?.annualIncome && (
                          <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Annual Income</p>
                            <p className="font-semibold text-zinc-900">{selectedLead.data.annualIncome}</p>
                          </div>
                        )}
                        {selectedLead.data?.employmentStatus && (
                          <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Employment</p>
                            <p className="font-semibold text-zinc-900">{selectedLead.data.employmentStatus}</p>
                          </div>
                        )}
                        {selectedLead.data?.developmentInterest && (
                          <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100 md:col-span-2">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Specific Property Interest</p>
                            <p className="font-semibold text-brand-emerald">{selectedLead.data.developmentInterest}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-6 border-t border-zinc-100 bg-zinc-50 flex justify-end gap-3">
                  <button onClick={() => setSelectedLead(null)} className="px-6 py-2 rounded-xl text-sm font-bold text-zinc-600 bg-white border border-zinc-200 hover:bg-zinc-50 transition-colors">
                    Close Profile
                  </button>
                  <a href={`mailto:${selectedLead.email}`} className="btn-primary px-6 py-2 text-sm flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" /> Send Email
                  </a>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

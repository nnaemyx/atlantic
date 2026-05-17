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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leads' | 'listings' | 'blog' | 'content' | 'settings'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [stats, setStats] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [siteContent, setSiteContent] = useState<any[]>([]);
  const [pageContent, setPageContent] = useState<Record<string, string>>({});
  const [pageContentSaving, setPageContentSaving] = useState<Record<string, boolean>>({});
  const [activePage, setActivePage] = useState('home');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState<'listing' | 'blog' | 'content' | null>(null);
  const [editingListingId, setEditingListingId] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const blankListing = {
    title: '', developer: '', developerBio: '', location: '', priceRange: '',
    image: '',
    images: [] as string[],
    type: 'Nigeria', overview: '', order: 0, featured: true,
    beds: '' as any, rooms: '' as any,
    amenity1: '', amenity2: '', amenity3: '', amenity4: '', amenity5: '', amenity6: ''
  };
  const [newListing, setNewListing] = useState<any>(blankListing);

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
      else if (activeTab === 'settings' || activeTab === 'content') endpoint = '/api/site-content';
      
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
      else if (activeTab === 'settings') setSiteContent(Array.isArray(data) ? data : []);
      else if (activeTab === 'content') {
        // Convert array to key-value map
        const map: Record<string, string> = {};
        (Array.isArray(data) ? data : []).forEach((item: any) => { map[item.key] = item.value; });
        setPageContent(map);
      }
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
      const isEditing = !!editingListingId;
      const url = isEditing ? `/api/listings/${editingListingId}` : '/api/listings';
      const method = isEditing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newListing)
      });
      const data = await res.json();
      if (res.ok) {
        setShowModal(null);
        setEditingListingId(null);
        fetchData();
        setNewListing(blankListing);
        alert(isEditing ? '✅ Listing updated!' : '✅ Listing created successfully!');
      } else {
        alert(`Failed: ${data.detail ?? data.error ?? 'Unknown error'}`);
      }
    } catch (error) {
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

  const handleAddContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/site-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newListing) // reusing newListing state for simple key-value modal
      });
      if (res.ok) {
        setShowModal(null);
        fetchData();
        setNewListing(blankListing);
      } else {
        const data = await res.json();
        alert(`Failed to save content: ${data.error}`);
      }
    } catch (error) {
      alert('Network error saving content');
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
          <button onClick={() => { setActiveTab('content'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'content' ? 'bg-white/10 text-brand-gold' : 'text-emerald-100/60 hover:bg-white/5'}`}>
            <Settings className="h-4 w-4" /> Page Content
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
            {activeTab === 'dashboard' ? 'Business Overview' : activeTab === 'leads' ? 'Lead Pipeline' : activeTab === 'listings' ? 'Property Inventory' : activeTab === 'content' ? 'Page Content Editor' : activeTab === 'settings' ? 'Site Settings' : 'Content Management'}
            </h2>
            <p className="text-zinc-500 text-sm mt-1">Real-time performance and control.</p>
          </div>
          
          {activeTab !== 'dashboard' && activeTab !== 'leads' && activeTab !== 'content' && (
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

        {activeTab === 'content' && (() => {
          // All editable content grouped by page
          const PAGES: Record<string, { label: string; fields: { key: string; label: string; type: 'text' | 'textarea' | 'image'; placeholder?: string }[] }> = {
            home: {
              label: '🏠 Home Page',
              fields: [
                { key: 'home.hero.image', label: 'Hero Background Image', type: 'image' },
                { key: 'home.hero.tag', label: 'Hero Tag Line (small badge)', type: 'text', placeholder: 'Trusted by Nigerians in the Diaspora' },
                { key: 'home.hero.title', label: 'Hero Main Title (HTML allowed)', type: 'textarea', placeholder: 'Invest in Nigerian Property...' },
                { key: 'home.hero.subtitle', label: 'Hero Subtitle', type: 'text', placeholder: '+ Buy UK Property Safely from Nigeria' },
                { key: 'home.hero.text', label: 'Hero Body Text', type: 'textarea', placeholder: 'Verified developers. Transparent projects...' },
                { key: 'home.nigeria.title', label: 'Nigeria Section Heading', type: 'text', placeholder: 'Featured Developments in Nigeria' },
                { key: 'home.nigeria.subtitle', label: 'Nigeria Section Subtext', type: 'text', placeholder: 'Hand-picked properties...' },
                { key: 'home.uk.title', label: 'UK Section Heading', type: 'text', placeholder: 'Featured UK Opportunities' },
                { key: 'home.uk.subtitle', label: 'UK Section Subtext', type: 'text', placeholder: 'Curated UK properties...' },
                { key: 'home.why.title', label: 'Why Atlantic — Heading', type: 'text', placeholder: 'Why Atlantic Property?' },
                { key: 'home.why.subtitle', label: 'Why Atlantic — Subtext', type: 'textarea', placeholder: 'We bridge the gap...' },
                { key: 'home.cta.title', label: 'Bottom CTA Heading', type: 'text', placeholder: 'Ready to Invest With Confidence?' },
                { key: 'home.cta.text', label: 'Bottom CTA Body Text', type: 'textarea', placeholder: 'Book a free consultation...' },
              ]
            },
            nigeria: {
              label: '🇳🇬 Nigeria Page',
              fields: [
                { key: 'nigeria.hero.title', label: 'Hero Title', type: 'text', placeholder: 'Nigeria Properties' },
                { key: 'nigeria.hero.subtitle', label: 'Hero Subtitle', type: 'textarea', placeholder: 'Secure your future...' },
              ]
            },
            uk: {
              label: '🇬🇧 UK Page',
              fields: [
                { key: 'uk.hero.image', label: 'Hero Background Image', type: 'image' },
                { key: 'uk.hero.title', label: 'Hero Title', type: 'text', placeholder: 'UK Property Investments' },
                { key: 'uk.hero.subtitle', label: 'Hero Subtitle', type: 'textarea', placeholder: 'Access the UK property market...' },
                { key: 'uk.why.title', label: 'Why UK Section Heading', type: 'text', placeholder: 'Why Invest in UK Property?' },
                { key: 'uk.why.p1', label: 'Why UK — Paragraph 1', type: 'textarea', placeholder: '' },
                { key: 'uk.why.p2', label: 'Why UK — Paragraph 2', type: 'textarea', placeholder: '' },
                { key: 'uk.cta.title', label: 'Bottom CTA Heading', type: 'text', placeholder: 'Ready to Own a Piece of the UK?' },
                { key: 'uk.cta.text', label: 'Bottom CTA Body Text', type: 'textarea', placeholder: '' },
              ]
            },
            about: {
              label: '👥 About Page',
              fields: [
                { key: 'about.hero.title', label: 'Hero Title (HTML allowed)', type: 'text', placeholder: 'About Atlantic Property' },
                { key: 'about.hero.subtitle', label: 'Hero Subtitle', type: 'textarea', placeholder: 'We are a premier real estate advisory firm...' },
                { key: 'about.mission.title', label: 'Our Story — Heading', type: 'text', placeholder: 'Our Mission' },
                { key: 'about.mission.p1', label: 'Our Story — Paragraph 1', type: 'textarea', placeholder: '' },
                { key: 'about.mission.p2', label: 'Our Story — Paragraph 2', type: 'textarea', placeholder: '' },
                { key: 'about.mission.p3', label: 'Our Story — Bold Closing Line', type: 'textarea', placeholder: '' },
                { key: 'about.ceo.name', label: 'CEO / Founder Name', type: 'text', placeholder: 'Founder Name' },
                { key: 'about.ceo.title', label: 'CEO / Founder Title', type: 'text', placeholder: 'Founder & CEO' },
                { key: 'about.ceo.quote', label: 'CEO Quote / Bio', type: 'textarea', placeholder: '' },
                { key: 'about.ceo.image', label: 'CEO Portrait Image', type: 'image' },
                { key: 'about.stats.clients', label: 'Stat: No. of Clients', type: 'text', placeholder: '500+' },
                { key: 'about.stats.value', label: 'Stat: Properties / Value', type: 'text', placeholder: '₦15B+' },
                { key: 'about.stats.years', label: 'Stat: Years Active', type: 'text', placeholder: '8+' },
              ]
            },
            mortgage: {
              label: '🏦 Mortgage Page',
              fields: [
                { key: 'mortgage.hero.title', label: 'Hero Title', type: 'textarea', placeholder: 'Diaspora Mortgages That Actually Work' },
                { key: 'mortgage.hero.subtitle', label: 'Hero Subtitle', type: 'textarea', placeholder: 'In partnership with the Ministry of Finance...' },
                { key: 'mortgage.hero.cta', label: 'Hero CTA Button Text', type: 'text', placeholder: 'Check Mortgage Eligibility' },
                { key: 'mortgage.terms.title', label: 'Key Terms Section Heading', type: 'text', placeholder: 'MREIF Home Loan Key Terms' },
                { key: 'mortgage.terms.rate', label: 'Interest Rate Value', type: 'text', placeholder: '9.75%' },
                { key: 'mortgage.terms.maxloan', label: 'Max Loan Amount Value', type: 'text', placeholder: '₦100,000,000' },
                { key: 'mortgage.terms.equity', label: 'Minimum Equity Value', type: 'text', placeholder: '10%' },
                { key: 'mortgage.terms.tenor', label: 'Repayment Tenor Value', type: 'text', placeholder: 'Up to 20 Years' },
                { key: 'mortgage.eligibility.title', label: 'Eligibility Section Heading', type: 'text', placeholder: 'Who Can Apply?' },
                { key: 'mortgage.eligibility.1', label: 'Eligibility Point 1', type: 'text', placeholder: 'Nigerian citizens living and working abroad with a valid NIN.' },
                { key: 'mortgage.eligibility.2', label: 'Eligibility Point 2', type: 'text', placeholder: 'Minimum monthly net income of ₦1,000,000...' },
                { key: 'mortgage.eligibility.3', label: 'Eligibility Point 3', type: 'text', placeholder: 'Employees or business owners with at least 3 years...' },
                { key: 'mortgage.eligibility.4', label: 'Eligibility Point 4', type: 'text', placeholder: 'Buyers targeting residential properties...' },
                { key: 'mortgage.faq.title', label: 'FAQ Section Heading', type: 'text', placeholder: 'Mortgage Frequently Asked Questions' },
                { key: 'mortgage.faq.q1', label: 'FAQ Question 1', type: 'text', placeholder: 'Can I use a foreign income for a Nigerian mortgage?' },
                { key: 'mortgage.faq.a1', label: 'FAQ Answer 1', type: 'textarea', placeholder: 'Yes, our mortgage partners specialize in...' },
                { key: 'mortgage.faq.q2', label: 'FAQ Question 2', type: 'text', placeholder: 'What is the MREIF Home Loan?' },
                { key: 'mortgage.faq.a2', label: 'FAQ Answer 2', type: 'textarea', placeholder: '' },
                { key: 'mortgage.faq.q3', label: 'FAQ Question 3', type: 'text', placeholder: 'Do I need to be in Nigeria to sign the documents?' },
                { key: 'mortgage.faq.a3', label: 'FAQ Answer 3', type: 'textarea', placeholder: '' },
                { key: 'mortgage.faq.q4', label: 'FAQ Question 4', type: 'text', placeholder: 'What happens if the property is not completed?' },
                { key: 'mortgage.faq.a4', label: 'FAQ Answer 4', type: 'textarea', placeholder: '' },
                { key: 'mortgage.faq.q5', label: 'FAQ Question 5', type: 'text', placeholder: 'New FAQ Question here' },
                { key: 'mortgage.faq.a5', label: 'FAQ Answer 5', type: 'textarea', placeholder: 'New FAQ Answer here' },
                { key: 'mortgage.faq.q6', label: 'FAQ Question 6', type: 'text', placeholder: '' },
                { key: 'mortgage.faq.a6', label: 'FAQ Answer 6', type: 'textarea', placeholder: '' },
                { key: 'mortgage.faq.q7', label: 'FAQ Question 7', type: 'text', placeholder: '' },
                { key: 'mortgage.faq.a7', label: 'FAQ Answer 7', type: 'textarea', placeholder: '' },
                { key: 'mortgage.faq.q8', label: 'FAQ Question 8', type: 'text', placeholder: '' },
                { key: 'mortgage.faq.a8', label: 'FAQ Answer 8', type: 'textarea', placeholder: '' },
                { key: 'mortgage.faq.q9', label: 'FAQ Question 9', type: 'text', placeholder: '' },
                { key: 'mortgage.faq.a9', label: 'FAQ Answer 9', type: 'textarea', placeholder: '' },
                { key: 'mortgage.faq.q10', label: 'FAQ Question 10', type: 'text', placeholder: '' },
                { key: 'mortgage.faq.a10', label: 'FAQ Answer 10', type: 'textarea', placeholder: '' },
              ]
            },
            prequalify: {
              label: '📋 Enquiry Form Page',
              fields: [
                { key: 'prequalify.step1.title', label: 'Step 1 — Heading', type: 'text', placeholder: 'Basic Information' },
                { key: 'prequalify.step1.subtitle', label: 'Step 1 — Subtitle', type: 'text', placeholder: "Let's start with your contact details." },
                { key: 'prequalify.step2ng.title', label: 'Step 2 Nigeria — Heading', type: 'text', placeholder: 'Investment Details' },
                { key: 'prequalify.step2ng.subtitle', label: 'Step 2 Nigeria — Subtitle', type: 'text', placeholder: 'Tell us about your target property in Nigeria.' },
                { key: 'prequalify.step2uk.title', label: 'Step 2 UK — Heading', type: 'text', placeholder: 'Financial Profile' },
                { key: 'prequalify.step2uk.subtitle', label: 'Step 2 UK — Subtitle', type: 'text', placeholder: 'Understanding your investment capacity.' },
                { key: 'prequalify.confirm.title', label: 'Final Step — Heading', type: 'text', placeholder: 'Final Confirmation' },
                { key: 'prequalify.confirm.subtitle', label: 'Final Step — Subtitle', type: 'text', placeholder: 'Review your strategy before submission.' },
                { key: 'prequalify.success.title', label: 'Success Screen — Heading', type: 'text', placeholder: 'Application Received!' },
                { key: 'prequalify.success.message', label: 'Success Screen — Body Text', type: 'textarea', placeholder: 'Our senior property advisor will review your profile...' },
                { key: 'prequalify.fee.notice', label: 'UK Fee Acceptance Text', type: 'textarea', placeholder: 'I understand that Atlantic Property charges a sourcing/consultancy fee...' },
                { key: 'prequalify.privacy.notice', label: 'Privacy/Security Notice', type: 'text', placeholder: '128-bit SSL Secured Lead Submission' },
              ]
            },
            blog: {
              label: '📰 Insights / Blog Page',
              fields: [
                { key: 'blog.hero.title', label: 'Hero Title', type: 'text', placeholder: 'Property Insights' },
                { key: 'blog.hero.subtitle', label: 'Hero Subtitle', type: 'textarea', placeholder: 'Expert guides, market analysis...' },
                { key: 'blog.empty.title', label: 'No Articles Yet — Heading', type: 'text', placeholder: 'Insights Coming Soon' },
                { key: 'blog.empty.text', label: 'No Articles Yet — Body', type: 'text', placeholder: 'Our editorial team is preparing expert content...' },
              ]
            },
            global: {
              label: '🌐 Global / Footer',
              fields: [
                { key: 'global.company.name', label: 'Company Name', type: 'text', placeholder: 'Atlantic Property Partners' },
                { key: 'global.company.tagline', label: 'Company Tagline', type: 'text', placeholder: 'Your trusted partner for diaspora real estate investments.' },
                { key: 'global.contact.phone', label: 'Contact Phone Number', type: 'text', placeholder: '+44 7xxx xxxx' },
                { key: 'global.contact.email', label: 'Contact Email', type: 'text', placeholder: 'info@atlanticproperty.com' },
                { key: 'global.contact.address', label: 'Office Address', type: 'text', placeholder: 'London, UK' },
                { key: 'global.social.tiktok', label: 'TikTok URL', type: 'text', placeholder: 'https://tiktok.com/@yourpage' },
                { key: 'global.social.instagram', label: 'Instagram URL', type: 'text', placeholder: 'https://instagram.com/...' },
                { key: 'global.social.facebook', label: 'Facebook URL', type: 'text', placeholder: 'https://facebook.com/...' },
                { key: 'global.social.twitter', label: 'Twitter / X URL', type: 'text', placeholder: 'https://twitter.com/...' },
                { key: 'global.social.linkedin', label: 'LinkedIn URL', type: 'text', placeholder: 'https://linkedin.com/...' },
                { key: 'global.social.whatsapp', label: 'WhatsApp Link/Number', type: 'text', placeholder: '+44 7xxx xxxx' },
              ]
            },
          };

          const saveField = async (key: string, value: string) => {
            setPageContentSaving(prev => ({ ...prev, [key]: true }));
            try {
              const res = await fetch('/api/site-content/upsert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, value, section: key.split('.')[0], label: key, type: value.startsWith('http') && (value.includes('.jpg') || value.includes('.png') || value.includes('.webp') || value.includes('cloudinary')) ? 'image' : 'text' }),
              });
              if (res.ok) {
                setPageContent(prev => ({ ...prev, [key]: value }));
                // brief green flash on the key
                setPageContentSaving(prev => ({ ...prev, [`${key}_saved`]: true as any }));
                setTimeout(() => setPageContentSaving(prev => { const n = { ...prev }; delete n[`${key}_saved`]; return n; }), 1800);
              }
            } catch {}
            finally { setPageContentSaving(prev => ({ ...prev, [key]: false })); }
          };

          const page = PAGES[activePage];
          // Count how many fields in the current page already have content
          const filledCount = page.fields.filter(f => pageContent[f.key] && pageContent[f.key].trim() !== '').length;

          return (
            <div className="space-y-6">
              {/* Top bar: page tabs + refresh */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(PAGES).map(([slug, pg]) => {
                    const count = pg.fields.filter(f => pageContent[f.key] && pageContent[f.key].trim() !== '').length;
                    return (
                      <button key={slug} onClick={() => setActivePage(slug)}
                        className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-all ${activePage === slug ? 'bg-brand-emerald text-white shadow-md' : 'bg-white border border-zinc-200 text-zinc-600 hover:border-brand-emerald/40'}`}
                      >
                        {pg.label}
                        {count > 0 && (
                          <span className={`ml-2 text-[10px] font-black px-1.5 py-0.5 rounded-full ${ activePage === slug ? 'bg-white/20 text-white' : 'bg-brand-emerald/10 text-brand-emerald'}`}>
                            {count}/{pg.fields.length}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={fetchData}
                  disabled={isLoading}
                  className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-brand-emerald border border-zinc-200 px-3 py-2 rounded-xl transition-colors disabled:opacity-40"
                >
                  <svg className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  Refresh
                </button>
              </div>

              {/* Loading skeleton */}
              {isLoading ? (
                <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-6 space-y-6">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="border border-zinc-100 rounded-2xl p-5 animate-pulse">
                      <div className="h-3.5 w-36 bg-zinc-200 rounded mb-2" />
                      <div className="h-2.5 w-20 bg-zinc-100 rounded mb-4" />
                      <div className="h-10 w-full bg-zinc-100 rounded-xl" />
                    </div>
                  ))}
                </div>
              ) : (

              <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-zinc-50 bg-zinc-50/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-emerald-950 text-lg">{page.label} — Content Fields</h3>
                      <p className="text-xs text-zinc-400 mt-1">{filledCount} of {page.fields.length} fields filled · Changes save per field and update the live site instantly.</p>
                    </div>
                    {filledCount === page.fields.length && (
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">✓ All fields set</span>
                    )}
                  </div>
                </div>
                <div className="p-6 space-y-8">
                  {page.fields.map((field) => {
                    const currentVal = pageContent[field.key] ?? '';
                    const justSaved = pageContentSaving[`${field.key}_saved` as any];
                    return (
                      <div key={field.key} className={`border rounded-2xl p-5 transition-all duration-300 ${ justSaved ? 'border-emerald-300 bg-emerald-50/30' : 'border-zinc-100 hover:border-brand-emerald/20'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <label className="block text-sm font-bold text-emerald-950">{field.label}</label>
                            <span className="text-[10px] font-mono text-zinc-400">{field.key}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {justSaved && <span className="text-[10px] text-emerald-600 font-bold">✓ Saved!</span>}
                            {pageContentSaving[field.key] && !justSaved && (
                              <span className="text-[10px] text-brand-gold font-bold animate-pulse">Saving...</span>
                            )}
                            {currentVal && !pageContentSaving[field.key] && !justSaved && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" title="Has content" />
                            )}
                          </div>
                        </div>

                        {field.type === 'image' ? (
                          <div className="space-y-3">
                            {currentVal ? (
                              <div className="relative group/img">
                                <img src={currentVal} alt={field.label} className="w-full max-h-48 object-cover rounded-xl border border-zinc-100" />
                                <button
                                  onClick={() => saveField(field.key, '')}
                                  className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover/img:opacity-100 transition-opacity font-bold"
                                >Remove</button>
                              </div>
                            ) : (
                              <div className="w-full h-24 bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-xl flex items-center justify-center text-zinc-400 text-sm">
                                No image set — upload or paste a URL below
                              </div>
                            )}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                              <input
                                type="file"
                                accept="image/*"
                                className="text-xs text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-brand-emerald hover:file:bg-emerald-100 cursor-pointer"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const url = await uploadToCloudinary(file);
                                    if (url) await saveField(field.key, url);
                                  }
                                }}
                              />
                              {isUploading && <span className="text-[10px] text-brand-gold font-bold animate-pulse">Uploading...</span>}
                            </div>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={currentVal}
                                onChange={(e) => setPageContent(prev => ({ ...prev, [field.key]: e.target.value }))}
                                className="flex-1 px-3 py-2 text-xs font-mono border border-zinc-200 rounded-xl text-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-emerald/30"
                                placeholder="Or paste image URL here..."
                              />
                              <button
                                onClick={() => saveField(field.key, currentVal)}
                                disabled={!currentVal}
                                className="btn-primary text-xs px-4 py-2 disabled:opacity-40"
                              >Save</button>
                            </div>
                          </div>
                        ) : field.type === 'textarea' ? (
                          <div className="space-y-2">
                            <textarea
                              rows={3}
                              value={currentVal}
                              onChange={(e) => setPageContent(prev => ({ ...prev, [field.key]: e.target.value }))}
                              onBlur={(e) => saveField(field.key, e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-emerald/30 text-sm resize-y min-h-[80px]"
                              placeholder={field.placeholder || 'Enter content...'}
                            />
                            <button
                              onClick={() => saveField(field.key, currentVal)}
                              className="text-xs font-bold text-brand-emerald hover:underline"
                            >Save this field ↑</button>
                          </div>
                        ) : (
                          <div className="flex gap-3">
                            <input
                              type="text"
                              value={currentVal}
                              onChange={(e) => setPageContent(prev => ({ ...prev, [field.key]: e.target.value }))}
                              onBlur={(e) => saveField(field.key, e.target.value)}
                              className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-emerald/30 text-sm"
                              placeholder={field.placeholder || 'Enter value...'}
                            />
                            <button
                              onClick={() => saveField(field.key, currentVal)}
                              className="btn-primary text-xs px-4 py-2"
                            >Save</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              )}
            </div>
          );
        })()}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-50 flex justify-between items-center bg-zinc-50/50">
              <h3 className="font-bold text-emerald-950">Site Content Management (CMS)</h3>
              <button onClick={() => {
                setNewListing({ ...blankListing, title: 'New Content Key' }); // repurposing slightly for modal trigger, wait no, let's use a specific state or just a simple UI.
                setShowModal('content' as any);
              }} className="btn-primary text-xs px-4 py-2">Add Content Key</button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {siteContent.map(item => (
                  <div key={item._id} className="p-4 border border-zinc-100 rounded-xl hover:border-brand-emerald/30 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{item.section}</span>
                      <span className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded uppercase">{item.type}</span>
                    </div>
                    <h4 className="font-bold text-emerald-950 mb-1">{item.label}</h4>
                    <p className="text-xs text-zinc-500 font-mono mb-3">{item.key}</p>
                    <div className="bg-zinc-50 p-2 rounded text-sm text-zinc-700 truncate">
                      {item.type === 'image' ? (
                        <img src={item.value} alt={item.label} className="h-10 object-cover rounded" />
                      ) : (
                        item.value
                      )}
                    </div>
                    <button 
                      onClick={() => {
                        // We will add editing capability via modal
                        setNewListing(item); 
                        setShowModal('content' as any);
                      }}
                      className="mt-4 text-xs font-bold text-brand-emerald hover:underline"
                    >
                      Edit Value
                    </button>
                  </div>
                ))}
              </div>
              {siteContent.length === 0 && (
                <div className="text-center py-12 text-zinc-400">
                  <p>No content keys found. Add one to start controlling site copy/images.</p>
                </div>
              )}
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
                        <button 
                          className="p-2 hover:bg-zinc-100 rounded-xl text-zinc-400 hover:text-emerald-600 transition-all"
                          title="Edit listing"
                          onClick={() => {
                            setNewListing({ ...blankListing, ...listing });
                            setEditingListingId(listing._id);
                            setShowModal('listing');
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
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
                  <h3 className="text-xl font-bold text-emerald-950 font-heading">{editingListingId ? 'Edit Property' : 'Add New Property'}</h3>
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
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">No. of Bedrooms</label>
                      <input type="number" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200" value={newListing.beds} onChange={(e) => setNewListing({...newListing, beds: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">No. of Bathrooms</label>
                      <input type="number" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200" value={newListing.rooms} onChange={(e) => setNewListing({...newListing, rooms: e.target.value})} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Developer Bio / Overview</label>
                      <textarea rows={2} className="w-full px-4 py-2.5 rounded-xl border border-zinc-200" value={newListing.developerBio} onChange={(e) => setNewListing({...newListing, developerBio: e.target.value})} />
                    </div>
                    <div className="md:col-span-2 mt-2">
                      <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-widest mb-3 border-b border-zinc-100 pb-2">Amenities (6 Slots)</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <input type="text" placeholder="Amenity 1" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm" value={newListing.amenity1} onChange={(e) => setNewListing({...newListing, amenity1: e.target.value})} />
                        <input type="text" placeholder="Amenity 2" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm" value={newListing.amenity2} onChange={(e) => setNewListing({...newListing, amenity2: e.target.value})} />
                        <input type="text" placeholder="Amenity 3" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm" value={newListing.amenity3} onChange={(e) => setNewListing({...newListing, amenity3: e.target.value})} />
                        <input type="text" placeholder="Amenity 4" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm" value={newListing.amenity4} onChange={(e) => setNewListing({...newListing, amenity4: e.target.value})} />
                        <input type="text" placeholder="Amenity 5" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm" value={newListing.amenity5} onChange={(e) => setNewListing({...newListing, amenity5: e.target.value})} />
                        <input type="text" placeholder="Amenity 6" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm" value={newListing.amenity6} onChange={(e) => setNewListing({...newListing, amenity6: e.target.value})} />
                      </div>
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

          {showModal === 'content' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                  <h3 className="text-xl font-bold text-emerald-950 font-heading">Manage Site Content</h3>
                  <button onClick={() => setShowModal(null)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors"><X className="h-5 w-5" /></button>
                </div>
                <form onSubmit={handleAddContent} className="p-8 space-y-6 overflow-y-auto">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Section Name</label>
                    <input required type="text" placeholder="e.g. homepage, footer" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200" value={newListing.section || ''} onChange={(e) => setNewListing({...newListing, section: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Content Key</label>
                    <input required type="text" placeholder="e.g. home.hero.title" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200" value={newListing.key || ''} onChange={(e) => setNewListing({...newListing, key: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Admin Label</label>
                    <input required type="text" placeholder="e.g. Hero Title" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200" value={newListing.label || ''} onChange={(e) => setNewListing({...newListing, label: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Content Type</label>
                    <select className="w-full px-4 py-2.5 rounded-xl border border-zinc-200" value={newListing.type || 'text'} onChange={(e) => setNewListing({...newListing, type: e.target.value})}>
                      <option value="text">Text (Headings, Paragraphs)</option>
                      <option value="image">Image URL</option>
                      <option value="icon">Icon Name</option>
                    </select>
                  </div>
                  
                  {newListing.type === 'image' && (
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Upload Image</label>
                      <div className="flex items-center gap-4">
                        {newListing.value && <img src={newListing.value} className="w-16 h-16 rounded-lg object-cover border border-zinc-100" />}
                        <input 
                          type="file" 
                          accept="image/*"
                          className="text-xs text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-brand-emerald hover:file:bg-emerald-100 cursor-pointer"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = await uploadToCloudinary(file);
                              if (url) setNewListing({...newListing, value: url});
                            }
                          }}
                        />
                        {isUploading && <span className="text-[10px] text-brand-gold animate-pulse font-bold">Uploading...</span>}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Content Value</label>
                    <textarea required rows={4} className="w-full px-4 py-2.5 rounded-xl border border-zinc-200" value={newListing.value || ''} onChange={(e) => setNewListing({...newListing, value: e.target.value})} />
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                    <button type="button" onClick={() => setShowModal(null)} className="px-6 py-2.5 text-sm font-bold text-zinc-400 hover:text-zinc-600 transition-colors">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="btn-primary px-8 py-2.5 text-sm">{isSubmitting ? 'Saving...' : 'Save Content'}</button>
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

                  {/* Comprehensive Additional Details (Dynamic) */}
                  {selectedLead.data && Object.keys(selectedLead.data).filter(key => !['name', 'email', 'phone', 'location', 'budget', 'targetMarket', 'type'].includes(key) && selectedLead.data[key] !== '' && selectedLead.data[key] !== null).length > 0 && (
                    <div className="mt-8 pt-6 border-t border-zinc-100">
                      <h3 className="text-sm font-bold text-emerald-950 mb-4 flex items-center gap-2"><FileText className="h-4 w-4 text-brand-gold" /> Comprehensive Profile</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(selectedLead.data)
                          .filter(([key, value]) => !['name', 'email', 'phone', 'location', 'budget', 'targetMarket', 'type'].includes(key) && value !== '' && value !== null)
                          .map(([key, value]) => (
                            <div key={key} className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </p>
                              <p className="font-semibold text-zinc-900">{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}</p>
                            </div>
                          ))
                        }
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

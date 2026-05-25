'use client';

import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Building2, Edit2, Plus, Trash2, X } from 'lucide-react';

type UploadFn = (file: File) => Promise<string | null>;

type DeveloperRecord = {
  _id: string;
  name: string;
  logo?: string;
  bio?: string;
  units?: number;
  updatedAt?: string;
};

type DeveloperForm = {
  name: string;
  logo: string;
  bio: string;
  units: string;
};

const blankDeveloper: DeveloperForm = {
  name: '',
  logo: '',
  bio: '',
  units: '',
};

export default function DeveloperAdminPanel({
  uploadToCloudinary,
  isUploading,
}: {
  uploadToCloudinary: UploadFn;
  isUploading: boolean;
}) {
  const [developers, setDevelopers] = useState<DeveloperRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingDeveloperId, setEditingDeveloperId] = useState<string | null>(null);
  const [form, setForm] = useState<DeveloperForm>(blankDeveloper);

  const fetchDevelopers = async () => {
    setIsLoading(true);

    try {
      const res = await fetch('/api/developers', { cache: 'no-store' });
      const data = await res.json();
      setDevelopers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Fetch developers failed:', error);
      setDevelopers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadDevelopers = async () => {
      try {
        const res = await fetch('/api/developers', { cache: 'no-store' });
        const data = await res.json();

        if (isMounted) {
          setDevelopers(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Fetch developers failed:', error);
        if (isMounted) {
          setDevelopers([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadDevelopers();

    return () => {
      isMounted = false;
    };
  }, []);

  const openCreateModal = () => {
    setEditingDeveloperId(null);
    setForm(blankDeveloper);
    setShowModal(true);
  };

  const openEditModal = (developer: DeveloperRecord) => {
    setEditingDeveloperId(developer._id);
    setForm({
      name: developer.name || '',
      logo: developer.logo || '',
      bio: developer.bio || '',
      units: developer.units?.toString() || '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDeveloperId(null);
    setForm(blankDeveloper);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingDeveloperId ? `/api/developers/${editingDeveloperId}` : '/api/developers';
      const method = editingDeveloperId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          units: form.units === '' ? 0 : Number(form.units),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`Failed to save developer: ${data.detail ?? data.error ?? 'Unknown error'}`);
        return;
      }

      await fetchDevelopers();
      closeModal();
    } catch (error) {
      console.error('Save developer failed:', error);
      alert('Network error while saving developer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (developer: DeveloperRecord) => {
    if (!confirm(`Delete developer "${developer.name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/developers/${developer._id}`, { method: 'DELETE' });

      if (!res.ok) {
        const data = await res.json();
        alert(`Failed to delete developer: ${data.detail ?? data.error ?? 'Unknown error'}`);
        return;
      }

      await fetchDevelopers();
    } catch (error) {
      console.error('Delete developer failed:', error);
      alert('Network error while deleting developer.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-6 md:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold mb-2">
            Developer Directory
          </p>
          <h3 className="text-2xl font-bold text-emerald-950 font-heading mb-2">
            Manage developer logos and units
          </h3>
          <p className="text-sm text-zinc-500 max-w-2xl">
            Add each developer once, then make sure the developer name matches the name used on its
            property listings so the logo, bio, and units show correctly on the frontend.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="btn-primary flex items-center justify-center gap-2 py-3 px-6 text-sm shadow-xl shadow-emerald-950/10"
        >
          <Plus className="h-4 w-4" /> Add Developer
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-12 text-center text-zinc-400 italic">
          Loading developers...
        </div>
      ) : developers.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-zinc-200 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl border border-zinc-100 bg-zinc-50 flex items-center justify-center mx-auto mb-5">
            <Building2 className="h-7 w-7 text-zinc-300" />
          </div>
          <h4 className="text-lg font-bold text-emerald-950 mb-2">No developers added yet</h4>
          <p className="text-sm text-zinc-500 max-w-md mx-auto">
            Add a developer here to control its logo, bio, and total number of units from the admin
            dashboard.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {developers.map((developer) => (
            <div
              key={developer._id}
              className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-6 flex flex-col gap-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="w-20 h-20 rounded-2xl border border-zinc-100 bg-zinc-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {developer.logo ? (
                    <img src={developer.logo} alt={developer.name} className="w-full h-full object-contain" />
                  ) : (
                    <Building2 className="h-9 w-9 text-zinc-300" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 mb-1">
                        Developer
                      </p>
                      <h4 className="text-xl font-bold text-emerald-950 break-words">{developer.name}</h4>
                    </div>

                    <div className="bg-brand-gold/10 text-brand-gold px-3 py-2 rounded-2xl text-right">
                      <p className="text-[10px] font-bold uppercase tracking-widest">Units</p>
                      <p className="text-xl font-black leading-none">{developer.units ?? 0}</p>
                    </div>
                  </div>

                  <p className="text-sm text-zinc-500 leading-relaxed mt-4 line-clamp-3">
                    {developer.bio || 'No developer overview added yet.'}
                  </p>
                </div>
              </div>

              <div className="border-t border-zinc-100 pt-4 flex items-center justify-between gap-3">
                <p className="text-xs text-zinc-400">
                  {developer.updatedAt
                    ? `Updated ${new Date(developer.updatedAt).toLocaleDateString()}`
                    : 'Recently added'}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(developer)}
                    className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(developer)}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <div>
                  <h3 className="text-xl font-bold text-emerald-950 font-heading">
                    {editingDeveloperId ? 'Edit Developer' : 'Add Developer'}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    Match the developer name to the name used on its listings.
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
                      Developer Name
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200"
                      value={form.name}
                      onChange={(event) => setForm({ ...form, name: event.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
                      Number of Units
                    </label>
                    <input
                      min={0}
                      type="number"
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200"
                      value={form.units}
                      onChange={(event) => setForm({ ...form, units: event.target.value })}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                      Developer Logo
                    </label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="w-20 h-20 rounded-2xl border border-zinc-100 bg-zinc-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {form.logo ? (
                          <img src={form.logo} alt={form.name || 'Developer logo'} className="w-full h-full object-contain" />
                        ) : (
                          <Building2 className="h-8 w-8 text-zinc-300" />
                        )}
                      </div>

                      <div className="space-y-3">
                        <input
                          type="file"
                          accept="image/*"
                          className="text-xs text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-brand-emerald hover:file:bg-emerald-100 cursor-pointer"
                          onChange={async (event) => {
                            const file = event.target.files?.[0];
                            if (!file) {
                              return;
                            }

                            const url = await uploadToCloudinary(file);
                            if (url) {
                              setForm((current) => ({ ...current, logo: url }));
                            }

                            event.target.value = '';
                          }}
                        />
                        <input
                          type="url"
                          placeholder="Or paste image URL"
                          className="w-full sm:w-[28rem] max-w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm"
                          value={form.logo}
                          onChange={(event) => setForm({ ...form, logo: event.target.value })}
                        />
                        {isUploading && (
                          <span className="text-[10px] text-brand-gold animate-pulse font-bold block">
                            Uploading...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
                      About Developer
                    </label>
                    <textarea
                      rows={5}
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200"
                      value={form.bio}
                      onChange={(event) => setForm({ ...form, bio: event.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2.5 text-sm font-bold text-zinc-400 hover:text-zinc-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || isUploading}
                    className="btn-primary px-8 py-2.5 text-sm"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Developer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, CheckCircle2, ShieldCheck, Landmark, Globe, Briefcase } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function PrequalifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialProject = searchParams.get('project') || '';

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    targetMarket: 'Nigeria', // 'Nigeria' | 'UK'
    budget: '',
    fundingType: 'Cash', // 'Cash' | 'Mortgage' | 'Equity'
    // Conditional Fields
    annualIncome: '',
    employmentStatus: 'Employed',
    developmentInterest: initialProject
  });

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          type: formData.targetMarket
        }),
      });
      
      if (response.ok) {
        setIsSuccess(true);
      }
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 bg-brand-cream min-h-screen">
        <div className="container mx-auto px-4 max-w-2xl pt-12">
          
          <div className="bg-white rounded-3xl shadow-xl border border-zinc-100 overflow-hidden">
            {/* Progress Bar */}
            <div className="h-2 bg-emerald-50 w-full flex">
              {[1, 2, 3, 4].map((s) => (
                <div 
                  key={s} 
                  className={`flex-1 transition-all duration-500 ${s <= step ? 'bg-brand-emerald' : 'bg-transparent'}`}
                />
              ))}
            </div>

            <div className="p-8 md:p-12">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-emerald-50 text-brand-emerald rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Application Received!</h2>
                    <p className="text-zinc-600 mb-8">
                      Thank you, {formData.name.split(' ')[0]}. Our senior property advisor will review your profile and contact you via {formData.email} within 24 hours.
                    </p>
                    <button 
                      onClick={() => router.push('/')}
                      className="btn-primary w-full"
                    >
                      Return to Homepage
                    </button>
                  </motion.div>
                ) : (
                  <div className="min-h-[400px]">
                    {/* Step 1: Basic Info */}
                    {step === 1 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <h2 className="text-2xl font-bold mb-2">Basic Information</h2>
                        <p className="text-zinc-500 mb-8 text-sm">Let's start with your contact details.</p>
                        
                        <div className="space-y-6">
                          <div>
                            <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Full Name</label>
                            <input 
                              type="text" 
                              className="w-full px-4 py-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 transition-all"
                              placeholder="e.g. John Doe"
                              value={formData.name}
                              onChange={(e) => updateFormData({ name: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Email Address</label>
                            <input 
                              type="email" 
                              className="w-full px-4 py-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 transition-all"
                              placeholder="john@example.com"
                              value={formData.email}
                              onChange={(e) => updateFormData({ email: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Phone Number (WhatsApp preferred)</label>
                            <input 
                              type="tel" 
                              className="w-full px-4 py-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 transition-all"
                              placeholder="+234..."
                              value={formData.phone}
                              onChange={(e) => updateFormData({ phone: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Your Current Location</label>
                            <input 
                              type="text" 
                              className="w-full px-4 py-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 transition-all"
                              placeholder="e.g. London, UK"
                              value={formData.location}
                              onChange={(e) => updateFormData({ location: e.target.value })}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Investment Intent */}
                    {step === 2 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <h2 className="text-2xl font-bold mb-2">Investment Strategy</h2>
                        <p className="text-zinc-500 mb-8 text-sm">Where and what are you looking to buy?</p>
                        
                        <div className="space-y-6">
                          <div>
                            <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Target Market</label>
                            <div className="grid grid-cols-2 gap-4">
                              <button 
                                onClick={() => updateFormData({ targetMarket: 'Nigeria' })}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${formData.targetMarket === 'Nigeria' ? 'border-brand-emerald bg-emerald-50 text-brand-emerald' : 'border-zinc-100 hover:border-zinc-200'}`}
                              >
                                <Globe className="h-6 w-6" />
                                <span className="font-bold text-sm">Nigeria</span>
                              </button>
                              <button 
                                onClick={() => updateFormData({ targetMarket: 'UK' })}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${formData.targetMarket === 'UK' ? 'border-brand-emerald bg-emerald-50 text-brand-emerald' : 'border-zinc-100 hover:border-zinc-200'}`}
                              >
                                <Globe className="h-6 w-6" />
                                <span className="font-bold text-sm">UK</span>
                              </button>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Investment Budget</label>
                            <select 
                              className="w-full px-4 py-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-emerald/20"
                              value={formData.budget}
                              onChange={(e) => updateFormData({ budget: e.target.value })}
                            >
                              <option value="">Select Budget Range</option>
                              <option value="Under ₦50M">Under ₦50M / £50k</option>
                              <option value="₦50M - ₦100M">₦50M - ₦100M / £50k - £100k</option>
                              <option value="₦100M - ₦250M">₦100M - ₦250M / £100k - £250k</option>
                              <option value="Above ₦250M">Above ₦250M / £250k+</option>
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Funding & Eligibility */}
                    {step === 3 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <h2 className="text-2xl font-bold mb-2">Funding & Eligibility</h2>
                        <p className="text-zinc-500 mb-8 text-sm">How do you plan to finance this investment?</p>
                        
                        <div className="space-y-6">
                          <div>
                            <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Funding Type</label>
                            <div className="grid grid-cols-3 gap-3">
                              {['Cash', 'Mortgage', 'Equity'].map(type => (
                                <button 
                                  key={type}
                                  onClick={() => updateFormData({ fundingType: type as any })}
                                  className={`p-3 rounded-lg border-2 text-xs font-bold transition-all ${formData.fundingType === type ? 'border-brand-emerald bg-emerald-50 text-brand-emerald' : 'border-zinc-100'}`}
                                >
                                  {type}
                                </button>
                              ))}
                            </div>
                          </div>

                          {formData.fundingType === 'Mortgage' && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="p-6 bg-brand-cream rounded-2xl border border-brand-emerald/10 space-y-4"
                            >
                              <div className="flex items-center gap-2 text-brand-emerald font-bold text-sm mb-2">
                                <Landmark className="h-4 w-4" />
                                <span>Mortgage Qualification Details</span>
                              </div>
                              
                              <div>
                                <label className="block text-[10px] font-bold text-zinc-500 mb-1">Annual Net Income (GBP/USD/NGN)</label>
                                <input 
                                  type="text" 
                                  className="w-full px-3 py-2 rounded-md border border-zinc-200 text-sm"
                                  placeholder="e.g. £60,000"
                                  value={formData.annualIncome}
                                  onChange={(e) => updateFormData({ annualIncome: e.target.value })}
                                />
                              </div>
                              
                              <div>
                                <label className="block text-[10px] font-bold text-zinc-500 mb-1">Employment Status</label>
                                <select 
                                  className="w-full px-3 py-2 rounded-md border border-zinc-200 text-sm"
                                  value={formData.employmentStatus}
                                  onChange={(e) => updateFormData({ employmentStatus: e.target.value })}
                                >
                                  <option value="Employed">Full-time Employed</option>
                                  <option value="Self-Employed">Self-Employed / Business Owner</option>
                                  <option value="Retired">Retired</option>
                                </select>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Step 4: Confirmation */}
                    {step === 4 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <h2 className="text-2xl font-bold mb-2">Final Confirmation</h2>
                        <p className="text-zinc-500 mb-8 text-sm">Review your strategy before submission.</p>
                        
                        <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 space-y-4 mb-8">
                          <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Project Market:</span>
                            <span className="font-bold text-brand-emerald">{formData.targetMarket}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Funding Method:</span>
                            <span className="font-bold text-brand-emerald">{formData.fundingType}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Budget:</span>
                            <span className="font-bold text-brand-emerald">{formData.budget || 'Not specified'}</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                          <ShieldCheck className="h-5 w-5 text-brand-emerald mt-0.5" />
                          <p className="text-xs text-brand-emerald/80 leading-relaxed">
                            By submitting, you agree to our privacy policy. Your data is encrypted and will only be used to match you with verified property opportunities.
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 mt-12 pt-8 border-t border-zinc-100">
                      {step > 1 && (
                        <button 
                          onClick={prevStep}
                          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-zinc-400 hover:text-zinc-600 transition-colors"
                        >
                          <ChevronLeft className="h-5 w-5" /> Back
                        </button>
                      )}
                      
                      {step < 4 ? (
                        <button 
                          onClick={nextStep}
                          disabled={!formData.name && step === 1}
                          className="flex-[2] btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next Step <ChevronRight className="h-5 w-5" />
                        </button>
                      ) : (
                        <button 
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          className="flex-[2] btn-gold flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isSubmitting ? 'Processing...' : 'Complete Prequalification'} 
                          {!isSubmitting && <CheckCircle2 className="h-5 w-5" />}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-xs text-zinc-400 flex items-center justify-center gap-2">
              <ShieldCheck className="h-3 w-3" />
              128-bit SSL Secured Lead Submission
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

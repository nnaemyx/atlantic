'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, CheckCircle2, ShieldCheck, Landmark, Globe } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

function PrequalifyForm({ initialCms }: { initialCms: Record<string, string> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialProject = searchParams.get('project') || '';
  const initialMarket = searchParams.get('market') || 'Nigeria';

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [cms] = useState<Record<string, string>>(initialCms);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    targetMarket: initialMarket,
    
    // Financial / Core
    budget: '',
    fundingType: 'Cash',
    propertyType: '',
    investmentLocation: '', // for the specific city/area
    
    // UK specific
    depositReadiness: '',
    proofOfFunds: '',
    purpose: '',
    timeline: '',
    sourceOfFunds: '',
    documentationReadiness: '',
    feeAcceptance: false,
    
    // Nigeria specific
    developmentInterest: initialProject,
    age: '',
    annualIncome: '',
    employmentStatus: 'Employed',
    residency: ''
  });

  useEffect(() => {
    if (initialMarket === 'UK' || initialMarket === 'Nigeria') {
      setFormData(prev => ({ ...prev, targetMarket: initialMarket }));
    }
  }, [initialMarket]);

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const isUK = formData.targetMarket === 'UK';

  // Navigation logic
  const maxSteps = isUK ? 4 : 3;

  const nextStep = () => {
    setError('');
    
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.phone || !formData.location) {
        setError('Please fill in all basic information fields.');
        return;
      }
    }
    
    if (isUK) {
      if (step === 2 && (!formData.budget || !formData.depositReadiness || !formData.fundingType || !formData.proofOfFunds)) {
        setError('Please complete all financial profile fields.');
        return;
      }
      if (step === 3 && (!formData.purpose || !formData.timeline || !formData.investmentLocation || !formData.propertyType)) {
        setError('Please complete all investment intent fields.');
        return;
      }
    } else {
      if (step === 2) {
        if (!formData.budget || !formData.investmentLocation || !formData.propertyType || !formData.developmentInterest || !formData.fundingType) {
          setError('Please complete all investment details.');
          return;
        }
        if (formData.fundingType === 'Mortgage') {
          if (!formData.age || !formData.annualIncome || !formData.employmentStatus || !formData.residency) {
            setError('Please complete all mortgage qualification details.');
            return;
          }
        }
      }
    }

    setStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setError('');
    if (isUK && (!formData.sourceOfFunds || !formData.documentationReadiness || !formData.feeAcceptance)) {
      setError('Please complete all qualification indicators and accept the fee terms.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          type: formData.targetMarket,
          location: formData.location // the user's current location
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
          
          {/* Target Market Switcher at the top if they want to change */}
          {!isSuccess && (
            <div className="flex justify-center mb-8">
              <div className="bg-white p-1 rounded-xl inline-flex border border-zinc-200 shadow-sm">
                <button 
                  onClick={() => { updateFormData({ targetMarket: 'Nigeria' }); setStep(1); }}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${!isUK ? 'bg-brand-emerald text-white' : 'text-zinc-500 hover:text-zinc-800'}`}
                >
                  Nigeria
                </button>
                <button 
                  onClick={() => { updateFormData({ targetMarket: 'UK' }); setStep(1); }}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${isUK ? 'bg-brand-emerald text-white' : 'text-zinc-500 hover:text-zinc-800'}`}
                >
                  United Kingdom
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-3xl shadow-xl border border-zinc-100 overflow-hidden">
            {/* Progress Bar */}
            <div className="h-2 bg-emerald-50 w-full flex">
              {(isUK ? [1, 2, 3, 4] : [1, 2, 3]).map((s) => (
                <div 
                  key={s} 
                  className={`flex-1 transition-all duration-500 ${s <= step ? 'bg-brand-emerald' : 'bg-transparent'} ${s > 1 ? 'border-l border-white/20' : ''}`}
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
                    <h2 className="text-3xl font-bold mb-4">{cms['prequalify.success.title'] || 'Application Received!'}</h2>
                    <p className="text-zinc-600 mb-8">
                      {cms['prequalify.success.message'] || `Thank you, ${formData.name.split(' ')[0]}. Our senior property advisor will review your profile and contact you via ${formData.email} within 24 hours.`}
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
                    
                    {/* Step 1: Basic Info (Shared) */}
                    {step === 1 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <h2 className="text-2xl font-bold mb-2">{cms['prequalify.step1.title'] || 'Basic Information'}</h2>
                        <p className="text-zinc-500 mb-8 text-sm">{cms['prequalify.step1.subtitle'] || "Let's start with your contact details."}</p>
                        
                        <div className="space-y-6">
                          <div>
                            <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Full Name</label>
                            <input 
                              type="text" 
                              className="w-full px-4 py-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-emerald/20"
                              placeholder="e.g. John Doe"
                              value={formData.name}
                              onChange={(e) => updateFormData({ name: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Email Address</label>
                            <input 
                              type="email" 
                              className="w-full px-4 py-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-emerald/20"
                              placeholder="john@example.com"
                              value={formData.email}
                              onChange={(e) => updateFormData({ email: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Phone Number</label>
                            <input 
                              type="tel" 
                              className="w-full px-4 py-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-emerald/20"
                              placeholder="+234..."
                              value={formData.phone}
                              onChange={(e) => updateFormData({ phone: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Your Current Location</label>
                            <input 
                              type="text" 
                              className="w-full px-4 py-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-emerald/20"
                              placeholder="e.g. London, UK or Lagos, Nigeria"
                              value={formData.location}
                              onChange={(e) => updateFormData({ location: e.target.value })}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2 UK: Financial Profile */}
                    {step === 2 && isUK && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h2 className="text-2xl font-bold mb-2">{cms['prequalify.step2uk.title'] || 'Financial Profile'}</h2>
                        <p className="text-zinc-500 mb-8 text-sm">{cms['prequalify.step2uk.subtitle'] || 'Understanding your investment capacity.'}</p>
                        
                        <div className="space-y-6">
                          <div>
                            <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Budget</label>
                            <select className="w-full px-4 py-3 rounded-lg border border-zinc-200" value={formData.budget} onChange={(e) => updateFormData({ budget: e.target.value })}>
                              <option value="">Select Budget Range</option>
                              <option value="Under £100k">Under £100k</option>
                              <option value="£100k - £250k">£100k - £250k</option>
                              <option value="£250k - £500k">£250k - £500k</option>
                              <option value="£500k+">£500k+</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Deposit Readiness</label>
                            <select className="w-full px-4 py-3 rounded-lg border border-zinc-200" value={formData.depositReadiness} onChange={(e) => updateFormData({ depositReadiness: e.target.value })}>
                              <option value="">Select Readiness</option>
                              <option value="Ready Now">Ready Now</option>
                              <option value="Within 3 Months">Within 3 Months</option>
                              <option value="3-6 Months">3-6 Months</option>
                              <option value="Just Exploring">Just Exploring</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Funding Type</label>
                            <div className="grid grid-cols-2 gap-3">
                              {['Cash', 'Mortgage'].map(type => (
                                <button key={type} onClick={() => updateFormData({ fundingType: type })} className={`p-3 rounded-lg border-2 text-sm font-bold transition-all ${formData.fundingType === type ? 'border-brand-emerald bg-emerald-50 text-brand-emerald' : 'border-zinc-100'}`}>{type}</button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Proof of Funds Available?</label>
                            <select className="w-full px-4 py-3 rounded-lg border border-zinc-200" value={formData.proofOfFunds} onChange={(e) => updateFormData({ proofOfFunds: e.target.value })}>
                              <option value="">Select Option</option>
                              <option value="Yes">Yes</option>
                              <option value="No, but can provide">No, but can provide soon</option>
                              <option value="No">No</option>
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3 UK: Investment Intent */}
                    {step === 3 && isUK && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h2 className="text-2xl font-bold mb-2">Investment Intent</h2>
                        <p className="text-zinc-500 mb-8 text-sm">What are you looking to achieve?</p>
                        
                        <div className="space-y-6">
                          <div>
                            <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Purpose</label>
                            <select className="w-full px-4 py-3 rounded-lg border border-zinc-200" value={formData.purpose} onChange={(e) => updateFormData({ purpose: e.target.value })}>
                              <option value="">Select Purpose</option>
                              <option value="Buy to Let (Investment)">Buy to Let (Investment)</option>
                              <option value="Personal Home / Relocation">Personal Home / Relocation</option>
                              <option value="Student Accommodation">Student Accommodation (for kids)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Timeline</label>
                            <select className="w-full px-4 py-3 rounded-lg border border-zinc-200" value={formData.timeline} onChange={(e) => updateFormData({ timeline: e.target.value })}>
                              <option value="">Select Timeline</option>
                              <option value="ASAP">ASAP</option>
                              <option value="1-3 Months">1-3 Months</option>
                              <option value="3-6 Months">3-6 Months</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Target Location (UK)</label>
                            <input type="text" className="w-full px-4 py-3 rounded-lg border border-zinc-200" placeholder="e.g. London, Manchester" value={formData.investmentLocation} onChange={(e) => updateFormData({ investmentLocation: e.target.value })} />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Property Type</label>
                            <select className="w-full px-4 py-3 rounded-lg border border-zinc-200" value={formData.propertyType} onChange={(e) => updateFormData({ propertyType: e.target.value })}>
                              <option value="">Select Type</option>
                              <option value="Apartment / Flat">Apartment / Flat</option>
                              <option value="House (Detached/Semi)">House</option>
                              <option value="New Build / Off-Plan">New Build / Off-Plan</option>
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 4 UK: Qualification Indicators */}
                    {step === 4 && isUK && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h2 className="text-2xl font-bold mb-2">Qualification Indicators</h2>
                        <p className="text-zinc-500 mb-8 text-sm">Final details to tailor our sourcing.</p>
                        
                        <div className="space-y-6">
                          <div>
                            <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Source of Funds</label>
                            <select className="w-full px-4 py-3 rounded-lg border border-zinc-200" value={formData.sourceOfFunds} onChange={(e) => updateFormData({ sourceOfFunds: e.target.value })}>
                              <option value="">Select Source</option>
                              <option value="Savings">Personal Savings</option>
                              <option value="Business Income">Business Income</option>
                              <option value="Inheritance / Gift">Inheritance / Gift</option>
                              <option value="Sale of Asset">Sale of Property/Asset</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Documentation Readiness</label>
                            <select className="w-full px-4 py-3 rounded-lg border border-zinc-200" value={formData.documentationReadiness} onChange={(e) => updateFormData({ documentationReadiness: e.target.value })}>
                              <option value="">Select Status</option>
                              <option value="Have all documents (ID, Bank Statements)">Have all documents ready</option>
                              <option value="Gathering documents">Currently gathering them</option>
                              <option value="Need guidance">Need guidance on what's required</option>
                            </select>
                          </div>
                          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-start gap-3 mt-8">
                            <input type="checkbox" id="feeAcceptance" className="mt-1" checked={formData.feeAcceptance} onChange={(e) => updateFormData({ feeAcceptance: e.target.checked })} />
                            <label htmlFor="feeAcceptance" className="text-sm text-emerald-900 leading-relaxed cursor-pointer">
                              {cms['prequalify.fee.notice'] || 'I understand that My Property Centre charges a sourcing/consultancy fee for finding and securing UK properties, payable upon successful engagement.'}
                            </label>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2 Nigeria: Core Fields */}
                    {step === 2 && !isUK && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h2 className="text-2xl font-bold mb-2">{cms['prequalify.step2ng.title'] || 'Investment Details'}</h2>
                        <p className="text-zinc-500 mb-8 text-sm">{cms['prequalify.step2ng.subtitle'] || 'Tell us about your target property in Nigeria.'}</p>
                        
                        <div className="space-y-6">
                          <div>
                            <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Budget</label>
                            <select className="w-full px-4 py-3 rounded-lg border border-zinc-200" value={formData.budget} onChange={(e) => updateFormData({ budget: e.target.value })}>
                              <option value="">Select Budget Range</option>
                              <option value="Under ₦50M">Under ₦50M</option>
                              <option value="₦50M - ₦100M">₦50M - ₦100M</option>
                              <option value="₦100M - ₦250M">₦100M - ₦250M</option>
                              <option value="Above ₦250M">Above ₦250M</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Target Location (Nigeria)</label>
                            <input type="text" className="w-full px-4 py-3 rounded-lg border border-zinc-200" placeholder="e.g. Lekki, Ikoyi, Abuja" value={formData.investmentLocation} onChange={(e) => updateFormData({ investmentLocation: e.target.value })} />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Property Type</label>
                            <select className="w-full px-4 py-3 rounded-lg border border-zinc-200" value={formData.propertyType} onChange={(e) => updateFormData({ propertyType: e.target.value })}>
                              <option value="">Select Type</option>
                              <option value="Land">Land</option>
                              <option value="Apartment">Apartment</option>
                              <option value="Duplex / House">Duplex / House</option>
                              <option value="Commercial">Commercial</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Specific Development Interest</label>
                            <input type="text" className="w-full px-4 py-3 rounded-lg border border-zinc-200" placeholder="Any specific project name?" value={formData.developmentInterest} onChange={(e) => updateFormData({ developmentInterest: e.target.value })} />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Funding Type</label>
                            <div className="grid grid-cols-3 gap-3">
                              {['Cash', 'Payment Plan', 'Mortgage'].map(type => (
                                <button key={type} type="button" onClick={() => updateFormData({ fundingType: type })} className={`p-3 rounded-lg border-2 text-xs font-bold transition-all ${formData.fundingType === type ? 'border-brand-emerald bg-emerald-50 text-brand-emerald' : 'border-zinc-100'}`}>{type}</button>
                              ))}
                            </div>
                          </div>

                          <AnimatePresence>
                            {formData.fundingType === 'Mortgage' && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }} 
                                animate={{ opacity: 1, height: 'auto' }} 
                                exit={{ opacity: 0, height: 0 }} 
                                className="pt-6 space-y-6 border-t border-zinc-100 overflow-hidden"
                              >
                                <div>
                                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Age</label>
                                  <input type="number" className="w-full px-4 py-3 rounded-lg border border-zinc-200" placeholder="e.g. 35" value={formData.age} onChange={(e) => updateFormData({ age: e.target.value })} />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Annual Income</label>
                                  <input type="text" className="w-full px-4 py-3 rounded-lg border border-zinc-200" placeholder="e.g. ₦20,000,000 or $50,000" value={formData.annualIncome} onChange={(e) => updateFormData({ annualIncome: e.target.value })} />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Employment Status</label>
                                  <select className="w-full px-4 py-3 rounded-lg border border-zinc-200" value={formData.employmentStatus} onChange={(e) => updateFormData({ employmentStatus: e.target.value })}>
                                    <option value="">Select Status</option>
                                    <option value="Employed">Full-time Employed</option>
                                    <option value="Self-Employed">Self-Employed / Business Owner</option>
                                    <option value="Diaspora Employed">Employed in Diaspora</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Country of Residency</label>
                                  <input type="text" className="w-full px-4 py-3 rounded-lg border border-zinc-200" placeholder="e.g. UK, USA, Nigeria" value={formData.residency} onChange={(e) => updateFormData({ residency: e.target.value })} />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3 Nigeria: Confirmation */}
                    {step === 3 && !isUK && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h2 className="text-2xl font-bold mb-2">{cms['prequalify.confirm.title'] || 'Final Confirmation'}</h2>
                        <p className="text-zinc-500 mb-8 text-sm">{cms['prequalify.confirm.subtitle'] || 'Review your strategy before submission.'}</p>
                        
                        <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 space-y-4 mb-8">
                          <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Market:</span>
                            <span className="font-bold text-brand-emerald">Nigeria</span>
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
                          <ShieldCheck className="h-5 w-5 text-brand-emerald mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-brand-emerald/80 leading-relaxed">
                            By submitting, you agree to our privacy policy. Your data is encrypted and will only be used to match you with verified property opportunities.
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Error Message */}
                    <AnimatePresence>
                      {error && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-8 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-bold text-center">
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 mt-8 pt-8 border-t border-zinc-100">
                      {step > 1 && (
                        <button 
                          onClick={prevStep}
                          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-zinc-400 hover:text-zinc-600 transition-colors"
                        >
                          <ChevronLeft className="h-5 w-5" /> Back
                        </button>
                      )}
                      
                      {step < maxSteps ? (
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
                          disabled={isSubmitting || (isUK && !formData.feeAcceptance)}
                          className="flex-[2] btn-gold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
              {cms['prequalify.privacy.notice'] || '128-bit SSL Secured Lead Submission'}
            </p>
          </div>
        </div>
      </main>
      <Footer initialCms={cms} />
    </>
  );
}

export default function PrequalifyPage() {
  const [cms, setCms] = useState({});
  
  useEffect(() => {
    fetch('/api/site-content').then(r => r.json()).then(d => {
      if (Array.isArray(d)) {
        const m: any = {};
        d.forEach(i => m[i.key] = i.value);
        setCms(m);
      }
    }).catch(()=>{});
  }, []);

  return (
    <Suspense fallback={
      <div className="min-h-screen pt-32 pb-20 bg-brand-cream flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-emerald/20 border-t-brand-emerald rounded-full animate-spin"></div>
      </div>
    }>
      <PrequalifyForm initialCms={cms} />
    </Suspense>
  );
}


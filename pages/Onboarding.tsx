import React, { useState, useEffect } from 'react';
import { UserProfile, UserGender, FitnessLevel, RiskProfile } from '../types';
import { MEDICAL_DISCLAIMER } from '../constants';
import { calculateRiskProfile } from '../utils';
import { Button } from '../components/Button';
import { AlertTriangle, ChevronRight, Activity, Ban, HeartPulse, Stethoscope, Bone } from 'lucide-react';

interface Props {
  onComplete: (profile: UserProfile) => void;
}

export const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    age: 30,
    weightKg: 70,
    heightCm: 170,
    gender: UserGender.Other,
    fitnessLevel: FitnessLevel.Sedentary,
    medicalConditions: [],
    injuries: [],
    redFlags: [],
    hasAgreedToDisclaimer: false,
    workStartTime: '09:00',
    workEndTime: '17:00'
  });
  const [medicalConfirm, setMedicalConfirm] = useState(false);
  const [riskAssessment, setRiskAssessment] = useState<RiskProfile>(RiskProfile.Unrestricted);
  const [isLockedOut, setIsLockedOut] = useState(false);

  // Auto-calculate risk for internal state, but DO NOT trigger UI changes immediately
  useEffect(() => {
    const risk = calculateRiskProfile(formData);
    setRiskAssessment(risk);
  }, [formData.age, formData.weightKg, formData.heightCm, formData.redFlags, formData.injuries]);

  const toggleSelection = (field: 'injuries' | 'redFlags' | 'medicalConditions', value: string) => {
    const current = formData[field] || [];
    if (current.includes(value)) {
      setFormData({ ...formData, [field]: current.filter(i => i !== value) });
    } else {
      setFormData({ ...formData, [field]: [...current, value] });
    }
  };

  const handleNext = () => {
    // Check for Red Flags specifically when trying to pass the Safety Screening (Step 2)
    if (step === 2) {
      if (riskAssessment === RiskProfile.RedFlag) {
        setIsLockedOut(true);
        return;
      }
    }

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Finalize
      // Double check risk at submission time
      const finalRisk = calculateRiskProfile(formData);
      if (finalRisk === RiskProfile.RedFlag) {
         setIsLockedOut(true);
         return;
      }

      const profile: UserProfile = {
        ...formData as UserProfile,
        riskProfile: finalRisk,
        onboardingCompleted: true,
        waiverSignedAt: new Date().toISOString(),
        hasAgreedToDisclaimer: true
      };
      onComplete(profile);
    }
  };

  // Hard Stop Screen logic - Controlled by isLockedOut state
  if (isLockedOut) {
    return (
      <div className="min-h-screen bg-red-50 dark:bg-red-950 flex items-center justify-center p-6 animate-in zoom-in duration-300">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 border border-red-200 dark:border-red-800 text-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Ban size={40} className="text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Safety Pause Initiated</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
            Based on your reported symptoms (e.g., Chest Pain, Uncontrolled BP, Dizziness), it is <strong>not medically safe</strong> for you to start an automated exercise program without physician clearance.
          </p>
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-left mb-6 border-l-4 border-brand-500">
            <h4 className="font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
              <HeartPulse size={16} className="text-brand-500" /> Clinical Recommendation:
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Please consult a healthcare professional immediately. This app will remain locked for workout features until your symptoms resolve and you are cleared for activity.
            </p>
          </div>
          <Button variant="secondary" fullWidth onClick={() => window.location.reload()}>
            Return to Start
          </Button>
        </div>
      </div>
    );
  }

  const steps = [
    // Step 0: Disclaimer
    {
      title: 'Clinical Disclaimer',
      icon: <Activity className="text-brand-500" />,
      render: () => (
        <div className="space-y-6">
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-red-500 shrink-0 mt-1" />
              <p className="text-sm text-red-800 dark:text-red-200 font-medium leading-relaxed">
                {MEDICAL_DISCLAIMER}
              </p>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            DeskFlow uses clinical algorithms (ACSM guidelines) to scale intensity, but we cannot replace a doctor. You assume all risk.
          </p>
          <label className="flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
            <input 
              type="checkbox" 
              className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500"
              checked={medicalConfirm}
              onChange={(e) => setMedicalConfirm(e.target.checked)}
            />
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
              I have read and accept the Medical Disclaimer & Assumption of Risk.
            </span>
          </label>
        </div>
      ),
      isValid: () => medicalConfirm
    },
    // Step 1: Biometrics
    {
      title: 'Biometrics',
      icon: <Activity className="text-brand-500" />,
      render: () => (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Name</label>
            <input 
              type="text" 
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-brand-500 dark:text-white font-medium"
              placeholder="Your Name"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Age</label>
              <input 
                type="number" 
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-brand-500 dark:text-white font-medium"
                value={formData.age}
                onChange={e => setFormData({...formData, age: parseInt(e.target.value) || 0})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Gender</label>
              <select 
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-brand-500 dark:text-white font-medium"
                value={formData.gender}
                onChange={e => setFormData({...formData, gender: e.target.value as UserGender})}
              >
                <option value={UserGender.Male}>Male</option>
                <option value={UserGender.Female}>Female</option>
                <option value={UserGender.Other}>Other</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Weight (kg)</label>
              <input 
                type="number" 
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-brand-500 dark:text-white font-medium"
                value={formData.weightKg}
                onChange={e => setFormData({...formData, weightKg: parseInt(e.target.value) || 0})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Height (cm)</label>
              <input 
                type="number" 
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-brand-500 dark:text-white font-medium"
                value={formData.heightCm}
                onChange={e => setFormData({...formData, heightCm: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>
          <p className="text-xs text-slate-400">Required to calculate BMI and scaling factors. Data stays on device.</p>
        </div>
      ),
      isValid: () => !!formData.name && (formData.age || 0) > 0
    },
    // Step 2: Red Flags
    {
      title: 'Safety Screening',
      icon: <Stethoscope className="text-red-500" />,
      render: () => (
        <div className="space-y-4">
           <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
             Do you currently experience any of the following?
           </p>
           <div className="space-y-2">
             {['Chest Pain at Rest/Exertion', 'Uncontrolled Hypertension', 'Severe Dizziness/Vertigo', 'Shortness of Breath'].map((flag) => (
               <label key={flag} className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                 formData.redFlags?.includes(flag) 
                   ? 'bg-red-50 border-red-500 dark:bg-red-900/20 dark:border-red-500' 
                   : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
               }`}>
                 <input 
                    type="checkbox"
                    className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                    checked={formData.redFlags?.includes(flag)}
                    onChange={() => toggleSelection('redFlags', flag)}
                 />
                 <span className={`text-sm font-medium ${formData.redFlags?.includes(flag) ? 'text-red-700 dark:text-red-300' : 'text-slate-700 dark:text-slate-300'}`}>
                   {flag}
                 </span>
               </label>
             ))}
           </div>
           <p className="text-xs text-slate-500">Checking these boxes will pause the setup process for safety.</p>
        </div>
      ),
      isValid: () => true
    },
    // Step 3: Orthopedics
    {
      title: 'Injury History',
      icon: <Bone className="text-brand-500" />,
      render: () => (
        <div className="space-y-4">
           <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
             Select areas where you have chronic pain or recent injuries. We will remove contraindicated exercises.
           </p>
           <div className="grid grid-cols-2 gap-3">
             {['Knees', 'Back', 'Shoulders', 'Wrists', 'Neck', 'Hips'].map((injury) => (
               <label key={injury} className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${
                 formData.injuries?.includes(injury) 
                   ? 'bg-brand-50 border-brand-500 dark:bg-brand-900/20 dark:border-brand-500' 
                   : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
               }`}>
                 <input 
                    type="checkbox"
                    className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                    checked={formData.injuries?.includes(injury)}
                    onChange={() => toggleSelection('injuries', injury)}
                 />
                 <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                   {injury}
                 </span>
               </label>
             ))}
           </div>
        </div>
      ),
      isValid: () => true
    }
  ];

  const currentStep = steps[step];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1">
        <div 
          className="bg-brand-600 h-1 transition-all duration-500"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>

      <div className="flex-1 p-6 flex flex-col max-w-lg mx-auto w-full">
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2 mb-2">
              {currentStep.icon}
              {currentStep.title}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Step {step + 1} of {steps.length}</p>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {currentStep.render()}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex gap-4">
          {step > 0 && (
            <Button variant="secondary" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          <Button 
            fullWidth 
            onClick={handleNext}
            disabled={!currentStep.isValid()}
          >
            {step === steps.length - 1 ? 'Complete Setup' : 'Continue'} <ChevronRight size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};
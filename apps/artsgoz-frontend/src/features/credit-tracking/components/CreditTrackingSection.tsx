import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { AcademicProfile, Subject, CategoryProgress } from '../types.js';
import { MOCK_SUBJECTS, CATEGORIES_CONFIG, MAJOR_OPTIONS, MINOR_OPTIONS, CURRICULUM_OPTIONS } from '../constants.js';
import { DropdownMenuContainer } from './DropdownMenuContainer.js';
import { PDPAForm } from './PDPAForm.js';
import { ProfileSetupForm } from './ProfileSetupForm.js';
import { CreditsSummaryCard } from './CreditsSummaryCard.js';
import { CurriculumView } from './CurriculumView.js';
import { PlannerView } from './PlannerView.js';
import { AcademicTrackerNavBar, type ActiveTab } from './AcademicTrackerNavBar.js';
import { SummaryView } from './SummaryView.js';

type AppStep = 'pdpa' | 'setup' | 'dashboard';

export function CreditTrackingSection() {
  const { t } = useTranslation();
  const [step, setStep] = useState<AppStep>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedStep = localStorage.getItem('tracker_step');
        if (savedStep) return savedStep as AppStep;
      } catch (e) {
        console.error('Failed to load tracker_step', e);
      }
    }
    return 'pdpa';
  });
  const [profile, setProfile] = useState<AcademicProfile | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedProfile = localStorage.getItem('tracker_profile');
        if (savedProfile) return JSON.parse(savedProfile);
      } catch (e) {
        console.error('Failed to load tracker_profile', e);
      }
    }
    return null;
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>('curriculum');

  const [showSummaryTab, setShowSummaryTab] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('tracker_show_summary');
        return saved === 'true';
      } catch (e) {
        console.error('Failed to load tracker_show_summary', e);
      }
    }
    return false;
  });

  const [lastSavedTime, setLastSavedTime] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('tracker_last_saved_time') || '';
      } catch (e) {
        console.error('Failed to load tracker_last_saved_time', e);
      }
    }
    return '';
  });
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedSubjects = localStorage.getItem('tracker_subjects');
        if (savedSubjects) {
          const parsed = JSON.parse(savedSubjects) as Subject[];
          const merged = [...parsed];
          MOCK_SUBJECTS.forEach((mock) => {
            if (!merged.some((s) => s.code === mock.code)) {
              merged.push(mock);
            }
          });
          return merged;
        }
      } catch (e) {
        console.error('Failed to load tracker_subjects', e);
      }
    }
    return MOCK_SUBJECTS;
  });

  // Save states helper
  const saveState = (newStep: AppStep, newProfile: AcademicProfile | null, newSubjects: Subject[]) => {
    try {
      localStorage.setItem('tracker_step', newStep);
      if (newProfile) {
        localStorage.setItem('tracker_profile', JSON.stringify(newProfile));
      } else {
        localStorage.removeItem('tracker_profile');
      }
      localStorage.setItem('tracker_subjects', JSON.stringify(newSubjects));
    } catch (e) {
      console.error('Failed to save tracker state', e);
    }
  };

  const handleConfirmPDPA = () => {
    setStep('setup');
    saveState('setup', profile, subjects);
  };

  const handleConfirmSetup = (setupProfile: AcademicProfile) => {
    setProfile(setupProfile);
    setStep('dashboard');
    saveState('dashboard', setupProfile, subjects);
  };

  const handleToggleSubject = (id: string) => {
    const nextSubjects = subjects.map((sub) =>
      sub.id === id ? { ...sub, completed: !sub.completed } : sub
    );
    setSubjects(nextSubjects);
    saveState(step, profile, nextSubjects);
  };

  const handleAddSubject = (newSub: Subject) => {
    const nextSubjects = [...subjects, newSub];
    setSubjects(nextSubjects);
    saveState(step, profile, nextSubjects);
  };

  const handleDeleteSubject = (id: string) => {
    const nextSubjects = subjects.filter((sub) => sub.id !== id);
    setSubjects(nextSubjects);
    saveState(step, profile, nextSubjects);
  };

  const handleUpdateMajor = (newMajor: string) => {
    if (!profile) return;
    const nextProfile = { ...profile, major: newMajor };
    setProfile(nextProfile);
    saveState(step, nextProfile, subjects);
  };

  const handleUpdateMinor = (newMinor: string) => {
    if (!profile) return;
    const nextProfile = { ...profile, minor: newMinor };
    setProfile(nextProfile);
    saveState(step, nextProfile, subjects);
  };

  const handleUpdateCurriculum = (newCurriculum: string) => {
    if (!profile) return;
    const nextProfile = { ...profile, curriculum: newCurriculum };
    setProfile(nextProfile);
    saveState(step, nextProfile, subjects);
  };

  const handleConfirmPlan = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;

    setShowSummaryTab(true);
    setLastSavedTime(timeStr);
    setActiveTab('summary');

    try {
      localStorage.setItem('tracker_show_summary', 'true');
      localStorage.setItem('tracker_last_saved_time', timeStr);
    } catch (e) {
      console.error('Failed to save summary confirmation state', e);
    }
  };

  // Calculate live progress for each category
  const progressList = useMemo<CategoryProgress[]>(() => {
    return CATEGORIES_CONFIG.map((cfg) => {
      const catCompleted = subjects
        .filter((sub) => sub.category === cfg.category && sub.completed)
        .reduce((sum, sub) => sum + sub.credits, 0);

      return {
        category: cfg.category,
        completed: catCompleted,
        required: cfg.required,
      };
    });
  }, [subjects]);

  // Handle rendering of current step
  if (step === 'pdpa') {
    return (
      <div className="w-full flex items-center justify-center min-h-[60vh] px-4">
        <PDPAForm onConfirm={handleConfirmPDPA} />
      </div>
    );
  }

  if (step === 'setup' || !profile) {
    return (
      <div className="w-full flex items-center justify-center min-h-[60vh] px-4">
        <ProfileSetupForm onSetupComplete={handleConfirmSetup} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8 py-10 md:py-16 font-[ChulaCharasNew] select-none min-w-0">
      {/* Top Header Section with profile display */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-24 min-w-0">
        <div className="min-w-0">
          <h1 className="text-black text-[36px] font-bold leading-none mb-2 truncate">{t('credit_tracking.title')}</h1>
          <h2 className="text-[#6D6D6D] text-[20px] font-medium truncate">{t('credit_tracking.subtitle')}</h2>
        </div>

        {/* Selected Major/Minor/Curriculum details */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-8 items-end min-w-0">
          <DropdownMenuContainer
            id="select-major"
            label={t('credit_tracking.profile.major_label')}
            value={profile.major}
            options={MAJOR_OPTIONS}
            placeholder="credit_tracking.profile.select_major"
            onChange={handleUpdateMajor}
          />
          <DropdownMenuContainer
            id="select-minor"
            label={t('credit_tracking.profile.minor_label')}
            value={profile.minor}
            options={MINOR_OPTIONS}
            placeholder="credit_tracking.profile.select_minor"
            onChange={handleUpdateMinor}
          />
          <DropdownMenuContainer
            id="select-curriculum"
            label={t('credit_tracking.profile.curriculum_label')}
            value={profile.curriculum}
            options={CURRICULUM_OPTIONS}
            placeholder="credit_tracking.profile.select_curriculum"
            onChange={handleUpdateCurriculum}
          />
        </div>
      </div>

      {/* Credit Summary */}
      <div className="w-full flex justify-center mt-[54px] mb-[78px]">
        <CreditsSummaryCard progressList={progressList} />
      </div>

      {/* Navigation Tabs Bar */}
      <div className="w-full max-w-[1062px] mb-10 overflow-hidden">
        <AcademicTrackerNavBar activeTab={activeTab} onTabChange={setActiveTab} showSummary={showSummaryTab} />
      </div>

      {/* Main Tab Views Switch */}
      <div className="mt-8 min-w-0">
        {activeTab === 'curriculum' && (
          <CurriculumView subjects={subjects} onToggleSubject={handleToggleSubject} profile={profile} />
        )}
        {activeTab === 'planner' && (
          <PlannerView
            subjects={subjects}
            onToggleSubject={handleToggleSubject}
            onAddSubject={handleAddSubject}
            onDeleteSubject={handleDeleteSubject}
            profile={profile}
            onConfirmPlan={handleConfirmPlan}
          />
        )}
        {activeTab === 'summary' && (
          <SummaryView
            subjects={subjects}
            profile={profile}
            lastSavedTime={lastSavedTime}
          />
        )}
      </div>
    </div>
  );
}

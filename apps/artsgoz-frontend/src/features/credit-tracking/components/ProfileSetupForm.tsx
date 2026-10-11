import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MAJOR_OPTIONS,
  MINOR_OPTIONS,
  CURRICULUM_OPTIONS,
} from '../constants.js';
import type { AcademicProfile } from '../types.js';
import { DropdownMenuContainer } from './DropdownMenuContainer.js';
import { Button } from '@artsgoz/design-system';

interface ProfileSetupFormProps {
  onSetupComplete: (profile: AcademicProfile) => void;
}

export function ProfileSetupForm({ onSetupComplete }: ProfileSetupFormProps) {
  const { t } = useTranslation();
  const [major, setMajor] = useState('credit_tracking.profile.select_major');
  const [minor, setMinor] = useState('credit_tracking.profile.select_minor');
  const [curriculum, setCurriculum] = useState(
    'credit_tracking.profile.select_curriculum',
  );
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!major || major === 'credit_tracking.profile.select_major') {
      setError(t('credit_tracking.profile.error_major'));
      return;
    }
    if (!minor || minor === 'credit_tracking.profile.select_minor') {
      setError(t('credit_tracking.profile.error_minor'));
      return;
    }
    if (
      !curriculum ||
      curriculum === 'credit_tracking.profile.select_curriculum'
    ) {
      setError(t('credit_tracking.profile.error_curriculum'));
      return;
    }

    setError('');
    onSetupComplete({ major, minor, curriculum });
  };

  return (
    <div className="w-full max-w-[620px] mx-auto bg-white border border-[#D0D0D1]/30 rounded-[16px] shadow-lg p-6 md:p-8 font-[ChulaCharasNew] my-8 select-none">
      <div className="text-center mb-8">
        <h2 className="text-black text-[28px] font-bold mb-1">
          Academic Tracker
        </h2>
        <p className="text-[#6D6D6D] text-[18px] break-words">
          {t('credit_tracking.subtitle')}
        </p>
      </div>

      <div className="bg-[#FCEFF4] text-[#DE5D8F] text-[18px] font-bold py-2 px-4 rounded-[8px] text-center mb-6 break-words">
        {t('credit_tracking.profile.fill_info')}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dropdown row */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-8">
          <DropdownMenuContainer
            id="select-major"
            label={t('credit_tracking.profile.major_label')}
            value={major}
            options={MAJOR_OPTIONS}
            placeholder="credit_tracking.profile.select_major"
            onChange={setMajor}
          />
          <DropdownMenuContainer
            id="select-minor"
            label={t('credit_tracking.profile.minor_label')}
            value={minor}
            options={MINOR_OPTIONS}
            placeholder="credit_tracking.profile.select_minor"
            onChange={setMinor}
          />
          <DropdownMenuContainer
            id="select-curriculum"
            label={t('credit_tracking.profile.curriculum_label')}
            value={curriculum}
            options={CURRICULUM_OPTIONS}
            placeholder="credit_tracking.profile.select_curriculum"
            onChange={setCurriculum}
          />
        </div>

        {error && (
          <div className="text-[#81132B] text-[16px] font-bold text-center mt-2 break-words">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full h-[48px] rounded-[8px] font-bold text-[18px] mt-4 font-[ChulaCharasNew]"
        >
          {t('credit_tracking.profile.submit')}
        </Button>
      </form>
    </div>
  );
}

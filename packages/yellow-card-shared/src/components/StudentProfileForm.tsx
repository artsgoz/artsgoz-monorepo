import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { StudentProfile } from '../types.js';

interface StudentProfileFormProps {
  profile: StudentProfile;
  onChange: (updatedProfile: StudentProfile) => void;
}

export function StudentProfileForm({ profile, onChange }: StudentProfileFormProps) {
  const { t } = useTranslation('yellow_card');
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<StudentProfile>(profile);

  const handleSave = () => {
    onChange(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  return (
    <div className="w-full bg-white border border-[#D0D0D1]/30 rounded-[16px] p-6 shadow-sm font-[ChulaCharasNew] mb-8 relative select-none min-w-0">
      {/* Absolute Edit Trigger Button on Top Right */}
      <div className="absolute top-6 right-6 z-10">
        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-[14px] font-bold text-[#DE5D8F] hover:text-[#ca5582] transition-colors cursor-pointer border border-[#DE5D8F]/20 hover:border-[#DE5D8F] rounded-[8px] py-1.5 px-3.5 bg-white"
          >
            {t('profile_form.edit')}
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="text-[14px] font-bold text-[#6D6D6D] hover:text-[#545455] transition-colors cursor-pointer border border-[#D0D0D1] rounded-[8px] py-1 px-3 bg-white"
            >
              {t('credit_tracking.planner.cancel')}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="text-[14px] font-bold text-white bg-[#E992B4] hover:bg-[#DE5D8F] transition-colors cursor-pointer rounded-[8px] py-1 px-3 border-none"
            >
              {t('credit_tracking.planner.save')}
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 min-w-0">
          <div className="flex flex-col gap-1.5 min-w-0">
            <label className="text-[14px] font-bold text-[#6D6D6D] truncate">{t('profile_form.name_label')}</label>
            <input
              type="text"
              value={editedProfile.name}
              onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
              className="w-full h-[40px] px-3 border border-[#D0D0D1] rounded-[8px] text-black text-[16px] focus:outline-none focus:border-[#DE5D8F]"
            />
          </div>

          <div className="flex flex-col gap-1.5 min-w-0">
            <label className="text-[14px] font-bold text-[#6D6D6D] truncate">{t('profile_form.student_id_label')}</label>
            <input
              type="text"
              value={editedProfile.studentId}
              onChange={(e) => setEditedProfile({ ...editedProfile, studentId: e.target.value })}
              className="w-full h-[40px] px-3 border border-[#D0D0D1] rounded-[8px] text-black text-[16px] focus:outline-none focus:border-[#DE5D8F]"
            />
          </div>

          <div className="flex flex-col gap-1.5 min-w-0">
            <label className="text-[14px] font-bold text-[#6D6D6D] truncate">{t('credit_tracking.profile.major_label')}</label>
            <input
              type="text"
              value={editedProfile.major}
              onChange={(e) => setEditedProfile({ ...editedProfile, major: e.target.value })}
              className="w-full h-[40px] px-3 border border-[#D0D0D1] rounded-[8px] text-black text-[16px] focus:outline-none focus:border-[#DE5D8F]"
            />
          </div>

          <div className="flex flex-col gap-1.5 min-w-0">
            <label className="text-[14px] font-bold text-[#6D6D6D] truncate">{t('credit_tracking.profile.minor_label')}</label>
            <input
              type="text"
              value={editedProfile.minor}
              onChange={(e) => setEditedProfile({ ...editedProfile, minor: e.target.value })}
              className="w-full h-[40px] px-3 border border-[#D0D0D1] rounded-[8px] text-black text-[16px] focus:outline-none focus:border-[#DE5D8F]"
            />
          </div>

          <div className="flex flex-col gap-1.5 min-w-0">
            <label className="text-[14px] font-bold text-[#6D6D6D] truncate">{t('credit_tracking.profile.curriculum_label')}</label>
            <input
              type="text"
              value={editedProfile.curriculum}
              onChange={(e) => setEditedProfile({ ...editedProfile, curriculum: e.target.value })}
              className="w-full h-[40px] px-3 border border-[#D0D0D1] rounded-[8px] text-black text-[16px] focus:outline-none focus:border-[#DE5D8F]"
            />
          </div>

          <div className="flex flex-col gap-1.5 min-w-0">
            <label className="text-[14px] font-bold text-[#6D6D6D] truncate">{t('profile_form.advisor_label')}</label>
            <input
              type="text"
              value={editedProfile.advisor}
              onChange={(e) => setEditedProfile({ ...editedProfile, advisor: e.target.value })}
              className="w-full h-[40px] px-3 border border-[#D0D0D1] rounded-[8px] text-black text-[16px] focus:outline-none focus:border-[#DE5D8F]"
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2 min-w-0">
            <label className="text-[14px] font-bold text-[#6D6D6D] truncate">{t('profile_form.address_label')}</label>
            <textarea
              value={editedProfile.address}
              onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
              rows={2}
              className="w-full p-3 border border-[#D0D0D1] rounded-[8px] text-black text-[16px] focus:outline-none focus:border-[#DE5D8F] resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5 min-w-0">
            <label className="text-[14px] font-bold text-[#6D6D6D] truncate">{t('profile_form.phone_label')}</label>
            <input
              type="text"
              value={editedProfile.phone}
              onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
              className="w-full h-[40px] px-3 border border-[#D0D0D1] rounded-[8px] text-black text-[16px] focus:outline-none focus:border-[#DE5D8F]"
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5 text-[16px] text-black pr-16 md:pr-0 min-w-0">
          {/* Row 1 */}
          <div className="flex flex-col md:flex-row md:items-center gap-y-2 min-w-0">
            <div className="flex items-center flex-1 min-w-0">
              <span className="w-[109px] font-bold shrink-0 text-black truncate">{t('profile_form.student_info_label')}</span>
              <span className="text-[#404041] truncate">{profile.name}</span>
            </div>
            <div className="flex items-center flex-1 md:pl-8 min-w-0">
              <span className="w-[100px] font-bold shrink-0 text-black truncate">{t('profile_form.student_id_short')}</span>
              <span className="text-[#404041] font-mono truncate">{profile.studentId}</span>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex flex-col md:flex-row md:items-center gap-y-2 min-w-0">
            <div className="flex items-center flex-1 min-w-0">
              <span className="w-[109px] font-bold shrink-0 text-black truncate">{t('credit_tracking.profile.major_label')}</span>
              <span className="text-[#404041] truncate">{profile.major}</span>
            </div>
            <div className="flex items-center flex-1 md:pl-8 min-w-0">
              <span className="w-[100px] font-bold shrink-0 text-black truncate">{t('credit_tracking.profile.minor_label')}</span>
              <span className="text-[#404041] truncate">{profile.minor || t('profile_form.no_minor')}</span>
            </div>
          </div>

          {/* Row 3 */}
          <div className="flex flex-col md:flex-row md:items-center gap-y-2 min-w-0">
            <div className="flex items-center flex-1 min-w-0">
              <span className="w-[109px] font-bold shrink-0 text-black truncate">{t('credit_tracking.profile.curriculum_label')}</span>
              <span className="text-[#404041] truncate">{profile.curriculum}</span>
            </div>
            <div className="flex items-center flex-1 md:pl-8 min-w-0">
              <span className="w-[100px] font-bold shrink-0 text-black truncate">{t('profile_form.advisor_label')}</span>
              <span className="text-[#404041] truncate">{profile.advisor}</span>
            </div>
          </div>

          {/* Row 4 */}
          <div className="flex flex-col md:flex-row md:items-start gap-y-2 min-w-0">
            <div className="flex items-start w-full min-w-0">
              <span className="w-[109px] font-bold shrink-0 text-black pt-0.5 truncate">{t('profile_form.address_label')}</span>
              <span className="text-[#404041] leading-relaxed break-words">{profile.address || '-'}</span>
            </div>
          </div>

          {/* Row 5 */}
          <div className="flex flex-col md:flex-row md:items-center gap-y-2 min-w-0">
            <div className="flex items-center w-full min-w-0">
              <span className="w-[109px] font-bold shrink-0 text-black truncate">{t('profile_form.phone_label')}</span>
              <span className="text-[#404041] font-mono truncate">{profile.phone || '-'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Professor } from '../types.js';
import {
  MOCK_PROFESSORS,
  DEPARTMENT_OPTIONS,
  STATUS_OPTIONS,
  PROFESSORS_PER_PAGE,
} from '../constants.js';
import { ProfessorCard } from './ProfessorCard.js';
import { ProfessorDetailPanel } from './ProfessorDetailPanel.js';
import { ProfessorSearchBar } from './ProfessorSearchBar.js';
import { FilterDropdown } from './FilterDropdown.js';
import { ProfessorPagination } from './ProfessorPagination.js';

export function ProfessorsSection() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [departmentFilter, setDepartmentFilter] = useState('professors.departments.all');
  const [statusFilter, setStatusFilter] = useState('professors.status.all');

  // Filter professors based on search and filters
  const filteredProfessors = useMemo(() => {
    return MOCK_PROFESSORS.filter((prof) => {
      const name = t(prof.nameKey).toLowerCase();
      const email = prof.email.toLowerCase();
      const department = t(prof.departmentKey).toLowerCase();
      const query = searchQuery.toLowerCase();

      const matchesSearch =
        !searchQuery ||
        name.includes(query) ||
        email.includes(query) ||
        department.includes(query);

      const matchesDept =
        departmentFilter === 'professors.departments.all' || prof.departmentKey === departmentFilter;

      return matchesSearch && matchesDept;
    });
  }, [searchQuery, departmentFilter, t]);

  const totalPages = Math.max(1, Math.ceil(filteredProfessors.length / PROFESSORS_PER_PAGE));

  const paginatedProfessors = useMemo(() => {
    const start = (currentPage - 1) * PROFESSORS_PER_PAGE;
    return filteredProfessors.slice(start, start + PROFESSORS_PER_PAGE);
  }, [filteredProfessors, currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    setSelectedProfessor(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedProfessor(null);
  };

  const handleSelectProfessor = (professor: Professor) => {
    setSelectedProfessor(professor);
  };

  const handleBack = () => {
    setSelectedProfessor(null);
  };

  const isDetailOpen = selectedProfessor !== null;

  return (
    <div className="w-full max-w-[1280px] mx-auto px-8">
      <h1
        className="font-[ChulaCharasNew] text-[#000000] truncate max-w-full"
        style={{
          fontSize: isDetailOpen ? '24px' : '32px',
          fontWeight: 700,
          marginTop: '74px',
          marginBottom: '22px',
          lineHeight: 1.25,
        }}
      >
        {t('professors.title')}
      </h1>

      <div className={`flex gap-0 ${isDetailOpen ? 'items-start flex-col lg:flex-row' : 'flex-col'}`}>
        {/* LEFT COLUMN — search + filters + list + pagination */}
        <div
          className="flex flex-col min-w-0"
          style={{
            width: isDetailOpen ? '434px' : '100%',
            maxWidth: '100%',
            flexShrink: 0,
          }}
        >
          <ProfessorSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            mode={isDetailOpen ? 'compact' : 'full'}
          />

          <div
            className={`flex items-center mt-[16px] flex-wrap gap-[18px] ${isDetailOpen ? 'justify-start' : 'justify-end'}`}
          >
            <FilterDropdown
              label={t('professors.department_label')}
              options={DEPARTMENT_OPTIONS}
              value={departmentFilter}
              onChange={(v) => { setDepartmentFilter(v); setCurrentPage(1); }}
            />
            <FilterDropdown
              label={t('professors.status_label')}
              options={STATUS_OPTIONS}
              value={statusFilter}
              onChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}
            />
          </div>

          <div
            className={`flex flex-col mt-[16px] min-w-0 ${!isDetailOpen ? 'mx-auto' : 'w-full'}`}
            style={{
              gap: '12px',
              width: isDetailOpen ? '100%' : '784px',
              maxWidth: '100%',
            }}
          >
            {paginatedProfessors.map((professor) => (
              <ProfessorCard
                key={professor.id}
                professor={professor}
                isSelected={selectedProfessor?.id === professor.id}
                onClick={handleSelectProfessor}
              />
            ))}

            {paginatedProfessors.length === 0 && (
              <div
                className="flex items-center justify-center py-16 font-[ChulaCharasNew] text-[#6D6D6D] text-center w-full"
                style={{ fontSize: '20px' }}
              >
                {t('professors.no_results')}
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div
              className="mt-8 flex justify-center w-full"
            >
              <ProfessorPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>

        {/* RIGHT COLUMN — detail panel (only visible in STATE 2) */}
        {isDetailOpen && (
          <div
            className="flex-1 ml-0 w-full lg:w-auto"
            style={{
              paddingLeft: '24px',
              marginTop: '-74px',
            }}
          >
            {selectedProfessor && (
              <ProfessorDetailPanel professor={selectedProfessor} onBack={handleBack} />
            )}
          </div>
        )}
      </div>

      <div style={{ height: '74px' }} />
    </div>
  );
}

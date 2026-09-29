import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Chip, SearchInput, Button, AccordionItem } from '@org/design-system';

// Assets
import linkTreeImg from '../../../assets/link_tree.png';

interface FAQItem {
  id: string;
  category: 'general' | 'registration' | 'tracker' | 'website';
  /** Translation key for the question */
  questionKey: string;
  /** Translation key for the answer */
  answerKey: string;
}

/**
 * FAQ data stores translation keys, not raw text.
 * Components must call t(faq.questionKey) and t(faq.answerKey) to render.
 */
const FAQ_DATA: FAQItem[] = [
  { id: 'faq-1', category: 'general',      questionKey: 'help.faq.faq_1_question', answerKey: 'help.faq.faq_1_answer' },
  { id: 'faq-2', category: 'registration', questionKey: 'help.faq.faq_2_question', answerKey: 'help.faq.faq_2_answer' },
  { id: 'faq-3', category: 'tracker',      questionKey: 'help.faq.faq_3_question', answerKey: 'help.faq.faq_3_answer' },
  { id: 'faq-4', category: 'website',      questionKey: 'help.faq.faq_4_question', answerKey: 'help.faq.faq_4_answer' },
  { id: 'faq-5', category: 'general',      questionKey: 'help.faq.faq_5_question', answerKey: 'help.faq.faq_5_answer' },
];

const CATEGORIES = [
  { value: 'all',          labelKey: 'help.categories.all' },
  { value: 'general',      labelKey: 'help.categories.general' },
  { value: 'registration', labelKey: 'help.categories.registration' },
  { value: 'tracker',      labelKey: 'help.categories.tracker' },
  { value: 'website',      labelKey: 'help.categories.website' },
] as const;

export default function HelpPage() {
  const { t } = useTranslation('help');
  const [searchQuery, setSearchQuery]     = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId]       = useState<string | null>(null);

  // Modal
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [name, setName]                 = useState('');
  const [email, setEmail]               = useState('');
  const [question, setQuestion]         = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const toggleAccordion = (id: string) =>
    setExpandedId(prev => (prev === id ? null : id));

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !question) return;
    setSubmitSuccess(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setName('');
      setEmail('');
      setQuestion('');
      setSubmitSuccess(false);
    }, 2000);
  };

  // Filter by category and search — compare against translated text
  const filteredFAQs = FAQ_DATA.filter(faq => {
    const matchesCategory =
      selectedCategory === 'all' || faq.category === selectedCategory;
    const translatedQ = t(faq.questionKey).toLowerCase();
    const translatedA = t(faq.answerKey).toLowerCase();
    const matchesSearch =
      translatedQ.includes(searchQuery.toLowerCase()) ||
      translatedA.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full bg-white min-h-screen font-[ChulaCharasNew]">
      {/* ── Main content ──────────────────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-16 pt-10 pb-16">

        {/* Row: left image  |  right FAQ section */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12">

          {/* ── LEFT: Link Tree image ────────────────────────────── */}
          <div className="w-full lg:w-[40%] shrink-0 flex flex-col gap-6">
            <h1 className="text-[40px] lg:text-[48px] font-bold text-[#404041] leading-[1.2] font-serif">
              {t('title')}
            </h1>
            <div className="w-full aspect-[521/679] rounded-[20px] overflow-hidden border border-[#ECECEC] shadow-[0_4px_20px_rgba(0,0,0,0.05)] bg-[#FDF8FA]/10">
              <img 
                src={linkTreeImg} 
                alt={t('image_alt')} 
                className="w-full h-full object-cover select-none" 
              />
            </div>
          </div>

          {/* ── RIGHT: Search + Chips + FAQ + Button ─────────────── */}
          <div className="w-full lg:flex-1 flex flex-col gap-0 pt-0 lg:pt-1">
            <h2 className="text-[32px] lg:text-[40px] font-bold text-[#404041] leading-[1.2] font-serif mb-6 mt-6 lg:mt-0">
              {t('faq_title')}
            </h2>

            {/* Search Field */}
            <div className="mb-4">
              <SearchInput
                size="lg"
                placeholder={t('search_placeholder')}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Categories */}
            <div className="flex flex-row justify-start items-end gap-5 flex-wrap mb-8">
              {CATEGORIES.map(cat => (
                <Chip
                  key={cat.value}
                  size="large"
                  selected={selectedCategory === cat.value}
                  onClick={() => {
                    setSelectedCategory(cat.value);
                    setExpandedId(null);
                  }}
                  className="font-[ChulaCharasNew]"
                >
                  {t(cat.labelKey)}
                </Chip>
              ))}
            </div>

            {/* FAQ Accordion */}
            <div className="flex flex-col">
              <AnimatePresence initial={false}>
                {filteredFAQs.length > 0 ? (
                  filteredFAQs.map(faq => {
                    const isExpanded = expandedId === faq.id;
                    return (
                      <AccordionItem
                        key={faq.id}
                        title={`${t(faq.questionKey)} ?`}
                        isOpen={isExpanded}
                        onToggle={() => toggleAccordion(faq.id)}
                        className="first:pt-0"
                      >
                        <p className="text-[16px] md:text-[18px] font-normal text-[#6D6D6D] leading-relaxed font-serif">
                          {t(faq.answerKey)}
                        </p>
                      </AccordionItem>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Search size={36} className="text-gray-300 mb-3" />
                    <p className="text-gray-500 text-[18px]">
                      {t('no_results')}
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* ส่งคำถาม Button */}
            <div className="mt-6 flex justify-center lg:justify-start">
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="primary"
                className="font-serif shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
              >
                {t('send_question_btn')}
                <Send size={16} />
              </Button>
            </div>

          </div>
        </div>
      </div>

      {/* ── Modal ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative z-10 border border-gray-100"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-5 top-5 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none cursor-pointer"
              >
                <X size={20} />
              </button>

              <h3 className="text-2xl font-bold text-gray-800 mb-2 font-[ChulaCharasNew]">
                {t('modal.title')}
              </h3>
              <p className="text-gray-500 text-[15px] mb-6 font-[ChulaCharasNew]">
                {t('modal.subtitle')}
              </p>

              {submitSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-8 text-center"
                >
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-1 font-[ChulaCharasNew]">{t('modal.success_title')}</h4>
                  <p className="text-gray-500 text-[15px] font-[ChulaCharasNew]">{t('modal.success_subtitle')}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleModalSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[15px] font-bold text-gray-700 mb-1.5 font-[ChulaCharasNew]">{t('modal.name_label')}</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder={t('modal.name_placeholder')}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#DE5D8F]/30 focus:border-[#DE5D8F] transition-all text-[15px] font-[ChulaCharasNew]"
                    />
                  </div>
                  <div>
                    <label className="block text-[15px] font-bold text-gray-700 mb-1.5 font-[ChulaCharasNew]">{t('modal.email_label')}</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder={t('modal.email_placeholder')}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#DE5D8F]/30 focus:border-[#DE5D8F] transition-all text-[15px] font-[ChulaCharasNew]"
                    />
                  </div>
                  <div>
                    <label className="block text-[15px] font-bold text-gray-700 mb-1.5 font-[ChulaCharasNew]">{t('modal.question_label')}</label>
                    <textarea
                      required
                      rows={4}
                      value={question}
                      onChange={e => setQuestion(e.target.value)}
                      placeholder={t('modal.question_placeholder')}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#DE5D8F]/30 focus:border-[#DE5D8F] transition-all text-[15px] resize-none font-[ChulaCharasNew]"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full mt-2 font-serif shadow-md"
                  >
                    {t('modal.submit_btn')}
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

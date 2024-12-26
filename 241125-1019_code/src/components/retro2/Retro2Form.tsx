import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Retro2QuestionField } from './Retro2QuestionField';
import { Sprout, LogOut } from 'lucide-react';
import type { ApplicationQuestion } from '../../types/application';
import { supabase } from '../../lib/supabase';
import './Retro2.css';

interface Props {
  questions: ApplicationQuestion[];
  onSubmit: (data: any) => void;
}

export function Retro2Form({ questions, onSubmit }: Props) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (questionId: number, value: any) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleAutoAdvance = () => {
    setCurrentSection(prev => Math.min(sectionNames.length - 1, prev + 1));
  };

  const sections = questions.reduce((acc, question) => {
    const section = question.section || 'Other';
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(question);
    return acc;
  }, {} as Record<string, ApplicationQuestion[]>);

  const sectionNames = Object.keys(sections);
  const currentSectionName = sectionNames[currentSection];
  const currentQuestions = sections[currentSectionName] || [];
  
  // Calculate progress based on answered questions
  const totalQuestions = questions.length;
  const answeredQuestions = Object.keys(formData).length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-black text-[#FFBF00] font-mono overflow-y-auto">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-[#FFBF00]/20">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Sprout className="w-6 h-6" />
              <h1 className="text-xl font-display">The Garden</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#FFBF00]/10 transition-colors rounded"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          {/* Section Navigation */}
          <div className="flex gap-6 py-2 overflow-x-auto scrollbar-none">
            {sectionNames.map((name, index) => (
              <button
                key={name}
                onClick={() => setCurrentSection(index)}
                className={`text-sm whitespace-nowrap transition-all ${
                  index === currentSection
                    ? `text-[#FFBF00]`
                    : `text-[#FFBF00]/40 hover:text-[#FFBF00]/60`
                }`}
              >
                {name}
                {index === currentSection && (
                  <span className="text-[#FFBF00]/60 ml-1">▲</span>
                )}
              </button>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="h-0.5 bg-[#FFBF00]/10">
            <motion.div
              className="h-full bg-[#FFBF00]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 pt-32 pb-32">
        <motion.div
          key={currentSectionName}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="space-y-12"
        >
          {currentQuestions.map((question, index) => (
            <div 
              key={question.order_number}
              className={`space-y-4 relative ${
                index !== currentQuestions.length - 1 ? 'pb-12' : ''
              }`}
            >
              <Retro2QuestionField
                question={question}
                value={formData[question.order_number]}
                onChange={(value) => handleChange(question.order_number, value)}
                onAutoAdvance={handleAutoAdvance}
              />
              {index !== currentQuestions.length - 1 && (
                <div className="absolute bottom-0 left-0 right-0 h-px bg-[#FFBF00]/10">
                  <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 text-[#FFBF00]/20 text-xs">
                    ▼
                  </div>
                </div>
              )}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-4 right-4 left-4 flex justify-between items-center max-w-2xl mx-auto">
        <button
          type="button"
          onClick={() => setCurrentSection(prev => Math.max(0, prev - 1))}
          className={`px-6 py-2 text-base transition-all bg-[#FFBF00]/10 hover:bg-[#FFBF00]/20 ${
            currentSection === 0
              ? 'opacity-0 pointer-events-none'
              : `text-[#FFBF00]`
          }`}
          style={{
            clipPath: `polygon(
              0 4px, 4px 4px, 4px 0,
              calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px,
              100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px),
              calc(100% - 4px) 100%, 4px 100%, 4px calc(100% - 4px),
              0 calc(100% - 4px)
            )`
          }}
        >
          Previous
        </button>

        {currentSection === sectionNames.length - 1 ? (
          <button
            type="submit"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="bg-[#FFBF00] text-black px-6 py-3 text-lg transition-colors"
            style={{
              clipPath: `polygon(
                0 4px, 4px 4px, 4px 0,
                calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px,
                100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px),
                calc(100% - 4px) 100%, 4px 100%, 4px calc(100% - 4px),
                0 calc(100% - 4px)
              )`
            }}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent" />
                Processing...
              </>
            ) : (
              'Submit'
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setCurrentSection(prev => Math.min(sectionNames.length - 1, prev + 1))}
            className="px-6 py-2 text-base transition-all bg-[#FFBF00]/10 hover:bg-[#FFBF00]/20 text-[#FFBF00]"
            style={{
              clipPath: `polygon(
                0 4px, 4px 4px, 4px 0,
                calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px,
                100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px),
                calc(100% - 4px) 100%, 4px 100%, 4px calc(100% - 4px),
                0 calc(100% - 4px)
              )`
            }}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
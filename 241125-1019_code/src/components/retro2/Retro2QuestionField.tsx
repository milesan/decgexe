import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { ApplicationQuestion } from '../../types/application';
import './Retro2.css';

interface Props {
  question: ApplicationQuestion;
  value: any;
  onChange: (value: any) => void;
  onAutoAdvance?: () => void;
}

const MBTI_TYPES = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
];

export function Retro2QuestionField({ question, value, onChange, onAutoAdvance }: Props) {
  const isConsentQuestion = question.order_number === 3;
  const isMBTIQuestion = question.text.toLowerCase().includes('mbti');

  if (isMBTIQuestion) {
    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-display">
          {question.text}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {MBTI_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => onChange(type)}
              className={`p-4 transition-all ${
                value === type 
                  ? `bg-[#FFBF00] text-black` 
                  : `bg-black border-2 border-[#FFBF00]/30 text-[#FFBF00] hover:border-[#FFBF00]/60`
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
              {type}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (question.type === 'radio' && question.options) {
    const options = Array.isArray(question.options) 
      ? question.options 
      : JSON.parse(question.options);

    const handleChange = (option: string) => {
      onChange(option);
      if (isConsentQuestion && option === 'Yes' && onAutoAdvance) {
        onAutoAdvance();
      }
    };

    return (
      <div className="space-y-6">
        {isConsentQuestion ? (
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <div className="relative">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-[#FFBF00]/20" />
              <motion.div 
                className="space-y-6 pl-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65 }}
              >
                <pre className="font-display text-[#FFBF00]/60 text-sm">
                  ╔═══════════════
                  COMPLETING THIS APPLICATION
                  IS NOT A CONFIRMED ENTRY
                  TO THE GARDEN
                  ════════════════╝
                </pre>

                <div className="space-y-4 font-display text-xl leading-relaxed max-w-lg">
                  <p className="text-[#FFBF00]/90">This is a curated place, unlike any other.</p>
                  <p className="text-[#FFBF00]/80">We seek those with the attention span & curiosity 
                  to complete this application.</p>
                  <p className="text-[#FFBF00]/70">We're not impressed by your followers, fortune, 
                  or fame [though none of those exclude you].</p>
                  <p className="text-[#FFBF00]/60">We seek the realest.</p>
                </div>

                <div className="h-px bg-[#FFBF00]/20" />
              </motion.div>
            </div>

            <motion.div 
              className="pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85 }}
            >
              <h3 className="text-xl font-display mb-6 text-[#FFBF00]/90">
                Do you consent to your data being stored and reviewed?
              </h3>
              <div className="flex justify-center gap-8">
                {options.map((option: string) => (
                  <button 
                    key={option} 
                    onClick={() => handleChange(option)}
                    className="bg-[#FFBF00] text-black px-6 py-3 text-lg transition-colors hover:bg-[#FFBF00]/90"
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
                    {option}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <>
            <h3 className="text-2xl font-display">
              {question.text}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </h3>
            <div className="space-y-4">
              {options.map((option: string) => {
                const isSelected = value === option;
                return (
                  <label 
                    key={option} 
                    className={`flex items-center p-6 cursor-pointer transition-all ${
                      isSelected 
                        ? `bg-[#FFBF00]/20` 
                        : `hover:bg-[#FFBF00]/10`
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
                    <div className={`flex-shrink-0 w-8 h-8 mr-4 flex items-center justify-center transition-colors ${
                      isSelected 
                        ? `border-2 border-[#FFBF00] bg-[#FFBF00]` 
                        : `border-2 border-[#FFBF00]`
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
                      {isSelected && <Check className="w-5 h-5 text-black" />}
                    </div>
                    <input
                      type="radio"
                      name={`question-${question.order_number}`}
                      value={option}
                      checked={isSelected}
                      onChange={() => handleChange(option)}
                      className="sr-only"
                      required={question.required}
                    />
                    <span className="text-xl text-[#FFBF00]">{option}</span>
                  </label>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  }

  if (question.type === 'textarea') {
    return (
      <div className="space-y-4">
        <h3 className="text-2xl font-display text-[#FFBF00]">
          {question.text}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </h3>
        <div className="relative">
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-black/30 p-3 text-[#FFBF00] focus:outline-none focus:ring-2 focus:ring-[#FFBF00] placeholder-[#FFBF00]/30 border-4 border-[#FFBF00]/30"
            rows={4}
            required={question.required}
            style={{
              clipPath: `polygon(
                0 4px, 4px 4px, 4px 0,
                calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px,
                100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px),
                calc(100% - 4px) 100%, 4px 100%, 4px calc(100% - 4px),
                0 calc(100% - 4px)
              )`
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-display text-[#FFBF00]">
        {question.text}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </h3>
      <div className="relative">
        <input
          type={question.type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-black/30 p-3 text-[#FFBF00] focus:outline-none focus:ring-2 focus:ring-[#FFBF00] placeholder-[#FFBF00]/30 border-4 border-[#FFBF00]/30"
          required={question.required}
          style={{
            clipPath: `polygon(
              0 4px, 4px 4px, 4px 0,
              calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px,
              100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px),
              calc(100% - 4px) 100%, 4px 100%, 4px calc(100% - 4px),
              0 calc(100% - 4px)
            )`
          }}
        />
      </div>
    </div>
  );
}
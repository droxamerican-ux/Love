/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, User, Rose, HeartHandshake } from 'lucide-react';

type Step = 1 | 2 | 3 | 4;

export default function App() {
  const [step, setStep] = useState<Step>(1);
  const [noBtnPos, setNoBtnPos] = useState<{ x: number; y: number } | null>(null);
  const [hearts, setHearts] = useState<{ id: number; left: string; duration: string; opacity: number; size: number }[]>([]);
  const noBtnRef = useRef<HTMLButtonElement>(null);

  // Background hearts generator
  useEffect(() => {
    const interval = setInterval(() => {
      setHearts((prev) => [
        ...prev.slice(-20),
        {
          id: Date.now(),
          left: `${Math.random() * 100}vw`,
          duration: `${Math.random() * 3 + 4}s`,
          opacity: Math.random() * 0.5 + 0.2,
          size: Math.random() * 20 + 10,
        },
      ]);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const moveButton = useCallback(() => {
    if (!noBtnRef.current) return;

    // Use the most reliable way to get viewport dimensions
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

    const btnWidth = noBtnRef.current.offsetWidth || 160;
    const btnHeight = noBtnRef.current.offsetHeight || 52;

    // Increased padding to ensure it never touches the very edge
    const padding = 40;
    
    // Calculate the maximum allowed coordinates
    const maxX = vw - btnWidth - padding;
    const maxY = vh - btnHeight - padding;

    // Ensure coordinates are always within a safe range [padding, max]
    const safeMaxX = Math.max(padding, maxX);
    const safeMaxY = Math.max(padding, maxY);

    const newX = padding + Math.random() * (safeMaxX - padding);
    const newY = padding + Math.random() * (safeMaxY - padding);

    setNoBtnPos({ x: newX, y: newY });
  }, []);

  const handleNoInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    if ('preventDefault' in e) e.preventDefault();
    moveButton();
  };

  const nextStep = () => {
    setStep((prev) => (prev + 1) as Step);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-love-dark via-love-red to-love-pink overflow-hidden" dir="rtl">
      {/* Background Hearts */}
      {hearts.map((h) => (
        <div
          key={h.id}
          className="heart-particle text-white/40"
          style={{
            left: h.left,
            animationDuration: h.duration,
            opacity: h.opacity,
            fontSize: `${h.size}px`,
          }}
        >
          ❤️
        </div>
      ))}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="glass-card relative z-10 w-[450px] max-w-[90%] p-10 rounded-[40px] text-center"
        >
          {step === 1 && (
            <div className="flex flex-col items-center gap-6">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-2">
                <User className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-black tracking-tight">المطور: Drox</h1>
              <p className="text-lg text-white/80 leading-relaxed">
                مرحباً بكِ في هذه التجربة المليئة بالحب والتقدير..
                <br />
                هل أنتِ مستعدة؟
              </p>
              <button
                onClick={nextStep}
                className="group relative px-8 py-4 bg-love-pink hover:bg-love-pink/90 text-white font-bold rounded-full transition-all duration-300 shadow-lg hover:shadow-love-pink/40 flex items-center gap-2"
              >
                ابدأ التجربة
                <Heart className="w-5 h-5 fill-current group-hover:scale-125 transition-transform" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center gap-6">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-2">
                <Sparkles className="w-10 h-10 text-yellow-300 animate-pulse" />
              </div>
              <p className="text-xl font-medium text-white/90 leading-relaxed">
                سأسألكِ سؤالاً واحداً فقط..
                <br />
                وأريد منكِ الإجابة بكل صراحة.
              </p>
              <button
                onClick={nextStep}
                className="px-8 py-4 bg-white text-love-red font-bold rounded-full hover:bg-white/90 transition-all shadow-xl"
              >
                عرض السؤال التالي
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center gap-8">
              <div className="w-24 h-24 bg-love-pink/20 rounded-full flex items-center justify-center animate-bounce">
                <HeartHandshake className="w-12 h-12 text-love-pink" />
              </div>
              <h1 className="text-5xl font-black text-white drop-shadow-md">هل تحبينني؟</h1>
              
              <div className="flex items-center justify-center gap-4 min-h-[100px] w-full relative">
                {/* Yes Button Container */}
                <div className="w-40 flex justify-center">
                  <button
                    onClick={nextStep}
                    className="z-20 w-40 py-3 bg-gradient-to-r from-love-pink to-love-red text-white font-bold text-lg rounded-full shadow-xl hover:scale-105 active:scale-95 transition-transform"
                  >
                    نعم! 🥰
                  </button>
                </div>

                {/* No Button Container with Placeholder */}
                <div className="w-40 flex justify-center">
                  {noBtnPos && <div className="w-40 h-[52px]" />} {/* Placeholder to keep Yes button in place */}
                  <button
                    ref={noBtnRef}
                    onMouseEnter={handleNoInteraction}
                    onTouchStart={handleNoInteraction}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      moveButton();
                    }}
                    style={noBtnPos ? {
                      position: 'fixed',
                      left: noBtnPos.x,
                      top: noBtnPos.y,
                      zIndex: 1000,
                      transition: 'all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    } : {}}
                    className="w-40 py-3 bg-zinc-800 text-white/60 font-bold text-lg rounded-full hover:bg-zinc-700 transition-colors"
                  >
                    لا 😢
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col items-center gap-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <Rose className="w-24 h-24 text-love-pink mb-4" />
              </motion.div>
              <h1 className="text-4xl font-black">وأنا أيضاً أحبكِ يا عزيزتي ❤️</h1>
              <p className="text-lg text-white/70">شكراً لكونكِ جزءاً جميلاً من عالمي.</p>
              
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="mt-4"
              >
                <Heart className="w-12 h-12 text-love-pink fill-current" />
              </motion.div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer Branding */}
      <div className="absolute bottom-6 left-0 right-0 text-center text-white/30 text-sm font-medium tracking-widest uppercase">
        Designed with Love by Drox
      </div>
    </div>
  );
}

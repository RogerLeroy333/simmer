'use client';
import { useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { sampleRecipes } from '@/lib/recipes-data';

export default function CookModePage() {
  const router = useRouter();
  const params = useParams();
  const recipe = sampleRecipes.find(r => r.id === params.id) || sampleRecipes[0];
  const [currentStep, setCurrentStep] = useState(0);
  const [mode, setMode] = useState<'overview' | 'cockpit'>('overview');
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragStart, setDragStart] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  if (mode === 'overview') {
    return (
      <div className="h-full relative">
        <div className="h-full overflow-y-auto pt-14 px-7 pb-32" style={{ WebkitOverflowScrolling: 'touch' }}>
          <button onClick={() => router.push(`/recipe/${recipe.id}`)}
                  className="text-[12px] font-light tracking-[1px] uppercase px-4 py-2 rounded-3xl mb-4 min-h-[44px] transition-all active:scale-[0.97]"
                  style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream-30)', border: '1px solid var(--color-cream-30)' }}>
            Back
          </button>
          <h1 className="text-[36px] uppercase tracking-[1px] leading-none mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)' }}>{recipe.title}</h1>
          <p className="text-[14px] italic mb-6" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-cream-30)' }}>{recipe.steps.length} steps — let&apos;s walk through it</p>

          {/* Steps */}
          <div className="flex flex-col">
            {recipe.steps.map((step, i) => (
              <button key={i} onClick={() => { setCurrentStep(i); setMode('cockpit'); }}
                      className="flex gap-3.5 py-4 text-left transition-all active:opacity-80"
                      style={{ borderBottom: '1px solid var(--color-cream-06)' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[16px]"
                     style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream-30)', border: '1px solid var(--color-cream-15)' }}>
                  {step.number}
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-normal leading-[1.5] tracking-[0.3px]" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream)' }}>{step.title}</p>
                  <p className="text-[12px] italic leading-[1.5] mt-1" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-cream-30)' }}>{step.detail}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(244,235,217,0.15)" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 px-7 pb-9 pt-4 flex justify-center z-10"
             style={{ background: 'linear-gradient(to top, var(--color-bg) 60%, transparent)' }}>
          <button onClick={() => { setCurrentStep(0); setMode('cockpit'); }}
                  className="w-full text-[20px] tracking-[2px] uppercase rounded-[28px] py-[18px] min-h-[56px] transition-all active:scale-[0.98]"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)', background: 'var(--color-terra)' }}>
            Begin Step 1
          </button>
        </div>
      </div>
    );
  }

  // Cockpit mode — swipeable cards
  const handleTouchStart = (e: React.TouchEvent) => { setDragStart(e.touches[0].clientX); setDragging(true); };
  const handleTouchMove = (e: React.TouchEvent) => { if (dragging) setDragOffset(e.touches[0].clientX - dragStart); };
  const handleTouchEnd = () => {
    setDragging(false);
    if (dragOffset < -50 && currentStep < recipe.steps.length - 1) setCurrentStep(currentStep + 1);
    else if (dragOffset > 50 && currentStep > 0) setCurrentStep(currentStep - 1);
    setDragOffset(0);
  };

  const step = recipe.steps[currentStep];

  return (
    <div className="h-full relative overflow-hidden" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 px-7 pt-12 pb-3 flex justify-between items-center z-10"
           style={{ background: 'linear-gradient(to bottom, var(--color-bg) 60%, transparent)' }}>
        <button onClick={() => setMode('overview')}
                className="text-[12px] font-light tracking-[1px] uppercase px-4 py-2 rounded-3xl min-h-[44px] transition-all active:scale-[0.97]"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream-30)', border: '1px solid var(--color-cream-30)' }}>
          Steps
        </button>
        <span className="text-[12px] font-light tracking-[1px] uppercase" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream-30)' }}>
          Step <span style={{ color: 'var(--color-cream)' }}>{currentStep + 1}</span> of {recipe.steps.length}
        </span>
        <button onClick={() => router.push(`/recipe/${recipe.id}`)}
                className="text-[12px] font-light tracking-[1px] uppercase px-4 py-2 rounded-3xl min-h-[44px] transition-all active:scale-[0.97]"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream-30)', border: '1px solid var(--color-cream-30)' }}>
          Exit
        </button>
      </div>

      {/* Card content */}
      <div className="h-full flex flex-col items-center justify-center px-7 text-center gap-5 pt-24 pb-40"
           style={{ transform: `translateX(${dragOffset * 0.3}px)`, transition: dragging ? 'none' : 'transform 0.3s ease' }}>
        <p className="text-[11px] font-light tracking-[1.5px] uppercase" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-terra)' }}>
          Step {step.number} of {recipe.steps.length}
        </p>
        <h2 className="text-[34px] uppercase tracking-[1px] leading-[1.1] max-w-[310px]" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)' }}>
          {step.milestone || step.title}
        </h2>
        <div className="w-10 h-px opacity-50" style={{ background: 'var(--color-terra)' }} />
        {step.sensory_cues && (
          <p className="text-[15px] italic leading-[1.7] max-w-[280px]" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-cream-60)' }}>
            {step.sensory_cues}
          </p>
        )}
        <p className="text-[12px] font-light tracking-[0.5px] max-w-[280px] leading-[1.5]" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream-30)' }}>
          {step.detail}
        </p>
      </div>

      {/* Bottom */}
      <div className="absolute bottom-0 left-0 right-0 px-7 pb-10 pt-4 flex flex-col items-center gap-4 z-10">
        {/* Status chips */}
        <div className="flex gap-2 flex-wrap justify-center">
          {['On track', "Something's off", 'Next step', 'Need more time'].map(label => (
            <button key={label}
                    onClick={() => { if (label === 'Next step' && currentStep < recipe.steps.length - 1) setCurrentStep(currentStep + 1); }}
                    className="text-[12px] font-light tracking-[0.5px] rounded-3xl px-4 py-2 min-h-[44px] flex items-center gap-2 transition-all active:scale-[0.95]"
                    style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream-60)', border: '1px solid var(--color-cream-30)' }}>
              <span className="w-[5px] h-[5px] rounded-full" style={{ background: label === 'On track' ? 'var(--color-sage)' : label === "Something's off" ? 'var(--color-gold)' : label === 'Next step' ? 'var(--color-terra)' : 'var(--color-cream-60)' }} />
              {label}
            </button>
          ))}
        </div>
        {/* Dots */}
        <div className="flex gap-1.5 items-center">
          {recipe.steps.map((_, i) => (
            <div key={i} className="h-1.5 rounded-full transition-all duration-300"
                 style={{ width: i === currentStep ? 20 : 6, background: i === currentStep ? 'var(--color-terra)' : 'var(--color-cream-15)' }} />
          ))}
        </div>
        <p className="text-[10px] font-light tracking-[1px] uppercase" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream-15)' }}>
          {currentStep < recipe.steps.length - 1 ? 'Swipe to next step →' : 'Final step'}
        </p>
      </div>
    </div>
  );
}

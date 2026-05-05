'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type ImportMethod = 'none' | 'url' | 'photo' | 'video';

export default function ImportPage() {
  const router = useRouter();
  const [method, setMethod] = useState<ImportMethod>('none');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [photos, setPhotos] = useState<number[]>([]);

  const handleImport = async () => {
    setLoading(true);
    setLoadingStep(0);
    // Simulate import steps
    for (let i = 0; i < 4; i++) {
      await new Promise(r => setTimeout(r, 800));
      setLoadingStep(i + 1);
    }
    // In production: call /api/import with URL or photos
    router.push('/import/preview?id=2'); // Demo: show chicken tikka masala
  };

  const addPhoto = (num: number) => {
    setPhotos(prev => prev.includes(num) ? prev : [...prev, num]);
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-7 gap-10">
        <div className="w-[120px] h-[120px] relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full animate-spin" style={{ border: '1.5px solid var(--color-cream-06)', animationDuration: '3s' }} />
          <div className="absolute inset-[10px] rounded-full animate-spin" style={{ border: '1.5px solid var(--color-terra)', opacity: 0.4, animationDuration: '2.2s', animationDirection: 'reverse' }} />
          <div className="absolute inset-[20px] rounded-full animate-spin" style={{ border: '1.5px solid var(--color-sage)', opacity: 0.3, animationDuration: '1.8s' }} />
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#CB5331" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        </div>
        <div className="flex flex-col items-center gap-2.5 text-center">
          <h2 className="text-[28px] uppercase tracking-[1px]" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)' }}>
            Importing recipe
          </h2>
          <p className="text-[14px] italic max-w-[260px] leading-[1.6]" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-cream-30)' }}>
            Reading, extracting, and organizing your recipe...
          </p>
          <div className="flex flex-col gap-2 mt-2">
            {['Fetching page...', 'Extracting ingredients...', 'Parsing steps...', 'Organizing for Simmer...'].map((step, i) => (
              <p key={i} className="text-[12px] font-light tracking-[0.5px] transition-colors duration-400"
                 style={{ fontFamily: 'var(--font-body)', color: loadingStep > i ? 'var(--color-sage)' : loadingStep === i ? 'var(--color-cream-60)' : 'var(--color-cream-15)' }}>
                {step}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pt-14 px-7 pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>
      <button onClick={() => router.back()}
              className="text-[12px] font-light tracking-[1px] uppercase px-4 py-2 rounded-3xl mb-6 min-h-[44px] transition-all active:scale-[0.97]"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream-30)', border: '1px solid var(--color-cream-30)' }}>
        Back
      </button>

      <h1 className="text-[36px] uppercase tracking-[1px] leading-none mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)' }}>
        Add a Recipe
      </h1>
      <p className="text-[14px] italic mb-8" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-cream-30)' }}>
        Bring in a recipe from anywhere
      </p>

      {/* URL Method */}
      <button onClick={() => setMethod('url')} className="w-full flex gap-4 items-center rounded-2xl p-5 mb-4 text-left transition-all active:scale-[0.98]"
              style={{ background: 'var(--color-bg2)', border: '1px solid var(--color-cream-06)' }}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-terra-bg)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#CB5331" strokeWidth="1.5"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
        </div>
        <div className="flex-1">
          <p className="text-[20px] uppercase tracking-[0.5px] mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)' }}>Paste a URL</p>
          <p className="text-[13px] italic leading-[1.5]" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-cream-30)' }}>Import from any recipe blog, NYT Cooking, Bon Appétit</p>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(244,235,217,0.15)" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg>
      </button>

      {/* Photo Method */}
      <button onClick={() => setMethod('photo')} className="w-full flex gap-4 items-center rounded-2xl p-5 mb-4 text-left transition-all active:scale-[0.98]"
              style={{ background: 'var(--color-bg2)', border: '1px solid var(--color-cream-06)' }}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-sage-bg)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#68886B" strokeWidth="1.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
        </div>
        <div className="flex-1">
          <p className="text-[20px] uppercase tracking-[0.5px] mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)' }}>Photos or Screenshots</p>
          <p className="text-[13px] italic leading-[1.5]" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-cream-30)' }}>Add multiple photos — cookbook pages, screenshots, notes</p>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(244,235,217,0.15)" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg>
      </button>

      {/* Video Method */}
      <button onClick={() => setMethod('video')} className="w-full flex gap-4 items-center rounded-2xl p-5 mb-4 text-left transition-all active:scale-[0.98]"
              style={{ background: 'var(--color-bg2)', border: '1px solid var(--color-cream-06)' }}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,168,83,0.1)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4A853" strokeWidth="1.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
        </div>
        <div className="flex-1">
          <p className="text-[20px] uppercase tracking-[0.5px] mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)' }}>Video or Reel</p>
          <p className="text-[13px] italic leading-[1.5]" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-cream-30)' }}>Paste a TikTok or Instagram Reel — we&apos;ll extract the recipe</p>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(244,235,217,0.15)" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg>
      </button>

      {/* URL Input */}
      {(method === 'url' || method === 'video') && (
        <div className="mt-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px" style={{ background: 'var(--color-cream-06)' }} />
            <span className="text-[11px] font-light tracking-[1.5px] uppercase" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream-15)' }}>
              {method === 'url' ? 'Paste recipe link' : 'Paste video link'}
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-cream-06)' }} />
          </div>
          <div className="flex items-center gap-3 rounded-[14px] px-4 py-3.5 transition-all"
               style={{ background: 'var(--color-bg-deep)', border: '1px solid var(--color-cream-15)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(244,235,217,0.3)" strokeWidth="1.5"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={method === 'url' ? 'https://recipes.com/...' : 'https://tiktok.com/... or instagram.com/reel/...'}
              className="flex-1 text-[14px] font-light tracking-[0.3px] bg-transparent border-none outline-none"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream)' }}
            />
            <button onClick={() => setUrl('https://www.seriouseats.com/chicken-tikka-masala')}
                    className="text-[11px] font-light tracking-[1px] uppercase min-h-[44px] px-2"
                    style={{ fontFamily: 'var(--font-body)', color: 'var(--color-terra)' }}>
              Paste
            </button>
          </div>
          <button onClick={handleImport} disabled={!url}
                  className="w-full text-[18px] tracking-[2px] uppercase rounded-3xl py-4 mt-4 min-h-[52px] transition-all active:scale-[0.97] disabled:opacity-25"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)', background: 'var(--color-terra)' }}>
            Import Recipe
          </button>
        </div>
      )}

      {/* Photo Upload */}
      {method === 'photo' && (
        <div className="mt-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px" style={{ background: 'var(--color-cream-06)' }} />
            <span className="text-[11px] font-light tracking-[1.5px] uppercase" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream-15)' }}>Add photos</span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-cream-06)' }} />
          </div>
          <div className="flex gap-2.5 flex-wrap mb-4">
            {[1, 2, 3].map((num) => (
              <button key={num} onClick={() => addPhoto(num)}
                      className="w-20 h-20 rounded-xl flex flex-col items-center justify-center gap-1 transition-all"
                      style={{
                        background: photos.includes(num) ? 'var(--color-sage-bg)' : 'var(--color-bg-deep)',
                        border: photos.includes(num) ? '1.5px solid var(--color-sage)' : '1.5px dashed var(--color-cream-15)'
                      }}>
                {photos.includes(num) ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#68886B" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                    <span className="text-[9px] font-light tracking-[0.5px]" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-sage)' }}>ADDED</span>
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(244,235,217,0.3)" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    <span className="text-[9px] font-light tracking-[0.5px]" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream-30)' }}>
                      {num <= 2 ? `PAGE ${num}` : 'MORE'}
                    </span>
                  </>
                )}
              </button>
            ))}
          </div>
          <p className="text-[12px] italic leading-[1.5] mb-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-cream-30)' }}>
            Add as many photos as you need — we&apos;ll combine them into one recipe.
          </p>
          <button onClick={handleImport} disabled={photos.length === 0}
                  className="w-full text-[18px] tracking-[2px] uppercase rounded-3xl py-4 min-h-[52px] transition-all active:scale-[0.97] disabled:opacity-25"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)', background: 'var(--color-terra)' }}>
            Extract Recipe
          </button>
        </div>
      )}
    </div>
  );
}

'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

type ImportMethod = 'none' | 'url' | 'photo' | 'video';

export default function ImportPage() {
  const router = useRouter();
  const [method, setMethod] = useState<ImportMethod>('none');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState('');
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async () => {
    setLoading(true);
    setError('');
    setLoadingStep(0);

    try {
      let body: Record<string, unknown>;

      if (method === 'url') {
        setLoadingStep(1); // Fetching page
        body = { type: 'url', url };
      } else if (method === 'video') {
        setLoadingStep(1); // Fetching video
        body = { type: 'video', url };
      } else {
        // Photo: convert files to base64
        setLoadingStep(1);
        const images = await Promise.all(
          photos.map(async (p) => {
            const buffer = await p.file.arrayBuffer();
            const base64 = btoa(
              new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            return {
              data: base64,
              mediaType: p.file.type || 'image/jpeg',
            };
          })
        );
        body = { type: 'photo', images };
      }

      // Simulate step progression while waiting for API
      const stepTimer = setInterval(() => {
        setLoadingStep(prev => Math.min(prev + 1, 3));
      }, 1500);

      const response = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      clearInterval(stepTimer);
      setLoadingStep(4); // All done

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Import failed');
      }

      const data = await response.json();

      // Store the parsed recipe in sessionStorage so preview page can read it
      sessionStorage.setItem('importedRecipe', JSON.stringify(data.recipe));
      sessionStorage.setItem('importSource', url || 'Photo upload');

      await new Promise(r => setTimeout(r, 500)); // Brief pause to show completion
      router.push('/import/preview');
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.');
    }
  };

  const handlePhotoSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPhotos = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPhotos(prev => [...prev, ...newPhotos]);
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  if (loading) {
    const steps = method === 'photo'
      ? ['Reading images...', 'Extracting text...', 'Parsing recipe...', 'Organizing for Simmer...']
      : method === 'video'
      ? ['Fetching video page...', 'Reading captions...', 'Extracting recipe...', 'Organizing for Simmer...']
      : ['Fetching page...', 'Extracting ingredients...', 'Parsing steps...', 'Organizing for Simmer...'];

    return (
      <div className="il-container">
        <div className="il-animation">
          <div className="il-ring" />
          <div className="il-ring" />
          <div className="il-ring" />
          <div className="il-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#CB5331" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </div>
        </div>
        <div className="il-text">
          <div className="il-title">Importing recipe</div>
          <div className="il-sub">Reading, extracting, and organizing your recipe...</div>
          <div className="il-steps">
            {steps.map((step, i) => (
              <div key={i} className={`il-step ${loadingStep > i + 1 ? 'done' : loadingStep >= i + 1 ? 'active' : ''}`}>
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', position: 'relative' }}>
      <div className="ri-scroll">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <button className="pill-btn" onClick={() => router.push('/')}>Back</button>
        </div>

        <div className="ri-title">Add a Recipe</div>
        <div className="ri-subtitle">Bring in a recipe from anywhere</div>

        {error && (
          <div style={{ background: 'rgba(203,83,49,0.15)', border: '1px solid var(--terra)', borderRadius: '12px', padding: '14px 16px', marginBottom: '16px' }}>
            <div style={{ fontFamily: 'var(--fb)', fontWeight: 300, fontSize: '13px', color: 'var(--cream)' }}>{error}</div>
          </div>
        )}

        {/* URL Method */}
        <div className="ri-method" onClick={() => setMethod('url')}>
          <div className="ri-method-icon" style={{ background: 'var(--terraBg)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#CB5331" strokeWidth="1.5"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
          </div>
          <div className="ri-method-info">
            <div className="ri-method-name">Paste a URL</div>
            <div className="ri-method-desc">Import from any recipe blog, NYT Cooking, Bon Appétit</div>
          </div>
          <div className="ri-method-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg></div>
        </div>

        {/* Photo Method */}
        <div className="ri-method" onClick={() => setMethod('photo')}>
          <div className="ri-method-icon" style={{ background: 'var(--sageBg)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#68886B" strokeWidth="1.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
          </div>
          <div className="ri-method-info">
            <div className="ri-method-name">Photos or Screenshots</div>
            <div className="ri-method-desc">Add multiple photos — cookbook pages, screenshots, handwritten notes</div>
          </div>
          <div className="ri-method-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg></div>
        </div>

        {/* Video Method */}
        <div className="ri-method" onClick={() => setMethod('video')}>
          <div className="ri-method-icon" style={{ background: 'rgba(212,168,83,0.1)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4A853" strokeWidth="1.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
          </div>
          <div className="ri-method-info">
            <div className="ri-method-name">Video or Reel</div>
            <div className="ri-method-desc">Paste a TikTok or Instagram Reel — we&apos;ll extract the recipe</div>
          </div>
          <div className="ri-method-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg></div>
        </div>

        {/* URL Input */}
        {(method === 'url' || method === 'video') && (
          <div className="ri-url-area">
            <div className="ri-divider">
              <div className="ri-divider-line" />
              <div className="ri-divider-text">{method === 'url' ? 'Paste recipe link' : 'Paste video link'}</div>
              <div className="ri-divider-line" />
            </div>
            <div className="ri-input-wrap">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(244,235,217,0.3)" strokeWidth="1.5"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={method === 'url' ? 'https://recipes.com/...' : 'https://tiktok.com/...'}
                className="ri-input"
              />
            </div>
            <button onClick={handleImport} className={`ri-go-btn ${!url ? 'disabled' : ''}`}>
              Import Recipe
            </button>
          </div>
        )}

        {/* Photo Upload */}
        {method === 'photo' && (
          <div className="ri-url-area">
            <div className="ri-divider">
              <div className="ri-divider-line" />
              <div className="ri-divider-text">Add photos</div>
              <div className="ri-divider-line" />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <div className="ri-photo-grid">
              {photos.map((photo, i) => (
                <div key={i} className="ri-photo-slot filled" onClick={() => removePhoto(i)}
                     style={{ backgroundImage: `url(${photo.preview})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#68886B" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              ))}
              <div className="ri-photo-slot empty" onClick={handlePhotoSelect}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(244,235,217,0.3)" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                <span className="ri-photo-label" style={{ color: 'var(--cream30)' }}>ADD</span>
              </div>
            </div>
            <div className="ri-photo-hint">Tap photos to remove. Add as many as you need — we&apos;ll combine them into one recipe.</div>
            <button onClick={handleImport} className={`ri-go-btn ${photos.length === 0 ? 'disabled' : ''}`}>
              Extract Recipe
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

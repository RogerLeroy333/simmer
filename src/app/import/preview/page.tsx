'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type ImportedRecipe = {
  title: string;
  subtitle?: string;
  time_minutes: number;
  difficulty: string;
  servings: number;
  cuisine: string;
  tags: string[];
  ingredients: { name: string; amount: string }[];
  steps: { number: number; title: string; detail: string; sensory_cues?: string; milestone?: string }[];
};

export default function PreviewPage() {
  const router = useRouter();
  const [recipe, setRecipe] = useState<ImportedRecipe | null>(null);
  const [source, setSource] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('importedRecipe');
    const storedSource = sessionStorage.getItem('importSource');
    if (stored) {
      setRecipe(JSON.parse(stored));
      setSource(storedSource || '');
    } else {
      // No recipe in session — go back to import
      router.push('/import');
    }
  }, [router]);

  const handleSave = async () => {
    if (!recipe) return;
    setSaving(true);
    setError('');

    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...recipe,
          source_url: source.startsWith('http') ? source : undefined,
          source_name: getSourceName(source),
          is_featured: false,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to save');
      }

      const saved = await response.json();
      sessionStorage.removeItem('importedRecipe');
      sessionStorage.removeItem('importSource');
      router.push('/library');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save recipe');
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    sessionStorage.removeItem('importedRecipe');
    sessionStorage.removeItem('importSource');
    router.push('/import');
  };

  if (!recipe) {
    return (
      <div className="il-container">
        <div className="il-title">Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', position: 'relative' }}>
      <div className="rp-scroll">
        <button className="pill-btn" onClick={() => router.push('/import')} style={{ marginBottom: '16px' }}>Back</button>

        <div className="rp-badge">
          <span className="rp-badge-dot" />
          Successfully imported
        </div>

        <div className="rp-title">{recipe.title}</div>
        {recipe.subtitle && (
          <div className="rp-source">{recipe.subtitle}</div>
        )}
        {source && source.startsWith('http') && (
          <div className="rp-source">
            <div className="rp-source-icon">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(244,235,217,0.3)" strokeWidth="1.5"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
            </div>
            {getSourceName(source)}
          </div>
        )}

        <div className="rp-meta">
          <div className="rp-meta-chip">
            <div className="rp-meta-val">{recipe.time_minutes}m</div>
            <div className="rp-meta-lbl">Time</div>
          </div>
          <div className="rp-meta-chip">
            <div className="rp-meta-val">{recipe.difficulty?.slice(0, 3)}</div>
            <div className="rp-meta-lbl">Difficulty</div>
          </div>
          <div className="rp-meta-chip">
            <div className="rp-meta-val">{recipe.servings}</div>
            <div className="rp-meta-lbl">Servings</div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="rp-section">
          <div className="rp-sec-head">
            <div className="rp-sec-title">Ingredients</div>
            <div className="rp-sec-line" />
            <div className="rp-sec-count">{recipe.ingredients.length} items</div>
          </div>
          {recipe.ingredients.map((ing, i) => (
            <div key={i} className="rp-ing-item">
              <span className="rp-ing-name">{ing.name}</span>
              <span className="rp-ing-amt">{ing.amount}</span>
            </div>
          ))}
        </div>

        {/* Steps */}
        <div className="rp-section">
          <div className="rp-sec-head">
            <div className="rp-sec-title">Steps</div>
            <div className="rp-sec-line" />
            <div className="rp-sec-count">{recipe.steps.length} steps</div>
          </div>
          {recipe.steps.map((step) => (
            <div key={step.number} className="rp-step-item">
              <div className="rp-step-num">{step.number}</div>
              <div className="rp-step-text">{step.detail}</div>
            </div>
          ))}
        </div>

        {error && (
          <div style={{ background: 'rgba(203,83,49,0.15)', border: '1px solid var(--terra)', borderRadius: '12px', padding: '14px 16px', marginBottom: '16px' }}>
            <div style={{ fontFamily: 'var(--fb)', fontWeight: 300, fontSize: '13px', color: 'var(--cream)' }}>{error}</div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="rp-actions">
        <button className="rp-action secondary" onClick={handleDiscard}>Discard</button>
        <button className="rp-action primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Recipe'}
        </button>
      </div>
    </div>
  );
}

function getSourceName(source: string): string {
  if (!source || !source.startsWith('http')) return source || 'Imported';
  try {
    const host = new URL(source).hostname.replace('www.', '');
    const names: Record<string, string> = {
      'seriouseats.com': 'Serious Eats',
      'bonappetit.com': 'Bon Appétit',
      'cooking.nytimes.com': 'NYT Cooking',
      'nytimes.com': 'NYT Cooking',
      'halfbakedharvest.com': 'Half Baked Harvest',
      'budgetbytes.com': 'Budget Bytes',
      'smittenkitchen.com': 'Smitten Kitchen',
      'foodnetwork.com': 'Food Network',
      'allrecipes.com': 'Allrecipes',
      'epicurious.com': 'Epicurious',
      'delish.com': 'Delish',
      'tiktok.com': 'TikTok',
      'instagram.com': 'Instagram',
    };
    return names[host] || host;
  } catch {
    return 'Imported';
  }
}

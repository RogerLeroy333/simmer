'use client';
import { useRouter, useParams } from 'next/navigation';
import { sampleRecipes } from '@/lib/recipes-data';

export default function RecipeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const recipe = sampleRecipes.find(r => r.id === params.id) || sampleRecipes[0];

  return (
    <div className="h-full relative">
      <div className="h-full overflow-y-auto pb-32" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Hero */}
        <div className="relative h-[280px] flex flex-col justify-end px-7 pb-6"
             style={{ background: 'linear-gradient(145deg, var(--color-bg3) 0%, var(--color-bg2) 50%, var(--color-bg) 100%)' }}>
          <div className="absolute top-12 left-7 right-7 flex justify-between items-center z-10">
            <button onClick={() => router.back()}
                    className="text-[12px] font-light tracking-[1px] uppercase px-4 py-2 rounded-3xl min-h-[44px] transition-all active:scale-[0.97]"
                    style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream-30)', background: 'rgba(72,17,16,0.7)', backdropFilter: 'blur(8px)', border: '1px solid var(--color-cream-15)' }}>
              Back
            </button>
          </div>
          {recipe.cuisine && (
            <p className="text-[11px] font-light tracking-[1.5px] uppercase mb-2" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-terra)' }}>{recipe.cuisine}</p>
          )}
          <h1 className="text-[48px] uppercase tracking-[2px] leading-none" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)' }}>{recipe.title}</h1>
          {recipe.subtitle && (
            <p className="text-[14px] italic mt-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-cream-60)' }}>{recipe.subtitle}</p>
          )}
        </div>

        <div className="px-7 pt-6">
          {/* Meta */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 flex flex-col items-center gap-1.5 rounded-xl py-3.5" style={{ background: 'var(--color-bg-deep)', border: '1px solid var(--color-cream-06)' }}>
              <span className="text-[22px]" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)' }}>{recipe.time_minutes ? `${recipe.time_minutes >= 60 ? Math.floor(recipe.time_minutes/60)+'h' : recipe.time_minutes+'m'}` : '?'}</span>
              <span className="text-[10px] font-light tracking-[1.5px] uppercase" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream-30)' }}>Total time</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1.5 rounded-xl py-3.5" style={{ background: 'var(--color-bg-deep)', border: '1px solid var(--color-cream-06)' }}>
              <span className="text-[22px]" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)' }}>{recipe.difficulty?.slice(0,3) || '?'}</span>
              <span className="text-[10px] font-light tracking-[1.5px] uppercase" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream-30)' }}>Difficulty</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1.5 rounded-xl py-3.5" style={{ background: 'var(--color-bg-deep)', border: '1px solid var(--color-cream-06)' }}>
              <span className="text-[22px]" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)' }}>{recipe.servings || '?'}</span>
              <span className="text-[10px] font-light tracking-[1.5px] uppercase" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream-30)' }}>Servings</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex gap-2 flex-wrap mb-6">
            {recipe.tags.map(tag => (
              <span key={tag} className="text-[11px] font-light tracking-[0.5px] rounded-full px-3.5 py-1.5"
                    style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream-60)', border: '1px solid var(--color-cream-15)' }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Ingredients */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[20px] uppercase tracking-[1px]" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)' }}>Ingredients</span>
              <div className="flex-1 h-px" style={{ background: 'var(--color-cream-15)' }} />
            </div>
            {recipe.ingredients.map((ing, i) => (
              <div key={i} className="flex justify-between items-baseline py-3" style={{ borderBottom: i < recipe.ingredients.length - 1 ? '1px solid var(--color-cream-06)' : 'none' }}>
                <span className="text-[14px] font-light tracking-[0.3px]" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream-80)' }}>{ing.name}</span>
                <span className="text-[13px] italic" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-cream-30)' }}>{ing.amount}</span>
              </div>
            ))}
          </div>

          {/* Method summary */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[20px] uppercase tracking-[1px]" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)' }}>Method</span>
              <div className="flex-1 h-px" style={{ background: 'var(--color-cream-15)' }} />
            </div>
            <p className="text-[14px] italic leading-[1.8]" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-cream-60)' }}>
              {recipe.steps.slice(0, 3).map(s => s.title).join(', then ')}...
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="absolute bottom-0 left-0 right-0 px-7 pb-10 pt-4 flex gap-2.5 z-10"
           style={{ background: 'linear-gradient(to top, var(--color-bg) 75%, transparent)' }}>
        <button className="flex-1 text-[16px] tracking-[1.5px] uppercase rounded-3xl py-4 min-h-[52px] flex items-center justify-center transition-all active:scale-[0.97]"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)', border: '1px solid var(--color-cream-30)' }}>
          Prep
        </button>
        <button className="flex-1 text-[16px] tracking-[1.5px] uppercase rounded-3xl py-4 min-h-[52px] flex items-center justify-center transition-all active:scale-[0.97]"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)', border: '1px solid var(--color-cream-30)' }}>
          Shop
        </button>
        <button onClick={() => router.push(`/cook/${recipe.id}`)}
                className="flex-1 text-[16px] tracking-[1.5px] uppercase rounded-3xl py-4 min-h-[52px] flex items-center justify-center transition-all active:scale-[0.97]"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)', background: 'var(--color-terra)', border: '1px solid var(--color-terra)' }}>
          Let&apos;s Cook
        </button>
      </div>
    </div>
  );
}

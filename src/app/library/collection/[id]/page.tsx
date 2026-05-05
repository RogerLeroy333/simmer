'use client';
import { useRouter, useParams } from 'next/navigation';
import { sampleRecipes, sampleCollections } from '@/lib/recipes-data';

export default function CollectionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const collection = sampleCollections.find(c => c.id === params.id) || sampleCollections[0];

  return (
    <div className="h-full overflow-y-auto pt-14 px-7 pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>
      <button onClick={() => router.push('/library')}
              className="text-[12px] font-light tracking-[1px] uppercase px-4 py-2 rounded-3xl mb-5 min-h-[44px] transition-all active:scale-[0.97]"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream-30)', border: '1px solid var(--color-cream-30)' }}>
        Back
      </button>
      <h1 className="text-[32px] uppercase tracking-[1px] leading-none mb-1.5" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)' }}>{collection.name}</h1>
      <p className="text-[13px] italic mb-6" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-cream-30)' }}>{collection.recipe_count} recipes</p>
      <div className="flex flex-col">
        {sampleRecipes.slice(0, collection.recipe_count).map((recipe) => (
          <button key={recipe.id} onClick={() => router.push(`/recipe/${recipe.id}`)}
                  className="flex gap-3.5 py-3.5 items-center text-left transition-all active:opacity-80"
                  style={{ borderBottom: '1px solid var(--color-cream-06)' }}>
            <div className="w-[52px] h-[52px] rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-bg3)' }}>
              <span className="text-[20px]" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream-15)' }}>{recipe.title[0]}</span>
            </div>
            <div className="flex-1">
              <p className="text-[16px] uppercase tracking-[0.5px] leading-tight mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)' }}>{recipe.title}</p>
              <p className="text-[11px] italic" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-cream-30)' }}>{recipe.time_minutes}m · {recipe.difficulty} · {recipe.cuisine}</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(244,235,217,0.15)" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        ))}
      </div>
    </div>
  );
}

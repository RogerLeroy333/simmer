'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import { sampleRecipes, sampleCollections } from '@/lib/recipes-data';

const smartFilters = [
  { name: 'All', count: 8 },
  { name: 'Recently added', count: 3 },
  { name: 'Under 30 min', count: 3 },
  { name: 'Italian', count: 3 },
  { name: 'Indian', count: 2 },
  { name: 'Thai', count: 1 },
  { name: 'Comfort food', count: 4 },
];

export default function LibraryPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredRecipes = activeFilter === 'All' ? sampleRecipes : sampleRecipes.filter(r => {
    if (activeFilter === 'Recently added') return true; // show all for demo
    if (activeFilter === 'Under 30 min') return (r.time_minutes || 999) <= 30;
    return r.cuisine === activeFilter || r.tags.includes(activeFilter);
  });

  return (
    <div className="h-full relative">
      <div className="h-full overflow-y-auto pt-14 px-7 pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>
        <h1 className="text-[36px] uppercase tracking-[1px] leading-none mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)' }}>Library</h1>
        <p className="text-[14px] italic mb-7" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-cream-30)' }}>Your recipes, your way</p>

        {/* Smart Filters */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 mb-7" style={{ scrollbarWidth: 'none' }}>
          {smartFilters.map(f => (
            <button key={f.name} onClick={() => setActiveFilter(f.name)}
                    className="flex-shrink-0 flex items-center gap-1.5 text-[12px] font-light tracking-[0.5px] rounded-full px-4 py-2.5 transition-all"
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: activeFilter === f.name ? 'var(--color-cream)' : 'var(--color-cream-60)',
                      background: activeFilter === f.name ? 'var(--color-terra-bg)' : 'var(--color-bg-deep)',
                      border: activeFilter === f.name ? '1px solid var(--color-terra)' : '1px solid var(--color-cream-06)',
                    }}>
              {f.name}
              <span className="text-[10px] px-1.5 py-0.5 rounded-md" style={{ background: 'var(--color-cream-06)', color: 'var(--color-cream-30)' }}>{f.count}</span>
            </button>
          ))}
        </div>

        {/* Collections */}
        <div className="mb-7">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[20px] uppercase tracking-[1px] whitespace-nowrap" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)' }}>Collections</span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-cream-15)' }} />
            <button className="text-[11px] font-light tracking-[1px] uppercase flex items-center gap-1 min-h-[44px]"
                    style={{ fontFamily: 'var(--font-body)', color: 'var(--color-terra)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {sampleCollections.map(coll => (
              <button key={coll.id} onClick={() => router.push(`/library/collection/${coll.id}`)}
                      className="rounded-[14px] p-4 text-left transition-all active:scale-[0.97]"
                      style={{ background: 'var(--color-bg2)', border: '1px solid var(--color-cream-06)' }}>
                <div className="w-9 h-9 rounded-[10px] flex items-center justify-center mb-3"
                     style={{ background: coll.color === 'terra' ? 'var(--color-terra-bg)' : coll.color === 'sage' ? 'var(--color-sage-bg)' : 'rgba(212,168,83,0.1)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                       stroke={coll.color === 'terra' ? '#CB5331' : coll.color === 'sage' ? '#68886B' : '#D4A853'} strokeWidth="1.5">
                    {coll.icon === 'clock' && <><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>}
                    {coll.icon === 'heart' && <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>}
                    {coll.icon === 'box' && <><path d="M3 9h18v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path d="M3 9l2-4h14l2 4"/></>}
                  </svg>
                </div>
                <p className="text-[16px] uppercase tracking-[0.5px] leading-tight mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)' }}>{coll.name}</p>
                <p className="text-[11px] font-light" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream-30)' }}>{coll.recipe_count} recipes</p>
              </button>
            ))}
            <button className="rounded-[14px] p-4 flex flex-col items-center justify-center min-h-[110px] gap-2 transition-all active:scale-[0.97]"
                    style={{ border: '1px dashed var(--color-cream-15)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(244,235,217,0.2)" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <span className="text-[13px] uppercase" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream-30)' }}>New collection</span>
            </button>
          </div>
        </div>

        {/* All Recipes */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[20px] uppercase tracking-[1px] whitespace-nowrap" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)' }}>All Recipes</span>
          <div className="flex-1 h-px" style={{ background: 'var(--color-cream-15)' }} />
          <span className="text-[11px] font-light whitespace-nowrap" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream-30)' }}>{filteredRecipes.length} recipes</span>
        </div>
        <div className="flex flex-col">
          {filteredRecipes.map((recipe) => (
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
      <NavBar />
    </div>
  );
}

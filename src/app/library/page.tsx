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
    if (activeFilter === 'Recently added') return true;
    if (activeFilter === 'Under 30 min') return (r.time_minutes || 999) <= 30;
    return r.cuisine === activeFilter || r.tags.includes(activeFilter);
  });

  return (
    <div style={{ height: '100%', position: 'relative' }}>
      <div className="lib-scroll">
        <div className="lib-title">Library</div>
        <div className="lib-subtitle">Your recipes, your way</div>

        {/* Smart Filters */}
        <div className="lib-smart-row">
          {smartFilters.map(f => (
            <button key={f.name} onClick={() => setActiveFilter(f.name)}
                    className={`lib-smart-chip ${activeFilter === f.name ? 'active' : ''}`}>
              {f.name}
              <span className="lsc-count">{f.count}</span>
            </button>
          ))}
        </div>

        {/* Collections */}
        <div className="lib-collections">
          <div className="lib-coll-header">
            <div className="lib-coll-title">Collections</div>
            <div className="lib-coll-line" />
            <button className="lib-coll-add">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New
            </button>
          </div>
          <div className="lib-coll-grid">
            {sampleCollections.map(coll => (
              <div key={coll.id} className="lib-folder" onClick={() => router.push(`/library/collection/${coll.id}`)}>
                <div className="lib-folder-icon"
                     style={{ background: coll.color === 'terra' ? 'var(--terraBg)' : coll.color === 'sage' ? 'var(--sageBg)' : 'rgba(212,168,83,0.1)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                       stroke={coll.color === 'terra' ? '#CB5331' : coll.color === 'sage' ? '#68886B' : '#D4A853'} strokeWidth="1.5">
                    {coll.icon === 'clock' && <><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>}
                    {coll.icon === 'heart' && <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>}
                    {coll.icon === 'box' && <><path d="M3 9h18v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path d="M3 9l2-4h14l2 4"/></>}
                  </svg>
                </div>
                <div className="lib-folder-name">{coll.name}</div>
                <div className="lib-folder-count">{coll.recipe_count} recipes</div>
              </div>
            ))}
            <div className="lib-folder add-new">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(244,235,217,0.2)" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <div className="lib-folder-name">New collection</div>
            </div>
          </div>
        </div>

        {/* All Recipes */}
        <div className="lib-all-header">
          <div className="lib-all-title">All Recipes</div>
          <div className="lib-all-line" />
          <div className="lib-all-count">{filteredRecipes.length} recipes</div>
        </div>
        <div className="lib-recipe-list">
          {filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="lib-recipe" onClick={() => router.push(`/recipe/${recipe.id}`)}>
              <div className="lib-recipe-thumb"><span className="lrt-letter">{recipe.title[0]}</span></div>
              <div className="lib-recipe-info">
                <div className="lib-recipe-name">{recipe.title}</div>
                <div className="lib-recipe-meta">{recipe.time_minutes}m · {recipe.difficulty} · {recipe.cuisine}</div>
              </div>
              <div className="lib-recipe-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg></div>
            </div>
          ))}
        </div>
      </div>
      <NavBar />
    </div>
  );
}

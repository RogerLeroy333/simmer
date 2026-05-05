'use client';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import { sampleRecipes, seasonalSpotlight, tipOfTheDay } from '@/lib/recipes-data';

export default function HomePage() {
  const router = useRouter();
  const featuredRecipes = sampleRecipes.filter(r => r.is_featured);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div style={{ height: '100%', position: 'relative' }}>
      <div className="hm-scroll">
        {/* Greeting */}
        <div className="greeting-hi">{getTimeGreeting()}</div>
        <div className="greeting-name">Rachel</div>
        <div className="tagline">What are we cooking tonight?</div>

        {/* Search */}
        <div className="search" onClick={() => {/* TODO */}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F4EBD9" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <span className="search-text">Search recipes, ingredients...</span>
        </div>

        {/* Tip of the day */}
        <div className="tip">
          <div className="tip-label">Tip of the day</div>
          <div className="tip-text">{tipOfTheDay}</div>
        </div>

        {/* Continue cooking */}
        <div className="resume" onClick={() => router.push('/cook/1?step=6')}>
          <div className="resume-label">Continue cooking</div>
          <div className="resume-title">Bolognese</div>
          <div className="resume-detail">Step 6 of 9 — Reducing the sauce</div>
          <div className="resume-progress">
            <div className="progress-bar"><div className="progress-fill" style={{ width: '67%' }} /></div>
            <div className="progress-text">67%</div>
          </div>
        </div>

        {/* For Tonight */}
        <div className="sec-head">
          <div className="sec-title">For tonight</div>
          <div className="sec-line" />
        </div>
        <div className="ft-scroll">
          {featuredRecipes.map((recipe) => (
            <div key={recipe.id} className="ft-card" onClick={() => router.push(`/recipe/${recipe.id}`)}>
              <div className="ft-card-img" style={{ background: `linear-gradient(135deg, var(--bg3), var(--bg2))` }}>
                <span className="ft-letter">{recipe.title[0]}</span>
                {recipe.featured_tag && (
                  <div className="ft-card-tag">{recipe.featured_tag}</div>
                )}
              </div>
              <div className="ft-card-body">
                <div className="ft-card-name">{recipe.title}</div>
                <div className="ft-card-meta">{recipe.time_minutes}m · {recipe.difficulty}</div>
                {recipe.source_name && (
                  <div className="ft-card-source">from {recipe.source_name}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* What's in Season */}
        <div className="season-card">
          <div className="season-tag">What&apos;s in season</div>
          <div className="season-title">{seasonalSpotlight.ingredient}</div>
          <div className="season-desc">{seasonalSpotlight.description}</div>
          <div className="season-recipes">
            {seasonalSpotlight.recipes.map((r) => (
              <div key={r.name} className="season-recipe">
                <div className="season-recipe-name">{r.name}</div>
                <div className="season-recipe-time">{r.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Start */}
        <div className="sec-head">
          <div className="sec-title">Quick start</div>
          <div className="sec-line" />
        </div>
        <div className="quick-row">
          <div className="quick-card">
            <div className="quick-icon" style={{ background: 'var(--terraBg)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#CB5331" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            </div>
            <div className="quick-label">30 min meals</div>
          </div>
          <div className="quick-card">
            <div className="quick-icon" style={{ background: 'var(--sageBg)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#68886B" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
            <div className="quick-label">Pantry cook</div>
          </div>
          <div className="quick-card">
            <div className="quick-icon" style={{ background: 'rgba(212,168,83,0.1)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4A853" strokeWidth="1.5"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
            </div>
            <div className="quick-label">Learn a skill</div>
          </div>
        </div>
      </div>

      {/* FAB */}
      <button className="fab" onClick={() => router.push('/import')}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F4EBD9" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>

      <NavBar />
    </div>
  );
}

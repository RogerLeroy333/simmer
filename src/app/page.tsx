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
    <div className="h-full relative">
      <div className="h-full overflow-y-auto pb-24 pt-14 px-7" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Greeting */}
        <p className="text-[13px] font-light tracking-[1.5px] uppercase" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream-30)' }}>
          {getTimeGreeting()}
        </p>
        <h1 className="text-[40px] uppercase tracking-[1px] leading-none mt-1 mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)' }}>
          Rachel
        </h1>
        <p className="text-[14px] italic mb-8" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-cream-30)' }}>
          What are we cooking tonight?
        </p>

        {/* Search */}
        <button
          onClick={() => {/* TODO: search overlay */}}
          className="w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 mb-7 transition-all"
          style={{ background: 'var(--color-bg-deep)', border: '1px solid var(--color-cream-06)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F4EBD9" strokeWidth="1.5" style={{ opacity: 0.3 }}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <span className="text-[13px] font-light tracking-[0.5px]" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream-30)' }}>
            Search recipes, ingredients...
          </span>
        </button>

        {/* Tip of the day */}
        <div className="rounded-2xl p-5 mb-7" style={{ background: 'var(--color-bg2)', border: '1px solid var(--color-cream-06)' }}>
          <p className="text-[10px] font-light tracking-[1.5px] uppercase mb-2" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-sage)' }}>
            Tip of the day
          </p>
          <p className="text-[14px] italic leading-[1.7]" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-cream-60)' }}>
            {tipOfTheDay}
          </p>
        </div>

        {/* Continue cooking */}
        <button
          onClick={() => router.push('/cook/1?step=6')}
          className="w-full rounded-2xl p-5 mb-7 text-left transition-all active:scale-[0.99]"
          style={{ background: 'var(--color-bg2)', border: '1px solid var(--color-cream-06)' }}
        >
          <p className="text-[10px] font-light tracking-[1.5px] uppercase mb-3" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-terra)' }}>
            Continue cooking
          </p>
          <p className="text-[28px] uppercase tracking-[1px] leading-none mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)' }}>
            Bolognese
          </p>
          <p className="text-[13px] italic mb-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-cream-60)' }}>
            Step 6 of 9 — Reducing the sauce
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-[3px] rounded-full" style={{ background: 'var(--color-cream-06)' }}>
              <div className="h-full rounded-full" style={{ background: 'var(--color-terra)', width: '67%' }} />
            </div>
            <span className="text-[11px] font-light" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream-30)' }}>67%</span>
          </div>
        </button>

        {/* For Tonight */}
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-[20px] uppercase tracking-[1px] whitespace-nowrap" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)' }}>
            For tonight
          </h2>
          <div className="flex-1 h-px" style={{ background: 'var(--color-cream-15)' }} />
        </div>
        <div className="flex gap-3.5 overflow-x-auto pb-2 mb-8 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          {featuredRecipes.map((recipe) => (
            <button
              key={recipe.id}
              onClick={() => router.push(`/recipe/${recipe.id}`)}
              className="flex-shrink-0 w-[200px] rounded-2xl overflow-hidden text-left transition-all active:scale-[0.97]"
              style={{ background: 'var(--color-bg2)', border: '1px solid var(--color-cream-06)' }}
            >
              <div className="h-[100px] flex items-center justify-center relative"
                   style={{ background: `linear-gradient(135deg, var(--color-bg3), var(--color-bg2))` }}>
                <span className="text-[36px]" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream-15)' }}>
                  {recipe.title[0]}
                </span>
                {recipe.featured_tag && (
                  <span className="absolute top-2.5 left-2.5 text-[9px] font-light tracking-[1px] uppercase px-2.5 py-1 rounded-[10px]"
                        style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream-60)', background: 'rgba(72,17,16,0.8)', backdropFilter: 'blur(4px)', border: '1px solid var(--color-cream-06)' }}>
                    {recipe.featured_tag}
                  </span>
                )}
              </div>
              <div className="p-3.5 pt-3">
                <p className="text-[17px] uppercase tracking-[0.5px] leading-tight mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)' }}>
                  {recipe.title}
                </p>
                <p className="text-[11px] italic" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-cream-30)' }}>
                  {recipe.time_minutes}m · {recipe.difficulty}
                </p>
                {recipe.source_name && (
                  <p className="text-[10px] font-light tracking-[0.5px] mt-1.5" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream-15)' }}>
                    from {recipe.source_name}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* What's in Season */}
        <div className="rounded-2xl p-5 mb-8" style={{ background: 'linear-gradient(135deg, var(--color-bg2), var(--color-bg-deep))', border: '1px solid var(--color-cream-06)' }}>
          <p className="text-[10px] font-light tracking-[1.5px] uppercase mb-2.5" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-sage)' }}>
            What&apos;s in season
          </p>
          <h3 className="text-[24px] uppercase tracking-[1px] leading-none mb-1.5" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)' }}>
            {seasonalSpotlight.ingredient}
          </h3>
          <p className="text-[13px] italic leading-[1.5] mb-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-cream-30)' }}>
            {seasonalSpotlight.description}
          </p>
          <div className="flex gap-2.5">
            {seasonalSpotlight.recipes.map((r) => (
              <button key={r.name} className="flex-1 rounded-xl p-3 text-center transition-all active:scale-[0.97]"
                      style={{ background: 'var(--color-bg)', border: '1px solid var(--color-cream-06)' }}>
                <p className="text-[11px] font-light tracking-[0.3px]" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream-60)' }}>{r.name}</p>
                <p className="text-[10px] italic mt-0.5" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-cream-15)' }}>{r.time}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Start */}
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-[20px] uppercase tracking-[1px] whitespace-nowrap" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)' }}>
            Quick start
          </h2>
          <div className="flex-1 h-px" style={{ background: 'var(--color-cream-15)' }} />
        </div>
        <div className="flex gap-3 mb-8">
          {[
            { label: '30 min meals', color: 'var(--color-terra-bg)', stroke: '#CB5331', icon: <><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></> },
            { label: 'Pantry cook', color: 'var(--color-sage-bg)', stroke: '#68886B', icon: <><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></> },
            { label: 'Learn a skill', color: 'rgba(212,168,83,0.1)', stroke: '#D4A853', icon: <><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></> },
          ].map((item) => (
            <button key={item.label} className="flex-1 flex flex-col items-center gap-2.5 rounded-2xl p-4 text-center transition-all active:scale-[0.97]"
                    style={{ background: 'var(--color-bg-deep)', border: '1px solid var(--color-cream-06)' }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: item.color }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={item.stroke} strokeWidth="1.5">{item.icon}</svg>
              </div>
              <span className="text-[11px] font-light tracking-[0.5px] uppercase" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream-60)' }}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => router.push('/import')}
        className="absolute bottom-24 right-6 w-14 h-14 rounded-full flex items-center justify-center z-40 transition-all active:scale-[0.92]"
        style={{ background: 'var(--color-terra)', boxShadow: '0 4px 20px rgba(203,83,49,0.35)' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F4EBD9" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>

      <NavBar />
    </div>
  );
}

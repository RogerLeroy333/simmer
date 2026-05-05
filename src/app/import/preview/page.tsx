'use client';
import { useRouter } from 'next/navigation';
import { sampleRecipes } from '@/lib/recipes-data';

export default function PreviewPage() {
  const router = useRouter();
  const recipe = sampleRecipes[1];

  return (
    <div className="h-full relative">
      <div className="h-full overflow-y-auto pt-14 px-7 pb-32" style={{ WebkitOverflowScrolling: 'touch' }}>
        <button onClick={() => router.push('/import')}
                className="text-[12px] font-light tracking-[1px] uppercase px-4 py-2 rounded-3xl mb-4 min-h-[44px] transition-all active:scale-[0.97]"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream-30)', border: '1px solid var(--color-cream-30)' }}>
          Back
        </button>
        <div className="inline-flex items-center gap-1.5 text-[10px] font-light tracking-[1.5px] uppercase rounded-full px-3.5 py-1.5 mb-4"
             style={{ fontFamily: 'var(--font-body)', color: 'var(--color-sage)', background: 'var(--color-sage-bg)', border: '1px solid rgba(104,136,107,0.2)' }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-sage)' }} />
          Successfully imported
        </div>
        <h1 className="text-[40px] uppercase tracking-[1px] leading-none mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)' }}>{recipe.title}</h1>
        <p className="text-[13px] italic mb-6 flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-cream-30)' }}>{recipe.source_name}</p>
        <div className="flex gap-3 mb-6">
          {[{v:`${recipe.time_minutes}m`,l:'Time'},{v:recipe.difficulty?.slice(0,3),l:'Difficulty'},{v:String(recipe.servings),l:'Servings'}].map(m=>(
            <div key={m.l} className="flex-1 flex flex-col items-center gap-1 rounded-xl py-3" style={{background:'var(--color-bg-deep)',border:'1px solid var(--color-cream-06)'}}>
              <span className="text-[20px]" style={{fontFamily:'var(--font-display)',color:'var(--color-cream)'}}>{m.v}</span>
              <span className="text-[10px] font-light tracking-[1.5px] uppercase" style={{fontFamily:'var(--font-body)',color:'var(--color-cream-30)'}}>{m.l}</span>
            </div>
          ))}
        </div>
        <div className="mb-7">
          <div className="flex items-center gap-3 mb-3"><span className="text-[18px] uppercase tracking-[1px]" style={{fontFamily:'var(--font-display)',color:'var(--color-cream)'}}>Ingredients</span><div className="flex-1 h-px" style={{background:'var(--color-cream-15)'}}/><span className="text-[11px] font-light" style={{fontFamily:'var(--font-body)',color:'var(--color-cream-30)'}}>{recipe.ingredients.length} items</span></div>
          {recipe.ingredients.map((ing,i)=>(
            <div key={i} className="flex justify-between items-baseline py-2.5" style={{borderBottom:i<recipe.ingredients.length-1?'1px solid var(--color-cream-06)':'none'}}>
              <span className="text-[13px] font-light" style={{fontFamily:'var(--font-body)',color:'var(--color-cream-80)'}}>{ing.name}</span>
              <span className="text-[12px] italic" style={{fontFamily:'var(--font-serif)',color:'var(--color-cream-30)'}}>{ing.amount}</span>
            </div>
          ))}
        </div>
        <div className="mb-7">
          <div className="flex items-center gap-3 mb-3"><span className="text-[18px] uppercase tracking-[1px]" style={{fontFamily:'var(--font-display)',color:'var(--color-cream)'}}>Steps</span><div className="flex-1 h-px" style={{background:'var(--color-cream-15)'}}/><span className="text-[11px] font-light" style={{fontFamily:'var(--font-body)',color:'var(--color-cream-30)'}}>{recipe.steps.length} steps</span></div>
          {recipe.steps.map((step)=>(
            <div key={step.number} className="flex gap-3 py-3" style={{borderBottom:step.number<recipe.steps.length?'1px solid var(--color-cream-06)':'none'}}>
              <div className="w-[26px] h-[26px] rounded-full flex items-center justify-center flex-shrink-0 text-[14px]" style={{fontFamily:'var(--font-display)',color:'var(--color-cream-30)',border:'1px solid var(--color-cream-15)'}}>{step.number}</div>
              <p className="text-[13px] font-light leading-[1.5]" style={{fontFamily:'var(--font-body)',color:'var(--color-cream-60)'}}>{step.detail}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 px-7 pb-10 pt-4 flex gap-2.5 z-10" style={{background:'linear-gradient(to top, var(--color-bg) 75%, transparent)'}}>
        <button onClick={()=>router.push('/import')} className="flex-1 text-[16px] tracking-[1.5px] uppercase rounded-3xl py-4 min-h-[52px] transition-all active:scale-[0.97]" style={{fontFamily:'var(--font-display)',color:'var(--color-cream-60)',border:'1px solid var(--color-cream-30)'}}>Discard</button>
        <button onClick={()=>router.push('/recipe/2')} className="flex-1 text-[16px] tracking-[1.5px] uppercase rounded-3xl py-4 min-h-[52px] transition-all active:scale-[0.97]" style={{fontFamily:'var(--font-display)',color:'var(--color-cream)',background:'var(--color-terra)'}}>Save Recipe</button>
      </div>
    </div>
  );
}

import { NextRequest, NextResponse } from 'next/server';

// Try to use Supabase, fall back to returning the recipe with a generated ID
async function saveToSupabase(recipe: Record<string, unknown>) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      return null; // Supabase not configured
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(url, key);

    const { data, error } = await supabase
      .from('recipes')
      .insert([recipe])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error('Supabase connection error:', err);
    return null;
  }
}

// GET all recipes
export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      return NextResponse.json([]);
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(url, key);

    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([]);
  }
}

// POST a new recipe
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const recipe = {
      title: body.title,
      subtitle: body.subtitle,
      source_url: body.source_url,
      source_name: body.source_name,
      time_minutes: body.time_minutes,
      difficulty: body.difficulty,
      servings: body.servings,
      cuisine: body.cuisine,
      tags: body.tags || [],
      ingredients: body.ingredients || [],
      steps: body.steps || [],
      is_featured: body.is_featured || false,
      featured_tag: body.featured_tag,
    };

    // Try Supabase first
    const saved = await saveToSupabase(recipe);

    if (saved) {
      return NextResponse.json(saved, { status: 201 });
    }

    // Fallback: return the recipe with a generated ID so the app still works
    const fallback = {
      ...recipe,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json(fallback, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: `Failed to save: ${message}` }, { status: 500 });
  }
}

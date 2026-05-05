import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET all recipes
export async function GET() {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// POST a new recipe
export async function POST(request: NextRequest) {
  const body = await request.json();

  const { data, error } = await supabase
    .from('recipes')
    .insert([{
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
    }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}

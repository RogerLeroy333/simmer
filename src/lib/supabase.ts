import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Recipe = {
  id: string;
  title: string;
  subtitle?: string;
  source_url?: string;
  source_name?: string;
  time_minutes?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  servings?: number;
  cuisine?: string;
  tags: string[];
  ingredients: Ingredient[];
  steps: Step[];
  is_featured: boolean;
  featured_tag?: string; // "Quick dinner", "Date night", "Comfort food", etc.
  created_at: string;
  updated_at: string;
};

export type Ingredient = {
  name: string;
  amount: string;
};

export type Step = {
  number: number;
  title: string;
  detail: string;
  sensory_cues?: string;
  milestone?: string;
};

export type Collection = {
  id: string;
  name: string;
  icon: string;
  color: string;
  recipe_count: number;
  created_at: string;
};

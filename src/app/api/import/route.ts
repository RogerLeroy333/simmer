import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const RECIPE_EXTRACTION_PROMPT = `You are a recipe extraction assistant. Extract a structured recipe from the provided content.

Return ONLY valid JSON in this exact format:
{
  "title": "Recipe name",
  "subtitle": "Brief enticing description",
  "time_minutes": 45,
  "difficulty": "Easy" | "Medium" | "Hard",
  "servings": 4,
  "cuisine": "Italian",
  "tags": ["tag1", "tag2"],
  "ingredients": [{"name": "Ingredient", "amount": "1 cup"}],
  "steps": [{"number": 1, "title": "Short title", "detail": "Full instruction", "sensory_cues": "What to look/smell/feel for", "milestone": "What success looks like at this step"}]
}

Be specific with sensory cues and milestones — these help the cook know they're on track.`;

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured. Add ANTHROPIC_API_KEY in Vercel settings.' }, { status: 500 });
    }

    const anthropic = new Anthropic({ apiKey });

    const body = await request.json();
    const { type, url, images } = body;

    let content: Anthropic.Messages.ContentBlockParam[] = [];

    if (type === 'url') {
      let response: Response;
      try {
        response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; Simmer Recipe Importer)',
            'Accept': 'text/html,application/xhtml+xml',
          },
        });
      } catch {
        return NextResponse.json({ error: 'Could not fetch that URL. Check the link and try again.' }, { status: 422 });
      }

      if (!response.ok) {
        return NextResponse.json({ error: `Could not fetch that page (${response.status}). The site may be blocking requests.` }, { status: 422 });
      }

      const html = await response.text();
      const text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                       .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                       .replace(/<[^>]+>/g, ' ')
                       .replace(/\s+/g, ' ')
                       .trim()
                       .slice(0, 12000);

      if (text.length < 100) {
        return NextResponse.json({ error: 'That page didn\'t have enough content. It may require login or be blocking automated access.' }, { status: 422 });
      }

      content = [{ type: 'text', text: `Extract the recipe from this webpage content. The source URL is ${url}:\n\n${text}` }];

    } else if (type === 'video') {
      let response: Response;
      try {
        response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; Simmer Recipe Importer)',
            'Accept': 'text/html,application/xhtml+xml',
          },
        });
      } catch {
        return NextResponse.json({ error: 'Could not fetch that video URL. Check the link and try again.' }, { status: 422 });
      }

      const html = await response.text();
      const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 12000);

      content = [{ type: 'text', text: `This is content from a cooking video page (TikTok/Instagram Reel). Extract any recipe information from the captions, description, and metadata. Source: ${url}\n\n${text}` }];

    } else if (type === 'photo') {
      if (!images || images.length === 0) {
        return NextResponse.json({ error: 'No photos provided.' }, { status: 422 });
      }

      content = [{ type: 'text', text: 'Extract the recipe from these photos of a recipe (could be cookbook pages, screenshots, or handwritten notes). Combine all images into one complete recipe:' }];
      for (const img of images) {
        content.push({
          type: 'image',
          source: { type: 'base64', media_type: img.mediaType, data: img.data },
        });
      }
    } else {
      return NextResponse.json({ error: 'Invalid import type.' }, { status: 400 });
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system: RECIPE_EXTRACTION_PROMPT,
      messages: [{ role: 'user', content }],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Claude couldn\'t extract a recipe from that content. Try a different URL.' }, { status: 422 });
    }

    const recipe = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ recipe });

  } catch (error: unknown) {
    console.error('Import error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';

    if (message.includes('authentication') || message.includes('api_key') || message.includes('401')) {
      return NextResponse.json({ error: 'API key is invalid. Check ANTHROPIC_API_KEY in Vercel settings.' }, { status: 500 });
    }

    return NextResponse.json({ error: `Import failed: ${message}` }, { status: 500 });
  }
}

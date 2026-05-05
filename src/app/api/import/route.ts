import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

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
    const body = await request.json();
    const { type, url, images } = body;

    let content: Anthropic.Messages.ContentBlockParam[] = [];

    if (type === 'url') {
      // Fetch the URL content
      const response = await fetch(url);
      const html = await response.text();
      // Strip HTML tags for a rough text extraction
      const text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                       .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                       .replace(/<[^>]+>/g, ' ')
                       .replace(/\s+/g, ' ')
                       .trim()
                       .slice(0, 8000); // Limit context

      content = [{ type: 'text', text: `Extract the recipe from this webpage content:\n\n${text}` }];
    } else if (type === 'video') {
      // For video URLs, we extract what we can from the URL/page
      // In production, you'd use a video transcription service
      const response = await fetch(url);
      const html = await response.text();
      const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 8000);

      content = [{ type: 'text', text: `This is content from a cooking video page (TikTok/Instagram Reel). Extract any recipe information from the captions, description, and metadata:\n\n${text}` }];
    } else if (type === 'photo') {
      // Multi-image: send all images to Claude for extraction
      content = [{ type: 'text', text: 'Extract the recipe from these photos of a recipe (could be cookbook pages, screenshots, or handwritten notes). Combine all images into one complete recipe:' }];
      for (const img of images) {
        content.push({
          type: 'image',
          source: { type: 'base64', media_type: img.mediaType, data: img.data },
        });
      }
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: RECIPE_EXTRACTION_PROMPT,
      messages: [{ role: 'user', content }],
    });

    // Parse the response
    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Could not parse recipe' }, { status: 422 });
    }

    const recipe = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ recipe });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ error: 'Failed to import recipe' }, { status: 500 });
  }
}

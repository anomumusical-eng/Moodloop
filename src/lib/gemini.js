import { Alert } from 'react-native';

const GEMINI_API_KEY = 'AIzaSyAdguFtHjg-eLSaYb512ae4Ko9UDd8xNj8';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function detectEmotion(checkinText) {
  const prompt = `
You are an emotion analysis AI for the Moodloop app.
Analyse this check-in text and return ONLY a valid JSON object, nothing else.
No markdown, no backticks, no explanation. Just the raw JSON.

Check-in: "${checkinText}"

Return this exact JSON structure:
{
  "primary_emotion": "one of: joyful, calm, anxious, stressed, burnt_out, focused, sad, angry, excited, lonely, grateful, overwhelmed, hopeful, tired, confused",
  "emotion_label": "A 2-3 word human-friendly label e.g. Quietly Exhausted or Buzzing With Energy",
  "energy_level": 5,
  "focus_capacity": 5,
  "social_battery": 5,
  "summary": "One warm, empathetic sentence acknowledging how they feel",
  "tasks": [
    "Short actionable task suited to this mood max 8 words",
    "Short actionable task suited to this mood max 8 words",
    "Short actionable task suited to this mood max 8 words"
  ],
  "spotify_mood": "A 3-4 word Spotify search query matching this mood",
  "rest_reminder": "One gentle suggestion about rest or self-care max 12 words",
  "social_suggestion": "One sentence about whether to connect with others or have solo time"
}
`;

  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini HTTP error:', response.status, errText);
      return getFallbackEmotion();
    }

    const data = await response.json();

    if (!data.candidates || !data.candidates[0]) {
      console.error('No candidates:', JSON.stringify(data));
      return getFallbackEmotion();
    }

    const text = data.candidates[0].content.parts[0].text;
    const clean = text.replace(/```json|```/g, '').trim();
    const jsonMatch = clean.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found:', clean);
      return getFallbackEmotion();
    }

    return JSON.parse(jsonMatch[0]);

  } catch (error) {
    console.error('Gemini error:', error.message);
    return getFallbackEmotion();
  }
}

function getFallbackEmotion() {
  return {
    primary_emotion: 'calm',
    emotion_label: 'Taking It Easy',
    energy_level: 5,
    focus_capacity: 5,
    social_battery: 5,
    summary: "You're here and that's what matters. Let's make the most of how you're feeling.",
    tasks: [
      'Take 3 deep breaths right now',
      'Write down one thing on your mind',
      'Drink a glass of water'
    ],
    spotify_mood: 'calm relaxing ambient',
    rest_reminder: 'Give yourself permission to go slow today.',
    social_suggestion: "Trust your gut on whether you need people or solitude right now."
  };
}

import { detectEmotion as localDetect } from './theme';

const GEMINI_API_KEY = 'AIzaSyAdguFtHjg-eLSaYb512ae4Ko9UDd8xNj8';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const VALID_EMOTIONS = [
  'joyful','calm','anxious','stressed','burnt_out','focused',
  'sad','angry','excited','lonely','grateful','overwhelmed',
  'hopeful','tired','confused'
];

export async function getEmotionKey(checkinText) {
  try {
    const prompt = `Analyze this emotional check-in text and respond with ONLY a single JSON object. No explanation, no markdown, no extra text.

Check-in: "${checkinText}"

Respond with exactly this JSON:
{"emotion": "INSERT_ONE_EMOTION_HERE"}

The emotion must be exactly one of these: joyful, calm, anxious, stressed, burnt_out, focused, sad, angry, excited, lonely, grateful, overwhelmed, hopeful, tired, confused`;

    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 50 }
      })
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) throw new Error('Empty response');

    const raw = data.candidates[0].content.parts[0].text.trim();
    const match = raw.match(/"emotion"\s*:\s*"([^"]+)"/);
    if (!match) throw new Error('No emotion field found');

    const detected = match[1].trim().toLowerCase();
    if (VALID_EMOTIONS.includes(detected)) return detected;
    throw new Error(`Invalid emotion: ${detected}`);

  } catch (error) {
    console.log('Gemini unavailable, using local detection. Reason:', error.message);
    return localDetect(checkinText);
  }
}

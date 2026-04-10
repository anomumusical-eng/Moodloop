// gemini.js — 100% local, zero cost, zero API, works offline
// Exports the same function your app already uses: getEmotionKey(text)
// No changes needed anywhere else in your codebase.

const KEYWORD_MAP = {
  calm:        ['calm', 'peaceful', 'relaxed', 'chill', 'zen', 'serene', 'quiet', 'still', 'at peace', 'tranquil', 'settled', 'steady', 'balanced', 'content', 'at ease', 'mellow'],
  focused:     ['focused', 'focus', 'concentrated', 'in the zone', 'sharp', 'locked in', 'productive', 'on track', 'dialled in', 'clear headed', 'alert', 'attentive'],
  energised:   ['energised', 'energized', 'energetic', 'pumped', 'charged', 'alive', 'buzzing', 'fired up', 'active', 'strong', 'powerful', 'full of energy', 'wired'],
  happy:       ['happy', 'joy', 'joyful', 'great', 'wonderful', 'amazing', 'fantastic', 'cheerful', 'bright', 'good mood', 'smiling', 'pleased', 'delighted', 'elated', 'feeling good'],
  anxious:     ['anxious', 'anxiety', 'nervous', 'worried', 'worry', 'panicky', 'uneasy', 'tense', 'on edge', 'scared', 'fearful', 'apprehensive', 'restless', 'dread', 'overthinking'],
  sad:         ['sad', 'down', 'unhappy', 'depressed', 'low', 'blue', 'melancholy', 'tearful', 'crying', 'upset', 'heartbroken', 'heavy', 'gloomy', 'miserable', 'hurt'],
  stressed:    ['stressed', 'stress', 'pressure', 'overloaded', 'swamped', 'buried', 'too much', 'bogged down', 'weighed down', 'deadlines', 'struggling', 'behind'],
  tired:       ['tired', 'exhausted', 'drained', 'sleepy', 'fatigued', 'weary', 'worn out', 'sluggish', 'groggy', 'no energy', 'burnt out', 'burned out', 'running on empty'],
  excited:     ['excited', 'excitement', 'thrilled', 'stoked', 'hyped', 'eager', 'enthusiastic', "can't wait", 'pumped up', 'amped', 'buzzing with'],
  overwhelmed: ['overwhelmed', 'too much going on', "can't cope", 'cant cope', 'scattered', 'all over the place', 'everything at once', 'head is spinning', 'breaking point'],
  motivated:   ['motivated', 'driven', 'determined', 'ready', 'ambitious', 'purposeful', 'on a mission', 'getting things done', 'making progress', 'inspired to work'],
  grateful:    ['grateful', 'thankful', 'blessed', 'appreciative', 'fortunate', 'lucky', 'gratitude', 'counting my blessings', 'appreciate'],
  creative:    ['creative', 'inspired', 'imaginative', 'inventive', 'flowing', 'full of ideas', 'in flow', 'making things', 'building something', 'creating'],
  lonely:      ['lonely', 'alone', 'isolated', 'disconnected', 'missing people', 'by myself', 'no one around', 'feels empty', 'missing connection'],
  confident:   ['confident', 'sure of myself', 'bold', 'unstoppable', 'capable', 'got this', 'can do anything', 'empowered', 'self-assured', 'ready to take on'],
};

const NEGATION_MAP = {
  happy: 'sad', calm: 'stressed', energised: 'tired',
  focused: 'overwhelmed', confident: 'anxious', motivated: 'tired',
  excited: 'anxious', grateful: 'lonely', creative: 'stressed',
};

const NEGATION_WORDS = ['not', "don't", 'dont', "can't feel", 'no longer', 'far from', 'anything but'];

function hasNegation(text, keyword) {
  const idx = text.indexOf(keyword);
  if (idx === -1) return false;
  const before = text.slice(Math.max(0, idx - 20), idx);
  return NEGATION_WORDS.some(neg => before.includes(neg));
}

// Returns one of the 15 emotion keys — same keys your Emotions object in theme.js uses
export async function getEmotionKey(text) {
  const lower = (text || '').toLowerCase().trim();
  if (!lower) return 'calm';

  const scores = {};

  for (const [emotion, keywords] of Object.entries(KEYWORD_MAP)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        if (hasNegation(lower, kw)) {
          const opposite = NEGATION_MAP[emotion];
          if (opposite) scores[opposite] = (scores[opposite] || 0) + 2;
        } else {
          // Phrases (multiple words) score higher than single words
          const weight = kw.includes(' ') ? 2 : 1;
          scores[emotion] = (scores[emotion] || 0) + weight;
        }
      }
    }
  }

  // Return the highest scoring emotion, default to calm
  let best = 'calm';
  let bestScore = 0;
  for (const [emotion, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      best = emotion;
    }
  }

  return best;
}

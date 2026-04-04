import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// REPLACE THESE WITH YOUR SUPABASE PROJECT VALUES
// Get them from: supabase.com → your project → Settings → API
const SUPABASE_URL = 'https://ozxhlbxpxbkrwbrtiubm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96eGhsYnhweGJrcndicnRpdWJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMzUxOTIsImV4cCI6MjA5MDgxMTE5Mn0.qQbktZPsES3tTOewXkkbZMJQNW2oFmusU1zDAFRb_Ow';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

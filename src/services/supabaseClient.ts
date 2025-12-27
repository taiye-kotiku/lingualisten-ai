import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://sysikqfqzndbgawqeysp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5c2lrcWZxem5kYmdhd3FleXNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3OTkzODQsImV4cCI6MjA4MjM3NTM4NH0.TjgOOGymLZWMGgNt2wLm6GrDETP54xsIJpN4djZCQyc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export default supabase;
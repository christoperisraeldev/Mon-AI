// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://dhtmmjixnckvqaxnwxwn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRodG1taml4bmNrdnFheG53eHduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MTgxNjcsImV4cCI6MjA2NTI5NDE2N30.N4h-PsL3gy1sPJb1SCymdrqgxPW6vGTDcz1ttJHBbgc";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
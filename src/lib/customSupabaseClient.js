import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mbdaqycbhdzjglaruriq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1iZGFxeWNiaGR6amdsYXJ1cmlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5MjIwNzUsImV4cCI6MjA3MTQ5ODA3NX0.RWMT-2sj5V3foyQhsje8UX4yca1fxUGgji7kSDs0LUE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
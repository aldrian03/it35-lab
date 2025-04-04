import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yrztgeegweciulbyhdwt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyenRnZWVnd2VjaXVsYnloZHd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NjAzMzksImV4cCI6MjA1ODQzNjMzOX0.Kx4RFs-85AbnULQn2fMKn-jUgsuJM-kxwQzFxt8RDvo';

export const supabase = createClient(supabaseUrl, supabaseKey);
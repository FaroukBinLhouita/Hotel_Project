import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://vykchttljsytzlbjioae.supabase.co";

const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5a2NodHRsanN5dHpsYmppb2FlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUzMjcyNDgsImV4cCI6MjAzMDkwMzI0OH0.UpV2AAiuPUG0RMSikSy-SMobgudsk1Mz6XnOCvha5P4";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

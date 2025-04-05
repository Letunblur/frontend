import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase"; // Importiere deine generierten Typen

// Supabase-Projekt-URL und Public Anon Key
const supabaseUrl = "https://ilgwunzkstvsdnzugawo.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsZ3d1bnprc3R2c2RuenVnYXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NjUyOTQsImV4cCI6MjA1OTA0MTI5NH0.l932PSd2eAkBVe-WjsdZDKieCL-c8dnlpOGZb7HwHP4";

// Supabase Client erstellen (mit Typenunterstützung)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

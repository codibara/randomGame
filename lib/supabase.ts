import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hamojmxhipkdezrrphyt.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbW9qbXhoaXBrZGV6cnJwaHl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MDIzMDcsImV4cCI6MjA0OTk3ODMwN30.afVwBkyJZ-oJLkPWydXrE-qmjAAsXR0aDm191F6LRkE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

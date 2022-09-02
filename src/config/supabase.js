const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://aozqughyxueicvaduidp.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvenF1Z2h5eHVlaWN2YWR1aWRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjIwODc4NjUsImV4cCI6MTk3NzY2Mzg2NX0.n91XEN-xmQgr5yh4LydJWoDM28R8C5fw-KqlqazofAc";
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;

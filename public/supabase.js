const { supabaseUrl, supabaseKey } = await fetch('/config').then(r => r.json())
const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm')
export const supabase = createClient(supabaseUrl, supabaseKey)

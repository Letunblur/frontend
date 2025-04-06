import supabase from '@/lib/supabase'

await supabase
  .from('user_email_archive')
  .insert([{ email }])

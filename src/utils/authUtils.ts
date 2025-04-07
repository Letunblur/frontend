// src/utils/authUtils.ts
import supabase from '../lib/supabaseClient'
import { TablesUpdate } from '../../types/supabase'

type UpdateProfileInput = TablesUpdate<'user_profiles'>

export async function updateUserProfile(updates: UpdateProfileInput) {
  // Sicherstellen, dass eine Session aktiv ist
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  const session = sessionData?.session

  if (sessionError || !session?.user?.id) {
    throw new Error('Keine aktive Session')
  }

  // Sicherstellen, dass die ID vorhanden ist
  if (!session.user.id) {
    throw new Error('Session enthält keine Benutzer-ID')
  }

  // Supabase verlangt, dass gewisse Felder wie `email` gesetzt sind (wenn im Typ so definiert)
  if (!updates.email) {
    throw new Error('Feld "email" ist erforderlich für Update')
  }

  // Update durchführen
  const { data, error } = await supabase
    .from('user_profiles')
    .update({ ...updates })
    .eq('id', session.user.id)
    .select()
    .single()

  if (error || !data) {
    throw new Error(error?.message || 'Unbekannter Fehler beim Aktualisieren')
  }

  return data
}

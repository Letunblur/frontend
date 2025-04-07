// src/hooks/useAuthSession.ts
import { useEffect, useState } from 'react'
import supabase from '../lib/supabaseClient'
import { Tables, TablesUpdate } from '../../types/supabase'
import { updateUserProfile as updateProfileInDB } from '../utils/authUtils'

type UserProfile = Tables<'user_profiles'>
type UpdateProfileInput = TablesUpdate<'user_profiles'>

export function useAuthSession() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  // 🔄 Profil abrufen
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      setError(null)

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      const session = sessionData?.session

      if (sessionError || !session?.user?.id) {
        setError('Keine aktive Session oder Fehler beim Abrufen.')
        setUserProfile(null)
        setLoading(false)
        return
      }

      const { data, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (profileError || !data) {
        console.error('Profil-Fehler:', profileError?.message)
        setError('Profil konnte nicht geladen werden.')
        setUserProfile(null)
      } else {
        setUserProfile(data)
      }

      setLoading(false)
    }

    fetchUser()
  }, [])

  // ✏️ Profil aktualisieren (via authUtils.ts)
  const updateUserProfile = async (updates: UpdateProfileInput) => {
    setIsUpdating(true)
    setError(null)

    try {
      const updated = await updateProfileInDB(updates)
      setUserProfile(updated)
    } catch (err: any) {
      setError('Profil konnte nicht aktualisiert werden.')
      console.error('Update-Fehler:', err.message)
    } finally {
      setIsUpdating(false)
    }
  }

  return {
    userProfile,
    loading,
    error,
    isUpdating,
    isLoggedIn: !!userProfile,
    updateUserProfile,
  }
}

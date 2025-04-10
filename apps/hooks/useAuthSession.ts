import { useEffect, useState, useRef } from 'react' // 🆕 useRef
// ... Rest bleibt gleich ...

export function useAuthSession() {
  const hasFetched = useRef(false) // 🆕 neu
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  // 🔄 Profil abrufen
  useEffect(() => {
    const fetchUser = async () => {
      if (hasFetched.current) return // 🛑 Falls schon geladen, abbrechen
      hasFetched.current = true      // ✅ Nur beim ersten Mal

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

  // ✏️ Profil aktualisieren (wie gehabt)
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

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client'; // Hier importierst du den Supabase-Client

// Erstelle den AuthContext
const AuthContext = createContext();

// AuthProvider-Komponente, die den Authentifizierungszustand verwaltet
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // Benutzerzustand
  const [loading, setLoading] = useState(true);  // Ladezustand, um zu wissen, wann die Sitzung geladen ist

  useEffect(() => {
    // Supabase-Session beim ersten Laden abrufen
    const session = supabase.auth.session();
    setUser(session?.user || null);  // Setze den Benutzer, falls er eingeloggt ist

    // Listener für Auth-Statusänderungen hinzufügen
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);  // Benutzerstatus aktualisieren, wenn sich die Sitzung ändert
    });

    setLoading(false);  // Ladezustand auf false setzen, wenn die Daten geladen sind

    // Cleanup-Funktion, um den AuthListener zu entfernen, wenn die Komponente verlassen wird
    return () => {
      authListener?.unsubscribe();
    };
  }, []);  // Der Effekt läuft nur einmal beim Laden der Komponente

  // Falls noch geladen wird, kannst du hier einen Lade-Indikator anzeigen
  if (loading) {
    return <div>Loading...</div>;  // Hier kannst du einen Spinner oder Lade-Indikator verwenden
  }

  return (
    <AuthContext.Provider value={{ user }}>
      {children}  {/* Alle Kinderkomponenten haben Zugriff auf den AuthContext */}
    </AuthContext.Provider>
  );
};

// Der useAuth-Hook, um den aktuellen Benutzer überall in der App abzurufen
export const useAuth = () => {
  return useContext(AuthContext);  // Gibt den AuthContext zurück, um auf den Benutzer zuzugreifen
};

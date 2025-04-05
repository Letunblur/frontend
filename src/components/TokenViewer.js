import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient'; 

const TokenViewer = () => {
const [token, setToken] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Fehler beim Abrufen des Tokens:", error);
        return;
      }

      const accessToken = data?.session?.access_token;
      setToken(accessToken || null);
    };

    getToken();
  }, []);

  return (
    <div>
      <h2>🔑 Supabase Token</h2>
      <pre>{token || 'Lade... Bitte einloggen.'}</pre>
    </div>
  );
};

export default TokenViewer;

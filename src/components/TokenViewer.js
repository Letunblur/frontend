import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const TokenViewer = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getToken = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("❌ Fehler beim Abrufen der Session:", error);
        return;
      }

      const accessToken = data?.session?.access_token;
      setToken(accessToken || null);
      console.log("🔑 Auth Token:", accessToken);
    };

    getToken();
  }, []);

  return (
    <div style={{ padding: '1rem', fontFamily: 'monospace' }}>
      <h2>🔐 Supabase Token</h2>
      <pre style={{ background: '#f4f4f4', padding: '1rem', borderRadius: '8px' }}>
        {token || 'Token wird geladen... (bitte eingeloggt sein)'}
      </pre>
    </div>
  );
};

export default TokenViewer;

import AuthBox from '@/components/AuthBox';
import TokenViewer from '@/components/TokenViewer';

export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      {/* 🔥 TEST-Heading */}
      <h1>🔥 Das ist meine eigene Seite!</h1>

      <p>Logge dich unten ein, um dein Supabase-Token zu sehen:</p>

      {/* Login-Formular */}
      <AuthBox />

      {/* Token-Anzeige */}
      <TokenViewer />
    </main>
  );
}

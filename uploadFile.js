import { supabase } from './supabaseClient.js';

export async function uploadFile(file) {
  const filePath = `uploads/${Date.now()}_${file.name}`;

  const { data, error } = await supabase.storage
    .from('media-uploads')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    alert('Fehler beim Upload: ' + error.message);
    return null;
  }

  console.log('Erfolgreich hochgeladen:', data);
  return filePath;
}

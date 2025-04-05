import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.5";
import { config } from "https://deno.land/x/dotenv/mod.ts";

const env = config();
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_API_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    const {
      reportId,
      reportedLink,
      name,
      email,
      reason,
      createdAt
    } = body;

    // 🧠 1. In Supabase speichern
    const { error: dbError } = await supabase.from("reports").insert([{
      id: reportId,
      reported_link: reportedLink,
      name,
      email,
      reason,
      created_at: createdAt
    }]);

    if (dbError) {
      throw new Error("Fehler beim Speichern in Supabase: " + dbError.message);
    }

    // 🧠 2. E-Mail nur senden, wenn DB-Speicherung erfolgreich war
    const formattedDate = new Date(createdAt).toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const response = await fetch('https://api.resend.com/v1/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Letunblur Reports <reports@letunblur.com>',
        to: ['hello@letunblur.com'],
        subject: 'Neuer Report eingegangen',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">Neuer Report eingegangen</h1>
            <p>Ein Nutzer hat einen Inhalt auf Letunblur gemeldet:</p>
            <p><strong>Report ID:</strong> ${reportId}</p>
            <p><strong>Gemeldeter Link:</strong> ${reportedLink}</p>
            <p><strong>Gemeldet von:</strong> ${name} (${email})</p>
            <p><strong>Grund:</strong></p>
            <div style="background-color: #fff; padding: 10px; border-left: 3px solid #ddd;">
              ${reason}
            </div>
            <p><strong>Eingegangen am:</strong> ${formattedDate}</p>
          </div>
        `
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`E-Mail-Versand fehlgeschlagen: ${JSON.stringify(data)}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });

  } catch (error) {
    console.error("Fehler in der Report-Funktion:", error);

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
};

serve(handler);

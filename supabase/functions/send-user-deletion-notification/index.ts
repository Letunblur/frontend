import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";  // Resend-Bibliothek importieren

// Zugriff auf den API-Schlüssel aus den Supabase-Secrets
const resend = new Resend(Deno.env.get("re_Sq4cgPCr_QAQE3KSqu1AfvWxeDXyYmVEA"));  // API-Schlüssel aus den Supabase-Secrets

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface UserDeletionRequest {
  userId: string;
  email: string;
  deletedAt: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Bearbeitung von CORS-Preflight-Anfragen
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const userData: UserDeletionRequest = await req.json();
    console.log("User data:", userData);
    
    // Datum formatieren
    const formattedDate = new Date(userData.deletedAt).toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Senden der E-Mail über Resend API
    const emailResponse = await resend.emails.send({
      from: "Letunblur Accounts <accounts@letunblur.com>",
      to: ["hello@letunblur.com"],  // Empfänger (Admin)
      subject: "Ein Benutzer hat sein Konto gelöscht",  // Betreff
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">Benutzer-Konto gelöscht</h1>
          
          <p>Ein Benutzer hat sein Letunblur-Konto gelöscht:</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Benutzer ID:</strong> ${userData.userId}</p>
            <p><strong>E-Mail-Adresse:</strong> ${userData.email}</p>
            <p><strong>Gelöscht am:</strong> ${formattedDate}</p>
          </div>
          
          <p style="color: #777; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
            Diese E-Mail wurde automatisch vom Letunblur System gesendet.
          </p>
        </div>
      `,
    });
    
    console.log("Email sent successfully:", emailResponse);
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Error in send-user-deletion-notification function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

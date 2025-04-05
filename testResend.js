const { Resend } = require("resend");

e_Sq4cgPCr_QAQE3KSqu1AfvWxeDXyYmVEA
const resend = new Resend("re_Sq4cgPCr_QAQE3KSqu1AfvWxeDXyYmVEA");

async function sendTestEmail() {
  try {
    const response = await resend.emails.send({
      from: "noreply@letunblur.com",  // Deine Absenderadresse hier
      to: "hello@letunblur.com", 
      subject: "Test E-Mail",
      html: "<p>Dies ist eine Test-E-Mail von Resend!</p>", // Einfacher HTML-Inhalt
    });

    console.log("Test E-Mail gesendet:", response);
  } catch (error) {
    console.error("Fehler beim Senden der E-Mail:", error);
  }
}

sendTestEmail();

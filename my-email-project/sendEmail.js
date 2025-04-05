require('dotenv').config();  // Laden der Umgebungsvariablen aus der .env-Datei

const nodemailer = require('nodemailer');
const { useAuth } = require('./contexts/AuthContext');  // Stelle sicher, dass der AuthContext richtig importiert wird

// Erstelle den Transporter mit den SMTP-Daten von Resend
let transporter = nodemailer.createTransport({
  host: 'smtp.resend.com', // Der SMTP-Server von Resend
  port: 465, // Port 465 für SSL
  secure: true, // SSL verwenden
  auth: {
    user: 'resend', // Benutzername für Resend
    pass: process.env.RESEND_API_KEY, // Dein API-Schlüssel aus der .env-Datei
  },
  tls: {
    rejectUnauthorized: false, // Selbstsignierte Zertifikate akzeptieren
  },
});

// Funktion zum Abrufen des aktuellen Benutzers (Benutzer-ID)
const { user } = useAuth();  // Holt den aktuellen Benutzer über den AuthContext
if (!user) {
  console.error('Fehler: Kein Benutzer eingeloggt!');
  return;
}

// E-Mail-Optionen für den Benutzer (Bestätigung)
let mailOptionsUser = {
  from: '"Letunblur Support" <noreply@letunblur.com>', // Absender E-Mail für den Benutzer
  to: user.email, // Dynamische Benutzer-E-Mail aus dem AuthContext
  subject: 'Konto-Löschung Bestätigung', // Betreff
  text: 'Dein Konto bei Letunblur wurde erfolgreich gelöscht.', // Klartext-Inhalt
  html: '<b>Dein Konto bei Letunblur wurde erfolgreich gelöscht.</b>', // HTML-Inhalt
};

// E-Mail-Optionen für das Admin-Team (Benachrichtigung)
let mailOptionsAdmin = {
  from: '"Letunblur Support" <noreply@letunblur.com>', // Absender E-Mail für Admin
  to: 'hello@letunblur.com', // Admin-E-Mail
  subject: 'Benutzerkonto gelöscht', // Betreff
  text: `Ein Benutzer mit der E-Mail ${user.email} hat sein Konto bei Letunblur gelöscht.`, // Klartext-Inhalt
  html: `<b>Ein Benutzer mit der E-Mail ${user.email} hat sein Konto bei Letunblur gelöscht.</b>`, // HTML-Inhalt
};

// Sende die E-Mails
transporter.sendMail(mailOptionsUser, (error, info) => {
  if (error) {
    return console.log('Fehler beim Senden der Benutzer-E-Mail:', error);
  }
  console.log('Benutzer-E-Mail gesendet:', info.response);
});

// Sende die Admin-Benachrichtigung
transporter.sendMail(mailOptionsAdmin, (error, info) => {
  if (error) {
    return console.log('Fehler beim Senden der Admin-E-Mail:', error);
  }
  console.log('Admin-E-Mail gesendet:', info.response);
});

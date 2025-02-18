# iCal Generator

Einfaches Tool zum Generieren von .ics-Kalenderdateien und Versenden von Einladungen (primär erstellt um ein bisschen Erfahrung mit **Alpine.js** zu erlangen).

## Konfiguration

Erstelle eine `.env`-Datei im `server/`-Verzeichnis mit:  
GMAIL_ADDRESS=deine-email@gmail.com  
GMAIL_PASS=dein-gmail-app-passwort  
USER_EMAIL=testempfänger@gmail.com

## Abhängigkeiten & Installation

### Backend (Node.js)

Installiere die benötigten Pakete:

```bash
npm install express nodemailer ical-generator dotenv cors
```

### E-Mail-Versand mit Nodemailer

Das Backend nutzt **Nodemailer**, um E-Mails mit `.ics`-Anhängen zu versenden. Dafür wird in diesem Fall ein Gmail-Konto und das dazugehörige App-Passwort benötigt. Unter [Google App-Passwörter](https://myaccount.google.com/apppasswords) kann ein **App-Passwort** erstellt werden.

Das `.env`-File benötigt:

```ini
# SMTP Konfiguration für den E-Mail-Versand
GMAIL_ADDRESS=deine-email@gmail.com # Absenderadresse für Nodemailer
GMAIL_PASS=dein-app-passwort # App-Passwort, kein normales Passwort!

# Nur für das testMail-Skript (optional)
USER_EMAIL=empfaenger@example.com
```

### Frontend

Alpine.js und Tailwind CSS sind als CDNs eingebunden:

```html
<script
  src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"
  defer
></script>
<script src="https://cdn.tailwindcss.com"></script>
```

### E-Mail-Versand testen

```bash
node scripts/testMail.js
```

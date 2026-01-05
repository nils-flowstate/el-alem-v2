# El-Âlem Artist Portfolio

Ein minimalistisches, künstlerisches Portfolio für den Künstler Erol / El-Âlem.
Entwickelt mit HTML, TailwindCSS (CDN) und Vanilla JS.

## Projektstruktur

- **Frontend:** HTML + Vanilla JS (kein Framework-Overhead)
- **Styling:** TailwindCSS via CDN + Custom CSS für Animationen
- **Daten:** Simuliertes Backend via `localStorage` (Persistiert im Browser)
- **Icons:** Phosphor Icons

## Features

- **Public:**
  - Hero Slideshow (Autoplay, Soft Zoom)
  - Portfolio Grid (Gemälde, Lichtkunst)
  - Detailseiten für Werke & Serien
  - Flipbook-Simulation für Kataloge
  - Kontaktformular (mit Honeypot & Simulation des Versands)
  
- **Admin:**
  - Login Bereich (`/admin/login.html`)
  - Dashboard mit Statistiken
  - CRUD-Funktionen (Mocked: Daten werden im Browser gespeichert)

## Installation & Start

Das Projekt ist für Replit optimiert.

1. **Starten:**
   ```bash
   npm run dev:client
   ```
   Dies startet den Vite Server auf Port 5000.

2. **Admin Login:**
   - URL: `/admin/login.html`
   - Email: `admin@kunst.de`
   - Passwort: `admin`

## Wichtiger Hinweis zur Technik

Da dieses Projekt als "Frontend-Mockup" erstellt wurde, ist **kein echtes Node.js Backend** aktiv.
- **Datenbank:** Alle Daten (Werke, Texte, Anfragen) werden im `localStorage` des Browsers gespeichert.
- **E-Mail:** E-Mails werden nicht versendet, sondern in der Browser-Konsole simuliert (`console.log`).
- **Uploads:** Bilder werden aus `/public/uploads` geladen.

## Anpassungen

- **Daten zurücksetzen:**
  Löschen Sie den `localStorage` Key `el_alem_data` im Browser oder nutzen Sie die Reset-Funktion im Admin (falls implementiert), um die Seed-Daten neu zu laden.
# Let's Go!

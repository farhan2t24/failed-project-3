# SpyTalk - Encrypted Messaging App

A responsive web app for encrypted messaging using AES encryption. Users can enter with a username and email, search for other users, and send/receive encrypted messages.

## Features

- User entry with username and email (no registration required)
- Search and select receivers
- AES encrypted message sending
- View encrypted message before sending
- Real-time message receiving with decryption option
- Responsive design for laptop and phone
- Gmail-like UI with white, yellow, blue, green, red colors

## Setup

1. Clone or download the project files.
2. Set up a Supabase project at https://supabase.com/
3. Create tables:
   - `users`: id (text, primary), username (text), email (text)
   - `messages`: id (auto), conversation_id (text), encrypted_text (text), sender_id (text), receiver_id (text), created_at (timestamp)
4. Enable Row Level Security (RLS) and create policies for public access (for demo).
5. Replace the `supabaseUrl` and `supabaseKey` in `app.js` with your Supabase project URL and anon key.
6. Open `index.html` in a browser or run a local server.

## Local Testing

Run a local server to test the app:

```bash
python -m http.server 8000
```

Then open http://localhost:8000 in your browser.

## Deployment

### GitHub Pages

1. Push code to GitHub repository.
2. Go to repository Settings > Pages.
3. Select source as "main" branch and "/ (root)".
4. Access the app at https://yourusername.github.io/repository-name/

### Other Hosting

Upload files to any static hosting service (Netlify, Vercel, etc.).

## Technologies Used

- HTML/CSS/JavaScript
- Supabase (Database, Real-time)
- CryptoJS (AES encryption)

## Note

- Uses a fixed AES key for demo purposes. In production, implement proper key exchange.
- Supabase tables should have RLS policies allowing public access for demo.

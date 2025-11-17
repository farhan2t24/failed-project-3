# SpyTalk App Development TODO

## Step 1: Set up project structure
- [x] Create index.html for the main UI
- [x] Create style.css for Gmail-like responsive design (colors: white, yellow, blue, green, red)
- [x] Create app.js for Firebase anonymous auth, Firestore DB, AES encryption/decryption logic

## Step 2: Implement user entry
- Users enter random username and email (no registration required)
- Use Firebase Auth anonymous sign-in to enable Firestore access
- Store user info in Firestore with username and email for search

## Step 3: Implement user search and selection
- Allow sender to search receivers by username or email
- Display list of matching users from Firestore

## Step 4: Implement message sending
- Encrypt message with AES using a fixed key (for demo)
- Store encrypted message in Firestore under sender-receiver conversation
- Option to view encrypted message before sending

## Step 5: Implement message receiving and decryption
- Use Firestore real-time listeners for new messages
- Show notification for new messages
- Display cipher text, with option to decrypt to original text

## Step 6: Ensure bidirectional communication
- Messages flow both ways; each user can send/receive

## Step 7: Make UI responsive
- Use CSS media queries for laptop and phone
- Gmail-like layout: sidebar for users, main area for chat

## Step 8: Test locally
- [x] Run with live server to test functionality

## Step 9: Provide deployment instructions
- [x] Instructions for Firebase Hosting or GitHub Pages
- Note: User needs to set up Firebase project and add API keys to code

## Step 10: Finalize code and link
- Ensure all features work
- Provide working link after deployment (user's responsibility)

# Admin Panel for Digital Accountability App

This is a simple admin panel for coaches to write weekly reviews for users.

## Setup

This admin panel can be built with any web framework. Here's a simple HTML/JavaScript implementation that you can host on Firebase Hosting or any static site hosting service.

### Option 1: Simple HTML (Recommended for MVP)

Create a single HTML file that uses Firebase JS SDK directly. See `index.html` for the implementation.

### Option 2: Next.js (For Production)

For a more robust solution, you can build this with Next.js:

```bash
npx create-next-app@latest admin-panel
cd admin-panel
npm install firebase
```

Then implement the pages as shown in the example Next.js structure below.

## Features

- Login for admin/coaches
- View list of active users
- See user stats (streak, check-ins, struggle type)
- Write and submit weekly reviews
- Score breakdown (Goal Achievement /40, Engagement /30, Behavior /20, Bonus /10)

## Deployment

### Firebase Hosting

```bash
cd admin
firebase init hosting
firebase deploy --only hosting
```

### Vercel (for Next.js version)

```bash
vercel deploy
```

## Security

Make sure to add Firestore rules to restrict review creation to admin users only.

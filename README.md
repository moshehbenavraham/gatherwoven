# Event Management Platform

Full-stack event management platform for creating, discovering, registering for,
and moderating events.

## Features

- Create and edit events with image uploads, date and time details, and location data.
- Discover upcoming events and view event detail pages with countdowns and registration.
- Sign up and sign in with Supabase Auth.
- Manage created and registered events from a personal dashboard.
- Moderate event listings from an admin dashboard.
- Use Google Maps Places autocomplete when a Maps API key is configured.
- Store event images in Supabase Storage with row-level storage policies.

## Stack

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- shadcn/ui
- Supabase

## Configuration

Create a `.env` file with the public Supabase project settings:

```sh
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-publishable-key"
```

Google Maps Places autocomplete is optional:

```sh
VITE_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

The Supabase schema and storage policies are tracked in `supabase/migrations`.

## Development

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
npm run lint
```

## Deployment

Build the app with `npm run build` and deploy the generated `dist` directory to
any static web host. Configure the same environment variables in the deployment
environment.

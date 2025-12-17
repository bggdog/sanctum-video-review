# Video Review Platform

A Frame.io clone for video review and collaboration, built with Next.js, Supabase, and Google Cloud Storage.

## Features

- 🔐 **Authentication** - Secure login with NextAuth.js and Supabase Auth
- 📹 **Video Upload** - Upload videos to Google Cloud Storage
- 💬 **Timestamped Comments** - Leave comments at specific points in videos
- ✅ **Approval System** - Track approval status for each video
- 📊 **Analytics Dashboard** - View cumulative statistics with date filtering
- 📋 **Kanban Board** - Drag-and-drop workflow management
- ⚡ **Real-time Updates** - Live comment updates using Supabase Realtime

## Tech Stack

- **Frontend/Backend**: Next.js 14 (App Router) with TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: NextAuth.js with Supabase Auth
- **Video Storage**: Google Cloud Storage
- **Video Player**: Video.js
- **Real-time**: Supabase Realtime
- **UI**: Tailwind CSS with shadcn/ui components
- **Drag & Drop**: @dnd-kit

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Google Cloud Platform account with Storage enabled

### Setup Instructions

1. **Clone the repository**

```bash
git clone <repository-url>
cd video-review-platform
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up Supabase**

   - Create a new Supabase project
   - Run the migration file: `supabase/migrations/001_initial_schema.sql`
   - Enable Realtime for the `comments` table in Supabase dashboard

4. **Set up Google Cloud Storage**

   - Create a GCS bucket
   - Create a service account with Storage Admin permissions
   - Download the service account key JSON file
   - Place it in the project root as `service-account-key.json` (or update the path in `.env.local`)

5. **Configure environment variables**

Create a `.env.local` file in the root directory:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Google Cloud Storage
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_STORAGE_BUCKET=your-bucket-name
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
```

6. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── (auth)/
│   │   └── login/          # Login page
│   ├── (protected)/        # Protected routes
│   │   ├── dashboard/      # Dashboard
│   │   ├── videos/         # Video list and detail
│   │   ├── kanban/         # Kanban board
│   │   ├── analytics/      # Analytics dashboard
│   │   └── upload/         # Video upload
│   ├── api/                # API routes
│   └── layout.tsx          # Root layout
├── components/
│   ├── sidebar/            # Sidebar navigation
│   ├── video-player/       # Video player components
│   ├── kanban/             # Kanban board components
│   └── analytics/          # Analytics components
├── lib/
│   ├── supabase/           # Supabase client setup
│   └── gcs/                # Google Cloud Storage setup
├── types/
│   └── database.ts         # TypeScript types
└── supabase/
    └── migrations/         # Database migrations
```

## Usage

1. **Login** - Use your Supabase Auth credentials to log in
2. **Upload Videos** - Go to the Upload page and drag-and-drop or select video files
3. **Review Videos** - Click on any video to watch and add timestamped comments
4. **Manage Workflow** - Use the Kanban board to drag videos between status columns
5. **Track Analytics** - View cumulative statistics on the Analytics dashboard
6. **Approve Videos** - Add approval status and notes for each video

## Database Schema

- `videos` - Video metadata
- `comments` - Timestamped comments on videos
- `video_analytics` - Analytics data per video
- `approvals` - Approval tracking

See `supabase/migrations/001_initial_schema.sql` for the full schema.

## License

ISC


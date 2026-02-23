# Are You AI Ready? - AI Sense Check

An interactive web experience designed to assess how professionals think about AI in workplace contexts. Rather than testing knowledge, this app validates perspective and assigns an "AI Thinking Profile" based on user responses.

## Features

- **8-Question Interactive Quiz**: Dynamic questions generated via OpenAI, covering 8 key domains:
  - Email & Meetings
  - Productivity
  - Collaboration
  - Learning
  - Customer Interaction
  - Decision Support
  - Company Workflows
  - Future of Work

- **Dynamic Question Generation**: Fresh questions for each user session via OpenAI API, ensuring unique experiences

- **AI Thinking Profiles**: Users receive one of 6 professional profiles:
  - Systems Thinker
  - Adoption Realist
  - Trust-Focused Operator
  - Human-Centered Technologist
  - Workflow Optimizer
  - Strategic Observer

- **Professional Certificates**: Beautiful, shareable certificates optimized for LinkedIn

- **Session Tracking**: All quiz data logged to Google Sheets for analytics

- **Geolocation Capture**: User geography captured via IP address

## Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **APIs**:
  - OpenAI (gpt-4o-mini) for question generation
  - Google Sheets API for session logging
  - Positionstack for IP geolocation
- **Certificate Generation**: html2canvas for client-side rendering
- **Deployment**: Vercel

## Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_key
NEXT_PUBLIC_GOOGLE_SHEETS_ID=your_google_sheets_id
NEXT_PUBLIC_POSITIONSTACK_API_KEY=your_positionstack_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Development

```bash
npm run dev
```

Visit `http://localhost:3000` to see the app.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
are-you-ai-ready/
├── app/
│   ├── page.tsx              # Landing page
│   ├── quiz/
│   │   ├── page.tsx          # Quiz flow
│   │   └── entry/page.tsx    # Entry screen
│   ├── certificate/page.tsx  # Certificate display
│   ├── api/
│   │   ├── generate-questions/route.ts
│   │   └── save-session/route.ts
│   ├── globals.css
│   └── layout.tsx
├── components/
│   └── CertificateDisplay.tsx
├── data/
│   ├── profiles.ts
│   ├── reveals.ts
│   └── questionPrompt.ts
├── lib/
│   ├── profileLogic.ts
│   ├── googleSheets.ts
│   └── ipGeolocation.ts
├── types/
│   └── index.ts
└── package.json
```

## How It Works

1. **Landing Page**: User clicks "Start Quiz"
2. **Entry Screen**: User provides optional name/email and selects difficulty
3. **Question Generation**: On "Start Quiz", OpenAI generates 8 unique questions for that session
4. **Quiz Flow**: User answers 8 questions with immediate reveals/feedback
5. **Profile Assignment**: Based on signal tags across answers, user receives an AI Thinking Profile
6. **Certificate**: Beautiful certificate displays with user's profile
7. **Sharing**: User can download certificate or share on LinkedIn
8. **Session Logging**: All data saved to Google Sheets

## Design Principles

- **No Wrong Answers**: All perspectives are valid
- **Always Validate**: Encouraging tone throughout
- **Credible Profiles**: All profiles feel aspirational and professional
- **Shareable**: Optimized for LinkedIn sharing
- **Professional**: Minimal design, readable typography

## Deployment

The app is built for Vercel deployment:

```bash
vercel deploy
```

Vercel will automatically:
- Build the Next.js application
- Set environment variables
- Deploy to a global CDN

## API Cost Analysis

- **Question Generation**: ~$0.005-0.01 per user (one-time per session)
- **Google Sheets**: Free tier (most cases)
- **IP Geolocation**: Free tier from Positionstack

## Future Enhancements

- Email capture with deeper insights summary delivery
- Analytics dashboard
- Multiple language support
- Custom question templates
- User profiles with history
- A/B testing framework

## License

MIT

## Created By

Built as part of the AI Sense Check initiative by Vinesh Thota via OpenAI

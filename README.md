# 📝 Mangodesk Notes - AI Meeting Summarizer

An intelligent meeting notes application that uses AI to automatically summarize meeting transcripts and share them via email. Built with Next.js 15, TypeScript, and powered by Groq's LLaMA model.

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black.svg)
![Shade CN](https://img.shields.io/badge/Shade%20CN-1.0.0-orange.svg)

## 🚀 Features

- **AI-Powered Summarization**: Uses Groq's LLaMA 3 model for intelligent meeting transcript analysis
- **Customizable Prompts**: Flexible prompt system for different summarization styles
- **Email Integration**: Send summaries directly via Gmail SMTP
- **File Upload Support**: Upload `.txt` transcript files or paste content directly
- **Real-time Processing**: Instant AI processing with loading states
- **Modern UI**: Clean, responsive interface built with React 19
- **TypeScript**: Fully typed codebase for better development experience
- **Shade CN Integration**: Enhanced UI theming and color management via Shade CN

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.4.6 with App Router
- **Language**: TypeScript 5.0
- **UI Library**: React 19.1.0
- **Styling**: Native CSS with system fonts
- **Build Tool**: Next.js built-in bundler
- **Theming**: Shade CN for color and theme management

### Backend
- **Runtime**: Node.js
- **API Framework**: Next.js API Routes
- **AI Integration**: Groq SDK 0.30.0
- **Email Service**: Nodemailer 7.0.5
- **Model**: LLaMA 3-8B (via Groq)

### Development Tools
- **Code Quality**: ESLint 9 with Next.js config
- **CSS Processing**: Tailwind CSS 4 with PostCSS
- **Type Safety**: TypeScript with strict mode
- **Package Manager**: npm

### External Services
- **AI Provider**: Groq (for LLaMA model access)
- **Email Service**: Gmail SMTP
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager
- Groq API key (free tier available)
- Gmail account with App Password enabled

## 🔧 Installation

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd lumio-notes
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Setup
Create a `.env.local` file in the root directory:

```bash
# Groq API Configuration
QROQ_API_KEY=your_groq_api_key_here

# Gmail SMTP Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your_gmail_app_password
```

### Step 4: Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🔑 API Keys Setup

### Getting Groq API Key
1. Visit [Groq Console](https://console.groq.com/)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to your `.env.local` file

### Setting up Gmail App Password
1. Enable 2-Factor Authentication on your Google account
2. Go to Google Account Settings > Security
3. Under "2-Step Verification", click "App passwords"
4. Generate a new app password for "Mail"
5. Use this password in your `.env.local` file

## 🚀 Usage

### 1. Upload or Paste Transcript
- Upload a `.txt` file containing your meeting transcript
- Or paste the transcript directly in the text area

### 2. Customize Summary Prompt
- Modify the default prompt to get different summary styles
- Examples:
  - "Summarize in bullet points with action items"
  - "Create a detailed summary with decisions and next steps"
  - "Extract key discussion points and deadlines"

### 3. Generate Summary
- Click "Generate Summary" to process the transcript
- The AI will analyze and create a structured summary
- Edit the generated summary if needed

### 4. Share via Email
- Enter recipient email addresses (comma-separated)
- Click "Send Email" to share the summary
- Recipients will receive an HTML-formatted email

## 📚 API Documentation

### POST `/api/summarize`

Processes a meeting transcript and returns an AI-generated summary.

**Request Body:**
```json
{
  "transcript": "Meeting transcript text...",
  "prompt": "Custom summarization instruction"
}
```

**Response:**
```json
{
  "summary": "Generated summary text..."
}
```

**Error Responses:**
- `400`: Missing transcript or prompt
- `500`: AI processing error

### POST `/api/mail`

Sends an email with the meeting summary.

**Request Body:**
```json
{
  "to": "email1@example.com,email2@example.com",
  "subject": "Meeting Summary",
  "html": "<p>Summary content...</p>"
}
```

**Response:**
```json
{
  "ok": true
}
```

**Error Responses:**
- `400`: Missing required fields
- `500`: Email sending error

## 🏗️ Project Structure

```
Mangodesk-notes/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── mail/
│   │   │   │   └── route.tsx          # Email sending endpoint
│   │   │   └── summarize/
│   │   │       └── route.tsx          # AI summarization endpoint
│   │   ├── globals.css                # Global styles
│   │   ├── layout.tsx                 # Root layout component
│   │   ├── page.tsx                   # Main application page
│   │   └── favicon.ico                # App icon
├── public/                            # Static assets
├── .env.local                         # Environment variables
├── package.json                       # Dependencies and scripts
├── tsconfig.json                      # TypeScript configuration
├── next.config.ts                     # Next.js configuration
├── eslint.config.mjs                  # ESLint configuration
├── postcss.config.mjs                 # PostCSS configuration
└── README.md                          # This file
```

## 🧪 Testing

### Manual Testing
1. Start the development server: `npm run dev`
2. Open `http://localhost:3000` in your browser
3. Test with a sample transcript
4. Verify AI summarization works
5. Test email functionality with valid credentials

### API Testing
Use tools like Postman or curl to test API endpoints:

```bash
# Test summarize endpoint
curl -X POST http://localhost:3000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{"transcript":"Meeting content","prompt":"Summarize this"}'

# Test mail endpoint
curl -X POST http://localhost:3000/api/mail \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com","subject":"Test","html":"<p>Test</p>"}'
```

## 🚢 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
```bash
QROQ_API_KEY=your_production_groq_key
GMAIL_USER=your_production_email
GMAIL_PASS=your_production_app_password
```

### Build Commands
```bash
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint checks
```

## 🔒 Security Considerations

- API keys are stored securely in environment variables
- Gmail App Passwords provide secure email access
- Input validation on all API endpoints
- Error handling prevents sensitive data exposure
- CORS policies restrict API access

## 🛠️ Development

### Code Style
- TypeScript strict mode enabled
- ESLint with Next.js configuration
- Consistent error handling patterns
- Functional React components with hooks

### Adding New Features
1. Create feature branch: `git checkout -b feature/new-feature`
2. Implement changes with TypeScript
3. Test thoroughly
4. Update documentation
5. Submit pull request

## 📖 Troubleshooting

### Common Issues

**AI Summarization Not Working**
- Verify `QROQ_API_KEY` in `.env.local`
- Check Groq API quota limits
- Ensure stable internet connection

**Email Not Sending**
- Verify Gmail credentials in `.env.local`
- Ensure App Password is correctly generated
- Check Gmail SMTP settings

**Build Errors**
- Run `npm install` to ensure all dependencies
- Check TypeScript errors with `npm run lint`
- Verify Node.js version compatibility

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.


## 🔄 Changelog

### v0.1.0 (Current)
- Initial release
- AI-powered meeting summarization
- Email integration
- TypeScript implementation
- Next.js 15 with App Router

---

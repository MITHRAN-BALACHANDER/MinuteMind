# 🛠️ Development Guide

This guide provides comprehensive information for developers working on Mango Desk Notes, including setup, architecture, coding standards, and contribution guidelines.

## 🏗️ Architecture Overview

### Application Structure

```
Mango Desk-notes/
├── src/
│   ├── app/                          # Next.js 15 App Router
│   │   ├── api/                      # API Routes
│   │   │   ├── mail/                 # Email functionality
│   │   │   │   └── route.tsx         # POST /api/mail
│   │   │   └── summarize/            # AI summarization
│   │   │       └── route.tsx         # POST /api/summarize
│   │   ├── globals.css               # Global styles
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Main application page
│   │   └── favicon.ico               # Application icon
├── public/                           # Static assets
├── docs/                             # Documentation
├── .env.local                        # Environment variables (local)
├── package.json                      # Dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
├── next.config.ts                    # Next.js configuration
├── eslint.config.mjs                 # Linting configuration
└── postcss.config.mjs               # CSS processing
```

### Technology Stack

**Frontend:**
- Next.js 15.4.6 (React 19.1.0)
- TypeScript 5.0
- CSS Modules / Native CSS
- App Router (file-based routing)

**Backend:**
- Next.js API Routes
- Node.js runtime
- Nodemailer (email)
- Groq SDK (AI integration)

**Development Tools:**
- ESLint (code quality)
- TypeScript (type safety)
- Tailwind CSS (styling)
- Git (version control)

### Data Flow

```
User Input → Frontend (React) → API Routes → External Services → Response → UI Update
     ↓              ↓              ↓              ↓              ↓           ↓
1. File/Text → 2. Validation → 3. Processing → 4. AI/Email → 5. JSON → 6. Display
```

---

## 🚀 Development Setup

### Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- Git 2.0.0 or higher
- Code editor (VS Code recommended)

### Initial Setup

```bash
# Clone repository
git clone <repository-url>
cd Mango Desk-notes

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Configuration

Create `.env.local` with required variables:

```bash
# AI Service - Get from https://console.groq.com/
QROQ_API_KEY=gsk_your_groq_api_key_here

# Email Service - Gmail with App Password
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your_16_character_app_password

# Development Settings
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
```

### Development Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues
npm run type-check # TypeScript type checking
```

---

## 📝 Coding Standards

### TypeScript Guidelines

**Type Definitions:**
```typescript
// Use interfaces for object types
interface MeetingSummary {
  transcript: string;
  prompt: string;
  summary?: string;
}

// Use strict typing for API responses
interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

// Avoid 'any' - use proper types or unknown
function handleError(error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(message);
}
```

**Component Props:**
```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

export function Button({ children, onClick, disabled = false, variant = 'primary' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
}
```

### React Best Practices

**Functional Components:**
```typescript
// Use functional components with hooks
import { useState, useCallback } from 'react';

export function MeetingForm() {
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      // API call logic
    } catch (error) {
      // Error handling
    } finally {
      setLoading(false);
    }
  }, [transcript]);

  return (
    <form onSubmit={handleSubmit}>
      {/* Form content */}
    </form>
  );
}
```

**State Management:**
```typescript
// Keep state close to where it's used
// Use useCallback for event handlers
// Use useMemo for expensive calculations

const MemoizedComponent = React.memo(({ data }: { data: ComplexData }) => {
  const processedData = useMemo(() => {
    return expensiveProcessing(data);
  }, [data]);

  return <div>{processedData}</div>;
});
```

### API Route Patterns

**Standard API Route Structure:**
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // 1. Parse and validate input
    const body = await req.json();
    const { field1, field2 } = body;

    if (!field1 || !field2) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // 2. Process request
    const result = await processData(field1, field2);

    // 3. Return response
    return NextResponse.json({ data: result });
  } catch (error: unknown) {
    // 4. Handle errors
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('API Error:', message);
    return new NextResponse(message, { status: 500 });
  }
}
```

**Error Handling:**
```typescript
// Create custom error types
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class ExternalServiceError extends Error {
  constructor(service: string, message: string) {
    super(`${service}: ${message}`);
    this.name = 'ExternalServiceError';
  }
}

// Use in API routes
try {
  const result = await externalService.process(data);
} catch (error) {
  if (error instanceof ValidationError) {
    return new NextResponse(error.message, { status: 400 });
  }
  if (error instanceof ExternalServiceError) {
    return new NextResponse(error.message, { status: 502 });
  }
  throw error; // Re-throw unknown errors
}
```

### CSS Standards

**CSS Organization:**
```css
/* globals.css - Global styles only */
:root {
  --color-primary: #0070f3;
  --color-secondary: #666;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
}

/* Component-specific styles in component files */
.component {
  /* Layout */
  display: flex;
  flex-direction: column;
  
  /* Spacing */
  padding: var(--spacing-md);
  margin: var(--spacing-sm) 0;
  
  /* Visual */
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
}
```

---

## 🔧 Development Workflow

### Git Workflow

**Branch Naming:**
```bash
feature/ai-summarization-improvements
bugfix/email-validation-error
hotfix/security-vulnerability
docs/api-documentation-update
```

**Commit Messages:**
```bash
feat: add email batch sending functionality
fix: resolve API timeout issue with large transcripts
docs: update deployment guide with Docker instructions
refactor: improve error handling in summarize endpoint
test: add integration tests for mail API
```

**Development Process:**
```bash
# 1. Create feature branch
git checkout -b feature/new-functionality

# 2. Make changes and commit frequently
git add .
git commit -m "feat: implement new functionality"

# 3. Push and create pull request
git push origin feature/new-functionality

# 4. Code review and merge
# 5. Deploy to staging/production
```

### Testing Strategy

**Manual Testing Checklist:**
- [ ] Upload transcript file functionality
- [ ] Paste transcript functionality
- [ ] AI summarization with different prompts
- [ ] Email sending with single recipient
- [ ] Email sending with multiple recipients
- [ ] Error handling for invalid inputs
- [ ] Error handling for API failures
- [ ] Responsive design on mobile devices

**Integration Testing:**
```typescript
// Example test for API endpoints
describe('/api/summarize', () => {
  it('should generate summary for valid input', async () => {
    const response = await fetch('/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transcript: 'Test meeting content',
        prompt: 'Summarize in bullets'
      })
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.summary).toBeDefined();
  });

  it('should return 400 for missing fields', async () => {
    const response = await fetch('/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript: 'test' })
    });

    expect(response.status).toBe(400);
  });
});
```

### Performance Monitoring

**Client-Side Performance:**
```typescript
// Measure API response times
const startTime = performance.now();
const response = await fetch('/api/summarize', options);
const endTime = performance.now();
console.log(`API call took ${endTime - startTime} milliseconds`);

// Monitor component render times
import { Profiler } from 'react';

function onRenderCallback(id: string, phase: string, actualDuration: number) {
  console.log(`${id} ${phase} took ${actualDuration}ms`);
}

<Profiler id="MeetingForm" onRender={onRenderCallback}>
  <MeetingForm />
</Profiler>
```

---

## 🧩 Adding New Features

### Creating New API Endpoints

1. **Create Route File:**
```typescript
// src/app/api/new-feature/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // Implementation
}

export async function GET(req: NextRequest) {
  // Implementation
}
```

2. **Add Types:**
```typescript
// types/api.ts
export interface NewFeatureRequest {
  field1: string;
  field2: number;
}

export interface NewFeatureResponse {
  result: string;
  timestamp: string;
}
```

3. **Update Documentation:**
- Add endpoint to `docs/API.md`
- Update README.md if needed
- Add examples and error codes

### Adding New UI Components

1. **Create Component:**
```typescript
// components/NewComponent.tsx
interface NewComponentProps {
  title: string;
  onAction: () => void;
}

export function NewComponent({ title, onAction }: NewComponentProps) {
  return (
    <div className="new-component">
      <h2>{title}</h2>
      <button onClick={onAction}>Action</button>
    </div>
  );
}
```

2. **Add Styles:**
```css
/* In appropriate CSS file */
.new-component {
  /* Component styles */
}
```

3. **Integration:**
```typescript
// In page.tsx or parent component
import { NewComponent } from '@/components/NewComponent';

export default function Page() {
  const handleAction = () => {
    // Handle action
  };

  return (
    <NewComponent 
      title="Feature Title" 
      onAction={handleAction} 
    />
  );
}
```

### Integrating External Services

1. **Environment Variables:**
```bash
# Add to .env.local
NEW_SERVICE_API_KEY=your_api_key
NEW_SERVICE_URL=https://api.service.com
```

2. **Service Client:**
```typescript
// lib/newService.ts
class NewServiceClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async processData(data: any) {
    const response = await fetch(`${this.baseUrl}/process`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Service error: ${response.statusText}`);
    }

    return response.json();
  }
}

export const newServiceClient = new NewServiceClient(
  process.env.NEW_SERVICE_API_KEY!,
  process.env.NEW_SERVICE_URL!
);
```

3. **API Integration:**
```typescript
// In API route
import { newServiceClient } from '@/lib/newService';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const result = await newServiceClient.processData(data);
    return NextResponse.json(result);
  } catch (error) {
    // Error handling
  }
}
```

---

## 🐛 Debugging

### Development Tools

**VS Code Extensions:**
- TypeScript and JavaScript Language Features
- ESLint
- Prettier
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens

**Browser DevTools:**
```javascript
// Debug API calls
console.log('Request payload:', requestData);
console.time('API Call');
const response = await fetch('/api/endpoint', options);
console.timeEnd('API Call');
console.log('Response:', await response.json());

// Debug React components
console.log('Component props:', props);
console.log('Component state:', state);
```

**Network Debugging:**
```bash
# Monitor API calls
curl -v http://localhost:3000/api/summarize

# Check environment variables
echo $QROQ_API_KEY | wc -c  # Should be > 0

# Test email configuration
node -e "console.log(process.env.GMAIL_USER)"
```

### Common Issues

**TypeScript Errors:**
```bash
# Clear TypeScript cache
rm -rf .next
npm run build

# Check specific file
npx tsc --noEmit src/app/page.tsx
```

**API Errors:**
```typescript
// Add detailed logging
console.error('API Error Details:', {
  error: error.message,
  stack: error.stack,
  timestamp: new Date().toISOString(),
  requestBody: requestData
});
```

**Build Issues:**
```bash
# Clear all caches
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

---

## 📊 Performance Optimization

### Code Splitting
```typescript
// Dynamic imports for large components
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false
});
```

### API Optimization
```typescript
// Implement caching for AI responses
const cache = new Map();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const cacheKey = JSON.stringify(body);
  
  if (cache.has(cacheKey)) {
    return NextResponse.json(cache.get(cacheKey));
  }
  
  const result = await processRequest(body);
  cache.set(cacheKey, result);
  
  return NextResponse.json(result);
}
```

### Bundle Analysis
```bash
# Analyze bundle size
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build
```

---

## 🤝 Contributing

### Code Review Checklist

**Functionality:**
- [ ] Feature works as expected
- [ ] Error handling is comprehensive
- [ ] API responses are properly typed
- [ ] UI is responsive and accessible

**Code Quality:**
- [ ] TypeScript types are accurate
- [ ] ESLint rules are followed
- [ ] Code is properly commented
- [ ] No console.logs in production code

**Performance:**
- [ ] No unnecessary re-renders
- [ ] API calls are optimized
- [ ] Images are optimized
- [ ] Bundle size impact is minimal

**Security:**
- [ ] No sensitive data in client code
- [ ] Input validation is present
- [ ] Error messages don't leak info
- [ ] Environment variables are used properly

### Pull Request Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Manual testing completed
- [ ] All existing tests pass
- [ ] New tests added if applicable

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or clearly documented)
```

---

For additional development support, refer to the main README.md or create an issue in the project repository.

# 🎯 Project Task: AI-Powered Meeting Notes Summarizer

## Project Overview

Build a full-stack application that serves as an AI-powered meeting notes summarizer and sharer. The application should enable users to upload meeting transcripts, generate AI-powered summaries with custom prompts, and share the results via email.

---

## 📋 Project Requirements

### Core Functionality

#### 1. File Upload & Input
- **Text Transcript Upload**: Users should be able to upload text files (e.g., meeting notes, call transcripts)
- **Manual Input**: Alternative text area for pasting transcript content directly
- **Supported Formats**: `.txt` files minimum (additional formats like `.docx`, `.pdf` are bonus)

#### 2. Custom AI Prompts
- **Instruction Input**: Text field for custom AI instructions/prompts
- **Example Prompts**: 
  - "Summarize in bullet points for executives"
  - "Highlight only action items"
  - "Extract key decisions and next steps"
  - "Create a detailed summary with timeline"

#### 3. AI-Powered Summarization
- **Generate Summary Button**: Trigger AI processing with uploaded content and custom prompt
- **AI Integration**: Use any AI service (Groq, ChatGPT, Claude, etc.)
- **Structured Output**: Generate meaningful, well-formatted summaries
- **Processing Feedback**: Show loading states and progress indicators

#### 4. Editable Results
- **Summary Editing**: Generated summary should be fully editable
- **Real-time Updates**: Changes should be reflected immediately
- **Format Preservation**: Maintain formatting and structure during editing

#### 5. Email Sharing
- **Recipient Input**: Field for entering email addresses
- **Multiple Recipients**: Support comma-separated email addresses
- **Email Composition**: Include summary content in email body
- **Send Functionality**: Reliable email delivery system

---

## 🛠️ Technical Requirements

### Frontend Requirements
- **Extremely Basic Design**: Focus on functionality over aesthetics
- **Responsive Layout**: Works on desktop and mobile devices
- **User Interface Elements**:
  - File upload component
  - Text area for manual input
  - Prompt input field
  - Generate summary button
  - Editable summary display
  - Email recipient input
  - Send email button
  - Error and success messaging

### Backend Requirements
- **API Endpoints**: RESTful API for summary generation and email sending
- **File Processing**: Handle uploaded text files
- **AI Integration**: Connect to chosen AI service (Groq, OpenAI, etc.)
- **Email Service**: SMTP or email API integration
- **Error Handling**: Comprehensive error management and validation
- **Security**: Protect API keys and sensitive data

### Technology Stack (Open Choice)
- **No Restrictions**: Use any tools, frameworks, or services
- **Suggested Options**:
  - Frontend: React, Vue, Next.js, vanilla HTML/CSS/JS
  - Backend: Node.js, Python (Flask/Django), Express.js
  - AI Services: Groq, OpenAI, Anthropic, Google AI
  - Email: Nodemailer, SendGrid, Mailgun, Gmail SMTP
  - Deployment: Vercel, Netlify, Heroku, Railway, AWS

---

## 🎯 User Flow

### Step-by-Step Process
1. **Upload/Input**: User uploads transcript file OR pastes content in text area
2. **Customize Prompt**: User enters custom instruction for AI summarization
3. **Generate**: User clicks "Generate Summary" to process content
4. **Review & Edit**: AI generates summary, user can edit the results
5. **Share**: User enters recipient email addresses and sends summary

### Expected User Experience
- **Simple Interface**: Minimal, focused design prioritizing functionality
- **Clear Workflow**: Obvious progression from input to output to sharing
- **Fast Processing**: Quick AI response times (under 10 seconds)
- **Reliable Delivery**: Successful email sending with confirmation
- **Error Handling**: Clear error messages and recovery options

---

## 📊 Success Criteria

### Functional Requirements
- [ ] Successfully upload and process text transcript files
- [ ] Accept manual text input via text area
- [ ] Generate AI summaries using custom prompts
- [ ] Allow editing of generated summaries
- [ ] Send summaries via email to multiple recipients
- [ ] Handle errors gracefully with user feedback
- [ ] Work on both desktop and mobile devices

### Technical Requirements
- [ ] Clean, well-structured code
- [ ] Proper error handling and validation
- [ ] Secure handling of API keys and credentials
- [ ] Responsive design (even if basic)
- [ ] Working deployment with public URL
- [ ] Fast loading times and performance

### Quality Requirements
- [ ] Reliable AI integration with meaningful summaries
- [ ] Consistent email delivery
- [ ] User-friendly interface despite basic design
- [ ] Comprehensive documentation
- [ ] Production-ready deployment

---

## 📋 Final Deliverables

### 1. Technical Documentation
**Required Content**:
- **Approach**: Detailed explanation of development strategy
- **Process**: Step-by-step development workflow
- **Tech Stack**: Complete list of technologies, frameworks, and services used
- **Architecture**: System design and component interaction
- **Setup Instructions**: How to run the project locally
- **Deployment Process**: How the application was deployed
- **API Documentation**: Endpoint specifications and usage
- **Challenges & Solutions**: Issues encountered and resolutions

### 2. Deployed Application
**Requirements**:
- **Working Link**: Publicly accessible URL
- **Full Functionality**: All features operational in production
- **Performance**: Fast loading and responsive design
- **Reliability**: Stable operation without frequent crashes
- **Security**: Proper handling of sensitive data

**Note**: Only working deployed links will be accepted.

---

## 🚀 Development Guidelines

### Phase 1: Planning & Setup
- Choose technology stack
- Set up development environment
- Create project structure
- Plan API design and database schema (if needed)

### Phase 2: Backend Development
- Implement AI integration
- Create email sending functionality
- Build API endpoints
- Add error handling and validation

### Phase 3: Frontend Development
- Create basic UI components
- Implement file upload functionality
- Build summary display and editing
- Add email sending interface

### Phase 4: Integration & Testing
- Connect frontend to backend
- Test all user flows
- Handle edge cases and errors
- Optimize performance

### Phase 5: Deployment & Documentation
- Deploy to chosen platform
- Write comprehensive documentation
- Test production deployment
- Prepare final deliverables

---


---

## 🎯 Evaluation Criteria

### Functionality (40%)
- All core features working as specified
- Reliable AI summarization quality
- Successful email delivery
- Proper error handling

### Code Quality (25%)
- Clean, readable, and well-structured code
- Proper documentation and comments
- Security best practices
- Performance optimization

### User Experience (20%)
- Intuitive interface despite basic design
- Clear user flow and feedback
- Mobile responsiveness
- Error messages and guidance

### Documentation (15%)
- Comprehensive technical documentation
- Clear setup and deployment instructions
- API documentation and examples
- Process explanation and tech stack details

---

## 📞 Support & Resources

### Available Resources
- **Groq Documentation**: Provided for AI integration reference
- **Open Tool Choice**: Freedom to use any AI service or development tools
- **No Design Restrictions**: Focus purely on functionality

### Clarifications
- **Basic Frontend**: Minimal styling is acceptable and encouraged
- **AI Service**: Any AI provider is acceptable (Groq, OpenAI, Claude, etc.)
- **Deployment**: Any platform that provides a working public URL
- **Documentation**: Should be thorough but can be in any format (Markdown preferred)

---

**🎯 Success Definition**: A working full-stack application deployed with a public URL that successfully processes meeting transcripts, generates AI summaries with custom prompts, and shares results via email, accompanied by comprehensive technical documentation.

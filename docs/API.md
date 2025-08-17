# 📡 API Documentation

## Overview

Mango Desk Notes provides two main API endpoints for meeting transcript processing and email functionality. All endpoints use JSON for request/response data and follow RESTful conventions.

**Base URL**: `http://localhost:3000/api` (development)  
**Content-Type**: `application/json`  
**Authentication**: Environment variable based (no API keys required in requests)

---

## 🧠 Summarization API

### `POST /api/summarize`

Processes meeting transcripts using AI to generate structured summaries.

#### Request

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "transcript": "string (required)",
  "prompt": "string (required)"
}
```

**Parameters:**
- `transcript` (string, required): The raw meeting transcript text
- `prompt` (string, required): Custom instruction for summarization style

#### Response

**Success Response (200):**
```json
{
  "summary": "string"
}
```

**Error Responses:**

**400 Bad Request:**
```json
"Missing transcript or prompt"
```

**500 Internal Server Error:**
```json
"Error message describing the issue"
```

#### Example Usage

**Request:**
```bash
curl -X POST http://localhost:3000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "Alice: We need to finish the project by Friday. Bob: I will handle the backend. Carol: I will work on frontend.",
    "prompt": "Summarize in bullet points with action items and owners"
  }'
```

**Response:**
```json
{
  "summary": "• Project deadline: Friday\n• Action items:\n  - Bob: Backend development\n  - Carol: Frontend development"
}
```

#### AI Model Details

- **Model**: LLaMA 3-8B via Groq
- **Temperature**: 0.2 (for consistent, focused outputs)
- **System Prompt**: Optimized for meeting notes structure
- **Output Format**: Structured text with decisions, action items, risks, and next steps

---

## 📧 Email API

### `POST /api/mail`

Sends meeting summaries via email using Gmail SMTP.

#### Request

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "to": "string (required)",
  "subject": "string (required)", 
  "html": "string (required)"
}
```

**Parameters:**
- `to` (string, required): Recipient email address(es), comma-separated for multiple recipients
- `subject` (string, required): Email subject line
- `html` (string, required): Email content in HTML format

#### Response

**Success Response (200):**
```json
{
  "ok": true
}
```

**Error Responses:**

**400 Bad Request:**
```json
"Missing fields"
```

**500 Internal Server Error:**
```json
"Error message describing the email sending issue"
```

#### Example Usage

**Request:**
```bash
curl -X POST http://localhost:3000/api/mail \
  -H "Content-Type: application/json" \
  -d '{
    "to": "alice@example.com,bob@example.com",
    "subject": "Meeting Summary - Project Update",
    "html": "<h2>Meeting Summary</h2><p>Project deadline: Friday</p><ul><li>Bob: Backend development</li><li>Carol: Frontend development</li></ul>"
  }'
```

**Response:**
```json
{
  "ok": true
}
```

#### Email Configuration

The email service uses Gmail SMTP with the following configuration:
- **Service**: Gmail SMTP (smtp.gmail.com:587)
- **Authentication**: App Password (not regular Gmail password)
- **Security**: TLS encryption
- **From Address**: Configured via `GMAIL_USER` environment variable

---

## 🔧 Environment Variables

Both APIs require specific environment variables to function:

```bash
# Required for /api/summarize
QROQ_API_KEY=your_groq_api_key

# Required for /api/mail  
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your_gmail_app_password
```

---

## 📊 Rate Limits & Quotas

### Groq API (Summarization)
- **Free Tier**: 30 requests per minute
- **Model**: LLaMA 3-8B (8192 context tokens)
- **Input Limit**: ~6,000 words per request
- **Response Time**: Typically 1-3 seconds

### Gmail SMTP (Email)
- **Daily Limit**: 500 emails per day (Gmail free account)
- **Rate Limit**: 100 emails per hour
- **Attachment Size**: Not applicable (text-only summaries)
- **Recipient Limit**: 100 recipients per email

---

## 🛡️ Error Handling

### Common Error Patterns

**Validation Errors (400):**
```json
{
  "error": "Missing transcript or prompt",
  "status": 400
}
```

**Authentication Errors (401):**
```json
{
  "error": "Invalid API key",
  "status": 401
}
```

**Rate Limit Errors (429):**
```json
{
  "error": "Rate limit exceeded",
  "status": 429,
  "retryAfter": "60 seconds"
}
```

**Server Errors (500):**
```json
{
  "error": "Internal server error",
  "status": 500
}
```

### Error Handling Best Practices

1. **Always check response status codes**
2. **Implement retry logic for 429 errors**
3. **Validate input data before sending requests**
4. **Handle network timeouts gracefully**
5. **Log errors for debugging**

---

## 🧪 Testing

### Testing the Summarize API

**Valid Request:**
```javascript
const response = await fetch('/api/summarize', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    transcript: "Alice: Let's discuss the project timeline. Bob: I think we can finish by next week.",
    prompt: "Extract key points and timeline"
  })
});

const data = await response.json();
console.log(data.summary);
```

**Invalid Request (Missing Fields):**
```javascript
const response = await fetch('/api/summarize', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    transcript: "Some content"
    // Missing prompt field
  })
});

console.log(response.status); // 400
```

### Testing the Mail API

**Valid Request:**
```javascript
const response = await fetch('/api/mail', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: "test@example.com",
    subject: "Test Summary",
    html: "<p>This is a test email</p>"
  })
});

const data = await response.json();
console.log(data.ok); // true
```

### Test Data

**Sample Meeting Transcript:**
```text
Meeting: Weekly Project Standup
Date: August 17, 2025
Participants: Alice (PM), Bob (Dev), Carol (Designer)

Alice: Good morning team. Let's review our progress on the Mango Desk project.

Bob: I've completed the API endpoints for summarization and email functionality. All tests are passing and the code is ready for deployment.

Carol: The UI is 90% complete. I'm working on the responsive design for mobile devices. Should be done by Thursday.

Alice: Excellent progress. Bob, can you prepare the deployment documentation by Friday? Carol, please coordinate with Bob on any API integration needs.

Bob: Sure, I'll have the docs ready. One concern - we might need additional server resources for the AI processing.

Alice: I'll reach out to the infrastructure team about scaling. Any blockers?

Carol: No blockers on my end. The designs are approved and implementation is smooth.

Alice: Great. Next meeting same time next week. Action items: Bob - deployment docs by Friday, Carol - mobile responsive by Thursday, Alice - infrastructure planning.
```

**Sample Custom Prompts:**
- `"Create a concise summary with bullet points"`
- `"Extract action items with owners and deadlines"`
- `"Identify key decisions and next steps"`
- `"Summarize risks and blockers mentioned"`
- `"Generate an executive summary for leadership"`

---

## 🔐 Security

### API Security Features

1. **Input Validation**: All inputs are validated for required fields and data types
2. **Error Sanitization**: Error messages don't expose sensitive system information  
3. **Environment Variables**: Sensitive credentials stored securely
4. **CORS Protection**: API endpoints protected against cross-origin attacks
5. **Rate Limiting**: Built-in protection via external service limits

### Security Best Practices

1. **Never expose API keys in client-side code**
2. **Use HTTPS in production environments**
3. **Implement request logging for audit trails**
4. **Validate and sanitize all user inputs**
5. **Monitor API usage for unusual patterns**

---

## 📈 Performance

### Response Times

- **Summarize API**: 1-5 seconds (depends on transcript length and AI processing)
- **Mail API**: 2-10 seconds (depends on email content and SMTP response)

### Optimization Tips

1. **Transcript Length**: Keep transcripts under 6,000 words for optimal AI processing
2. **Batch Emails**: Send to multiple recipients in a single request when possible
3. **Error Handling**: Implement proper timeout handling (30-60 seconds recommended)
4. **Caching**: Consider caching AI responses for identical inputs

---

## 🔄 Changelog

### v1.0.0
- Initial API release
- Summarize endpoint with LLaMA 3-8B integration
- Mail endpoint with Gmail SMTP support
- Comprehensive error handling
- TypeScript implementation

---

## 📞 Support

For API-related issues:

1. **Check Environment Variables**: Ensure all required variables are set
2. **Verify Credentials**: Test Groq and Gmail credentials independently  
3. **Review Error Messages**: Check specific error details in responses
4. **Monitor Rate Limits**: Ensure you're within service quotas
5. **Test with Sample Data**: Use provided test examples to isolate issues

For additional support, please refer to the main README.md or create an issue in the project repository.

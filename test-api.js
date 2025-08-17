// Test script for API endpoints
// Run this with: node test-api.js

const API_BASE = 'http://localhost:3001/api';

// Test data
const testTranscript = `Meeting Transcript - Test
Alice: We need to complete the project by Friday.
Bob: I'll handle the backend API development.
Carol: I'll work on the frontend components.
Alice: Let's schedule a follow-up meeting for Monday.`;

const testPrompt = 'Summarize in bullet points with action items and owners.';

async function testSummarizeAPI() {
  console.log('🧪 Testing /api/summarize endpoint...');
  
  try {
    const response = await fetch(`${API_BASE}/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transcript: testTranscript,
        prompt: testPrompt
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    console.log('✅ Summarize API working!');
    console.log('📝 Summary:', data.summary);
    return data.summary;
  } catch (error) {
    console.error('❌ Summarize API failed:', error.message);
    return null;
  }
}

async function testMailAPI(summary) {
  console.log('\n🧪 Testing /api/mail endpoint...');
  
  // Note: This will fail without proper email credentials
  try {
    const response = await fetch(`${API_BASE}/mail`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'test@example.com',
        subject: 'Test Meeting Summary',
        html: `<pre>${summary || 'Test summary content'}</pre>`
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('⚠️  Mail API responded with error (expected without email config):', errorText);
    } else {
      console.log('✅ Mail API working!');
    }
  } catch (error) {
    console.error('❌ Mail API failed:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting API tests...\n');
  
  const summary = await testSummarizeAPI();
  await testMailAPI(summary);
  
  console.log('\n✨ Test completed!');
  console.log('📋 Next steps:');
  console.log('1. Set up environment variables in .env.local:');
  console.log('   - QROQ_API_KEY (for AI summarization)');
  console.log('   - GMAIL_USER and GMAIL_PASS (for email sending)');
  console.log('2. Test the web interface at http://localhost:3001');
}

runTests().catch(console.error);

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

function createEmailTemplate(summary: string, meetingDate?: string): string {
  const currentDate = meetingDate || new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Process summary to add better formatting
  const formattedSummary = summary
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Bold text
    .replace(/\*(.*?)\*/g, '<em>$1</em>')              // Italic text
    .replace(/^- (.*$)/gim, '<div style="margin: 8px 0; padding-left: 20px; position: relative;"><span style="position: absolute; left: 0; color: #3b82f6; font-weight: bold;">•</span>$1</div>')  // Bullet points
    .replace(/^## (.*$)/gim, '<h2 style="color: #1e40af; font-size: 18px; margin: 25px 0 15px 0; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0;">$1</h2>')  // Headers
    .replace(/^# (.*$)/gim, '<h1 style="color: #1e40af; font-size: 22px; margin: 30px 0 20px 0;">$1</h1>')  // Main headers
    .replace(/\n\n/g, '<br><br>');  // Double line breaks

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Meeting Summary</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f8fafc;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 40px 30px 40px;
          text-align: center;
          position: relative;
        }
        .header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.15"/><circle cx="20" cy="80" r="0.5" fill="white" opacity="0.15"/><circle cx="90" cy="30" r="0.5" fill="white" opacity="0.15"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
        }
        .header-content {
          position: relative;
          z-index: 1;
        }
        .header h1 {
          margin: 0;
          font-size: 32px;
          font-weight: 700;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header p {
          margin: 12px 0 0 0;
          opacity: 0.95;
          font-size: 16px;
          font-weight: 300;
        }
        .content {
          padding: 40px;
        }
        .meeting-info {
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          border-left: 5px solid #3b82f6;
          padding: 25px;
          margin-bottom: 35px;
          border-radius: 0 12px 12px 0;
          position: relative;
        }
        .meeting-info::before {
          content: '📅';
          position: absolute;
          top: -10px;
          left: -15px;
          background: white;
          padding: 8px;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .meeting-info h2 {
          margin: 0 0 15px 0;
          color: #1e40af;
          font-size: 20px;
          font-weight: 600;
        }
        .meeting-info p {
          margin: 8px 0;
          color: #475569;
          font-size: 15px;
        }
        .meeting-info strong {
          color: #1e293b;
        }
        .summary-content {
          background-color: #ffffff;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 35px;
          font-size: 15px;
          line-height: 1.8;
          color: #374151;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .summary-content h1 {
          color: #1e40af;
          font-size: 22px;
          margin: 30px 0 20px 0;
          font-weight: 600;
        }
        .summary-content h2 {
          color: #1e40af;
          font-size: 18px;
          margin: 25px 0 15px 0;
          padding-bottom: 8px;
          border-bottom: 2px solid #e2e8f0;
          font-weight: 600;
        }
        .summary-content strong {
          color: #1e293b;
          font-weight: 600;
        }
        .summary-content em {
          color: #64748b;
          font-style: italic;
        }
        .footer {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 35px 40px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        .footer p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }
        .footer .logo {
          font-weight: 700;
          color: #3b82f6;
          margin-bottom: 8px;
          font-size: 18px;
        }
        .divider {
          height: 2px;
          background: linear-gradient(to right, transparent, #e2e8f0, transparent);
          margin: 35px 0;
          border-radius: 1px;
        }
        .highlight-box {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border-left: 4px solid #f59e0b;
          padding: 20px;
          margin: 20px 0;
          border-radius: 0 8px 8px 0;
        }
        @media (max-width: 600px) {
          .container {
            margin: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header, .content, .footer {
            padding: 25px 20px;
          }
          .header h1 {
            font-size: 24px;
          }
          .summary-content {
            padding: 25px 20px;
            font-size: 14px;
          }
          .meeting-info {
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="header-content">
            <h1>📝 Meeting Summary</h1>
            <p>AI-Generated Meeting Notes & Action Items</p>
          </div>
        </div>
        
        <div class="content">
          <div class="meeting-info">
            <h2>Meeting Details</h2>
            <p><strong>Date:</strong> ${currentDate}</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Processed by:</strong> MinuteMind AI</p>
          </div>
          
          <div class="divider"></div>
          
          <div class="summary-content">${formattedSummary}</div>
        </div>
        
        <div class="footer">
          <p class="logo">🤖 MinuteMind</p>
          <p>Powered by AI • Streamlined for productivity</p>
          <p style="margin-top: 8px; font-size: 12px; opacity: 0.7;">
            This summary was automatically generated and may require review
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function POST(req: NextRequest) {
  try {
    const { to, subject, summary, meetingDate } = await req.json();
    if (!to || !subject || !summary) {
      return new NextResponse('Missing required fields: to, subject, summary', { status: 400 });
    }

    // Use Gmail SMTP (needs an App Password, not your regular Gmail password)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,   // your Gmail address
        pass: process.env.GMAIL_PASS    // app password
      }
    });

    const recipients = String(to)
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean);

    // Generate the HTML email template
    const html = createEmailTemplate(summary, meetingDate);

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: recipients,
      subject,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Email error';
    return new NextResponse(message, { status: 500 });
  }
}

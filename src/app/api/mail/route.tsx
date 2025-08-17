import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { to, subject, html } = await req.json();
    if (!to || !subject || !html) {
      return new NextResponse('Missing fields', { status: 400 });
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

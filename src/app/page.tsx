'use client';

import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Send, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Upload, 
  Brain,
  Mail,
  Sparkles,
  Copy,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  const [transcript, setTranscript] = useState('');
  const [prompt, setPrompt] = useState('Summarize in concise bullet points. Include action items and owners.');
  const [summary, setSummary] = useState('');
  const [emails, setEmails] = useState('');
  const [subject, setSubject] = useState('Meeting Summary - ' + new Date().toLocaleDateString());
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleGenerate() {
    setError(null); 
    setOk(null); 
    setLoading(true);
    
    try {
      const r = await fetch('/api/summarize', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ transcript, prompt })
      });
      if (!r.ok) throw new Error(await r.text());
      const data = await r.json();
      setSummary(data.summary || '');
      setOk('Summary generated successfully!');
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      setError(message);
    } finally { 
      setLoading(false); 
    }
  }

  async function handleSend() {
    setError(null); 
    setOk(null); 
    setSending(true);
    
    try {
      const r = await fetch('/api/mail', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ 
          to: emails, 
          subject: subject, 
          summary: summary,
          meetingDate: new Date().toISOString()
        })
      });
      if (!r.ok) throw new Error(await r.text());
      setOk('Email sent successfully!');
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      setError(message);
    } finally { 
      setSending(false); 
    }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    
    const reader = new FileReader();
    reader.onload = () => setTranscript(String(reader.result || ''));
    reader.readAsText(f);
  }

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = () => setTranscript(String(reader.result || ''));
        reader.readAsText(file);
      }
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(summary);
    setOk('Summary copied to clipboard!');
    setTimeout(() => setOk(null), 2000);
  }

  function downloadSummary() {
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-summary-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Skip Navigation Link for Screen Readers */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header 
        className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        role="banner"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg" aria-hidden="true">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">MinuteMind</h1>
              <p className="text-sm text-muted-foreground hidden sm:block">AI Meeting Notes</p>
            </div>
          
          </div>
          {/* <div className="inline-flex items-center gap-2 px-3 py-3  rounded-full border-8 bg-muted/50 text-sm text-muted-foreground mb-6">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            Transform meetings into actionable insights
          </div> */}
          <ThemeToggle />
        </div>
      </header>

      <main 
        id="main-content"
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"
        role="main"
      >
        {/* Hero Section */}
        <section className="text-center mb-12 animate-fade-in" aria-labelledby="hero-heading">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-muted/50 text-sm text-muted-foreground mb-6">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            Transform meetings into actionable insights
          </div>
          
          <h2 id="hero-heading" className="text-display bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text mb-4">
            AI-Powered Meeting Summarizer
          </h2>
          
          <p className="text-body-large text-muted-foreground max-w-3xl mx-auto mb-8">
            Upload your meeting transcripts and get professional summaries with action items, 
            key decisions, and insights in seconds. Share with your team instantly.
          </p>
        </section>

        <div className="max-w-5xl mx-auto space-y-8">
          {/* Upload Section */}
          <section aria-labelledby="upload-heading">
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle id="upload-heading" className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" aria-hidden="true" />
                  Upload Your Transcript
                </CardTitle>
                <CardDescription>
                  Start by uploading a text file or pasting your meeting transcript below
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* File Upload Area */}
                <div
                  className={`
                    relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
                    ${dragActive 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                    }
                  `}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  role="button"
                  tabIndex={0}
                  aria-label="File upload area. Drop files here or click to browse."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-3 bg-muted rounded-full" aria-hidden="true">
                      <FileText className="w-8 h-8 text-muted-foreground" />
                    </div>
                    
                    <div>
                      <p className="text-lg font-medium mb-2">
                        Drop your transcript file here, or{' '}
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="text-primary hover:underline focus:underline focus:outline-none"
                          aria-describedby="file-requirements"
                        >
                          browse files
                        </button>
                      </p>
                      <p id="file-requirements" className="text-sm text-muted-foreground">
                        Supports .txt files up to 10MB
                      </p>
                    </div>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt"
                      onChange={handleFile}
                      className="sr-only"
                      aria-label="Choose transcript file"
                    />
                  </div>
                </div>

                {/* Or Separator */}
                <div className="relative" role="separator" aria-label="Alternative input method">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or paste directly</span>
                  </div>
                </div>

                {/* Textarea */}
                <div className="space-y-2">
                  <label 
                    htmlFor="transcript-input"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Meeting Transcript
                  </label>
                  <Textarea
                    id="transcript-input"
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="Paste your meeting or call transcript here..."
                    className="min-h-[120px] resize-none"
                    aria-describedby="transcript-help"
                  />
                  <p id="transcript-help" className="text-xs text-muted-foreground">
                    {transcript.length} characters{transcript.length > 0 && ` • ${Math.ceil(transcript.length / 4)} estimated words`}
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Prompt Configuration */}
          <section aria-labelledby="prompt-heading">
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle id="prompt-heading" className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" aria-hidden="true" />
                  Summarization Instructions
                </CardTitle>
                <CardDescription>
                  Customize how you want your meeting summary to be formatted
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <label 
                    htmlFor="prompt-input"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Custom Prompt
                  </label>
                  <Input
                    id="prompt-input"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe how you want the summary formatted..."
                    aria-describedby="prompt-help"
                  />
                  <p id="prompt-help" className="text-xs text-muted-foreground">
                    Pro tip: Be specific about what sections you want (action items, decisions, participants, etc.)
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Generate Button */}
          <div className="flex justify-center animate-slide-up">
            <Button
              onClick={handleGenerate}
              disabled={loading || !transcript.trim()}
              size="lg"
              className="min-w-[200px]"
              aria-describedby={transcript.trim() ? "generate-help" : "generate-disabled-help"}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
                  Generating Summary...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" aria-hidden="true" />
                  Generate Summary
                </>
              )}
            </Button>
            {!transcript.trim() && (
              <p id="generate-disabled-help" className="sr-only">
                Button disabled. Please enter a transcript first.
              </p>
            )}
            {transcript.trim() && (
              <p id="generate-help" className="sr-only">
                Generate an AI summary of your meeting transcript.
              </p>
            )}
          </div>

          {/* Summary Section */}
          {(summary || loading) && (
            <section aria-labelledby="summary-heading">
              <Card className="animate-slide-up">
                <CardHeader>
                  <CardTitle id="summary-heading" className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-success" aria-hidden="true" />
                      Generated Summary
                    </div>
                    {summary && (
                      <div className="flex items-center gap-2" role="toolbar" aria-label="Summary actions">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={copyToClipboard}
                          className="h-8"
                          aria-label="Copy summary to clipboard"
                        >
                          <Copy className="w-4 h-4 mr-1" aria-hidden="true" />
                          Copy
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={downloadSummary}
                          className="h-8"
                          aria-label="Download summary as text file"
                        >
                          <Download className="w-4 h-4 mr-1" aria-hidden="true" />
                          Download
                        </Button>
                      </div>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Review and edit your AI-generated summary before sharing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    id="summary-textarea"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Your AI-generated summary will appear here..."
                    className="min-h-[300px] font-mono text-sm"
                    aria-describedby="summary-stats"
                    aria-label="Editable meeting summary"
                  />
                  {summary && (
                    <p id="summary-stats" className="text-xs text-muted-foreground mt-2">
                      {summary.length} characters • {summary.split(' ').length} words
                    </p>
                  )}
                </CardContent>
              </Card>
            </section>
          )}

          {/* Email Section */}
          {summary && (
            <section aria-labelledby="email-heading">
              <Card className="animate-slide-up">
                <CardHeader>
                  <CardTitle id="email-heading" className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" aria-hidden="true" />
                    Share Summary
                  </CardTitle>
                  <CardDescription>
                    Send your meeting summary to team members via email
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <legend className="sr-only">Email details</legend>
                    
                    <div className="space-y-2">
                      <label 
                        htmlFor="email-subject"
                        className="text-sm font-medium"
                      >
                        Email Subject
                      </label>
                      <Input
                        id="email-subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Meeting Summary - [Date]"
                        aria-describedby="subject-help"
                      />
                      <p id="subject-help" className="sr-only">
                        Enter the subject line for the email
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <label 
                        htmlFor="email-recipients"
                        className="text-sm font-medium"
                      >
                        Recipients
                      </label>
                      <Input
                        id="email-recipients"
                        value={emails}
                        onChange={(e) => setEmails(e.target.value)}
                        placeholder="alice@company.com, bob@company.com"
                        aria-describedby="recipients-help"
                      />
                      <p id="recipients-help" className="text-xs text-muted-foreground">
                        Separate multiple email addresses with commas
                      </p>
                    </div>
                  </fieldset>

                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={handleSend}
                      disabled={sending || !summary || !emails.trim()}
                      className="min-w-[150px]"
                      aria-describedby={(!summary || !emails.trim()) ? "send-disabled-help" : "send-help"}
                    >
                      {sending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" aria-hidden="true" />
                          Send Email
                        </>
                      )}
                    </Button>
                    {(!summary || !emails.trim()) && (
                      <p id="send-disabled-help" className="sr-only">
                        Button disabled. Please add recipients and ensure you have a summary.
                      </p>
                    )}
                    {summary && emails.trim() && (
                      <p id="send-help" className="sr-only">
                        Send the meeting summary via email to the specified recipients.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Status Messages */}
          {(error || ok) && (
            <div className="space-y-3 animate-fade-in">
              {error && (
                <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-destructive">Error occurred</p>
                    <p className="text-sm text-destructive/80">{error}</p>
                  </div>
                </div>
              )}
              
              {ok && (
                <div className="flex items-start gap-3 p-4 bg-success/10 border border-success/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <p className="font-medium text-success">{ok}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Powered by AI • Built for productivity 
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Transform meetings into actionable insights with MinuteMind
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ThemeToggle } from '@/components/theme-toggle'
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
  const [isDragOver, setIsDragOver] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  async function handleGenerate() {
    if (!transcript.trim()) return;
    
    setLoading(true);
    setError(null);
    setOk(null);
    
    try {
      const r = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, prompt })
      });
      
      if (!r.ok) throw new Error(await r.text());
      
      const { summary: newSummary } = await r.json();
      setSummary(newSummary);
      setOk('Summary generated successfully!');
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      setError(message);
    } finally { 
      setLoading(false); 
    }
  }

  async function handleSend() {
    if (!summary || !emails.trim()) return;
    
    setSending(true);
    setError(null);
    setOk(null);
    
    try {
      const r = await fetch('/api/mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: emails, subject, body: summary })
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

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    
    const reader = new FileReader();
    reader.onload = () => setTranscript(String(reader.result || ''));
    reader.readAsText(f);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    
    const f = e.dataTransfer.files[0];
    if (!f) return;
    
    const reader = new FileReader();
    reader.onload = () => setTranscript(String(reader.result || ''));
    reader.readAsText(f);
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(summary);
    setOk('Copied to clipboard!');
  }

  function downloadSummary() {
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meeting-summary.txt';
    a.click();
    URL.revokeObjectURL(url);
    setOk('Summary downloaded!');
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Skip Navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
            </div>
            <h1 className="text-xl font-bold">MinuteMind</h1>
          </div>
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
          
          <h2 id="hero-heading" className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent mb-4">
            MinuteMind AI
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Upload your meeting transcripts and get professional summaries with action items, 
            key decisions, and insights in seconds. Share with your team instantly.
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Badge variant="secondary" className="px-3 py-1">
              <Brain className="w-3 h-3 mr-1" aria-hidden="true" />
              AI-Powered
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <CheckCircle className="w-3 h-3 mr-1" aria-hidden="true" />
              Instant Results
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <Mail className="w-3 h-3 mr-1" aria-hidden="true" />
              Easy Sharing
            </Badge>
          </div>
        </section>

        <div className="max-w-5xl mx-auto">
          <TooltipProvider>
            <Tabs defaultValue="input" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid w-full max-w-lg grid-cols-3">
                  <TabsTrigger value="input" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span className="hidden sm:inline">Input</span>
                  </TabsTrigger>
                  <TabsTrigger value="generate" className="flex items-center gap-2" disabled={!transcript.trim()}>
                    <Brain className="w-4 h-4" />
                    <span className="hidden sm:inline">Generate</span>
                  </TabsTrigger>
                  <TabsTrigger value="share" className="flex items-center gap-2" disabled={!summary}>
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Share</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="input" className="space-y-8 mt-0">
                {/* File Upload Section */}
                <Card className="animate-slide-up hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="w-5 h-5 text-primary" aria-hidden="true" />
                      Upload Transcript
                    </CardTitle>
                    <CardDescription>
                      Drag and drop your meeting transcript file or click to browse
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      ref={dropZoneRef}
                      className={`group relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer hover:border-primary/50 hover:bg-accent/50 hover:scale-[1.01] ${
                        isDragOver ? 'border-primary bg-accent/50 scale-[1.02] shadow-lg' : 'border-muted-foreground/25'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      role="button"
                      tabIndex={0}
                      aria-label="File upload area. Click to select a file or drag and drop."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          fileInputRef.current?.click();
                        }
                      }}
                    >
                      <div className="space-y-4">
                        <div className={`w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center transition-all duration-300 ${
                          isDragOver ? 'bg-primary/20 scale-110' : 'group-hover:bg-primary/15 group-hover:scale-105'
                        }`}>
                          <FileText className={`w-6 h-6 text-primary transition-transform duration-300 ${
                            isDragOver ? 'scale-110' : 'group-hover:scale-105'
                          }`} aria-hidden="true" />
                        </div>
                        <div>
                          <p className="text-lg font-medium">
                            {isDragOver ? 'Drop your file here!' : 'Drop your transcript file here'}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Supports .txt, .doc, .docx files up to 10MB
                          </p>
                        </div>
                        <div className="flex items-center justify-center gap-2 pt-2">
                          <span className="text-sm text-muted-foreground">or</span>
                          <Button variant="outline" size="sm" type="button" className="group-hover:border-primary/50">
                            Browse Files
                          </Button>
                        </div>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".txt,.doc,.docx"
                        onChange={handleFileUpload}
                        className="sr-only"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Separator />

                {/* Manual Input Section */}
                <Card className="animate-slide-up hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" aria-hidden="true" />
                      Meeting Transcript
                    </CardTitle>
                    <CardDescription>
                      Paste your meeting transcript or notes for summarization
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Textarea
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                        placeholder="Paste your meeting transcript here...

Example:
[09:00] John: Good morning everyone, let's start with the quarterly review...
[09:05] Sarah: The Q3 numbers look promising, revenue is up 15%...
[09:10] Mike: We need to address the customer feedback regarding..."
                        className="min-h-[300px] font-mono text-sm"
                      />
                      {transcript && (
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>
                            {transcript.length} characters • {transcript.split(' ').length} words
                          </span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setTranscript('')}
                                className="h-6 px-2 text-xs"
                              >
                                Clear
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Clear the transcript</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="generate" className="space-y-8 mt-0">
                {/* Prompt Configuration */}
                <Card className="animate-slide-up hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-primary" aria-hidden="true" />
                      Summarization Instructions
                    </CardTitle>
                    <CardDescription>
                      Customize how you want your meeting summary to be formatted
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Textarea
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="Describe how you want the summary formatted..."
                          className="min-h-[100px]"
                        />
                        <p className="text-xs text-muted-foreground">
                          Pro tip: Be specific about what sections you want (action items, decisions, participants, etc.)
                        </p>
                      </div>
                      
                      {loading && (
                        <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                            <span className="text-sm font-medium">Generating summary...</span>
                          </div>
                          <Progress value={75} className="w-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-5/6" />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            This usually takes 5-10 seconds depending on transcript length
                          </p>
                        </div>
                      )}

                      <div className="flex justify-center pt-4">
                        <Button
                          onClick={handleGenerate}
                          disabled={loading || !transcript.trim()}
                          size="lg"
                          className="min-w-[200px] bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-5 h-5 mr-2" aria-hidden="true" />
                              Generate Summary
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Summary Section */}
                {summary && (
                  <Card className="animate-slide-up hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" aria-hidden="true" />
                            Generated Summary
                          </CardTitle>
                          <CardDescription>
                            Review and edit your AI-generated summary before sharing
                          </CardDescription>
                        </div>
                        <CardAction>
                          <div className="flex items-center gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={copyToClipboard}
                                >
                                  <Copy className="w-4 h-4" aria-hidden="true" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Copy to clipboard</p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={downloadSummary}
                                >
                                  <Download className="w-4 h-4" aria-hidden="true" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Download as file</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </CardAction>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="Your AI-generated summary will appear here..."
                        className="min-h-[300px] font-mono text-sm"
                      />
                      {summary && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {summary.length} characters • {summary.split(' ').length} words
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="share" className="space-y-8 mt-0">
                {/* Email Section */}
                {summary && (
                  <Card className="animate-slide-up hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-primary" aria-hidden="true" />
                        Share Summary
                      </CardTitle>
                      <CardDescription>
                        Send your meeting summary to team members via email
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email Subject</label>
                          <Input
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Meeting Summary - [Date]"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Recipients</label>
                          <Input
                            value={emails}
                            onChange={(e) => setEmails(e.target.value)}
                            placeholder="alice@company.com, bob@company.com"
                          />
                          <p className="text-xs text-muted-foreground">
                            Separate multiple email addresses with commas
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <Button
                          onClick={handleSend}
                          disabled={sending || !summary || !emails.trim()}
                          className="min-w-[150px] bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300"
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
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </TooltipProvider>
        </div>

        {/* Status Messages */}
        {(error || ok) && (
          <div className="fixed bottom-4 right-4 z-50 max-w-md animate-slide-up">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-2 flex items-start gap-3 shadow-lg backdrop-blur-sm">
                <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-destructive">Error</p>
                  <p className="text-sm text-destructive/80">{error}</p>
                </div>
              </div>
            )}
            {ok && (
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3 shadow-lg backdrop-blur-sm">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-700 dark:text-green-400">Success</p>
                  <p className="text-sm text-green-600 dark:text-green-500">{ok}</p>
                </div>
              </div>
            )}
          </div>
        )}
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
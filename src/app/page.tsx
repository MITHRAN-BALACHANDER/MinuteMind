// 'use client';
// import { useState } from 'react';

// export default function Home() {
//   const [transcript, setTranscript] = useState('');
//   const [prompt, setPrompt] = useState('Summarize in concise bullet points. Include action items and owners.');
//   const [summary, setSummary] = useState('');
//   const [emails, setEmails] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [sending, setSending] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [ok, setOk] = useState<string | null>(null);

//   async function handleGenerate() {
//     setError(null); setOk(null); setLoading(true);
//     try {
//       const r = await fetch('/api/summarize', {
//         method: 'POST',
//         headers: {'Content-Type':'application/json'},
//         body: JSON.stringify({ transcript, prompt })
//       });
//       if (!r.ok) throw new Error(await r.text());
//       const data = await r.json();
//       setSummary(data.summary || '');
//     } catch (e: unknown) {
//       const message = e instanceof Error ? e.message : 'Unknown error';
//       setError(message);
//     } finally { setLoading(false); }
//   }

//   async function handleSend() {
//     setError(null); setOk(null); setSending(true);
//     try {
//       const r = await fetch('/api/mail', {
//         method: 'POST',
//         headers: {'Content-Type':'application/json'},
//         body: JSON.stringify({ to: emails, subject: 'Meeting Summary', html: `<pre>${summary}</pre>` })
//       });
//       if (!r.ok) throw new Error(await r.text());
//       setOk('Email sent.');
//     } catch (e: unknown) {
//       const message = e instanceof Error ? e.message : 'Unknown error';
//       setError(message);
//     } finally { setSending(false); }
//   }

//   function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
//     const f = e.target.files?.[0];
//     if (!f) return;
//     const reader = new FileReader();
//     reader.onload = () => setTranscript(String(reader.result || ''));
//     reader.readAsText(f);
//   }

//   return (
//     <main style={{maxWidth:780, margin:'40px auto', padding:16, fontFamily:'ui-sans-serif'}}>
//       <h1>AI Meeting Notes Summarizer</h1>

//       <section style={{marginTop:24}}>
//         <label>Upload transcript (.txt)</label><br/>
//         <input type="file" accept=".txt" onChange={handleFile} />
//       </section>

//       <section style={{marginTop:16}}>
//         <label>Or paste transcript</label><br/>
//         <textarea value={transcript} onChange={e=>setTranscript(e.target.value)}
//           rows={10} style={{width:'100%'}} placeholder="Paste meeting/call transcript here" />
//       </section>

//       <section style={{marginTop:16}}>
//         <label>Custom instruction/prompt</label><br/>
//         <input value={prompt} onChange={e=>setPrompt(e.target.value)} style={{width:'100%'}} />
//       </section>

//       <button onClick={handleGenerate} disabled={loading || !transcript} style={{marginTop:12}}>
//         {loading ? 'Generating…' : 'Generate Summary'}
//       </button>

//       <section style={{marginTop:16}}>
//         <label>Editable summary</label><br/>
//         <textarea value={summary} onChange={e=>setSummary(e.target.value)}
//           rows={12} style={{width:'100%'}} placeholder="Summary will appear here and is editable" />
//       </section>

//       <section style={{marginTop:16}}>
//         <label>Share via email (comma-separated)</label><br/>
//         <input value={emails} onChange={e=>setEmails(e.target.value)} style={{width:'100%'}} placeholder="alice@x.com,bob@y.com" />
//       </section>

//       <button onClick={handleSend} disabled={sending || !summary || !emails} style={{marginTop:12}}>
//         {sending ? 'Sending…' : 'Send Email'}
//       </button>

//       {error && <p style={{color:'crimson', marginTop:12}}>Error: {error}</p>}
//       {ok && <p style={{color:'green', marginTop:12}}>{ok}</p>}
//       <p style={{opacity:0.6, marginTop:20}}>Frontend kept intentionally minimal per instructions.</p>
//     </main>
//   );
// }
'use client';
import { useState } from 'react';
import { FileText, Send, Loader2, CheckCircle, AlertCircle, Upload } from 'lucide-react';

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

  async function handleGenerate() {
    setError(null); setOk(null); setLoading(true);
    try {
      const r = await fetch('/api/summarize', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ transcript, prompt })
      });
      if (!r.ok) throw new Error(await r.text());
      const data = await r.json();
      setSummary(data.summary || '');
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      setError(message);
    } finally { setLoading(false); }
  }

  async function handleSend() {
    setError(null); setOk(null); setSending(true);
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
    } finally { setSending(false); }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setTranscript(String(reader.result || ''));
    reader.readAsText(f);
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Meeting Notes Summarizer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your meeting transcripts into actionable summaries and share them instantly
          </p>
        </div>

        <div className="space-y-8">
          {/* File Upload Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Upload className="w-5 h-5 mr-2 text-gray-600" />
              Upload Transcript
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload transcript file (.txt)
                </label>
                <input 
                  type="file" 
                  accept=".txt" 
                  onChange={handleFile}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500">or</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paste transcript directly
                </label>
                <textarea 
                  value={transcript} 
                  onChange={e=>setTranscript(e.target.value)}
                  rows={8} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors"
                  placeholder="Paste your meeting or call transcript here..."
                />
              </div>
            </div>
          </div>

          {/* Prompt Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Summarization Instructions
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom prompt (how you want the summary formatted)
              </label>
              <input 
                value={prompt} 
                onChange={e=>setPrompt(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Describe how you want the summary formatted..."
              />
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex justify-center">
            <button 
              onClick={handleGenerate} 
              disabled={loading || !transcript}
              className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors min-w-[200px] justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Summary'
              )}
            </button>
          </div>

          {/* Summary Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Generated Summary
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review and edit your summary
              </label>
              <textarea 
                value={summary} 
                onChange={e=>setSummary(e.target.value)}
                rows={12} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors font-mono text-sm"
                placeholder="Your AI-generated summary will appear here and can be edited..."
              />
            </div>
          </div>

          {/* Email Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Send className="w-5 h-5 mr-2 text-gray-600" />
              Share Summary
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email subject
                </label>
                <input 
                  value={subject} 
                  onChange={e=>setSubject(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Meeting Summary - [Date]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email recipients (comma-separated)
                </label>
                <input 
                  value={emails} 
                  onChange={e=>setEmails(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="alice@company.com, bob@company.com"
                />
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={handleSend} 
                  disabled={sending || !summary || !emails}
                  className="inline-flex items-center px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors min-w-[140px] justify-center"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Email
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {(error || ok) && (
            <div className="space-y-3">
              {error && (
                <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Error</p>
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                </div>
              )}
              
              {ok && (
                <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                  <p className="text-sm font-medium text-green-800">{ok}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            Streamlined interface for efficient meeting documentation
          </p>
        </div>
      </div>
    </main>
  );
}
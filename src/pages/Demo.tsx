import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

export default function DemoPlayground() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setAnalyzing(true);
      
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = (event.target?.result as string).split(',')[1];
        
        try {
          const res = await fetch('/api/demo/resume-analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              fileName: selectedFile.name,
              fileData: base64Data,
              mimeType: selectedFile.type
            })
          });
          const data = await res.json();
          setResult(data);
          setAnalyzing(false);
        } catch (err) {
          setAnalyzing(false);
          alert("Failed to analyze resume. Please try again.");
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-sm font-mono tracking-wider">
          SYSTEM 1: LIVE DEMO
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
          Test My Production Skills
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Experience the actual platforms I build for clients. Upload a resume to see the AI Analyzer in action.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass p-8 rounded-3xl border border-white/10 flex flex-col items-center justify-center text-center min-h-[400px]"
        >
          {!file ? (
            <>
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                <Upload size={32} className="text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-2">AI Resume Analyzer</h3>
              <p className="text-gray-400 mb-8">Upload a PDF to test the ATS scoring algorithm.</p>
              
              <label className="cursor-pointer px-8 py-4 rounded-full bg-accent text-dark-bg font-bold hover:bg-white transition-colors">
                <span>Upload Resume (PDF)</span>
                <input type="file" accept=".pdf" className="hidden" onChange={handleUpload} />
              </label>
            </>
          ) : analyzing ? (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mb-6"></div>
              <h3 className="text-xl font-bold mb-2">Analyzing Resume...</h3>
              <p className="text-gray-400 font-mono text-sm">Extracting keywords via Gemini 3 Flash</p>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full">
              <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mb-6">
                <CheckCircle size={40} className="text-success" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Analysis Complete</h3>
              <p className="text-gray-400 mb-6">{file.name}</p>
              <button 
                onClick={() => { setFile(null); setResult(null); }}
                className="text-accent hover:underline text-sm"
              >
                Test another resume
              </button>
            </div>
          )}
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className={`glass p-8 rounded-3xl border border-white/10 transition-all ${!result ? 'opacity-50 grayscale' : ''}`}
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            <FileText className="mr-3 text-accent" /> ATS Results
          </h3>

          {result ? (
            <div className="space-y-6">
              <div className="flex items-end justify-between border-b border-white/10 pb-6">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Overall Score</p>
                  <div className="text-5xl font-bold text-success">{result.score}/100</div>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm mb-1">Pass Rate</p>
                  <div className="text-2xl font-bold">{result.atsPassRate}</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-3 flex items-center">
                  <AlertCircle size={16} className="mr-2 text-yellow-400" /> AI Feedback
                </h4>
                <ul className="space-y-3">
                  {result.feedback.map((item: string, i: number) => (
                    <li key={i} className="flex items-start bg-white/5 p-3 rounded-lg text-sm text-gray-300">
                      <ArrowRight size={16} className="mr-2 mt-0.5 text-accent shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="pt-4 space-y-3">
                <a 
                  href="https://www.linkedin.com/feed/?shareActive=true&url=http%3A%2F%2Flocalhost%3A5174%2Fresume%2Fshare%2Fresume_1764766477706_5j5m4aoke&shareUrl=http%3A%2F%2Flocalhost%3A5174%2Fresume%2Fshare%2Fresume_1764766477706_5j5m4aoke&linkOrigin=LI_BADGE" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full py-4 text-center rounded-xl bg-[#0A66C2] text-white hover:bg-[#004182] transition-colors font-bold flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  Share Result on LinkedIn
                </a>
                <a href="/pricing" className="block w-full py-4 text-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors font-bold">
                  Get this system for your business
                </a>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 pb-12">
              Upload a resume to see results here
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

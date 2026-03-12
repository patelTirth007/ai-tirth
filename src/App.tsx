import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import { 
  Upload, 
  FileText, 
  User, 
  LogOut, 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  Volume2, 
  Languages, 
  Info,
  ChevronRight,
  Shield,
  Heart,
  Brain,
  Stethoscope,
  MessageSquare,
  Send,
  Mic,
  MicOff,
  Sparkles,
  ArrowRight,
  Play,
  Search,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { GoogleGenAI, Modality } from "@google/genai";
import { analyzeMedicalReport, translateText, chatWithReport, transcribeAudio, ReportAnalysis } from './services/gemini';
import { cn } from './lib/utils';

// --- Components ---

const Button = ({ className, variant = 'primary', size = 'md', ...props }: any) => {
  const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-600/20',
    secondary: 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    accent: 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };
  return (
    <button 
      className={cn(
        'rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2',
        variants[variant as keyof typeof variants],
        sizes[size as keyof typeof sizes],
        className
      )}
      {...props}
    />
  );
};

const Input = ({ className, ...props }: any) => (
  <input 
    className={cn(
      'w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all bg-white/50 backdrop-blur-sm',
      className
    )}
    {...props}
  />
);

const Card = ({ children, className, delay = 0, noHover = false }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className={cn('glass rounded-3xl p-6', !noHover && 'card-3d', className)}
  >
    <div className="inner-3d h-full">
      {children}
    </div>
  </motion.div>
);

const Tooltip = ({ text, children }: { text: string, children: React.ReactNode }) => {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-block group" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <span className="border-b border-dotted border-brand-500 cursor-help text-brand-700 font-medium">{children}</span>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 glass-dark text-white text-xs rounded-xl shadow-2xl pointer-events-none"
          >
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-brand-400 shrink-0" />
              <p className="leading-relaxed">{text}</p>
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};

// --- Pages ---

const LandingPage = () => {
  return (
    <div className="min-h-screen mesh-bg overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 text-brand-700 text-sm font-bold mb-6 animate-float">
              <Sparkles className="w-4 h-4" />
              AI-Powered Health Intelligence
            </div>
            <h1 className="text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-8">
              Understand Your <span className="text-brand-600">Health</span> Like Never Before.
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
              MedSimplify AI transforms complex medical reports into clear, actionable insights. No more jargon, just clarity.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/login">
                <Button size="xl" className="group">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="secondary" size="xl">
                <Play className="w-5 h-5 fill-current" />
                Watch Demo
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-brand-500/10 blur-3xl rounded-full" />
            <Card className="relative z-10 p-2 border-none bg-white/20 shadow-none" noHover>
              <img 
                src="https://picsum.photos/seed/medical/800/600" 
                alt="Dashboard Preview" 
                className="rounded-2xl shadow-2xl border border-white/50"
                referrerPolicy="no-referrer"
              />
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-10 -right-10 glass p-4 rounded-2xl shadow-xl flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Status</p>
                  <p className="font-bold">Report Simplified</p>
                </div>
              </motion.div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4">Everything You Need</h2>
          <p className="text-slate-500">Advanced AI features to help you navigate your health journey.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Brain, title: "Smart Analysis", desc: "Deep learning models analyze every value in your report." },
            { icon: Languages, title: "Multilingual", desc: "Translate reports into 50+ languages instantly." },
            { icon: MessageSquare, title: "AI Chatbot", desc: "Ask follow-up questions about your health results." },
            { icon: Volume2, title: "Voice Assistant", desc: "Listen to your report summary on the go." },
            { icon: Shield, title: "Privacy First", desc: "Your medical data is encrypted and secure." },
            { icon: Search, title: "Search Grounding", desc: "Get real-time medical info from verified sources." },
          ].map((f, i) => (
            <Card key={i} delay={i * 0.1}>
              <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center text-brand-600 mb-4">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

const Login = ({ onLogin }: any) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (data.success) {
        onLogin(data.user || { id: data.userId, email, name });
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 mesh-bg">
      <Card className="w-full max-w-md p-10">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-brand-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-brand-600/40 rotate-12">
            <Stethoscope className="w-10 h-10 text-white -rotate-12" />
          </div>
          <h1 className="text-3xl font-black text-slate-900">Welcome Back</h1>
          <p className="text-slate-500">Sign in to access your health dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegister && (
            <Input 
              placeholder="Full Name" 
              value={name} 
              onChange={(e: any) => setName(e.target.value)} 
              required 
            />
          )}
          <Input 
            type="email" 
            placeholder="Email Address" 
            value={email} 
            onChange={(e: any) => setEmail(e.target.value)} 
            required 
          />
          <Input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e: any) => setPassword(e.target.value)} 
            required 
          />
          {error && (
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-red-500 text-sm text-center font-medium"
            >
              {error}
            </motion.p>
          )}
          <Button type="submit" className="w-full py-4 text-lg" disabled={loading}>
            {loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="text-brand-600 font-bold hover:text-brand-700 transition-colors"
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
          </button>
        </div>
      </Card>
    </div>
  );
};

const ChatBot = ({ analysis }: { analysis: ReportAnalysis }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model', parts: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', parts: userMsg }]);
    setLoading(true);

    try {
      const response = await chatWithReport(messages, userMsg, analysis.summary);
      setMessages(prev => [...prev, { role: 'model', parts: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', parts: "I'm sorry, I couldn't process that request." }]);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    // Mock recording for demo
    setTimeout(() => {
      setIsRecording(false);
      setInput("What should I eat to improve my health?");
    }, 2000);
  };

  return (
    <Card className="flex flex-col h-[500px] p-0 overflow-hidden border-none shadow-2xl">
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5" />
          </div>
          <h3 className="font-bold">Health Assistant</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] uppercase font-bold tracking-widest opacity-70">Online</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50">
            <MessageSquare className="w-12 h-12 mb-4" />
            <p className="text-sm">Ask me anything about your report results.</p>
          </div>
        )}
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "max-w-[85%] p-3 rounded-2xl text-sm",
              m.role === 'user' 
                ? "bg-brand-600 text-white ml-auto rounded-tr-none" 
                : "bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none"
            )}
          >
            <ReactMarkdown>{m.parts}</ReactMarkdown>
          </motion.div>
        ))}
        {loading && (
          <div className="flex gap-1 p-2">
            <div className="w-1.5 h-1.5 bg-brand-600 rounded-full animate-bounce" />
            <div className="w-1.5 h-1.5 bg-brand-600 rounded-full animate-bounce [animation-delay:0.2s]" />
            <div className="w-1.5 h-1.5 bg-brand-600 rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
        <Button 
          variant="ghost" 
          className={cn("p-2 shrink-0", isRecording && "text-red-500 animate-pulse")}
          onClick={startRecording}
        >
          {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </Button>
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your question..."
          className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 transition-all"
        />
        <Button className="p-2 shrink-0" onClick={handleSend} disabled={!input.trim() || loading}>
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </Card>
  );
};

const Dashboard = ({ user, onLogout }: any) => {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ReportAnalysis | null>(null);
  const [translatedAnalysis, setTranslatedAnalysis] = useState<string | null>(null);
  const [language, setLanguage] = useState('English');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'analysis' | 'chat'>('analysis');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const res = await fetch(`/api/reports/${user.id}`);
    const data = await res.json();
    setHistory(data);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setAnalyzing(true);
      setAnalysis(null);
      setTranslatedAnalysis(null);
      setAudioUrl(null);

      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const result = await analyzeMedicalReport(base64, selectedFile.type);
          setAnalysis(result);
          
          await fetch('/api/reports/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              filename: selectedFile.name,
              analysis: result
            }),
          });
          fetchHistory();
        } catch (err) {
          console.error(err);
          alert('Failed to analyze report');
        } finally {
          setAnalyzing(false);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleTranslate = async (lang: string) => {
    if (!analysis) return;
    setLanguage(lang);
    if (lang === 'English') {
      setTranslatedAnalysis(null);
      return;
    }
    setAnalyzing(true);
    try {
      const textToTranslate = `Summary: ${analysis.summary}\n\nAdvice: ${analysis.personalizedAdvice.join(', ')}`;
      const result = await translateText(textToTranslate, lang);
      setTranslatedAnalysis(result);
    } catch (err) {
      alert('Translation failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleTTS = async () => {
    if (!analysis) return;
    const text = translatedAnalysis || analysis.summary;
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-2.5-flash-preview-tts";
      const response = await ai.models.generateContent({
        model,
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        setAudioUrl(`data:audio/mp3;base64,${base64Audio}`);
      }
    } catch (err) {
      alert('Speech generation failed');
    }
  };

  const renderTextWithTooltips = (text: string) => {
    if (!analysis) return text;
    let parts: (string | React.ReactNode)[] = [text];
    
    analysis.simplifiedTerms.forEach(({ term, definition }) => {
      const newParts: (string | React.ReactNode)[] = [];
      parts.forEach(part => {
        if (typeof part === 'string') {
          const regex = new RegExp(`(${term})`, 'gi');
          const split = part.split(regex);
          split.forEach(s => {
            if (s.toLowerCase() === term.toLowerCase()) {
              newParts.push(<Tooltip text={definition} key={s + Math.random()}>{s}</Tooltip>);
            } else {
              newParts.push(s);
            }
          });
        } else {
          newParts.push(part);
        }
      });
      parts = newParts;
    });
    
    return parts;
  };

  return (
    <div className="min-h-screen bg-slate-50 mesh-bg">
      <header className="glass sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-600/20">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-black text-slate-900 hidden sm:block">MedSimplify AI</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold">{user.name}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{user.email}</p>
          </div>
          <Button variant="secondary" onClick={onLogout} className="p-2 border-none bg-white/50">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-8 text-center border-none bg-brand-600 text-white shadow-2xl shadow-brand-600/30">
            <input 
              type="file" 
              id="report-upload" 
              className="hidden" 
              onChange={handleFileUpload}
              accept=".pdf,image/*"
            />
            <label htmlFor="report-upload" className="cursor-pointer block group">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-black mb-1">New Analysis</h3>
              <p className="text-xs text-white/70">Upload PDF or Image</p>
            </label>
          </Card>

          <Card className="p-0 overflow-hidden border-none shadow-xl">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <h3 className="font-black text-xs uppercase tracking-widest flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-600" />
                History
              </h3>
            </div>
            <div className="max-h-[400px] overflow-y-auto bg-white/50">
              {history.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">
                  No reports yet
                </div>
              ) : (
                history.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => {
                      setAnalysis(JSON.parse(item.analysis));
                      setFile({ name: item.filename } as any);
                    }}
                    className="w-full p-4 text-left hover:bg-white transition-all border-b border-slate-50 last:border-0 flex items-center justify-between group"
                  >
                    <div>
                      <p className="font-bold text-sm truncate max-w-[150px]">{item.filename}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-600 transition-colors" />
                  </button>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {analysis && (
            <div className="flex gap-2 p-1 bg-white/50 backdrop-blur-sm rounded-2xl w-fit border border-white/50 shadow-sm">
              <button 
                onClick={() => setActiveTab('analysis')}
                className={cn(
                  "px-6 py-2 rounded-xl text-sm font-bold transition-all",
                  activeTab === 'analysis' ? "bg-white shadow-md text-brand-600" : "text-slate-500 hover:text-slate-700"
                )}
              >
                Analysis
              </button>
              <button 
                onClick={() => setActiveTab('chat')}
                className={cn(
                  "px-6 py-2 rounded-xl text-sm font-bold transition-all",
                  activeTab === 'chat' ? "bg-white shadow-md text-brand-600" : "text-slate-500 hover:text-slate-700"
                )}
              >
                Chat Assistant
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {analyzing ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="h-[600px] flex flex-col items-center justify-center text-center space-y-6"
              >
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin" />
                  <Brain className="w-10 h-10 text-brand-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Simplifying Your Health...</h2>
                  <p className="text-slate-500 max-w-sm mx-auto mt-2">Our AI is processing your report to give you the clearest possible insights.</p>
                </div>
              </motion.div>
            ) : analysis ? (
              activeTab === 'analysis' ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Summary Card */}
                  <Card className="relative overflow-hidden border-none shadow-2xl">
                    <div className="absolute top-0 right-0 p-4 flex gap-2">
                      <select 
                        value={language}
                        onChange={(e) => handleTranslate(e.target.value)}
                        className="text-[10px] font-bold uppercase tracking-widest bg-slate-100 border-none rounded-lg px-3 py-2 outline-none cursor-pointer hover:bg-slate-200 transition-colors"
                      >
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>Hindi</option>
                        <option>German</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center gap-2 text-brand-600 mb-6">
                      <Sparkles className="w-5 h-5" />
                      <span className="font-black uppercase tracking-[0.2em] text-[10px]">AI Insights</span>
                    </div>
                    
                    <div className="prose prose-slate max-w-none">
                      <p className="text-xl leading-relaxed text-slate-800 font-medium">
                        {translatedAnalysis ? translatedAnalysis : renderTextWithTooltips(analysis.summary)}
                      </p>
                    </div>
                  </Card>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="flex flex-col items-center justify-center text-center p-10 border-none shadow-xl">
                      <div className="relative w-40 h-40 mb-6">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle className="text-slate-100 stroke-current" strokeWidth="8" fill="transparent" r="42" cx="50" cy="50" />
                          <motion.circle 
                            className={cn(
                              "stroke-current",
                              analysis.riskScore < 30 ? "text-green-500" : analysis.riskScore < 70 ? "text-amber-500" : "text-red-500"
                            )}
                            strokeWidth="8" 
                            strokeLinecap="round" 
                            fill="transparent" 
                            r="42" cx="50" cy="50" 
                            initial={{ strokeDasharray: "0 264" }}
                            animate={{ strokeDasharray: `${(analysis.riskScore / 100) * 264} 264` }}
                            transition={{ duration: 2, ease: "circOut" }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-4xl font-black">{analysis.riskScore}</span>
                          <span className="text-[10px] uppercase text-slate-400 font-black tracking-widest">Risk Index</span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">{analysis.riskExplanation}</p>
                    </Card>

                    <Card className="p-8 border-none shadow-xl">
                      <h3 className="font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Heart className="w-4 h-4 text-red-500" />
                        Health Recommendations
                      </h3>
                      <ul className="space-y-4">
                        {analysis.personalizedAdvice.map((advice, i) => (
                          <motion.li 
                            key={i} 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex gap-4 text-sm text-slate-600 bg-white/50 p-3 rounded-xl border border-white/50"
                          >
                            <div className="w-5 h-5 bg-brand-100 rounded-full flex items-center justify-center shrink-0">
                              <CheckCircle className="w-3 h-3 text-brand-600" />
                            </div>
                            {advice}
                          </motion.li>
                        ))}
                      </ul>
                    </Card>
                  </div>

                  {/* Abnormal Values */}
                  <Card className="border-none shadow-xl">
                    <h3 className="font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                      Critical Observations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {analysis.abnormalValues.length === 0 ? (
                        <div className="col-span-2 p-8 bg-green-50/50 rounded-2xl text-green-700 text-sm font-bold flex flex-col items-center gap-3 border border-green-100">
                          <CheckCircle className="w-10 h-10" />
                          All values appear to be within normal ranges.
                        </div>
                      ) : (
                        analysis.abnormalValues.map((val, i) => (
                          <motion.div 
                            key={i} 
                            whileHover={{ scale: 1.02 }}
                            className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <span className="font-black text-slate-900">{val.parameter}</span>
                              <span className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                val.severity === 'high' ? "bg-red-100 text-red-600" : 
                                val.severity === 'medium' ? "bg-amber-100 text-amber-600" : 
                                "bg-blue-100 text-blue-600"
                              )}>
                                {val.severity}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-6 mb-4">
                              <div className="bg-slate-50 p-3 rounded-xl">
                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Result</p>
                                <p className="text-lg font-black text-red-500">{val.value}</p>
                              </div>
                              <div className="bg-slate-50 p-3 rounded-xl">
                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Reference</p>
                                <p className="text-lg font-bold text-slate-700">{val.referenceRange}</p>
                              </div>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed italic mb-4">{val.explanation}</p>
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              className="w-full text-[10px] font-black uppercase tracking-widest"
                              onClick={() => window.open(`https://www.google.com/search?q=${val.parameter}+medical+meaning`, '_blank')}
                            >
                              <Search className="w-3 h-3" />
                              Search More Info
                            </Button>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </Card>

                  <div className="flex items-center justify-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] py-12">
                    <Shield className="w-4 h-4" />
                    <span>Secure AI Analysis • Medical Disclaimer Applies</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <ChatBot analysis={analysis} />
                </motion.div>
              )
            ) : (
              <div className="h-[600px] flex flex-col items-center justify-center text-center space-y-8">
                <div className="relative">
                  <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center rotate-12 animate-float">
                    <FileText className="w-16 h-16 text-brand-100 -rotate-12" />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                    <Plus className="w-6 h-6" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h2 className="text-3xl font-black text-slate-900">Ready to Simplify?</h2>
                  <p className="text-slate-500 max-w-sm mx-auto">Upload your medical report and let our AI handle the complexity for you.</p>
                </div>
                <Button size="xl" onClick={() => document.getElementById('report-upload')?.click()}>
                  Upload Report Now
                </Button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('medsimplify_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('medsimplify_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('medsimplify_user');
  };

  if (loading) return null;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
        />
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

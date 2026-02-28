import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Check, ArrowRight } from 'lucide-react';

const ADDONS = [
  { id: 'MERN Fullstack', price: 25000, days: 5, desc: 'React 19 + Node 22 + MongoDB' },
  { id: 'AI Matching', price: 15000, days: 3, desc: 'OpenAI/Groq Integration' },
  { id: 'Admin Dashboard', price: 12000, days: 4, desc: 'Full CRUD + Analytics' },
  { id: 'PWA Mobile', price: 8000, days: 2, desc: 'Installable mobile app' },
  { id: 'Kathmandu Geo', price: 5000, days: 1, desc: 'Geo-spatial search' },
];

export default function Pricing() {
  const [projectType, setProjectType] = useState('SaaS');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [quote, setQuote] = useState<{ totalPrice: number, timelineDays: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const calculateQuote = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pricing/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectType, features: selectedAddons })
      });
      const data = await res.json();
      setQuote(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getWhatsAppLink = () => {
    if (!quote) return '#';
    const text = `Hi SudipRo, I'm interested in building a ${projectType} project with: ${selectedAddons.join(', ')}. The estimated quote is NPR ${quote.totalPrice.toLocaleString()} (${quote.timelineDays} days). Let's discuss!`;
    return `https://wa.me/9779800000000?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-sm font-mono tracking-wider">
          SYSTEM 2: DYNAMIC PRICING
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
          Transparent Project Quotes
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Select your project type and features to get an instant estimate. No hidden fees.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Project Type */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass p-8 rounded-3xl border border-white/10">
            <h3 className="text-xl font-bold mb-6">1. Select Project Type</h3>
            <div className="grid grid-cols-2 gap-4">
              {['SaaS', 'E-commerce', 'Portfolio', 'Custom API'].map(type => (
                <button
                  key={type}
                  onClick={() => setProjectType(type)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    projectType === type 
                      ? 'border-accent bg-accent/10 text-white' 
                      : 'border-white/10 text-gray-400 hover:border-white/30'
                  }`}
                >
                  <div className="font-bold">{type}</div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Addons */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass p-8 rounded-3xl border border-white/10">
            <h3 className="text-xl font-bold mb-6">2. Select Features</h3>
            <div className="space-y-3">
              {ADDONS.map(addon => (
                <button
                  key={addon.id}
                  onClick={() => toggleAddon(addon.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                    selectedAddons.includes(addon.id)
                      ? 'border-accent bg-accent/5'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center text-left">
                    <div className={`w-6 h-6 rounded flex items-center justify-center mr-4 border ${selectedAddons.includes(addon.id) ? 'bg-accent border-accent text-dark-bg' : 'border-gray-500'}`}>
                      {selectedAddons.includes(addon.id) && <Check size={16} />}
                    </div>
                    <div>
                      <div className="font-bold text-white">{addon.id}</div>
                      <div className="text-sm text-gray-400">{addon.desc}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-accent">+NPR {addon.price.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">+{addon.days} days</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quote Summary */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <div className="glass p-8 rounded-3xl border border-white/10 sticky top-24">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
              <Calculator size={32} className="text-accent" />
            </div>
            <h3 className="text-2xl font-bold mb-6">Your Estimate</h3>
            
            <button 
              onClick={calculateQuote}
              disabled={loading}
              className="w-full py-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors font-bold mb-8"
            >
              {loading ? 'Calculating...' : 'Calculate Quote'}
            </button>

            {quote && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 border-t border-white/10 pt-6">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Estimated Cost</p>
                  <div className="text-4xl font-bold text-success">
                    NPR {quote.totalPrice.toLocaleString()}
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Estimated Timeline</p>
                  <div className="text-2xl font-bold">
                    {quote.timelineDays} Days
                  </div>
                </div>

                <a 
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 w-full py-4 rounded-xl bg-accent text-dark-bg font-bold hover:bg-white transition-colors mt-4"
                >
                  <span>Send via WhatsApp</span>
                  <ArrowRight size={20} />
                </a>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

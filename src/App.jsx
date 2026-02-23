import React, { useState, useEffect } from 'react';
import { Dumbbell, Shield, Skull, Pizza, Trophy, Swords, Scroll, Crown, Briefcase, MessageSquare, User, Home, Plus, X, Calendar as CalIcon, Send, Loader2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// --- 0. INITIALIZE CLOUD CONNECTIONS ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- 1. IMPORT LOCAL ASSETS ---
import kratosImg from './assets/kratos-hero.png';
import batmanImg from './assets/batman-hero.png';
import supermanImg from './assets/superman-hero.png';
import ironmanImg from './assets/ironman-hero.png';
import spidermanImg from './assets/spiderman-hero.png';
import vitoImg from './assets/vito-hero.png';
import michaelImg from './assets/michael-hero.png';
import tommyImg from './assets/tommy-hero.png';

// --- 2. LORE DATA & AUDIO ENGINE ---
const HEROES = {
  Kratos: { franchise: 'God of War', image: kratosImg, glow: 'rgba(220,38,38,0.6)' }, 
  Batman: { franchise: 'DC', image: batmanImg, glow: 'rgba(250,204,21,0.6)' }, 
  Superman: { franchise: 'DC', image: supermanImg, glow: 'rgba(37,99,235,0.6)' }, 
  IronMan: { franchise: 'Marvel', image: ironmanImg, glow: 'rgba(220,38,38,0.6)' }, 
  SpiderMan: { franchise: 'Marvel', image: spidermanImg, glow: 'rgba(37,99,235,0.6)' },
  Vito: { franchise: 'Godfather', image: vitoImg, glow: 'rgba(180,83,9,0.6)' }, 
  Michael: { franchise: 'Godfather', image: michaelImg, glow: 'rgba(255,255,255,0.4)' },
  Tommy: { franchise: 'Vice City', image: tommyImg, glow: 'rgba(236,72,153,0.6)' } 
};

const COMPANIONS = {
  'God of War': { name: 'Mimir', icon: '🗣️', color: 'text-cyan-400', bg: 'bg-cyan-950/40', border: 'border-cyan-500/50' },
  'DC': { name: 'Alfred', icon: '🤵‍♂️', color: 'text-gray-300', bg: 'bg-gray-800/40', border: 'border-gray-500/50' },
  'Marvel': { name: 'Nick Fury', icon: '👁️‍🗨️', color: 'text-purple-400', bg: 'bg-purple-950/40', border: 'border-purple-500/50' },
  'Godfather': { name: 'Consigliere', icon: '💼', color: 'text-amber-500', bg: 'bg-amber-950/40', border: 'border-amber-700/50' },
  'Vice City': { name: 'Ken Rosenberg', icon: '🌴', color: 'text-pink-400', bg: 'bg-pink-950/40', border: 'border-pink-500/50' }
};

const LOOT_ROADMAP = [ { level: 1, item: 'Innate Might (Fists)' }, { level: 5, item: 'Franchise Weapon' }, { level: 10, item: 'Divine Artifact' } ];
const LOOT_TABLE = {
  'God of War': { 'bench': 'Leviathan Axe', 'squat': 'Blades of Chaos', 'deadlift': 'Draupnir Spear' },
  'DC': { 'bench': 'Batarang Arsenal', 'squat': 'Kryptonite Ring', 'deadlift': 'Lasso of Truth' },
  'Marvel': { 'bench': 'Vibranium Shield', 'squat': 'Mjolnir', 'deadlift': 'Infinity Gauntlet' },
  'Godfather': { 'bench': 'Tommy Gun', 'squat': 'Bespoke Silk Suit', 'deadlift': 'The Don\'s Ring' },
  'Vice City': { 'bench': 'Machete', 'squat': 'Chainsaw', 'deadlift': 'Vercetti Estate Keys' }
};

// Web Audio API to synthesize sounds on the fly (No downloads needed)
const playWorkoutFX = (franchise) => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  if (franchise === 'Godfather' || franchise === 'Vice City') {
    // Subtle, sharp mafia flick/coin sound
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1500, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(3000, audioCtx.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
  } else {
    // Cinematic, heavy hero Bass Drop/Boom
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.6);
    gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.7);
  }
};

const ImageAvatar = ({ heroName, size = 80 }) => {
  const hero = HEROES[heroName] || HEROES['Kratos'];
  return (
    <div className="animate-idle transition-transform duration-300 hover:scale-110 flex justify-center items-center" style={{ filter: `drop-shadow(0px 0px 15px ${hero.glow})` }}>
      <img src={hero.image} alt={heroName} style={{ width: size, height: size, objectFit: 'contain' }} className="rounded-lg opacity-90" />
    </div>
  );
};

// --- 3. CLOUD GAME ENGINE ---
const useHero = () => {
  const [registry, setRegistry] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [aiPopup, setAiPopup] = useState(null);
  const [isDbLoading, setIsDbLoading] = useState(true);
  const [isScreenShaking, setIsScreenShaking] = useState(false); // New FX State

  const fetchLeaderboard = async () => {
    const { data } = await supabase.from('syndicate_registry').select('username, hero_data');
    if (data) setRegistry(data.map(d => ({ username: d.username, ...d.hero_data })));
    setIsDbLoading(false);
  };

  useEffect(() => { fetchLeaderboard(); }, []);

  const triggerAiPopup = (franchise, message) => {
    setAiPopup({ franchise, message });
    setTimeout(() => setAiPopup(null), 5000); 
  };

  const loginUser = async (username, password) => {
    const { data, error } = await supabase.from('syndicate_registry').select('*').eq('username', username).single();
    if (error || !data) return { success: false, error: "Identity not found in the realm." };
    if (data.password !== password) return { success: false, error: "Incorrect passcode." };
    setCurrentUser({ username: data.username, ...data.hero_data });
    return { success: true };
  };

  const registerUser = async (username, password, heroName, franchise) => {
    const { data: existing } = await supabase.from('syndicate_registry').select('username').eq('username', username).single();
    if (existing) return { success: false, error: "Alias already claimed." };

    const newHeroData = { heroName, franchise, xp: 0, level: 1, prs: {}, inventory: [], bio: "A new legend begins.", workouts: [], meals: [], cheatMeals: [] };
    const { error } = await supabase.from('syndicate_registry').insert([{ username, password, hero_data: newHeroData }]);
    if (error) return { success: false, error: "The database rejected your entry." };
    
    setCurrentUser({ username, ...newHeroData });
    fetchLeaderboard();
    return { success: true };
  };

  const updateUserState = async (updates) => {
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser); 
    const { username, ...hero_data } = updatedUser;
    await supabase.from('syndicate_registry').update({ hero_data }).eq('username', username);
    fetchLeaderboard(); 
  };

  const logFullWorkout = (date, split, exercises) => {
    let totalXpGained = 0;
    let newPrs = { ...currentUser.prs };
    let unlockedItems = [];
    let newInventory = [...(currentUser.inventory || [])];

    exercises.forEach(ex => {
      const xp = (ex.weight * ex.reps * ex.sets) / 10;
      totalXpGained += xp;
      const prevWeight = newPrs[ex.name] || 0;
      if (ex.weight > prevWeight) {
        newPrs[ex.name] = ex.weight;
        const normalizedEx = ex.name.toLowerCase().trim();
        const possibleItem = LOOT_TABLE[currentUser.franchise]?.[normalizedEx];
        if (possibleItem && !newInventory.includes(possibleItem)) {
          newInventory.push(possibleItem);
          unlockedItems.push(possibleItem);
        }
      }
    });

    const newXp = currentUser.xp + totalXpGained;
    const newLevel = Math.floor(Math.sqrt(newXp) / 5) + 1;
    const newWorkoutLog = { id: Date.now(), date, split, exercises, xp: totalXpGained };
    
    updateUserState({ xp: newXp, level: newLevel, prs: newPrs, inventory: newInventory, workouts: [newWorkoutLog, ...(currentUser.workouts || [])] });
    
    // TRIGGER SCREEN SHAKE AND AUDIO
    playWorkoutFX(currentUser.franchise);
    setIsScreenShaking(true);
    setTimeout(() => setIsScreenShaking(false), 500);

    let popupMsg = `The conquest advances! +${totalXpGained.toFixed(0)} XP.`;
    if (unlockedItems.length > 0) popupMsg = `Magnificent! You unlocked the ${unlockedItems.join(', ')}!`;
    triggerAiPopup(currentUser.franchise, popupMsg);
  };

  const logMeal = (foodName, protein, isCheat) => {
    const newMeal = { id: Date.now(), foodName, protein, isCheat, date: new Date().toLocaleDateString() };
    updateUserState({ meals: [newMeal, ...(currentUser.meals || [])] });
    triggerAiPopup(currentUser.franchise, `Fuel secured: ${protein}g of protein added to the engine.`);
  };

  const updateBio = (newBio) => updateUserState({ bio: newBio });
  return { currentUser, registry, isDbLoading, loginUser, registerUser, logFullWorkout, logMeal, updateBio, aiPopup, isScreenShaking };
};

// --- 4. UI COMPONENTS ---

const DashboardTab = ({ user, registry }) => {
  // Generate the exact dates for the last 14 days
  const today = new Date();
  const last14Days = Array.from({length: 14}).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (13 - i));
    return d.toISOString().split('T')[0];
  });

  return (
    <div className="space-y-6 animate-fade-in pb-24 md:pb-6 pt-4">
      <div className="glass-card p-6 md:p-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-widest">{user.username}</h2>
          <p className="text-indigo-400 font-bold text-sm md:text-lg tracking-widest uppercase mt-2">Level {user.level} • {Math.floor(user.xp)} XP</p>
        </div>
        <ImageAvatar heroName={user.heroName} size={80} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold uppercase text-white mb-4 flex items-center gap-2 tracking-widest border-b border-white/10 pb-2"><CalIcon size={18} className="text-indigo-400"/> Conquest Calendar</h3>
          <div className="grid grid-cols-7 gap-2">
            {last14Days.map(dateStr => {
              // Check if user has a workout on this specific date
              const hasWorkout = user.workouts?.some(w => w.date === dateStr);
              return (
                <div key={dateStr} title={dateStr} className={`h-8 md:h-12 rounded transition-all duration-500 ${hasWorkout ? 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)] border border-indigo-400' : 'bg-black/40 border border-white/5'}`}></div>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center uppercase tracking-widest">Consistency Matrix (14 Days)</p>
        </div>

        <div className="glass-card p-6 flex flex-col">
           <h2 className="text-lg font-bold uppercase text-yellow-500 flex gap-2 border-b border-white/10 pb-2 mb-4"><Crown size={20} /> Global Leaderboard</h2>
           <div className="space-y-2 overflow-y-auto max-h-[200px] hide-scrollbar">
             {[...registry].sort((a, b) => b.xp - a.xp).map((u, index) => (
               <div key={u.username} className={`flex justify-between p-3 rounded ${u.username === user.username ? 'bg-white/10 border border-white/20' : 'bg-black/30'}`}>
                 <p className="font-bold text-white">#{index + 1} {u.username} <span className="text-xs text-gray-400">({u.heroName})</span></p>
                 <p className="font-bold text-indigo-400">{Math.floor(u.xp)} XP</p>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

// ... FoodTab, ProfileTab, and WorkoutModal remain EXACTLY the same ...
const FoodTab = ({ user, logMeal }) => {
  const [food, setFood] = useState('');
  const [protein, setProtein] = useState('');
  return (
    <div className="space-y-6 animate-fade-in pb-24 pt-4 md:pb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 md:p-8 border-emerald-500/20">
          <h2 className="text-xl font-bold uppercase text-emerald-400 mb-6 flex items-center gap-2 tracking-widest border-b border-emerald-500/20 pb-2"><Pizza size={20}/> Fuel the Engine</h2>
          <form onSubmit={(e) => { e.preventDefault(); logMeal(food, protein, false); setFood(''); setProtein(''); }} className="space-y-4">
            <div><label className="text-xs text-emerald-500/70 uppercase tracking-widest mb-1 block">Ration Description</label><input placeholder="E.g. Chicken Smash Burger" required value={food} onChange={e=>setFood(e.target.value)} className="w-full bg-black/50 border border-emerald-900/50 rounded p-4 text-white focus:border-emerald-500 outline-none transition" /></div>
            <div><label className="text-xs text-emerald-500/70 uppercase tracking-widest mb-1 block">Protein Content</label><input type="number" placeholder="Protein (g)" required value={protein} onChange={e=>setProtein(e.target.value)} className="w-full bg-black/50 border border-emerald-900/50 rounded p-4 text-white focus:border-emerald-500 outline-none transition" /></div>
            <button type="submit" className="w-full py-4 mt-4 bg-emerald-700 hover:bg-emerald-600 font-black uppercase tracking-widest rounded text-white transition shadow-[0_0_15px_rgba(16,185,129,0.3)]">Log Nutrition</button>
          </form>
        </div>
        <div className="glass-card p-6 md:p-8">
          <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest border-b border-white/10 pb-2">Recent Rations</h3>
          <ul className="space-y-3 overflow-y-auto max-h-[400px] hide-scrollbar">
            {(user.meals || []).map((m, i) => (<li key={i} className="flex justify-between items-center bg-black/40 p-4 rounded border border-white/5 hover:border-emerald-500/30 transition"><span className="text-gray-300 font-medium">{m.foodName}</span><span className="text-emerald-400 font-black tracking-wider">{m.protein}g PRO</span></li>))}
            {(!user.meals || user.meals.length === 0) && <p className="text-gray-600 text-sm italic">No meals logged yet.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
};

const ProfileTab = ({ user, updateBio }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [bioText, setBioText] = useState(user.bio);
  return (
    <div className="space-y-6 animate-fade-in pb-24 pt-4 md:pb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-8 text-center flex flex-col items-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-32 md:h-48 bg-gradient-to-b from-indigo-900/40 to-transparent"></div>
           <div className="z-10 mt-4 md:mt-12"><ImageAvatar heroName={user.heroName} size={140} /></div>
           <h2 className="text-3xl md:text-4xl font-black uppercase text-white mt-6 tracking-widest z-10">{user.username}</h2>
           <p className="text-indigo-400 font-bold mb-6 uppercase tracking-widest text-sm z-10">Level {user.level} {user.franchise} Warrior</p>
           {isEditing ? (
             <div className="w-full max-w-sm flex gap-2 z-10"><input value={bioText} onChange={e=>setBioText(e.target.value)} className="flex-1 bg-black/50 border border-indigo-500/50 rounded p-3 text-white text-sm text-center outline-none" /><button onClick={()=>{updateBio(bioText); setIsEditing(false);}} className="bg-indigo-600 px-6 font-bold uppercase tracking-widest rounded text-white text-xs transition hover:bg-indigo-500">Save</button></div>
           ) : (<p className="text-gray-300 italic text-sm cursor-pointer hover:text-white z-10 bg-black/30 p-4 rounded-lg border border-white/10 w-full max-w-sm transition" onClick={()=>setIsEditing(true)}>"{user.bio}" <span className="text-xs text-indigo-400 ml-2">Edit</span></p>)}
        </div>
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold uppercase text-emerald-400 mb-6 flex items-center gap-2 tracking-widest border-b border-white/10 pb-2"><Briefcase size={18}/> Arsenal Stash</h3>
            {(!user.inventory || user.inventory.length === 0) ? (<p className="text-sm text-gray-500 italic">Hit a PR on core lifts to unlock loot.</p>) : (
              <ul className="space-y-3">{user.inventory.map((item, i) => (<li key={i} className="flex items-center gap-3 p-3 bg-black/40 border border-white/5 rounded"><span className="text-emerald-500"><Swords size={16}/></span><span className="text-sm text-emerald-100 font-bold tracking-wider uppercase">{item}</span></li>))}</ul>
            )}
          </div>
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold uppercase text-white mb-6 flex items-center gap-2 tracking-widest border-b border-white/10 pb-2">Loot Roadmap</h3>
            <div className="relative border-l-2 border-indigo-900 ml-4 space-y-8">
              {LOOT_ROADMAP.map((tier, i) => (
                <div key={i} className="pl-8 relative">
                  <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 border-[#0a0a0a] ${user.level >= tier.level ? 'bg-indigo-500 shadow-[0_0_15px_#6366f1]' : 'bg-gray-800'}`}></div>
                  <p className={`font-black uppercase tracking-widest text-sm mb-1 ${user.level >= tier.level ? 'text-white' : 'text-gray-600'}`}>Level {tier.level}</p>
                  <p className={`text-sm ${user.level >= tier.level ? 'text-indigo-300 font-medium' : 'text-gray-700'}`}>{tier.item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatTab = ({ user }) => {
  const companion = COMPANIONS[user.franchise] || COMPANIONS['God of War'];
  const [messages, setMessages] = useState([{ sender: 'ai', text: `I am here. Speak your mind.` }]);
  const [input, setInput] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }, { sender: 'ai', text: '...' }]);

    try {
      const systemPrompt = `You are ${companion.name} from the ${user.franchise} universe. You are an AI companion for a fitness app. The user trains with brutal, high-intensity methodology. Keep your response to exactly one short, punchy, in-character sentence. Do not use emojis or hashtags.`;
      const chatHistory = messages.filter(m => m.text !== '...').map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }));

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ model: "llama3-8b-8192", messages: [{ role: "system", content: systemPrompt }, ...chatHistory, { role: "user", content: userText }], temperature: 0.7, max_tokens: 100 })
      });

      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      const aiResponse = data.choices[0].message.content.replace(/"/g, ''); 

      setMessages(prev => { const newMsgs = [...prev]; newMsgs[newMsgs.length - 1] = { sender: 'ai', text: aiResponse }; return newMsgs; });
    } catch (error) {
      setMessages(prev => { const newMsgs = [...prev]; newMsgs[newMsgs.length - 1] = { sender: 'ai', text: "The comms channel is experiencing interference... check your API key." }; return newMsgs; });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] md:h-[calc(100vh-40px)] animate-fade-in glass-card overflow-hidden mt-4 md:mt-0">
      <div className={`p-6 border-b flex items-center gap-4 ${companion.bg} ${companion.border}`}>
        <span className="text-4xl bg-black/50 p-3 rounded-full border border-white/10">{companion.icon}</span>
        <div><h2 className={`font-black uppercase tracking-widest text-xl ${companion.color}`}>{companion.name}</h2><p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Secure Comms Channel</p></div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar pb-24 md:pb-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] md:max-w-[60%] p-4 rounded-2xl text-sm md:text-base shadow-lg ${m.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-[#1a1a1a] text-gray-200 border border-white/10 rounded-bl-none font-serif italic'}`}>{m.text}</div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-black/40 border-t border-white/5 absolute bottom-0 w-full md:relative md:bg-transparent">
        <form onSubmit={handleSend} className="max-w-3xl mx-auto bg-black/80 backdrop-blur-md border border-white/10 rounded-full p-2 flex gap-2 shadow-2xl">
          <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Consult the AI..." className="flex-1 bg-transparent px-6 text-white text-base focus:outline-none placeholder-gray-500" />
          <button type="submit" className="p-4 bg-indigo-600 rounded-full text-white hover:bg-indigo-500 transition shadow-[0_0_10px_rgba(79,70,229,0.5)]"><Send size={20}/></button>
        </form>
      </div>
    </div>
  );
};

const WorkoutModal = ({ isOpen, onClose, logWorkout }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [split, setSplit] = useState('Blood & Guts (HIT)');
  const [exercises, setExercises] = useState([{ name: '', weight: '', reps: '', sets: '' }]);

  if (!isOpen) return null;

  const handleUpdateRow = (index, field, value) => { const newEx = [...exercises]; newEx[index][field] = value; setExercises(newEx); };
  const handleSubmit = (e) => { e.preventDefault(); logWorkout(date, split, exercises); onClose(); setExercises([{ name: '', weight: '', reps: '', sets: '' }]); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-[#0f0f0f] border border-indigo-500/30 w-full max-w-lg md:max-w-2xl rounded-xl shadow-[0_0_40px_rgba(79,70,229,0.2)] overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-black/50"><h2 className="text-xl md:text-2xl font-black uppercase text-indigo-400 tracking-widest flex items-center gap-2"><Dumbbell size={24}/> Log Conquest</h2><button onClick={onClose} className="text-gray-400 hover:text-white transition"><X size={28}/></button></div>
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 hide-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">Date</label><input type="date" required value={date} onChange={(e)=>setDate(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-4 text-white focus:border-indigo-500 outline-none transition" /></div>
            <div><label className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">Split</label><select value={split} onChange={(e)=>setSplit(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-4 text-white focus:border-indigo-500 outline-none transition"><option>Blood & Guts (HIT)</option><option>Push/Pull/Legs</option><option>Upper/Lower</option><option>Full Body</option></select></div>
          </div>
          <div className="space-y-4">
            <label className="text-xs text-gray-400 uppercase tracking-widest block">Exercises</label>
            {exercises.map((ex, i) => (
              <div key={i} className="flex flex-col md:flex-row gap-2 items-center bg-white/5 md:bg-transparent p-3 md:p-0 rounded-lg">
                <input placeholder="Movement" required value={ex.name} onChange={(e)=>handleUpdateRow(i, 'name', e.target.value)} className="w-full md:flex-2 bg-black/50 border border-white/10 rounded p-3 text-white focus:border-indigo-500 outline-none" />
                <div className="w-full flex gap-2"><input type="number" placeholder="Kg" required value={ex.weight} onChange={(e)=>handleUpdateRow(i, 'weight', e.target.value)} className="flex-1 bg-black/50 border border-white/10 rounded p-3 text-white focus:border-indigo-500 outline-none" /><input type="number" placeholder="Reps" required value={ex.reps} onChange={(e)=>handleUpdateRow(i, 'reps', e.target.value)} className="flex-1 bg-black/50 border border-white/10 rounded p-3 text-white focus:border-indigo-500 outline-none" /><input type="number" placeholder="Sets" required value={ex.sets} onChange={(e)=>handleUpdateRow(i, 'sets', e.target.value)} className="flex-1 bg-black/50 border border-white/10 rounded p-3 text-white focus:border-indigo-500 outline-none" /></div>
              </div>
            ))}
            <button type="button" onClick={()=>setExercises([...exercises, { name: '', weight: '', reps: '', sets: '' }])} className="text-sm font-bold uppercase tracking-widest text-indigo-400 flex items-center justify-center gap-2 hover:text-indigo-300 mt-4 bg-indigo-900/30 w-full md:w-auto px-6 py-3 rounded-lg transition"><Plus size={16}/> Add Movement</button>
          </div>
        </form>
        <div className="p-6 border-t border-white/10 bg-black/50"><button onClick={handleSubmit} className="w-full py-4 bg-indigo-600 text-white font-black uppercase tracking-widest rounded-lg hover:bg-indigo-500 transition shadow-[0_0_15px_rgba(79,70,229,0.4)]">Commit to Iron</button></div>
      </div>
    </div>
  );
};

// --- 5. AUTHENTICATION UI ---
const DndLogin = ({ engine }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [heroName, setHeroName] = useState('Vito');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    let res = isRegistering ? await engine.registerUser(username, password, heroName, HEROES[heroName].franchise) : await engine.loginUser(username, password);
    if (!res.success) setError(res.error);
    setIsLoading(false);
  };

  if (engine.isDbLoading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><Loader2 className="animate-spin text-amber-500" size={48} /></div>;

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]">
      <div className="border border-amber-900/50 bg-[#0a0503]/95 backdrop-blur-md p-8 md:p-12 w-full max-w-md md:max-w-lg text-center shadow-[0_0_40px_rgba(180,83,9,0.15)] rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent"></div>
        <Scroll size={56} className="mx-auto text-amber-600 mb-6 drop-shadow-[0_0_10px_rgba(217,119,6,0.8)]" />
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-widest text-amber-500 mb-2 font-serif">The Syndicate</h1>
        <p className="text-amber-900/80 font-serif italic mb-8 md:text-lg">Swear your blood oath.</p>
        {error && <p className="text-red-500 text-sm mb-4 font-bold animate-pulse">{error}</p>}
        <form onSubmit={handleAuth} className="space-y-4">
          <input type="text" required placeholder="Alias (Username)" className="w-full bg-black/60 border border-amber-900/50 p-4 text-amber-100 rounded-lg outline-none focus:border-amber-500 transition" onChange={(e) => setUsername(e.target.value)} />
          <input type="password" required placeholder="Passcode" className="w-full bg-black/60 border border-amber-900/50 p-4 text-amber-100 rounded-lg outline-none focus:border-amber-500 transition" onChange={(e) => setPassword(e.target.value)} />
          {isRegistering && (
            <div className="pt-4 text-left">
              <label className="block text-amber-700 text-xs font-black uppercase tracking-widest mb-3">Select Identity</label>
              <select className="w-full bg-black/60 border border-amber-900/50 p-4 text-amber-100 rounded-lg outline-none focus:border-amber-500 transition appearance-none" onChange={(e) => setHeroName(e.target.value)} value={heroName}>
                {Object.keys(HEROES).map(name => <option key={name} value={name}>{name} ({HEROES[name].franchise})</option>)}
              </select>
              <div className="flex justify-center mt-6 p-6 border border-amber-900/30 bg-black/40 rounded-xl"><ImageAvatar heroName={heroName} size={100} /></div>
            </div>
          )}
          <button type="submit" disabled={isLoading} className="w-full py-4 mt-6 bg-gradient-to-r from-amber-800 to-amber-600 text-black font-black uppercase tracking-widest hover:from-amber-700 hover:to-amber-500 transition rounded-lg shadow-[0_0_15px_rgba(217,119,6,0.4)] md:text-lg flex justify-center items-center gap-2 disabled:opacity-50">
            {isLoading ? <Loader2 className="animate-spin" size={20}/> : (isRegistering ? 'Forge Legacy' : 'Enter Realm')}
          </button>
        </form>
        <button onClick={() => { setIsRegistering(!isRegistering); setError(''); }} className="mt-8 text-amber-700 hover:text-amber-500 text-sm underline font-serif transition">{isRegistering ? 'Already in the family? Login.' : 'New to town? Register.'}</button>
      </div>
    </div>
  );
};

// --- 6. ROOT APP ---
export default function App() {
  const engine = useHero();
  const [activeTab, setActiveTab] = useState('home');
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);

  if (!engine.currentUser) return <DndLogin engine={engine} />;

  return (
    // NOTE: Added the dynamic `animate-shake` class and a red flash if `engine.isScreenShaking` is true
    <div className={`min-h-screen ${engine.isScreenShaking ? 'bg-red-950/40 animate-shake' : 'bg-[#050505]'} text-gray-100 font-sans flex overflow-hidden transition-colors duration-100`}>
      <style>{`
        .glass-card { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 1.5rem; } 
        .hide-scrollbar::-webkit-scrollbar { display: none; } 
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } 
        .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; } 
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } } 
        @keyframes slideDown { from { opacity: 0; transform: translate(-50%, -20px); } to { opacity: 1; transform: translate(-50%, 0); } } 
        .animate-slide-down { animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        /* The Earthquake / Camera Shake Animation */
        @keyframes shake { 
          0%, 100% { transform: translate(0, 0) rotate(0deg); } 
          20% { transform: translate(-4px, 4px) rotate(-1deg); } 
          40% { transform: translate(4px, -4px) rotate(1deg); } 
          60% { transform: translate(-4px, -4px) rotate(-1deg); } 
          80% { transform: translate(4px, 4px) rotate(1deg); } 
        } 
        .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
      `}</style>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/10 bg-[#0a0a0a] z-40 p-4">
        <div className="flex items-center gap-3 mb-10 px-2 mt-4"><Crown className="text-amber-500" size={28}/><h1 className="font-serif font-black text-xl tracking-widest text-amber-500">SYNDICATE</h1></div>
        <nav className="flex-1 space-y-4">
          <button onClick={() => setActiveTab('home')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${activeTab === 'home' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}><Home size={20} /> <span className="font-bold uppercase tracking-widest text-sm">Base</span></button>
          <button onClick={() => setActiveTab('food')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${activeTab === 'food' ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}><Pizza size={20} /> <span className="font-bold uppercase tracking-widest text-sm">Fuel</span></button>
          <button onClick={() => setActiveTab('chat')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${activeTab === 'chat' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}><MessageSquare size={20} /> <span className="font-bold uppercase tracking-widest text-sm">Comms</span></button>
          <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${activeTab === 'profile' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}><User size={20} /> <span className="font-bold uppercase tracking-widest text-sm">Profile</span></button>
        </nav>
        <button onClick={() => setIsWorkoutModalOpen(true)} className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white p-4 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:bg-indigo-500 transition transform hover:scale-105"><Dumbbell size={20} /> <span className="font-black uppercase tracking-widest">Log Grind</span></button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 relative overflow-y-auto hide-scrollbar">
        <div className="w-full max-w-md md:max-w-6xl mx-auto h-full px-4 md:px-8 py-4 md:py-8">
          {activeTab === 'home' && <DashboardTab user={engine.currentUser} registry={engine.registry} />}
          {activeTab === 'food' && <FoodTab user={engine.currentUser} logMeal={engine.logMeal} />}
          {activeTab === 'chat' && <ChatTab user={engine.currentUser} />}
          {activeTab === 'profile' && <ProfileTab user={engine.currentUser} updateBio={engine.updateBio} />}
        </div>
      </main>

      {/* GLOBAL NOTIFICATIONS */}
      {engine.aiPopup && (
        <div className="fixed top-6 left-1/2 z-50 animate-slide-down w-[90%] max-w-sm md:max-w-md"><div className="p-4 md:p-6 border border-indigo-500/50 bg-indigo-950/95 backdrop-blur-xl shadow-[0_0_40px_rgba(79,70,229,0.5)] flex items-center gap-4 rounded-2xl"><span className="text-3xl md:text-4xl drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">✨</span><p className="text-indigo-100 font-serif italic text-sm md:text-base">"{engine.aiPopup.message}"</p></div></div>
      )}

      <WorkoutModal isOpen={isWorkoutModalOpen} onClose={() => setIsWorkoutModalOpen(false)} logWorkout={engine.logFullWorkout} />

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 w-full bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/5 z-40 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] pb-safe">
        <div className="flex justify-around items-center px-2 py-4 relative">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center w-16 transition-colors ${activeTab === 'home' ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}><Home size={22} /><span className="text-[9px] mt-1.5 uppercase font-black tracking-widest">Base</span></button>
          <button onClick={() => setActiveTab('food')} className={`flex flex-col items-center w-16 transition-colors ${activeTab === 'food' ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}><Pizza size={22} /><span className="text-[9px] mt-1.5 uppercase font-black tracking-widest">Fuel</span></button>
          <div className="relative w-16 flex justify-center"><button onClick={() => setIsWorkoutModalOpen(true)} className="absolute -top-10 bg-indigo-600 text-white p-4 rounded-full shadow-[0_0_25px_rgba(79,70,229,0.6)] border-4 border-[#050505] hover:scale-110 hover:bg-indigo-500 transition-all transform duration-300"><Dumbbell size={26} /></button></div>
          <button onClick={() => setActiveTab('chat')} className={`flex flex-col items-center w-16 transition-colors ${activeTab === 'chat' ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}><MessageSquare size={22} /><span className="text-[9px] mt-1.5 uppercase font-black tracking-widest">Comms</span></button>
          <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center w-16 transition-colors ${activeTab === 'profile' ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}><User size={22} /><span className="text-[9px] mt-1.5 uppercase font-black tracking-widest">Profile</span></button>
        </div>
      </nav>
    </div>
  );
}
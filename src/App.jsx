import React, { useState, useEffect } from 'react';
import { Dumbbell, Shield, Skull, Pizza, Trophy, Swords, Scroll, Crown, Briefcase, MessageSquare, User, Home, Plus, X, Calendar as CalIcon, Send, Loader2, Sparkles } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// --- 0. CLOUD CONNECTIONS ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- 1. LORE DATA & ASSETS ---
const HEROES = {
  Kratos: { franchise: 'God of War', image: 'https://cdn-icons-png.flaticon.com/512/3593/3593539.png', glow: 'rgba(220,38,38,0.6)' }, 
  Batman: { franchise: 'DC', image: 'https://cdn-icons-png.flaticon.com/512/1007/1007004.png', glow: 'rgba(250,204,21,0.6)' }, 
  Superman: { franchise: 'DC', image: 'https://cdn-icons-png.flaticon.com/512/805/805404.png', glow: 'rgba(37,99,235,0.6)' }, 
  IronMan: { franchise: 'Marvel', image: 'https://cdn-icons-png.flaticon.com/512/1154/1154448.png', glow: 'rgba(220,38,38,0.6)' }, 
  Vito: { franchise: 'Godfather', image: 'https://cdn-icons-png.flaticon.com/512/3067/3067302.png', glow: 'rgba(180,83,9,0.6)' }, 
  Tommy: { franchise: 'Vice City', image: 'https://cdn-icons-png.flaticon.com/512/8221/8221151.png', glow: 'rgba(236,72,153,0.6)' },
  Messi: { franchise: 'Football', image: 'https://cdn-icons-png.flaticon.com/512/5323/5323344.png', glow: 'rgba(56,189,248,0.8)' } // Lionel Messi Added
};

const COMPANIONS = {
  'God of War': { name: 'Mimir', icon: '🗣️', color: 'text-cyan-400', bg: 'bg-cyan-950/40', border: 'border-cyan-500/50' },
  'DC': { name: 'Alfred', icon: '🤵‍♂️', color: 'text-gray-300', bg: 'bg-gray-800/40', border: 'border-gray-500/50' },
  'Marvel': { name: 'Nick Fury', icon: '👁️‍🗨️', color: 'text-purple-400', bg: 'bg-purple-950/40', border: 'border-purple-500/50' },
  'Godfather': { name: 'Consigliere', icon: '💼', color: 'text-amber-500', bg: 'bg-amber-950/40', border: 'border-amber-700/50' },
  'Vice City': { name: 'Ken Rosenberg', icon: '🌴', color: 'text-pink-400', bg: 'bg-pink-950/40', border: 'border-pink-500/50' },
  'Football': { name: 'Lionel Scaloni', icon: '⚽', color: 'text-sky-400', bg: 'bg-sky-950/40', border: 'border-sky-500/50' }
};

const LOOT_ROADMAP = [ { level: 1, item: 'Innate Might' }, { level: 5, item: 'Franchise Weapon' }, { level: 10, item: 'Divine Artifact' } ];
const LOOT_TABLE = {
  'God of War': { 'bench': 'Leviathan Axe', 'squat': 'Blades of Chaos', 'deadlift': 'Draupnir Spear' },
  'DC': { 'bench': 'Batarang Arsenal', 'squat': 'Kryptonite Ring', 'deadlift': 'Lasso of Truth' },
  'Marvel': { 'bench': 'Vibranium Shield', 'squat': 'Mjolnir', 'deadlift': 'Infinity Gauntlet' },
  'Godfather': { 'bench': 'Tommy Gun', 'squat': 'Bespoke Silk Suit', 'deadlift': 'The Don\'s Ring' },
  'Vice City': { 'bench': 'Machete', 'squat': 'Chainsaw', 'deadlift': 'Vercetti Estate Keys' },
  'Football': { 'bench': 'Golden Boot', 'squat': 'Ballon d\'Or', 'deadlift': 'World Cup Trophy' }
};

const playWorkoutFX = (franchise) => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (franchise === 'Godfather' || franchise === 'Vice City') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(3000, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } else if (franchise === 'Football') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(100, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(20, audioCtx.currentTime + 0.8);
      gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.9);
    }
  } catch (e) { console.log("Audio blocked by browser."); }
};

const ImageAvatar = ({ heroName, size = 80 }) => {
  const hero = HEROES[heroName] || HEROES['Kratos'];
  return (
    <div className="animate-idle transition-transform duration-300 hover:scale-110 flex justify-center items-center" style={{ filter: `drop-shadow(0px 0px 15px ${hero.glow})` }}>
      <img src={hero.image} alt={heroName} style={{ width: size, height: size, objectFit: 'contain' }} className="rounded-lg opacity-90 invert" />
    </div>
  );
};

// --- 2. CLOUD GAME ENGINE & PERSISTENCE ---
const useHero = () => {
  const [registry, setRegistry] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [aiPopup, setAiPopup] = useState(null);
  const [isDbLoading, setIsDbLoading] = useState(true);
  const [isScreenShaking, setIsScreenShaking] = useState(false); 

  const fetchLeaderboard = async () => {
    const { data } = await supabase.from('syndicate_registry').select('username, hero_data');
    if (data) setRegistry(data.map(d => ({ username: d.username, ...d.hero_data })));
  };

  // CHECK LOCAL STORAGE ON MOUNT TO PREVENT LOGOUT
  useEffect(() => {
    const restoreSession = async () => {
      const savedUser = localStorage.getItem('syndicate_active_user');
      if (savedUser) {
        const { data } = await supabase.from('syndicate_registry').select('*').eq('username', savedUser).single();
        if (data) setCurrentUser({ username: data.username, ...data.hero_data });
      }
      await fetchLeaderboard();
      setIsDbLoading(false);
    };
    restoreSession();
  }, []);

  const triggerAiPopup = (franchise, message) => {
    setAiPopup({ franchise, message });
    setTimeout(() => setAiPopup(null), 5000); 
  };

  const loginUser = async (username, password) => {
    const { data, error } = await supabase.from('syndicate_registry').select('*').eq('username', username).single();
    if (error || !data) return { success: false, error: "Identity not found in the realm." };
    if (data.password !== password) return { success: false, error: "Incorrect passcode." };
    
    setCurrentUser({ username: data.username, ...data.hero_data });
    localStorage.setItem('syndicate_active_user', data.username); // SAVE SESSION
    return { success: true };
  };

  const registerUser = async (username, password, heroName, franchise) => {
    const { data: existing } = await supabase.from('syndicate_registry').select('username').eq('username', username).single();
    if (existing) return { success: false, error: "Alias already claimed." };

    const newHeroData = { heroName, franchise, xp: 0, level: 1, prs: {}, inventory: [], bio: "A new legend begins.", workouts: [], meals: [], cheatMeals: [] };
    const { error } = await supabase.from('syndicate_registry').insert([{ username, password, hero_data: newHeroData }]);
    if (error) return { success: false, error: "The database rejected your entry." };
    
    setCurrentUser({ username, ...newHeroData });
    localStorage.setItem('syndicate_active_user', username); // SAVE SESSION
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
        // Check if any word in their exercise matches a core lift
        const matchedLift = Object.keys(LOOT_TABLE[currentUser.franchise]).find(key => normalizedEx.includes(key));
        if (matchedLift) {
          const possibleItem = LOOT_TABLE[currentUser.franchise][matchedLift];
          if (possibleItem && !newInventory.includes(possibleItem)) {
            newInventory.push(possibleItem);
            unlockedItems.push(possibleItem);
          }
        }
      }
    });

    const newXp = currentUser.xp + totalXpGained;
    const newLevel = Math.floor(Math.sqrt(newXp) / 5) + 1;
    const newWorkoutLog = { id: Date.now(), date, split, exercises, xp: totalXpGained };
    
    updateUserState({ xp: newXp, level: newLevel, prs: newPrs, inventory: newInventory, workouts: [newWorkoutLog, ...(currentUser.workouts || [])] });
    
    playWorkoutFX(currentUser.franchise);
    setIsScreenShaking(true);
    setTimeout(() => setIsScreenShaking(false), 700);

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
  
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('syndicate_active_user'); // CLEAR SESSION
  };

  return { currentUser, registry, isDbLoading, loginUser, registerUser, logFullWorkout, logMeal, updateBio, aiPopup, isScreenShaking, logout };
};

// --- 3. UI COMPONENTS ---

const DashboardTab = ({ user, registry, logout }) => {
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
          <button onClick={logout} className="mt-2 text-xs text-gray-500 hover:text-white uppercase tracking-widest">Logout</button>
        </div>
        <ImageAvatar heroName={user.heroName} size={80} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold uppercase text-white mb-4 flex items-center gap-2 tracking-widest border-b border-white/10 pb-2"><CalIcon size={18} className="text-indigo-400"/> Conquest Calendar</h3>
          <div className="grid grid-cols-7 gap-2">
            {last14Days.map(dateStr => {
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

// --- NEW AI FOOD TAB ---
const FoodTab = ({ user, logMeal }) => {
  const [food, setFood] = useState('');
  const [protein, setProtein] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const estimateMacrosWithAI = async () => {
    if (!food.trim()) return;
    setIsAiLoading(true);
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ 
          model: "llama-3.1-8b-instant", 
          messages: [{ role: "system", content: "You are a macro calculator. The user will give you a food. Estimate the grams of protein. Reply with ONLY a number. No text, no symbols." }, { role: "user", content: food }], 
          temperature: 0.1, max_tokens: 10 
        })
      });
      const data = await response.json();
      const aiProtein = parseInt(data.choices[0].message.content.replace(/[^0-9]/g, ''));
      if (!isNaN(aiProtein)) setProtein(aiProtein);
    } catch (err) { console.error("AI Macro fail", err); }
    setIsAiLoading(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-24 pt-4 md:pb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 md:p-8 border-emerald-500/20">
          <h2 className="text-xl font-bold uppercase text-emerald-400 mb-6 flex items-center gap-2 tracking-widest border-b border-emerald-500/20 pb-2"><Pizza size={20}/> Fuel the Engine</h2>
          <form onSubmit={(e) => { e.preventDefault(); logMeal(food, protein, false); setFood(''); setProtein(''); }} className="space-y-4">
            <div>
              <label className="text-xs text-emerald-500/70 uppercase tracking-widest mb-1 block">Ration Description</label>
              <div className="flex gap-2">
                <input placeholder="E.g. Chicken Smash Burger" required value={food} onChange={e=>setFood(e.target.value)} className="flex-1 bg-black/50 border border-emerald-900/50 rounded p-4 text-white focus:border-emerald-500 outline-none transition" />
                <button type="button" onClick={estimateMacrosWithAI} disabled={isAiLoading || !food} className="bg-emerald-900/40 border border-emerald-500/30 text-emerald-400 p-4 rounded hover:bg-emerald-800/50 transition flex items-center justify-center disabled:opacity-50">
                  {isAiLoading ? <Loader2 className="animate-spin" size={20}/> : <Sparkles size={20}/>}
                </button>
              </div>
            </div>
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
        headers: { "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "llama-3.1-8b-instant", messages: [{ role: "system", content: systemPrompt }, ...chatHistory, { role: "user", content: userText }], temperature: 0.7, max_tokens: 100 })
      });

      if (!response.ok) throw new Error(`HTTP Status ${response.status}`);
      const data = await response.json();
      const aiResponse = data.choices[0].message.content.replace(/"/g, ''); 
      setMessages(prev => { const newMsgs = [...prev]; newMsgs[newMsgs.length - 1] = { sender: 'ai', text: aiResponse }; return newMsgs; });
    } catch (error) {
      setMessages(prev => { const newMsgs = [...prev]; newMsgs[newMsgs.length - 1] = { sender: 'ai', text: `ERROR: ${error.message}.` }; return newMsgs; });
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
  const [exercises, setExercises] = useState([{ bodyPart: 'Chest', name: '', weight: '', reps: '', sets: '' }]);

  if (!isOpen) return null;

  const handleUpdateRow = (index, field, value) => { const newEx = [...exercises]; newEx[index] = { ...newEx[index], [field]: value }; setExercises(newEx); };
  const handleSubmit = (e) => { e.preventDefault(); logWorkout(date, split, exercises); onClose(); setExercises([{ bodyPart: 'Chest', name: '', weight: '', reps: '', sets: '' }]); };

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
            <label className="text-xs text-gray-400 uppercase tracking-widest block">Movements</label>
            {exercises.map((ex, i) => (
              <div key={i} className="flex flex-col gap-3 bg-black/30 border border-white/5 p-4 rounded-xl">
                <div className="flex flex-col md:flex-row gap-3">
                  <select value={ex.bodyPart} onChange={(e)=>handleUpdateRow(i, 'bodyPart', e.target.value)} className="w-full md:w-1/3 bg-black/50 border border-white/10 rounded p-3 text-white focus:border-indigo-500 outline-none transition"><option value="Chest">Chest</option><option value="Back">Back</option><option value="Legs">Legs</option><option value="Shoulders">Shoulders</option><option value="Arms">Arms</option><option value="Core">Core</option></select>
                  <input placeholder="Exercise (e.g., Incline Press)" required value={ex.name} onChange={(e)=>handleUpdateRow(i, 'name', e.target.value)} className="w-full md:w-2/3 bg-black/50 border border-white/10 rounded p-3 text-white focus:border-indigo-500 outline-none transition" />
                </div>
                <div className="flex gap-3"><input type="number" placeholder="Kg" required value={ex.weight} onChange={(e)=>handleUpdateRow(i, 'weight', e.target.value)} className="flex-1 bg-black/50 border border-white/10 rounded p-3 text-white focus:border-indigo-500 outline-none transition" /><input type="number" placeholder="Reps" required value={ex.reps} onChange={(e)=>handleUpdateRow(i, 'reps', e.target.value)} className="flex-1 bg-black/50 border border-white/10 rounded p-3 text-white focus:border-indigo-500 outline-none transition" /><input type="number" placeholder="Sets" required value={ex.sets} onChange={(e)=>handleUpdateRow(i, 'sets', e.target.value)} className="flex-1 bg-black/50 border border-white/10 rounded p-3 text-white focus:border-indigo-500 outline-none transition" /></div>
              </div>
            ))}
            <button type="button" onClick={()=>setExercises([...exercises, { bodyPart: 'Chest', name: '', weight: '', reps: '', sets: '' }])} className="text-sm font-bold uppercase tracking-widest text-indigo-400 flex items-center justify-center gap-2 hover:text-indigo-300 mt-2 bg-indigo-900/30 w-full px-6 py-4 rounded-xl transition border border-indigo-500/20"><Plus size={18}/> Add Movement</button>
          </div>
        </form>
        <div className="p-6 border-t border-white/10 bg-black/50"><button onClick={handleSubmit} className="w-full py-4 bg-indigo-600 text-white font-black uppercase tracking-widest rounded-lg hover:bg-indigo-500 transition shadow-[0_0_15px_rgba(79,70,229,0.4)]">Commit to Iron</button></div>
      </div>
    </div>
  );
};

// --- 4. DYNAMIC THEMED LOGIN ---
const LOGIN_THEMES = [
  { name: 'D&D', bgClass: 'bg-[#050505] bg-[url("https://www.transparenttextures.com/patterns/dark-leather.png")]', cardBg: 'bg-[#0a0503]/95 border-amber-900/50', textAccent: 'text-amber-500', icon: <Scroll size={56} className="mx-auto text-amber-600 mb-6 drop-shadow-[0_0_10px_rgba(217,119,6,0.8)]" />, btnClass: 'bg-gradient-to-r from-amber-800 to-amber-600 text-black shadow-[0_0_15px_rgba(217,119,6,0.4)] hover:from-amber-700 hover:to-amber-500' },
  { name: 'Gotham', bgClass: 'bg-zinc-950 bg-[url("https://www.transparenttextures.com/patterns/concrete-wall.png")]', cardBg: 'bg-zinc-900/95 border-blue-900/50', textAccent: 'text-blue-500', icon: <Shield size={56} className="mx-auto text-blue-600 mb-6 drop-shadow-[0_0_10px_rgba(37,99,235,0.8)]" />, btnClass: 'bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:from-blue-800 hover:to-blue-600' },
  { name: 'Tron', bgClass: 'bg-black bg-[url("https://www.transparenttextures.com/patterns/cubes.png")]', cardBg: 'bg-black border-cyan-500/80 shadow-[0_0_30px_rgba(6,182,212,0.3)]', textAccent: 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]', icon: <Swords size={56} className="mx-auto text-cyan-400 mb-6 drop-shadow-[0_0_15px_rgba(6,182,212,1)]" />, btnClass: 'bg-transparent border-2 border-cyan-500 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:bg-cyan-950' }
];

const DndLogin = ({ engine }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [heroName, setHeroName] = useState('Vito');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Pick random theme on load
  const [theme] = useState(LOGIN_THEMES[Math.floor(Math.random() * LOGIN_THEMES.length)]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true); setError('');
    let res = isRegistering ? await engine.registerUser(username, password, heroName, HEROES[heroName].franchise) : await engine.loginUser(username, password);
    if (!res.success) setError(res.error);
    setIsLoading(false);
  };

  if (engine.isDbLoading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><Loader2 className="animate-spin text-indigo-500" size={48} /></div>;

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors ${theme.bgClass}`}>
      <div className={`border backdrop-blur-md p-8 md:p-12 w-full max-w-md md:max-w-lg text-center rounded-2xl relative overflow-hidden ${theme.cardBg}`}>
        {theme.icon}
        <h1 className={`text-3xl md:text-4xl font-black uppercase tracking-widest mb-2 font-serif ${theme.textAccent}`}>The Syndicate</h1>
        <p className="text-gray-400 font-serif italic mb-8 md:text-lg">Swear your blood oath.</p>
        {error && <p className="text-red-500 text-sm mb-4 font-bold animate-pulse">{error}</p>}
        <form onSubmit={handleAuth} className="space-y-4">
          <input type="text" required placeholder="Alias (Username)" className="w-full bg-black/60 border border-white/10 p-4 text-white rounded-lg outline-none focus:border-white/40 transition" onChange={(e) => setUsername(e.target.value)} />
          <input type="password" required placeholder="Passcode" className="w-full bg-black/60 border border-white/10 p-4 text-white rounded-lg outline-none focus:border-white/40 transition" onChange={(e) => setPassword(e.target.value)} />
          {isRegistering && (
            <div className="pt-4 text-left">
              <label className={`block text-xs font-black uppercase tracking-widest mb-3 ${theme.textAccent}`}>Select Identity</label>
              <select className="w-full bg-black/60 border border-white/10 p-4 text-white rounded-lg outline-none transition appearance-none" onChange={(e) => setHeroName(e.target.value)} value={heroName}>
                {Object.keys(HEROES).map(name => <option key={name} value={name}>{name} ({HEROES[name].franchise})</option>)}
              </select>
            </div>
          )}
          <button type="submit" disabled={isLoading} className={`w-full py-4 mt-6 font-black uppercase tracking-widest transition rounded-lg md:text-lg flex justify-center items-center gap-2 disabled:opacity-50 ${theme.btnClass}`}>
            {isLoading ? <Loader2 className="animate-spin" size={20}/> : (isRegistering ? 'Forge Legacy' : 'Enter Realm')}
          </button>
        </form>
        <button onClick={() => { setIsRegistering(!isRegistering); setError(''); }} className="mt-8 text-gray-500 hover:text-gray-300 text-sm underline font-serif transition">{isRegistering ? 'Already in the family? Login.' : 'New to town? Register.'}</button>
      </div>
    </div>
  );
};

// --- 5. ROOT APP ---
export default function App() {
  const engine = useHero();
  const [activeTab, setActiveTab] = useState('home');
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);

  if (!engine.currentUser) return <DndLogin engine={engine} />;

  return (
    <div className={`min-h-screen text-gray-100 font-sans flex overflow-hidden transition-all duration-75 ${engine.isScreenShaking ? 'animate-rage bg-red-950' : 'bg-[#050505]'}`}>
      <style>{`
        .glass-card { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 1.5rem; } 
        .hide-scrollbar::-webkit-scrollbar { display: none; } 
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } 
        .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; } 
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } } 
        @keyframes slideDown { from { opacity: 0; transform: translate(-50%, -20px); } to { opacity: 1; transform: translate(-50%, 0); } } 
        .animate-slide-down { animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        @keyframes rage { 
          0%, 100% { transform: translate(0, 0) scale(1); } 
          10%, 30%, 50%, 70%, 90% { transform: translate(-12px, 12px) scale(1.05); } 
          20%, 40%, 60%, 80% { transform: translate(12px, -12px) scale(1.05); } 
        } 
        .animate-rage { animation: rage 0.7s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes flash { 0%, 100% { opacity: 0; } 50% { opacity: 1; } }
        .animate-flash { animation: flash 0.7s ease-in-out; }
      `}</style>

      {engine.isScreenShaking && <div className="fixed inset-0 bg-red-600/50 mix-blend-overlay z-[100] pointer-events-none animate-flash"></div>}

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
      <main className="flex-1 relative overflow-y-auto hide-scrollbar z-10">
        <div className="w-full max-w-md md:max-w-6xl mx-auto h-full px-4 md:px-8 py-4 md:py-8">
          {activeTab === 'home' && <DashboardTab user={engine.currentUser} registry={engine.registry} logout={engine.logout} />}
          {activeTab === 'food' && <FoodTab user={engine.currentUser} logMeal={engine.logMeal} />}
          {activeTab === 'chat' && <ChatTab user={engine.currentUser} />}
          {activeTab === 'profile' && <ProfileTab user={engine.currentUser} updateBio={engine.updateBio} />}
        </div>
      </main>

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
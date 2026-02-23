import React, { useState, useEffect } from 'react';
import { Dumbbell, Shield, Pizza, Trophy, Swords, Scroll, Crown, Briefcase, MessageSquare, User, Home, Plus, X, Calendar as CalIcon, Send, Loader2, Sparkles, Radio, Activity, Timer, Search, Music } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// --- 1. STRICT REQUIREMENT: ALL IMPORTS AT THE VERY TOP ---
import kratosImg from './assets/kratos-hero.png';
import batmanImg from './assets/batman-hero.png';
import supermanImg from './assets/superman-hero.png';
import ironmanImg from './assets/ironman-hero.png';
import spidermanImg from './assets/spiderman-hero.png';
import vitoImg from './assets/vito-hero.png';
import michaelImg from './assets/michael-hero.png';
import tommyImg from './assets/tommy-hero.png';
import messiImg from './assets/messi-hero.png'; 

// --- 2. CLOUD CONNECTIONS ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- 3. LORE DATA & DICTIONARIES ---
const HEROES = {
  Kratos: { franchise: 'God of War', image: kratosImg, glow: 'rgba(220,38,38,0.8)' }, 
  Batman: { franchise: 'DC', image: batmanImg, glow: 'rgba(250,204,21,0.8)' }, 
  Superman: { franchise: 'DC', image: supermanImg, glow: 'rgba(37,99,235,0.8)' }, 
  IronMan: { franchise: 'Marvel', image: ironmanImg, glow: 'rgba(220,38,38,0.8)' }, 
  SpiderMan: { franchise: 'Marvel', image: spidermanImg, glow: 'rgba(37,99,235,0.8)' },
  Vito: { franchise: 'Godfather', image: vitoImg, glow: 'rgba(180,83,9,0.8)' }, 
  Michael: { franchise: 'Godfather', image: michaelImg, glow: 'rgba(255,255,255,0.6)' },
  Tommy: { franchise: 'Vice City', image: tommyImg, glow: 'rgba(236,72,153,0.8)' },
  Messi: { franchise: 'Football', image: messiImg, glow: 'rgba(56,189,248,0.9)' }
};

const COMPANIONS = {
  'God of War': { name: 'Mimir', icon: '🗣️', color: 'text-cyan-400', bg: 'bg-cyan-950/40', border: 'border-cyan-500/50' },
  'DC': { name: 'Alfred', icon: '🤵‍♂️', color: 'text-gray-300', bg: 'bg-gray-800/40', border: 'border-gray-500/50' },
  'Marvel': { name: 'Nick Fury', icon: '👁️‍🗨️', color: 'text-purple-400', bg: 'bg-purple-950/40', border: 'border-purple-500/50' },
  'Godfather': { name: 'Consigliere', icon: '💼', color: 'text-amber-500', bg: 'bg-amber-950/40', border: 'border-amber-700/50' },
  'Vice City': { name: 'Ken Rosenberg', icon: '🌴', color: 'text-pink-400', bg: 'bg-pink-950/40', border: 'border-pink-500/50' },
  'Football': { name: 'Lionel Scaloni', icon: '⚽', color: 'text-sky-400', bg: 'bg-sky-950/40', border: 'border-sky-500/50' }
};

const MENTORS = {
  'Mike Mentzer': { name: 'Mike Mentzer', icon: '🧠', color: 'text-zinc-400', bg: 'bg-zinc-950/40', border: 'border-zinc-500/50', system: "You are Mike Mentzer. Advocate strictly for Heavy Duty training. Emphasize that anything more than ONE single set to absolute muscular failure is overtraining. Be highly intellectual, objective, and intense. Give a detailed 2-paragraph response." },
  'Dorian Yates': { name: 'Dorian Yates', icon: '🦍', color: 'text-stone-400', bg: 'bg-stone-950/40', border: 'border-stone-500/50', system: "You are 6x Mr. Olympia Dorian Yates. Your philosophy is 'Blood & Guts' High-Intensity Training (HIT). You strongly advocate for strictly 1 or 2 warm-up sets followed by exactly ONE working set taken to absolute, brutal muscular failure and beyond. You despise high-volume training. You emphasize precise biomechanics, slow negatives, and deep stretching. Speak with a gritty, intense, no-nonsense British tone. Give a detailed, 2-3 paragraph breakdown." },
  'Tom Platz': { name: 'Tom Platz', icon: '🦵', color: 'text-yellow-400', bg: 'bg-yellow-950/40', border: 'border-yellow-500/50', system: "You are Tom Platz. You are intensely passionate about pushing past the pain barrier on leg day. Give a detailed 2-paragraph response." },
  'Jeff Nippard': { name: 'Jeff Nippard', icon: '🧬', color: 'text-cyan-400', bg: 'bg-cyan-950/40', border: 'border-cyan-500/50', system: "You are Jeff Nippard. Focus on biomechanics, hypertrophy studies, and optimal technique. Give a detailed 2-paragraph response." }
};

const LOOT_ROADMAP = [ { level: 1, item: 'Innate Might' }, { level: 5, item: 'Franchise Weapon' }, { level: 10, item: 'Divine Artifact' }, { level: 12, item: 'Aura of Intimidation' }, { level: 14, item: 'Veteran\'s Belt' }, { level: 16, item: 'Master\'s Grip' }, { level: 18, item: 'Hero\'s Mantle' }, { level: 20, item: 'Ascended Godhood' } ];
const LOOT_TABLE = {
  'God of War': { 'bench press': 'Leviathan Axe', 'squat': 'Blades of Chaos', 'deadlift': 'Draupnir Spear' },
  'DC': { 'bench press': 'Batarang Arsenal', 'squat': 'Kryptonite Ring', 'deadlift': 'Lasso of Truth' },
  'Marvel': { 'bench press': 'Vibranium Shield', 'squat': 'Mjolnir', 'deadlift': 'Infinity Gauntlet' },
  'Godfather': { 'bench press': 'Tommy Gun', 'squat': 'Bespoke Silk Suit', 'deadlift': 'The Don\'s Ring' },
  'Vice City': { 'bench press': 'Machete', 'squat': 'Chainsaw', 'deadlift': 'Vercetti Estate Keys' },
  'Football': { 'bench press': 'Golden Boot', 'squat': 'Ballon d\'Or', 'deadlift': 'World Cup Trophy' }
};

const CELEBRATIONS = {
  arnold: { name: "Arnold Schwarzenegger", quote: "Shock the muscle!", gif: "https://media.giphy.com/media/1xp1ygdOQOEuw/giphy.gif" },
  dorian: { name: "Dorian Yates", quote: "Blood and Guts. Absolute failure.", gif: "https://media.tenor.com/P4E7i22-K24AAAAC/dorian-yates-bodybuilding.gif" },
  platz: { name: "Tom Platz", quote: "You have to go to the dark place.", gif: "https://media.tenor.com/lM_LnbH2uO0AAAAC/tom-platz-squats.gif" },
  sulek: { name: "Sam Sulek", quote: "Just do the heavy lifting.", gif: "https://media.tenor.com/b9K-nQj13J8AAAAd/sam-sulek.gif" },
  goggins: { name: "David Goggins", quote: "They don't know me son! Stay Hard!", gif: "https://media.tenor.com/yF1d4JtO5iEAAAAC/david-goggins-stay-hard.gif" },
  messi: { name: "Lionel Messi", quote: "Ankara Messi!", gif: "https://media.tenor.com/7123jYVvLfkAAAAC/messi-world-cup.gif" }
};

const playWorkoutFX = (franchise) => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode); gainNode.connect(audioCtx.destination);
    osc.type = 'triangle'; osc.frequency.setValueAtTime(150, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.6); gainNode.gain.setValueAtTime(1, audioCtx.currentTime); gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6); osc.start(); osc.stop(audioCtx.currentTime + 0.7);
  } catch (e) { console.log("Audio blocked."); }
};

const ImageAvatar = ({ heroName, size = 80 }) => {
  const hero = HEROES[heroName] || HEROES['Kratos'];
  return (
    <div className="animate-idle transition-transform duration-300 hover:scale-110 flex justify-center items-center relative z-10" style={{ filter: `drop-shadow(0px 10px 25px ${hero.glow})` }}>
      <img src={hero.image} alt={heroName} style={{ width: size, height: size, objectFit: 'contain' }} className="rounded-lg opacity-95" />
    </div>
  );
};

// --- 4. CLOUD ENGINE ---
const useHero = () => {
  const [registry, setRegistry] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [aiPopup, setAiPopup] = useState(null);
  const [isDbLoading, setIsDbLoading] = useState(true);
  const [isScreenShaking, setIsScreenShaking] = useState(false); 
  const [workoutCelebration, setWorkoutCelebration] = useState(null); 

  const fetchLeaderboard = async () => {
    const { data } = await supabase.from('syndicate_registry').select('username, hero_data');
    if (data) setRegistry(data.map(d => ({ username: d.username, ...d.hero_data })));
  };

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

    // REAL-TIME SYNC
    const channel = supabase.channel('realtime_registry')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'syndicate_registry' }, payload => {
        fetchLeaderboard(); 
        const savedUser = localStorage.getItem('syndicate_active_user');
        if (payload.new && payload.new.username === savedUser) {
          setCurrentUser({ username: payload.new.username, ...payload.new.hero_data });
        }
      }).subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const triggerAiPopup = (franchise, message) => {
    setAiPopup({ franchise, message });
    setTimeout(() => setAiPopup(null), 6000); 
  };

  const loginUser = async (username, password) => {
    const { data, error } = await supabase.from('syndicate_registry').select('*').eq('username', username).single();
    if (error || !data) return { success: false, error: "Identity not found in the realm." };
    if (data.password !== password) return { success: false, error: "Incorrect passcode." };
    const userData = data.hero_data;
    if (!userData.dietPhase) userData.dietPhase = 'Maintenance';
    setCurrentUser({ username: data.username, ...userData });
    localStorage.setItem('syndicate_active_user', data.username); 
    return { success: true };
  };

  const registerUser = async (username, password, heroName, franchise) => {
    const { data: existing } = await supabase.from('syndicate_registry').select('username').eq('username', username).single();
    if (existing) return { success: false, error: "Alias already claimed." };
    const newHeroData = { heroName, franchise, xp: 0, level: 1, prs: {}, inventory: [], bio: "A new legend begins.", dietPhase: "Maintenance", workouts: [], meals: [] };
    const { error } = await supabase.from('syndicate_registry').insert([{ username, password, hero_data: newHeroData }]);
    if (error) return { success: false, error: "The database rejected your entry." };
    setCurrentUser({ username, ...newHeroData });
    localStorage.setItem('syndicate_active_user', username); 
    fetchLeaderboard();
    return { success: true };
  };

  const updateUserState = async (updates) => {
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser); 
    const { username, ...hero_data } = updatedUser;
    await supabase.from('syndicate_registry').update({ hero_data }).eq('username', username);
  };

  const logFullWorkout = (date, split, exercises, type = 'iron', cardioData = null) => {
    let totalXpGained = 0; let newPrs = { ...currentUser.prs }; let unlockedItems = []; let newInventory = [...(currentUser.inventory || [])];
    let celebKey = null;

    if (type === 'iron') {
      let partsStr = split.toLowerCase();
      exercises.forEach(ex => {
        partsStr += " " + ex.bodyPart.toLowerCase();
        const xp = (ex.weight * ex.reps * ex.sets) / 10;
        totalXpGained += xp;
        const prevWeight = newPrs[ex.name] || 0;
        if (ex.weight > prevWeight) {
          newPrs[ex.name] = ex.weight;
          const matchedLift = Object.keys(LOOT_TABLE[currentUser.franchise] || {}).find(key => ex.name.toLowerCase().trim().includes(key));
          if (matchedLift) {
            const possibleItem = LOOT_TABLE[currentUser.franchise][matchedLift];
            if (possibleItem && !newInventory.includes(possibleItem)) { newInventory.push(possibleItem); unlockedItems.push(possibleItem); }
          }
        }
      });

      if (partsStr.includes('leg') || partsStr.includes('quad') || partsStr.includes('hamstring') || partsStr.includes('calf') || partsStr.includes('lower')) celebKey = 'platz';
      else if (partsStr.includes('back') || partsStr.includes('lat') || partsStr.includes('pull') || partsStr.includes('rhomboid')) celebKey = 'dorian';
      else if (partsStr.includes('bicep') || partsStr.includes('tricep') || partsStr.includes('forearm') || partsStr.includes('arm')) celebKey = 'sulek';
      else if (partsStr.includes('chest') || partsStr.includes('push') || partsStr.includes('upper') || partsStr.includes('delt')) celebKey = 'arnold';
      else celebKey = 'arnold';

    } else if (type === 'cardio' && cardioData) {
      totalXpGained = (cardioData.duration * 8);
      if (cardioData.activity === 'Football (Soccer)') celebKey = 'messi';
      else if (cardioData.activity === 'Running') celebKey = 'goggins';
      else celebKey = 'goggins'; 
    }

    const newXp = currentUser.xp + totalXpGained;
    const newLevel = Math.floor(Math.sqrt(newXp) / 5) + 1;
    const newWorkoutLog = { id: Date.now(), date, type, split: type === 'iron' ? split : cardioData.activity, xp: totalXpGained, details: type === 'iron' ? exercises : cardioData };
    
    updateUserState({ xp: newXp, level: newLevel, prs: newPrs, inventory: newInventory, workouts: [newWorkoutLog, ...(currentUser.workouts || [])] });
    
    playWorkoutFX(currentUser.franchise);
    setIsScreenShaking(true);
    setTimeout(() => setIsScreenShaking(false), 700);

    if (celebKey) {
      setWorkoutCelebration(CELEBRATIONS[celebKey]);
      setTimeout(() => setWorkoutCelebration(null), 5000); 
    }

    let popupMsg = `The conquest advances! +${totalXpGained.toFixed(0)} XP.`;
    if (unlockedItems.length > 0) popupMsg = `Magnificent! You unlocked the ${unlockedItems.join(', ')}!`;
    triggerAiPopup(currentUser.franchise, popupMsg);
  };

  const logMeal = (foodName, protein, isJunk, aiComment) => {
    let newXp = currentUser.xp; let popupMessage = `Fuel secured: ${protein}g of protein added.`;
    if (currentUser.dietPhase === 'Cut' && isJunk) { newXp = Math.max(0, newXp - 15); popupMessage = `WARNING: ${aiComment} (-15 XP Penalty)`; } 
    else if (aiComment) { popupMessage = aiComment; }
    const newLevel = Math.floor(Math.sqrt(newXp) / 5) + 1;
    const newMeal = { id: Date.now(), foodName, protein, date: new Date().toLocaleDateString() };
    updateUserState({ xp: newXp, level: newLevel, meals: [newMeal, ...(currentUser.meals || [])] });
    triggerAiPopup(currentUser.franchise, popupMessage);
  };

  const updateProfile = (updates) => updateUserState(updates);
  const logout = () => { setCurrentUser(null); localStorage.removeItem('syndicate_active_user'); };

  return { currentUser, registry, isDbLoading, loginUser, registerUser, logFullWorkout, logMeal, updateProfile, aiPopup, isScreenShaking, workoutCelebration, logout };
};

// --- 5. PREMIUM UI COMPONENTS ---

const TopSearchBar = ({ onNavigate, onOpenWorkout }) => {
  const [query, setQuery] = useState('');
  const handleSearch = (e) => {
    const val = e.target.value.toLowerCase();
    setQuery(val);
    if (val.includes('food') || val.includes('diet') || val.includes('fuel')) onNavigate('food');
    if (val.includes('data') || val.includes('analytic')) onNavigate('analytics');
    if (val.includes('chat') || val.includes('comms') || val.includes('ai')) onNavigate('chat');
    if (val.includes('profile') || val.includes('level') || val.includes('stash')) onNavigate('profile');
    if (val.includes('base') || val.includes('home')) onNavigate('home');
    if (val.includes('log') || val.includes('workout') || val.includes('lift')) { onOpenWorkout(); setQuery(''); }
  };
  return (
    <div className="w-full bg-[#050505]/80 border-b border-white/5 p-4 sticky top-0 z-40 backdrop-blur-2xl flex items-center gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      <Search size={20} className="text-indigo-500 ml-2" />
      <input type="text" value={query} onChange={handleSearch} placeholder="Command bar: Type 'food', 'chat', 'log' to jump..." className="flex-1 bg-transparent text-white font-medium focus:outline-none placeholder-gray-600 tracking-wide" />
    </div>
  );
};

const DashboardTab = ({ user, registry }) => {
  const today = new Date();
  const last14Days = Array.from({length: 14}).map((_, i) => {
    const d = new Date(today); d.setDate(d.getDate() - (13 - i)); return d.toISOString().split('T')[0];
  });
  return (
    <div className="space-y-8 animate-fade-in pb-24 md:pb-8 pt-4">
      <div className="premium-glass p-8 flex items-center justify-between overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="z-10">
          <h2 className="text-4xl md:text-6xl font-black uppercase text-white tracking-widest drop-shadow-lg">{user.username}</h2>
          <p className="text-indigo-400 font-bold text-sm md:text-lg tracking-widest uppercase mt-3 drop-shadow">Level {user.level} • {Math.floor(user.xp)} XP</p>
        </div>
        <ImageAvatar heroName={user.heroName} size={100} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="premium-glass p-6 md:p-8">
          <h3 className="text-xl font-black uppercase text-white mb-6 flex items-center gap-3 tracking-widest border-b border-white/10 pb-4"><CalIcon size={22} className="text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]"/> Conquest Calendar</h3>
          <div className="grid grid-cols-7 gap-3">
            {last14Days.map(dateStr => {
              const hasWorkout = user.workouts?.some(w => w.date === dateStr);
              return <div key={dateStr} title={dateStr} className={`h-10 md:h-14 rounded-lg transition-all duration-500 ${hasWorkout ? 'bg-gradient-to-tr from-indigo-600 to-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.6)] border border-indigo-300' : 'bg-black/40 border border-white/5 shadow-inner'}`}></div>;
            })}
          </div>
        </div>
        <div className="premium-glass p-6 md:p-8 flex flex-col">
           <h2 className="text-xl font-black uppercase text-yellow-500 flex items-center gap-3 border-b border-white/10 pb-4 mb-6"><Crown size={22} className="drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]"/> Global Leaderboard</h2>
           <div className="space-y-3 overflow-y-auto max-h-[160px] hide-scrollbar pr-2">
             {[...registry].sort((a, b) => b.xp - a.xp).map((u, index) => (
               <div key={u.username} className={`flex justify-between items-center p-4 rounded-xl transition-all ${u.username === user.username ? 'bg-white/10 border border-white/20 shadow-lg' : 'bg-black/50 border border-transparent shadow-inner hover:bg-black/30'}`}>
                 <p className="font-bold text-white tracking-wide">#{index + 1} {u.username} <span className="text-xs text-gray-500 ml-2">({u.heroName})</span></p>
                 <p className="font-black text-indigo-400 drop-shadow">{Math.floor(u.xp)} XP</p>
               </div>
             ))}
           </div>
        </div>
      </div>

      <div className="premium-glass p-6 md:p-8">
        <h3 className="text-xl font-black uppercase text-white mb-6 flex items-center gap-3 tracking-widest border-b border-white/10 pb-4"><Music size={22} className="text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"/> Gym Frequencies</h3>
        <div className="w-full overflow-hidden rounded-xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] bg-black">
          <iframe width="100%" height="152" src="https://www.youtube.com/embed/videoseries?list=PLRD1G5jY01E-EofQJ_x_0411r1gI-yH0D" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </div>
      </div>
    </div>
  );
};

const AnalyticsTab = ({ user }) => {
  const today = new Date();
  const chartData = Array.from({length: 7}).map((_, i) => {
    const d = new Date(today); d.setDate(d.getDate() - (6 - i)); const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayWorkouts = user.workouts?.filter(w => w.date === dateStr) || [];
    const dailyXP = dayWorkouts.reduce((acc, w) => acc + (w.xp || 0), 0);
    return { dayLabel, xp: dailyXP };
  });
  const maxXP = Math.max(...chartData.map(d => d.xp), 100);

  return (
    <div className="space-y-8 animate-fade-in pb-24 md:pb-8 pt-4">
      <div className="premium-glass p-6 md:p-8">
        <h3 className="text-xl font-black uppercase text-white mb-10 flex items-center gap-3 tracking-widest border-b border-white/10 pb-4"><Activity size={22} className="text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]"/> 7-Day XP Output</h3>
        <div className="flex items-end justify-between gap-4 h-56 border-b border-white/20 pb-2 px-4 relative">
          {chartData.map((data, i) => {
            const heightPercent = data.xp === 0 ? 2 : (data.xp / maxXP) * 100;
            return (
              <div key={i} className="flex flex-col items-center flex-1 group">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-black text-indigo-300 mb-3 drop-shadow">{Math.floor(data.xp)}</div>
                <div className="w-full max-w-[50px] bg-gradient-to-t from-indigo-900 to-indigo-400 rounded-t-md transition-all duration-500 hover:brightness-125 shadow-[0_0_15px_rgba(99,102,241,0.3)] relative" style={{ height: `${heightPercent}%` }}>
                   <div className="absolute top-0 left-0 w-full h-1 bg-white/40 rounded-t-md"></div>
                </div>
                <span className="text-[11px] text-gray-400 uppercase font-black tracking-widest mt-4 absolute -bottom-8">{data.dayLabel}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="premium-glass p-6 md:p-8 mt-12">
        <h3 className="text-xl font-black uppercase text-white mb-6 tracking-widest border-b border-white/10 pb-4">Conquest History</h3>
        <div className="space-y-4 max-h-[350px] overflow-y-auto hide-scrollbar pr-2">
          {(user.workouts || []).map((w, i) => (
            <div key={i} className="premium-glass p-5 flex justify-between items-center hover:border-indigo-500/50 hover:bg-white/5">
              <div><p className="text-white font-bold tracking-widest uppercase text-base">{w.split}</p><p className="text-indigo-300/70 text-sm mt-1">{w.date} • {w.type === 'cardio' ? 'Athletics' : 'Iron'}</p></div>
              <span className="text-indigo-400 font-black tracking-widest text-lg drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]">+{Math.floor(w.xp)} XP</span>
            </div>
          ))}
          {(!user.workouts || user.workouts.length === 0) && <p className="text-gray-500 italic text-center py-8">The archives are empty.</p>}
        </div>
      </div>
    </div>
  );
};

const FoodTab = ({ user, logMeal }) => {
  const [food, setFood] = useState(''); const [protein, setProtein] = useState(''); const [isAiLoading, setIsAiLoading] = useState(false);
  const estimateAndJudgeFood = async () => {
    if (!food.trim()) return; setIsAiLoading(true);
    try {
      const prompt = `Analyze this food: "${food}". The user is currently on a "${user.dietPhase}" diet phase. Return a JSON object exactly like this: {"protein": estimated_grams_number, "calories": estimated_cals_number, "isJunk": boolean, "aiComment": "One short sentence judging the food based on their diet phase."}`;
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", { method: "POST", headers: { "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ model: "llama-3.1-8b-instant", messages: [{ role: "system", content: "You are a fitness nutritionist. Output ONLY valid JSON." }, { role: "user", content: prompt }], temperature: 0.1, max_tokens: 150 }) });
      const data = await response.json(); let rawJson = data.choices[0].message.content.replace(/```json/g, '').replace(/```/g, '').trim(); const parsed = JSON.parse(rawJson);
      setProtein(parsed.protein); logMeal(food, parsed.protein, parsed.isJunk, parsed.aiComment); setFood(''); setProtein('');
    } catch (err) { logMeal(food, parseInt(protein) || 0, false, null); setFood(''); setProtein(''); }
    setIsAiLoading(false);
  };
  return (
    <div className="space-y-8 animate-fade-in pb-24 pt-4 md:pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="premium-glass border-emerald-500/30 p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
          <h2 className="text-2xl font-black uppercase text-emerald-400 mb-6 flex items-center gap-3 tracking-widest border-b border-emerald-500/20 pb-4"><Pizza size={24} className="drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]"/> Fuel the Engine</h2>
          <p className="text-sm text-emerald-100/60 mb-8 uppercase tracking-widest bg-emerald-900/20 p-3 rounded-lg border border-emerald-500/20 inline-block">Current Phase: <span className="text-emerald-400 font-bold ml-2">{user.dietPhase}</span></p>
          <div className="space-y-6">
            <div>
              <label className="text-xs text-emerald-500/80 uppercase font-bold tracking-widest mb-2 block">Ration Description</label>
              <div className="flex gap-3">
                <input placeholder="E.g. Large Pepperoni Pizza" required value={food} onChange={e=>setFood(e.target.value)} className="flex-1 premium-input p-4 text-white focus:border-emerald-400" />
                <button type="button" onClick={estimateAndJudgeFood} disabled={isAiLoading || !food} className="bg-emerald-900/40 border border-emerald-500/50 text-emerald-400 p-4 rounded-xl hover:bg-emerald-800/60 hover:shadow-[0_0_20px_rgba(52,211,153,0.4)] transition-all flex items-center justify-center disabled:opacity-50" title="AI Macro Estimator & Judge">{isAiLoading ? <Loader2 className="animate-spin" size={24}/> : <Sparkles size={24}/>}</button>
              </div>
            </div>
            <div>
              <label className="text-xs text-emerald-500/80 uppercase font-bold tracking-widest mb-2 block">Manual Protein Log</label>
              <div className="flex gap-3">
                <input type="number" placeholder="Protein (g)" value={protein} onChange={e=>setProtein(e.target.value)} className="flex-1 premium-input p-4 text-white focus:border-emerald-400" />
                <button onClick={() => { logMeal(food, parseInt(protein)||0, false, null); setFood(''); setProtein(''); }} className="premium-btn bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/40 px-8 text-white">Log</button>
              </div>
            </div>
          </div>
        </div>
        <div className="premium-glass p-6 md:p-8">
          <h3 className="text-xl font-black text-white mb-6 uppercase tracking-widest border-b border-white/10 pb-4">Recent Rations</h3>
          <ul className="space-y-4 overflow-y-auto max-h-[400px] hide-scrollbar pr-2">
            {(user.meals || []).map((m, i) => (<li key={i} className="premium-glass p-5 flex justify-between items-center hover:border-emerald-500/40 hover:bg-white/5"><span className="text-gray-200 font-bold tracking-wide">{m.foodName}</span><span className="text-emerald-400 font-black tracking-widest text-lg drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">{m.protein}g PRO</span></li>))}
            {(!user.meals || user.meals.length === 0) && <p className="text-gray-500 italic text-center py-8">No meals logged yet.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
};

const ProfileTab = ({ user, updateProfile, logout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [bioText, setBioText] = useState(user.bio);
  const [dietPhase, setDietPhase] = useState(user.dietPhase || 'Maintenance');

  const handleSave = () => { updateProfile({ bio: bioText, dietPhase: dietPhase }); setIsEditing(false); };

  return (
    <div className="space-y-8 animate-fade-in pb-24 pt-4 md:pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="premium-glass p-10 text-center flex flex-col items-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-40 md:h-48 bg-gradient-to-b from-indigo-900/60 to-transparent"></div>
           <div className="absolute top-4 right-4 z-20"><button onClick={logout} className="text-xs font-bold text-gray-400 hover:text-white uppercase tracking-widest premium-glass px-4 py-2 hover:bg-white/10">Logout</button></div>
           <div className="z-10 mt-8 md:mt-12"><ImageAvatar heroName={user.heroName} size={160} /></div>
           <h2 className="text-4xl md:text-5xl font-black uppercase text-white mt-8 tracking-widest z-10 drop-shadow-lg">{user.username}</h2>
           <p className="text-indigo-400 font-bold mb-8 uppercase tracking-widest text-base z-10 drop-shadow">Level {user.level} {user.franchise}</p>
           {isEditing ? (
             <div className="w-full max-w-sm flex flex-col gap-4 z-10">
               <input value={bioText} onChange={e=>setBioText(e.target.value)} className="premium-input p-4 text-center" />
               <select value={dietPhase} onChange={e=>setDietPhase(e.target.value)} className="premium-input p-4 text-center appearance-none"><option value="Cut">Phase: Cut</option><option value="Bulk">Phase: Bulk</option><option value="Maintenance">Phase: Maintenance</option></select>
               <button onClick={handleSave} className="premium-btn bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/40 py-4 mt-2">Save Profile</button>
             </div>
           ) : (
             <div className="flex flex-col items-center gap-4 z-10 w-full max-w-sm">
                <p className="text-gray-300 italic text-base cursor-pointer hover:text-white premium-glass p-5 w-full hover:bg-white/5" onClick={()=>setIsEditing(true)}>"{user.bio}" <span className="text-xs font-bold text-indigo-400 ml-3 not-italic uppercase tracking-widest">Edit</span></p>
                <p className="text-sm text-gray-500 uppercase font-black tracking-widest mt-2">Protocol: <span className="text-indigo-400">{user.dietPhase}</span></p>
             </div>
           )}
        </div>
        <div className="space-y-8">
          <div className="premium-glass p-8">
            <h3 className="text-xl font-black uppercase text-emerald-400 mb-6 flex items-center gap-3 tracking-widest border-b border-white/10 pb-4"><Briefcase size={22} className="drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]"/> Arsenal Stash</h3>
            {(!user.inventory || user.inventory.length === 0) ? (<p className="text-gray-500 italic py-4">Hit a PR on core lifts to unlock loot.</p>) : (<ul className="space-y-4 max-h-[180px] overflow-y-auto hide-scrollbar pr-2">{user.inventory.map((item, i) => (<li key={i} className="premium-glass p-4 flex items-center gap-4 hover:border-emerald-500/40"><span className="text-emerald-500 bg-emerald-900/30 p-2 rounded-full"><Swords size={18}/></span><span className="text-base text-emerald-50 font-bold tracking-wider uppercase">{item}</span></li>))}</ul>)}
          </div>
          <div className="premium-glass p-8">
            <h3 className="text-xl font-black uppercase text-white mb-8 flex items-center gap-3 tracking-widest border-b border-white/10 pb-4">Loot Roadmap</h3>
            <div className="relative border-l-4 border-indigo-900/50 ml-4 space-y-10 max-h-[250px] overflow-y-auto hide-scrollbar pl-4 py-2">
              {LOOT_ROADMAP.map((tier, i) => (
                <div key={i} className="pl-6 relative group">
                  <div className={`absolute -left-[43px] top-1 w-6 h-6 rounded-full border-4 border-[#0a0a0a] transition-all duration-500 ${user.level >= tier.level ? 'bg-indigo-500 shadow-[0_0_20px_#6366f1] scale-110' : 'bg-gray-800'}`}></div>
                  <p className={`font-black uppercase tracking-widest text-base mb-1 transition-colors ${user.level >= tier.level ? 'text-white drop-shadow' : 'text-gray-600'}`}>Level {tier.level}</p>
                  <p className={`text-sm font-bold tracking-wide transition-colors ${user.level >= tier.level ? 'text-indigo-300' : 'text-gray-700'}`}>{tier.item}</p>
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
  const defaultCompanion = COMPANIONS[user.franchise] || COMPANIONS['God of War'];
  const [activeChannel, setActiveChannel] = useState('franchise'); 
  const [messages, setMessages] = useState([{ sender: 'ai', text: `I am here. Speak your mind.` }]);
  const [input, setInput] = useState('');
  const currentMentor = activeChannel === 'franchise' ? defaultCompanion : MENTORS[activeChannel];

  const handleChannelSwitch = (channel) => { setActiveChannel(channel); setMessages([{ sender: 'ai', text: `Frequency tuned. State your business.` }]); };
  const handleSend = async (e) => {
    e.preventDefault(); if (!input.trim()) return;
    const userText = input; setInput(''); setMessages(prev => [...prev, { sender: 'user', text: userText }, { sender: 'ai', text: '...' }]);
    try {
      let systemPrompt = activeChannel === 'franchise' ? `You are ${currentMentor.name} from the ${user.franchise} universe. You are an AI companion. Answer with 2 detailed paragraphs. No emojis.` : `${currentMentor.system}`;
      const chatHistory = messages.filter(m => m.text !== '...').map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }));
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", { method: "POST", headers: { "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ model: "llama-3.1-8b-instant", messages: [{ role: "system", content: systemPrompt }, ...chatHistory, { role: "user", content: userText }], temperature: 0.7, max_tokens: 600 }) });
      if (!response.ok) throw new Error(`HTTP Status ${response.status}`);
      const data = await response.json();
      setMessages(prev => { const newMsgs = [...prev]; newMsgs[newMsgs.length - 1] = { sender: 'ai', text: data.choices[0].message.content }; return newMsgs; });
    } catch (error) { setMessages(prev => { const newMsgs = [...prev]; newMsgs[newMsgs.length - 1] = { sender: 'ai', text: `ERROR: ${error.message}.` }; return newMsgs; }); }
  };
  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] animate-fade-in premium-glass overflow-hidden mt-4 md:mt-0 border-indigo-500/20">
      <div className={`p-6 border-b flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${currentMentor.bg} ${currentMentor.border} transition-colors duration-700 relative overflow-hidden`}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
        <div className="flex items-center gap-5 z-10">
          <span className="text-4xl md:text-5xl premium-glass p-4 rounded-full">{currentMentor.icon}</span>
          <div><h2 className={`font-black uppercase tracking-widest text-xl md:text-2xl drop-shadow-md ${currentMentor.color}`}>{currentMentor.name}</h2><p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2 flex items-center gap-2"><Radio size={14} className="animate-pulse text-indigo-400"/> Secure Comms Channel</p></div>
        </div>
        <select value={activeChannel} onChange={(e) => handleChannelSwitch(e.target.value)} className="premium-input p-3 text-xs md:text-sm font-bold uppercase tracking-widest w-full md:w-auto appearance-none cursor-pointer z-10"><option value="franchise">Lore: {defaultCompanion.name}</option><option value="Mike Mentzer">Mentor: Mike Mentzer</option><option value="Dorian Yates">Mentor: Dorian Yates</option><option value="Tom Platz">Mentor: Tom Platz</option><option value="Jeff Nippard">Mentor: Jeff Nippard</option></select>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar pb-6">
        {messages.map((m, i) => (<div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[90%] md:max-w-[70%] p-5 rounded-2xl text-sm md:text-base whitespace-pre-wrap leading-relaxed shadow-xl ${m.sender === 'user' ? 'bg-gradient-to-br from-indigo-600 to-indigo-500 text-white rounded-br-none font-medium' : 'premium-glass rounded-bl-none font-serif text-gray-200'}`}>{m.text}</div></div>))}
      </div>
      <div className="p-5 bg-black/60 border-t border-white/10 backdrop-blur-xl">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto premium-glass rounded-full p-2 flex gap-3"><input value={input} onChange={e=>setInput(e.target.value)} placeholder={`Consult ${currentMentor.name}...`} className="flex-1 bg-transparent px-6 text-white text-base focus:outline-none placeholder-gray-500 font-medium" /><button type="submit" className="p-4 bg-indigo-600 rounded-full text-white hover:bg-indigo-500 transition-all hover:scale-105 shadow-[0_0_15px_rgba(79,70,229,0.5)]"><Send size={20}/></button></form>
      </div>
    </div>
  );
};

const WorkoutModal = ({ isOpen, onClose, logWorkout }) => {
  const [mode, setMode] = useState('iron'); 
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [split, setSplit] = useState('Blood & Guts (HIT)');
  const [exercises, setExercises] = useState([{ bodyPart: 'Chest', name: '', weight: '', reps: '', sets: '' }]);
  const [cardioActivity, setCardioActivity] = useState('Running');
  const [duration, setDuration] = useState('');

  if (!isOpen) return null;

  const handleUpdateRow = (index, field, value) => { const newEx = [...exercises]; newEx[index] = { ...newEx[index], [field]: value }; setExercises(newEx); };
  const handleSubmit = (e) => { 
    e.preventDefault(); 
    if (mode === 'iron') { logWorkout(date, split, exercises, 'iron'); setExercises([{ bodyPart: 'Chest', name: '', weight: '', reps: '', sets: '' }]); } 
    else { logWorkout(date, null, [], 'cardio', { activity: cardioActivity, duration: parseInt(duration) }); setDuration(''); }
    onClose(); 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 animate-fade-in">
      <div className="premium-glass w-full max-w-lg md:max-w-3xl overflow-hidden flex flex-col max-h-[90vh] shadow-[0_0_50px_rgba(79,70,229,0.2)] border-indigo-500/30">
        <div className="flex justify-between items-center p-6 md:p-8 border-b border-white/10 bg-black/40">
          <h2 className="text-2xl md:text-3xl font-black uppercase text-indigo-400 tracking-widest flex items-center gap-3 drop-shadow-md"><Dumbbell size={28}/> Log Conquest</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition bg-white/5 p-2 rounded-lg hover:bg-white/10"><X size={28}/></button>
        </div>
        
        <div className="flex w-full bg-black/60 border-b border-white/10 p-2 gap-2">
           <button type="button" onClick={() => setMode('iron')} className={`flex-1 py-4 font-black uppercase tracking-widest text-sm rounded-lg transition-all ${mode === 'iron' ? 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)] text-white' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}>Iron (Weights)</button>
           <button type="button" onClick={() => setMode('cardio')} className={`flex-1 py-4 font-black uppercase tracking-widest text-sm rounded-lg transition-all ${mode === 'cardio' ? 'bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.5)] text-white' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}>Athletics (Sports)</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 overflow-y-auto space-y-8 flex-1 hide-scrollbar bg-[#050505]/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-2 block">Date</label><input type="date" required value={date} onChange={(e)=>setDate(e.target.value)} className="w-full premium-input p-4 text-white focus:border-indigo-500" /></div>
            {mode === 'iron' ? ( <div><label className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-2 block">Split</label><select value={split} onChange={(e)=>setSplit(e.target.value)} className="w-full premium-input p-4 text-white focus:border-indigo-500 appearance-none"><option>Blood & Guts (HIT)</option><option>Push/Pull/Legs</option><option>Upper/Lower</option><option>Full Body</option></select></div> ) : ( <div><label className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-2 block">Activity Type</label><select value={cardioActivity} onChange={(e)=>setCardioActivity(e.target.value)} className="w-full premium-input p-4 text-white focus:border-emerald-500 appearance-none"><option>Running</option><option>Cycling</option><option>Football (Soccer)</option><option>Basketball</option><option>Swimming</option></select></div> )}
          </div>
          
          {mode === 'iron' ? (
            <div className="space-y-6">
              <label className="text-xs text-gray-400 uppercase font-bold tracking-widest block border-b border-white/10 pb-2">Movements</label>
              {exercises.map((ex, i) => (
                <div key={i} className="flex flex-col gap-4 premium-glass p-5 hover:border-indigo-500/40 transition-colors">
                  <div className="flex flex-col md:flex-row gap-4">
                    <select value={ex.bodyPart} onChange={(e)=>handleUpdateRow(i, 'bodyPart', e.target.value)} className="w-full md:w-1/3 premium-input p-3 text-white focus:border-indigo-500 font-medium">
                      <optgroup label="Chest"><option value="Chest">Chest</option></optgroup>
                      <optgroup label="Back"><option value="Upper Back">Upper Back</option><option value="Lats">Lats</option><option value="Rhomboids">Rhomboids</option><option value="Lower Lats">Lower Lats</option><option value="Lower Back">Lower Back</option></optgroup>
                      <optgroup label="Legs"><option value="Quads">Quads</option><option value="Hamstrings">Hamstrings</option><option value="Calves">Calves</option><option value="Glutes">Glutes</option><option value="Abductors">Abductors</option><option value="Adductors">Adductors</option></optgroup>
                      <optgroup label="Shoulders"><option value="Front Delts">Front Delts</option><option value="Side Delts">Side Delts</option><option value="Rear Delts">Rear Delts</option></optgroup>
                      <optgroup label="Arms"><option value="Biceps">Biceps</option><option value="Triceps">Triceps</option><option value="Forearms">Forearms</option></optgroup>
                      <optgroup label="Core"><option value="Core">Core</option></optgroup>
                    </select>
                    <input placeholder="Exercise (e.g., Incline Press)" required value={ex.name} onChange={(e)=>handleUpdateRow(i, 'name', e.target.value)} className="w-full md:w-2/3 premium-input p-3 text-white focus:border-indigo-500 font-medium" />
                  </div>
                  <div className="flex gap-4"><input type="number" placeholder="Kg" required value={ex.weight} onChange={(e)=>handleUpdateRow(i, 'weight', e.target.value)} className="flex-1 w-full premium-input p-3 text-white focus:border-indigo-500 text-center font-black" /><input type="number" placeholder="Reps" required value={ex.reps} onChange={(e)=>handleUpdateRow(i, 'reps', e.target.value)} className="flex-1 w-full premium-input p-3 text-white focus:border-indigo-500 text-center font-black" /><input type="number" placeholder="Sets" required value={ex.sets} onChange={(e)=>handleUpdateRow(i, 'sets', e.target.value)} className="flex-1 w-full premium-input p-3 text-white focus:border-indigo-500 text-center font-black" /></div>
                </div>
              ))}
              <button type="button" onClick={()=>setExercises([...exercises, { bodyPart: 'Chest', name: '', weight: '', reps: '', sets: '' }])} className="premium-btn bg-white/5 border border-white/10 hover:bg-white/10 text-indigo-400 w-full flex items-center justify-center gap-2 py-4"><Plus size={20}/> Add Movement</button>
            </div>
          ) : (
            <div className="space-y-6 premium-glass p-6 border-emerald-500/30">
               <div><label className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-3 block">Duration</label><div className="flex items-center gap-4"><Timer size={28} className="text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"/><input type="number" placeholder="Total Minutes Active" required value={duration} onChange={(e)=>setDuration(e.target.value)} className="w-full premium-input p-5 text-white focus:border-emerald-500 text-lg font-black" /></div></div>
               <p className="text-sm text-gray-400 italic mt-2 border-t border-white/10 pt-4">Athletic performance calculates XP based on time-under-tension and metabolic load.</p>
            </div>
          )}
        </form>
        <div className="p-6 md:p-8 border-t border-white/10 bg-black/60">
          <button onClick={handleSubmit} className={`premium-btn w-full py-5 text-lg text-white ${mode === 'iron' ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/40' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/40'}`}>Commit to {mode === 'iron' ? 'Iron' : 'Glory'}</button>
        </div>
      </div>
    </div>
  );
};

const LOGIN_THEMES = [
  { name: 'D&D', bgClass: 'bg-[#050505] bg-[url("https://www.transparenttextures.com/patterns/dark-leather.png")]', cardBg: 'premium-glass border-amber-900/50', textAccent: 'text-amber-500', icon: <Scroll size={64} className="mx-auto text-amber-600 mb-8 drop-shadow-[0_0_15px_rgba(217,119,6,0.8)]" />, btnClass: 'premium-btn bg-gradient-to-r from-amber-800 to-amber-600 text-black shadow-amber-600/40 hover:from-amber-700 hover:to-amber-500' },
  { name: 'Gotham', bgClass: 'bg-zinc-950 bg-[url("https://www.transparenttextures.com/patterns/concrete-wall.png")]', cardBg: 'premium-glass border-blue-900/50', textAccent: 'text-blue-500', icon: <Shield size={64} className="mx-auto text-blue-600 mb-8 drop-shadow-[0_0_15px_rgba(37,99,235,0.8)]" />, btnClass: 'premium-btn bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-blue-600/40 hover:from-blue-800 hover:to-blue-600' },
  { name: 'Tron', bgClass: 'bg-black bg-[url("https://www.transparenttextures.com/patterns/cubes.png")]', cardBg: 'premium-glass border-cyan-500/50 shadow-[0_0_40px_rgba(6,182,212,0.2)]', textAccent: 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]', icon: <Swords size={64} className="mx-auto text-cyan-400 mb-8 drop-shadow-[0_0_20px_rgba(6,182,212,1)]" />, btnClass: 'premium-btn bg-black border-2 border-cyan-500 text-cyan-400 shadow-cyan-500/40 hover:bg-cyan-950' }
];

const DndLogin = ({ engine }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState(''); const [password, setPassword] = useState(''); const [heroName, setHeroName] = useState('Vito');
  const [error, setError] = useState(''); const [isLoading, setIsLoading] = useState(false);
  const [theme] = useState(LOGIN_THEMES[Math.floor(Math.random() * LOGIN_THEMES.length)]);

  const handleAuth = async (e) => {
    e.preventDefault(); setIsLoading(true); setError('');
    let res = isRegistering ? await engine.registerUser(username, password, heroName, HEROES[heroName].franchise) : await engine.loginUser(username, password);
    if (!res.success) setError(res.error);
    setIsLoading(false);
  };

  if (engine.isDbLoading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><Loader2 className="animate-spin text-indigo-500" size={64} /></div>;

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-1000 ${theme.bgClass}`}>
      <style>{`.premium-glass { background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 8px 32px 0 rgba(0,0,0,0.3), inset 0 1px 0 0 rgba(255,255,255,0.1); border-radius: 1.5rem; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); } .premium-input { background: rgba(0,0,0,0.4); box-shadow: inset 0 2px 4px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.05); border-radius: 0.75rem; transition: all 0.3s ease; } .premium-input:focus { border-color: rgba(255,255,255,0.3); background: rgba(0,0,0,0.6); outline: none; } .premium-btn { font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 0.75rem; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); } .premium-btn:hover:not(:disabled) { transform: translateY(-3px); filter: brightness(1.1); }`}</style>
      <div className={`${theme.cardBg} p-8 md:p-14 w-full max-w-md md:max-w-xl text-center relative overflow-hidden group`}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
        {theme.icon}
        <h1 className={`text-4xl md:text-5xl font-black uppercase tracking-widest mb-3 font-serif ${theme.textAccent}`}>{theme.name} Realm</h1>
        <p className="text-gray-400 font-serif italic mb-10 md:text-xl">Swear your blood oath.</p>
        {error && <p className="text-red-500 text-sm mb-6 font-bold animate-pulse bg-red-950/40 p-3 rounded-lg border border-red-500/30">{error}</p>}
        <form onSubmit={handleAuth} className="space-y-5">
          <input type="text" required placeholder="Alias (Username)" className="w-full premium-input p-5 text-white text-lg" onChange={(e) => setUsername(e.target.value)} />
          <input type="password" required placeholder="Passcode" className="w-full premium-input p-5 text-white text-lg" onChange={(e) => setPassword(e.target.value)} />
          {isRegistering && (
            <div className="pt-6 text-left border-t border-white/10 mt-6">
              <label className={`block text-sm font-black uppercase tracking-widest mb-4 ${theme.textAccent}`}>Select Identity</label>
              <select className="w-full premium-input p-5 text-white text-lg appearance-none cursor-pointer" onChange={(e) => setHeroName(e.target.value)} value={heroName}>{Object.keys(HEROES).map(name => <option key={name} value={name}>{name} ({HEROES[name].franchise})</option>)}</select>
              <div className="flex justify-center mt-8 p-8 bg-black/40 rounded-2xl shadow-inner border border-white/5 relative"><ImageAvatar heroName={heroName} size={120} /></div>
            </div>
          )}
          <button type="submit" disabled={isLoading} className={`w-full py-5 mt-8 text-lg ${theme.btnClass} flex justify-center items-center gap-3 disabled:opacity-50 disabled:transform-none`}>{isLoading ? <Loader2 className="animate-spin" size={24}/> : (isRegistering ? 'Forge Legacy' : 'Enter Realm')}</button>
        </form>
        <button onClick={() => { setIsRegistering(!isRegistering); setError(''); }} className="mt-10 text-gray-500 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors">{isRegistering ? 'Already in the family? Login.' : 'New to town? Register.'}</button>
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
    <div className={`min-h-screen text-gray-100 font-sans flex overflow-hidden transition-all duration-75 flex-col md:flex-row ${engine.isScreenShaking ? 'animate-rage bg-red-950' : 'bg-[#050505]'}`}>
      <style>{`
        .premium-glass { background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.06); box-shadow: 0 8px 32px 0 rgba(0,0,0,0.3), inset 0 1px 0 0 rgba(255,255,255,0.05); border-radius: 1.25rem; transition: all 0.3s ease; }
        .premium-glass:hover { border-color: rgba(255,255,255,0.15); box-shadow: 0 12px 40px 0 rgba(0,0,0,0.4), inset 0 1px 0 0 rgba(255,255,255,0.1); }
        .premium-input { background: rgba(0,0,0,0.3); box-shadow: inset 0 2px 5px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.05); border-radius: 0.75rem; transition: all 0.3s ease; }
        .premium-input:focus { border-color: rgba(255,255,255,0.2); background: rgba(0,0,0,0.5); outline: none; }
        .premium-btn { font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 0.75rem; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .premium-btn:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.1); }
        .hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } 
        .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; } 
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } } 
        @keyframes slideDown { from { opacity: 0; transform: translate(-50%, -20px); } to { opacity: 1; transform: translate(-50%, 0); } } 
        .animate-slide-down { animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes rage { 0%, 100% { transform: translate(0, 0) scale(1); } 10%, 30%, 50%, 70%, 90% { transform: translate(-12px, 12px) scale(1.05); } 20%, 40%, 60%, 80% { transform: translate(12px, -12px) scale(1.05); } } 
        .animate-rage { animation: rage 0.7s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes flash { 0%, 100% { opacity: 0; } 50% { opacity: 1; } }
        .animate-flash { animation: flash 0.7s ease-in-out; }
      `}</style>

      {/* RAGE FLASH OVERLAY */}
      {engine.isScreenShaking && <div className="fixed inset-0 bg-red-600/50 mix-blend-overlay z-[100] pointer-events-none animate-flash"></div>}

      {/* LEGEND CELEBRATION GIF OVERLAY */}
      {engine.workoutCelebration && (
        <div className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md animate-fade-in">
          <img src={engine.workoutCelebration.gif} alt="Celebration" className="w-72 h-72 md:w-[500px] md:h-[500px] object-cover rounded-2xl shadow-[0_0_100px_rgba(255,255,255,0.3)] mb-10 border border-white/20" />
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-widest text-white mb-4 drop-shadow-2xl">{engine.workoutCelebration.name}</h2>
          <p className="text-2xl md:text-4xl text-indigo-400 italic font-serif text-center px-6 drop-shadow-lg">"{engine.workoutCelebration.quote}"</p>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-72 border-r border-white/5 bg-[#0a0a0a]/80 backdrop-blur-3xl z-40 p-5 shadow-[5px_0_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-4 mb-12 px-2 mt-4"><Crown className="text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" size={32}/><h1 className="font-serif font-black text-2xl tracking-widest text-amber-500">SYNDICATE</h1></div>
        <nav className="flex-1 space-y-4">
          <button onClick={() => setActiveTab('home')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all ${activeTab === 'home' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-[inset_0_0_20px_rgba(99,102,241,0.2)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}><Home size={22} /> <span className="font-bold uppercase tracking-widest text-sm">Base</span></button>
          <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all ${activeTab === 'analytics' ? 'bg-pink-600/20 text-pink-400 border border-pink-500/30 shadow-[inset_0_0_20px_rgba(236,72,153,0.2)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}><Activity size={22} /> <span className="font-bold uppercase tracking-widest text-sm">Analytics</span></button>
          <button onClick={() => setActiveTab('food')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all ${activeTab === 'food' ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 shadow-[inset_0_0_20px_rgba(16,185,129,0.2)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}><Pizza size={22} /> <span className="font-bold uppercase tracking-widest text-sm">Fuel</span></button>
          <button onClick={() => setActiveTab('chat')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all ${activeTab === 'chat' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30 shadow-[inset_0_0_20px_rgba(168,85,247,0.2)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}><MessageSquare size={22} /> <span className="font-bold uppercase tracking-widest text-sm">Comms</span></button>
          <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[inset_0_0_20px_rgba(59,130,246,0.2)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}><User size={22} /> <span className="font-bold uppercase tracking-widest text-sm">Profile</span></button>
        </nav>
        <button onClick={() => setIsWorkoutModalOpen(true)} className="premium-btn w-full flex items-center justify-center gap-3 bg-indigo-600 text-white p-5 shadow-[0_0_20px_rgba(79,70,229,0.4)]"><Dumbbell size={22} /> <span className="text-sm">Log Grind</span></button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 relative overflow-y-auto hide-scrollbar z-10 flex flex-col w-full h-screen bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-repeat bg-[length:10px_10px]">
        <TopSearchBar onNavigate={setActiveTab} onOpenWorkout={() => setIsWorkoutModalOpen(true)} />
        <div className="w-full max-w-md md:max-w-6xl mx-auto px-4 md:px-10 py-4 md:py-10 flex-1">
          {activeTab === 'home' && <DashboardTab user={engine.currentUser} registry={engine.registry} logout={engine.logout} />}
          {activeTab === 'analytics' && <AnalyticsTab user={engine.currentUser} />}
          {activeTab === 'food' && <FoodTab user={engine.currentUser} logMeal={engine.logMeal} />}
          {activeTab === 'chat' && <ChatTab user={engine.currentUser} />}
          {activeTab === 'profile' && <ProfileTab user={engine.currentUser} updateProfile={engine.updateProfile} logout={engine.logout} />}
        </div>
      </main>

      {engine.aiPopup && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down w-[90%] max-w-sm md:max-w-lg"><div className="premium-glass p-5 md:p-6 bg-indigo-950/90 shadow-[0_20px_50px_rgba(79,70,229,0.5)] border-indigo-500/50 flex items-center gap-5"><span className="text-4xl drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">✨</span><p className="text-indigo-50 font-serif italic text-sm md:text-lg leading-relaxed">"{engine.aiPopup.message}"</p></div></div>
      )}

      <WorkoutModal isOpen={isWorkoutModalOpen} onClose={() => setIsWorkoutModalOpen(false)} logWorkout={engine.logFullWorkout} />

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 w-full bg-[#0a0a0a]/90 backdrop-blur-2xl border-t border-white/5 z-40 rounded-t-[2rem] shadow-[0_-10px_50px_rgba(0,0,0,0.7)] pb-safe">
        <div className="flex justify-around items-center px-2 py-5 relative">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center w-14 transition-colors ${activeTab === 'home' ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'text-gray-600 hover:text-gray-400'}`}><Home size={24} /><span className="text-[9px] mt-2 uppercase font-black tracking-widest">Base</span></button>
          <button onClick={() => setActiveTab('analytics')} className={`flex flex-col items-center w-14 transition-colors ${activeTab === 'analytics' ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'text-gray-600 hover:text-gray-400'}`}><Activity size={24} /><span className="text-[9px] mt-2 uppercase font-black tracking-widest">Data</span></button>
          <div className="relative w-20 flex justify-center"><button onClick={() => setIsWorkoutModalOpen(true)} className="absolute -top-12 bg-indigo-600 text-white p-5 rounded-full shadow-[0_10px_30px_rgba(79,70,229,0.7)] border-[6px] border-[#050505] hover:scale-110 hover:bg-indigo-500 transition-all transform duration-300"><Dumbbell size={28} /></button></div>
          <button onClick={() => setActiveTab('food')} className={`flex flex-col items-center w-14 transition-colors ${activeTab === 'food' ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'text-gray-600 hover:text-gray-400'}`}><Pizza size={24} /><span className="text-[9px] mt-2 uppercase font-black tracking-widest">Fuel</span></button>
          <button onClick={() => setActiveTab('chat')} className={`flex flex-col items-center w-14 transition-colors ${activeTab === 'chat' ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'text-gray-600 hover:text-gray-400'}`}><MessageSquare size={24} /><span className="text-[9px] mt-2 uppercase font-black tracking-widest">Comms</span></button>
        </div>
      </nav>
    </div>
  );
}
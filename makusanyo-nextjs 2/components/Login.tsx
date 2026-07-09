'use client';

import { useState } from 'react';
import type { User } from '@prisma/client';

export default function Login({ users, onLogin }: { users: User[]; onLogin: (u: User) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [anim, setAnim] = useState<'spin' | 'shake' | null>(null);

  function submit() {
    const u = users.find((x) => x.username.toLowerCase() === username.trim().toLowerCase());
    if (!u) {
      setError('Unknown username');
      setAnim('shake');
      setTimeout(() => setAnim(null), 500);
      return;
    }
    if (password !== u.password) {
      setError('Incorrect password — demo password is 941');
      setAnim('shake');
      setTimeout(() => setAnim(null), 500);
      return;
    }
    setAnim('spin');
    setTimeout(() => onLogin(u), 650);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[radial-gradient(1100px_700px_at_50%_-10%,#16324f,#0a1420_60%)] bg-navy-950">
      <div className="w-full max-w-[420px] rounded-[22px] border border-white/10 bg-navy-700/60 backdrop-blur-xl p-9 shadow-2xl">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-[70px] h-[70px] rounded-full bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center font-serif font-bold text-2xl text-navy-950 shadow-lg">
            941
          </div>
          <div>
            <div className="font-serif font-bold text-2xl text-amber-50">Welcome to Makusanyo</div>
            <div className="text-xs text-slate-300 mt-1.5">941 Regt Financial Management</div>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-xs text-slate-300 mb-1.5 font-medium">Username</label>
          <input
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(null); }}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="Enter username"
            className="w-full px-4 py-3 rounded-xl border border-[#2c496e] bg-navy-950/70 text-white text-sm focus:outline-none focus:border-gold-500"
          />
        </div>
        <div className="mt-3.5">
          <label className="block text-xs text-slate-300 mb-1.5 font-medium">Password</label>
          <div className="relative flex items-center">
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(null); }}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              placeholder="Enter password"
              className="w-full px-4 py-3 pr-16 rounded-xl border border-[#2c496e] bg-navy-950/70 text-white text-sm focus:outline-none focus:border-gold-500"
            />
            <button
              onClick={() => setShowPass((s) => !s)}
              className="absolute right-2 px-2.5 py-1.5 rounded-md bg-white/5 text-slate-300 text-xs font-semibold"
            >
              {showPass ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-3 text-xs text-red-300 bg-red-900/20 border border-red-800/40 rounded-lg px-3 py-2 flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">!</span>
            {error}
          </div>
        )}

        <button
          onClick={submit}
          className={
            'w-full mt-5 py-3.5 rounded-xl font-bold text-navy-950 bg-gradient-to-br from-gold-400 to-gold-600 shadow-lg ' +
            (anim === 'spin' ? 'animate-[spin_0.6s_ease-in-out_1]' : anim === 'shake' ? 'animate-[shake_0.4s_ease-in-out]' : '')
          }
        >
          Log In
        </button>

        <div className="mt-4 pt-3.5 border-t border-white/10 text-center text-[11px] text-slate-400 leading-relaxed">
          Demo users: <span className="text-slate-300 font-mono">admin · co · upm · cashier · auditor</span>
          <br />
          Password for all: <span className="font-mono text-gold-500">941</span>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { increment, decrement, incrementByAmount } from '@/store/slices/counterSlice';
import { useState } from 'react';

export default function Home() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();
  const [incrementAmount, setIncrementAmount] = useState('2');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-6 sm:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm flex flex-col gap-8">
        <div className="flex flex-col items-center gap-4">
          <div className="pointer-events-none relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-indigo-500/30 before:to-transparent before:blur-2xl before:-z-10 before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-500/40 after:via-indigo-500/40 after:blur-2xl after:content-['']">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg z-10 text-center pointer-events-auto">
              Next.js + <span className="text-indigo-400">Tailwind</span> + <span className="text-sky-400">RTK</span>
            </h1>
          </div>
          <p className="text-zinc-400 text-lg z-10">
            A premium, robust foundation for your next big idea.
          </p>
        </div>

        {/* RTK Interactive Component */}
        <div className="relative group rounded-3xl bg-zinc-900/50 p-8 ring-1 ring-white/10 shadow-2xl backdrop-blur-xl z-10 w-full max-w-md overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Redux Counter</h2>
          
          <div className="flex items-center justify-center gap-6 mb-8">
            <button
              className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-3xl font-bold text-white shadow-inner transition hover:bg-zinc-700 hover:scale-105 active:scale-95 ring-1 ring-white/5"
              aria-label="Decrement value"
              onClick={() => dispatch(decrement())}
            >
              -
            </button>
            <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400 w-24 text-center">
              {count}
            </span>
            <button
              className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-3xl font-bold text-white shadow-inner transition hover:bg-zinc-700 hover:scale-105 active:scale-95 ring-1 ring-white/5"
              aria-label="Increment value"
              onClick={() => dispatch(increment())}
            >
              +
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <input
                className="w-full rounded-xl bg-zinc-950/50 px-4 py-3 text-lg text-white ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow disabled:opacity-50"
                aria-label="Set increment amount"
                value={incrementAmount}
                onChange={(e) => setIncrementAmount(e.target.value)}
                type="number"
              />
              <button
                className="rounded-xl bg-indigo-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-indigo-400 hover:shadow-indigo-500/25 active:scale-95 whitespace-nowrap"
                onClick={() => dispatch(incrementByAmount(Number(incrementAmount) || 0))}
              >
                Add Amount
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

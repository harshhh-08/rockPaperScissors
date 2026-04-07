import { useState, useCallback, useMemo } from 'react';

const MOVES = ['Rock', 'Paper', 'Scissors'];

const MOVE_EMOJI = { Rock: '🪨', Paper: '📄', Scissors: '✂️' };

const getWinner = (player, computer) => {
  if (player === computer) return 'draw';
  if (
    (player === 'Rock' && computer === 'Scissors') ||
    (player === 'Paper' && computer === 'Rock') ||
    (player === 'Scissors' && computer === 'Paper')
  ) {
    return 'player';
  }
  return 'computer';
};

const randomMove = () => MOVES[Math.floor(Math.random() * MOVES.length)];

const App = () => {
  const [playerMove, setPlayerMove] = useState(null);
  const [computerMove, setComputerMove] = useState(null);
  const [result, setResult] = useState(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [history, setHistory] = useState([]);

  const totalRounds = useMemo(() => history.length, [history]);

  const handlePlay = useCallback((chosenMove) => {
    const pMove = chosenMove;
    const cMove = randomMove();
    const winner = getWinner(pMove, cMove);

    setPlayerMove(pMove);
    setComputerMove(cMove);
    setResult(winner);

    if (winner === 'player') {
      setPlayerScore((prev) => prev + 1);
      setStreak((prev) => {
        const next = prev + 1;
        setBestStreak((best) => Math.max(best, next));
        return next;
      });
    } else if (winner === 'computer') {
      setComputerScore((prev) => prev + 1);
      setStreak(0);
    }

    setHistory((prev) => [
      { winner, playerMove: pMove, computerMove: cMove },
      ...prev
    ]);
  }, []);

  const resetGame = useCallback(() => {
    setPlayerMove(null);
    setComputerMove(null);
    setResult(null);
    setPlayerScore(0);
    setComputerScore(0);
    setStreak(0);
    setBestStreak(0);
    setHistory([]);
  }, []);

  const resultLabel = result === 'player'
    ? 'Excellent! You Won'
    : result === 'computer'
      ? 'Aww! Computer Wins'
      : result === 'draw'
        ? 'A Peaceful Draw'
        : null;

  const resultColor = result === 'player'
    ? 'text-emerald-700'
    : result === 'computer'
      ? 'text-rose-700'
      : 'text-amber-700';

  return (
    <div className="min-h-screen bg-[#fdf9f0] flex flex-col items-center justify-center p-4 selection:bg-orange-100 italic-none">
      <div className="w-full max-w-2xl bg-[#faf7f2] rounded-3xl shadow-xl border border-stone-200/50 overflow-hidden">

        <div className="p-8 pb-4 text-center border-b border-stone-100">
          <h1 className="text-4xl font-extrabold text-stone-800 tracking-tight">
            Rock <span className="text-stone-400">·</span> Paper <span className="text-stone-400">·</span> Scissors
          </h1>
          <p className="text-stone-500 font-medium mt-1">A Classic Showdown</p>
        </div>

        <div className="p-8 pt-6 space-y-8">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/50 rounded-2xl p-4 border border-stone-100 text-center flex flex-col items-center justify-center">
              <span className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">Your Wins</span>
              <span className="text-4xl font-black text-stone-800">{playerScore}</span>
            </div>

            <div className="flex flex-col items-center justify-center text-center px-2">
              <div className="bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 shadow-sm">
                Round {totalRounds}
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-[10px] font-bold uppercase text-stone-400 flex items-center gap-1.5">
                  Streak: <span className="text-stone-800 text-sm">{streak}</span>
                </p>
                <p className="text-[10px] font-bold uppercase text-stone-400 flex items-center gap-1.5">
                  Best: <span className="text-stone-800 text-sm">{bestStreak}</span>
                </p>
              </div>
            </div>

            <div className="bg-white/50 rounded-2xl p-4 border border-stone-100 text-center flex flex-col items-center justify-center">
              <span className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">CPU Wins</span>
              <span className="text-4xl font-black text-stone-800">{computerScore}</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-stone-200/40 shadow-sm relative overflow-hidden flex flex-col items-center justify-center min-h-[14rem]">
            {result ? (
              <div className="w-full flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-300">
                <div className="flex items-center gap-12 sm:gap-16">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-24 h-24 bg-stone-50 rounded-3xl border border-stone-200 flex items-center justify-center text-5xl shadow-inner-sm">
                      {MOVE_EMOJI[playerMove]}
                    </div>
                    <span className="text-[10px] font-bold uppercase text-stone-500 tracking-widest">You</span>
                  </div>

                  <span className="text-stone-300 font-bold text-lg italic tracking-tighter -rotate-12">VS</span>

                  <div className="flex flex-col items-center gap-3">
                    <div className="w-24 h-24 bg-stone-50 rounded-3xl border border-stone-200 flex items-center justify-center text-5xl shadow-inner-sm">
                      {MOVE_EMOJI[computerMove]}
                    </div>
                    <span className="text-[10px] font-bold uppercase text-stone-500 tracking-widest">CPU</span>
                  </div>
                </div>
                <h2 className={`text-3xl font-black italic tracking-tight ${resultColor}`}>
                  {resultLabel}
                </h2>
              </div>
            ) : (
              <div className="text-center opacity-40">
                <p className="text-stone-400 text-lg font-medium italic">Make your selection below</p>
              </div>
            )}

            <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500/10" />
            <div className="absolute top-0 right-0 w-2 h-full bg-amber-500/10" />
          </div>

          <div className="grid grid-cols-3 gap-6 pt-2">
            <button
              onClick={() => handlePlay('Rock')}
              className="flex flex-col items-center gap-4 py-8 bg-stone-700 text-white rounded-[2.5rem] shadow-lg shadow-stone-200 hover:shadow-xl hover:bg-stone-800 hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-300 border-4 border-white/10 group overflow-hidden relative"
            >
              <span className="text-4xl transition-transform duration-500 group-hover:scale-110">🪨</span>
              <span className="text-xs font-bold uppercase tracking-widest">Rock</span>
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              onClick={() => handlePlay('Paper')}
              className="flex flex-col items-center gap-4 py-8 bg-emerald-600 text-white rounded-[2.5rem] shadow-lg shadow-emerald-100 hover:shadow-xl hover:bg-emerald-700 hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-300 border-4 border-white/10 group overflow-hidden relative"
            >
              <span className="text-4xl transition-transform duration-500 group-hover:scale-110">📄</span>
              <span className="text-xs font-bold uppercase tracking-widest">Paper</span>
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              onClick={() => handlePlay('Scissors')}
              className="flex flex-col items-center gap-4 py-8 bg-amber-500 text-white rounded-[2.5rem] shadow-lg shadow-amber-100 hover:shadow-xl hover:bg-amber-600 hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-300 border-4 border-white/10 group overflow-hidden relative"
            >
              <span className="text-4xl transition-transform duration-500 group-hover:scale-110">✂️</span>
              <span className="text-xs font-bold uppercase tracking-widest">Scissors</span>
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          <div className="pt-8 border-t border-stone-200/60">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-stone-400">Battle Timeline</h3>
              <button
                onClick={resetGame}
                className="text-[10px] font-bold uppercase tracking-widest text-stone-500 hover:text-rose-500 transition-colors flex items-center gap-1.5"
              >
                <span>↻</span> Reset Session
              </button>
            </div>

            <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1 customize-scrollbar">
              {history.length > 0 ? (
                history.map((round, index) => (
                  <div
                    key={index}
                    className="bg-white border border-stone-200/50 rounded-2xl px-6 py-4 flex items-center justify-between text-xs font-bold shadow-sm-hover transition-all duration-300 hover:border-stone-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-stone-600 italic">
                        <span className="not-italic text-sm">{MOVE_EMOJI[round.playerMove]}</span>
                        <span className="text-[10px] uppercase font-black text-stone-300 mx-1">VS</span>
                        <span className="not-italic text-sm">{MOVE_EMOJI[round.computerMove]}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[9px] uppercase tracking-wider font-black ${round.winner === 'player' ? 'bg-emerald-50 text-emerald-700' :
                        round.winner === 'computer' ? 'bg-rose-50 text-rose-700' :
                          'bg-amber-50 text-amber-600'
                      }`}>
                      {round.winner === 'player' ? 'Victory' :
                        round.winner === 'computer' ? 'Defeat' :
                          'Draw'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 rounded-2xl border-2 border-dashed border-stone-100">
                  <p className="text-stone-300 text-[10px] font-bold uppercase tracking-widest">
                    No battles recorded
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .customize-scrollbar::-webkit-scrollbar { width: 4px; }
        .customize-scrollbar::-webkit-scrollbar-thumb { background: #e7e5e4; border-radius: 10px; }
        .customize-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .shadow-sm-hover:hover { box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05); }
      `}</style>
    </div>
  );
};

export default App;
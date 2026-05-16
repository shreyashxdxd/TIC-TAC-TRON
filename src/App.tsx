/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Trophy, User, Monitor, LogIn, UserPlus, ArrowLeft, Mail, Lock, Smartphone, Cpu, ShieldCheck } from 'lucide-react';

type Player = 'X' | 'O' | null;
type View = 'landing' | 'mode_selection' | 'game';
type GameMode = 'bot' | 'local' | null;

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<Player | 'Draw'>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  const calculateWinner = (squares: Player[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: [a, b, c] };
      }
    }
    if (!squares.includes(null)) {
      return { winner: 'Draw' as const, line: null };
    }
    return null;
  };

  const handleClick = (i: number) => {
    if (winner || board[i]) return;
    if (gameMode === 'bot' && !isXNext) return;
    
    const newBoard = board.slice();
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  useEffect(() => {
    const result = calculateWinner(board);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
      return;
    }

    // Bot move logic
    if (gameMode === 'bot' && !isXNext && !winner) {
      const timer = setTimeout(() => {
        const availableMoves = board
          .map((val, idx) => (val === null ? idx : null))
          .filter((val) => val !== null) as number[];
        
        if (availableMoves.length > 0) {
          let move: number | null = null;
          const winningLines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
          ];

          // 1. Try to win
          for (const line of winningLines) {
            const [a, b, c] = line;
            const values = [board[a], board[b], board[c]];
            const botCount = values.filter(v => v === 'O').length;
            const nullCount = values.filter(v => v === null).length;
            if (botCount === 2 && nullCount === 1) {
              move = line[values.indexOf(null)];
              break;
            }
          }

          // 2. Block player
          if (move === null) {
            for (const line of winningLines) {
              const [a, b, c] = line;
              const values = [board[a], board[b], board[c]];
              const playerCount = values.filter(v => v === 'X').length;
              const nullCount = values.filter(v => v === null).length;
              if (playerCount === 2 && nullCount === 1) {
                move = line[values.indexOf(null)];
                break;
              }
            }
          }

          // 3. Take center
          if (move === null && board[4] === null) {
            move = 4;
          }

          // 4. Random move
          if (move === null) {
            move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
          }

          if (move !== null) {
            const newBoard = board.slice();
            newBoard[move] = 'O';
            setBoard(newBoard);
            setIsXNext(true);
          }
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [board, gameMode, isXNext, winner]);

  const resetBoard = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine(null);
  };

  const returnToLanding = () => {
    resetBoard();
    setGameMode(null);
    setView('landing');
  };

  const Y2KButton = ({ onClick, children, variant = 'primary', className = '' }: any) => {
    const variants = {
      primary: 'glossy-black hover:scale-105 active:scale-95',
      secondary: 'bg-white/40 text-y2k-blue border border-white/60 hover:bg-white/60 hover:scale-105 active:scale-95',
      ghost: 'bg-transparent text-y2k-black/40 hover:text-y2k-black',
    };

    return (
      <motion.button
        whileHover={{ y: -2 }}
        onClick={onClick}
        className={`px-8 py-4 font-display text-[10px] tracking-[0.2em] uppercase rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-md shadow-lg ${variants[variant as keyof typeof variants]} ${className}`}
      >
        {children}
      </motion.button>
    );
  };

  return (
    <div id="y2k-app" className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-y2k-blue/20">
      {/* Decorative Blobs (Frutiger Aero / Image Style) */}
      <div className="y2k-blob w-[500px] h-[500px] -top-20 -left-20 opacity-80" />
      <div className="y2k-blob w-[600px] h-[600px] -bottom-40 -right-20 opacity-60 blur-xl" />
      <div className="y2k-blob w-40 h-40 top-1/4 right-20 opacity-40 animate-pulse" />
      <div className="y2k-blob w-20 h-20 bottom-1/4 left-32 opacity-30" />
      
      {/* Tech Accents: Dot Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.05]"
           style={{ 
             backgroundImage: `radial-gradient(var(--color-y2k-blue) 1px, transparent 0)`,
             backgroundSize: '24px 24px',
           }} 
      />

      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div 
            key="landing"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="z-10 flex flex-col items-center max-w-md w-full"
          >
            <div className="mb-4 flex items-center gap-2 px-3 py-1 glass-panel rounded-full border-white/40">
              <Cpu size={10} className="text-y2k-blue" />
              <span className="text-[8px] font-mono font-bold tracking-[0.3em] opacity-50">NODE_STATUS: ONLINE</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-8xl chrome-text tracking-widest mb-16 px-4 py-2 relative text-center whitespace-nowrap">
              TIC-TAC-TRON
              <div className="absolute -bottom-4 left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-y2k-blue/30 to-transparent blur-[2px]" />
            </h1>

            <div className="flex flex-col gap-6 w-full px-8">
              <Y2KButton onClick={() => setView('mode_selection')} className="w-full h-24 text-sm glossy-black">
                <Smartphone size={24} className="text-y2k-blue animate-pulse" />
                ENTER THE GAME
              </Y2KButton>
            </div>

            <p className="mt-20 text-y2k-deep font-mono text-[9px] tracking-[0.6em] opacity-40 uppercase font-bold text-center">
              Global Neural Access Established
            </p>
          </motion.div>
        )}

        {view === 'mode_selection' && (
          <motion.div 
            key="mode_selection"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="z-10 flex flex-col items-center max-w-sm w-full"
          >
            <div className="glass-panel p-10 flex flex-col w-full relative overflow-hidden items-center">
              <button 
                onClick={() => setView('landing')}
                className="absolute top-6 left-6 text-y2k-blue flex items-center gap-2 font-mono text-[10px] hover:opacity-100 opacity-60 transition-opacity font-bold"
              >
                <ArrowLeft size={14} /> BACK
              </button>

              <h2 className="text-2xl font-display text-y2k-black/80 mb-10 mt-6 text-center tracking-tighter">SELECT MODE</h2>
              
              <div className="flex flex-col gap-5 w-full">
                <Y2KButton 
                  onClick={() => {
                    setGameMode('bot');
                    setView('game');
                  }}
                  className="w-full flex-col h-auto py-6"
                >
                  <Monitor size={20} className="text-y2k-purple" />
                  <div className="flex flex-col items-center">
                    <span>Against Computer</span>
                    <span className="text-[8px] opacity-40 lowercase"></span>
                  </div>
                </Y2KButton>

                <Y2KButton 
                  variant="secondary"
                  onClick={() => {
                    setGameMode('local');
                    setView('game');
                  }}
                  className="w-full flex-col h-auto py-6 bg-y2k-blue/5"
                >
                  <User size={20} className="text-y2k-blue" />
                  <div className="flex flex-col items-center">
                    <span>Local Multiplayer</span>
                    <span className="text-[8px] opacity-40 lowercase">PvP connection</span>
                  </div>
                </Y2KButton>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'game' && (
          <motion.div 
            key="game"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="z-10 flex flex-col items-center w-full"
          >
            {/* Header Mini */}
            <div className="text-center mb-12 relative flex flex-col items-center">
              <button 
                onClick={returnToLanding}
                className="absolute -left-20 top-1/2 -translate-y-1/2 text-y2k-blue hover:scale-110 transition-transform bg-white/60 p-3 rounded-full backdrop-blur-md shadow-lg"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-3xl md:text-5xl chrome-text tracking-widest mb-1 whitespace-nowrap">TIC-TAC-TRON</h1>
              <div className="flex items-center gap-2 px-3 py-1 bg-white/30 rounded-full border border-white/50">
                <div className="w-1 h-1 bg-y2k-blue rounded-full animate-ping" />
                <p className="text-y2k-deep font-mono text-[9px] tracking-[0.4em] opacity-60 font-bold uppercase">Session Active</p>
              </div>
            </div>

            {/* Main Board Container */}
            <motion.div 
              className="glass-panel p-10 relative z-10 w-full max-w-md aspect-square flex flex-col items-center justify-center"
            >
              {/* Game Status */}
              <div className="absolute -top-14 left-0 right-0 flex justify-between px-6 font-display text-[9px] tracking-widest font-bold">
                <div className={`flex items-center gap-3 transition-all p-3 rounded-2xl glass-panel ${isXNext ? 'border-y2k-blue/50 text-y2k-blue bg-white/60' : 'opacity-20'}`}>
                  <User size={14} />
                  <span>PLAYER 1</span>
                </div>
                <div className={`flex items-center gap-3 transition-all p-3 rounded-2xl glass-panel ${!isXNext ? 'border-y2k-purple/50 text-y2k-purple bg-white/60' : 'opacity-20'}`}>
                  <Monitor size={14} />
                  <span>PLAYER 2</span>
                </div>
              </div>

              {/* The Grid */}
              <div className="grid grid-cols-3 gap-5 w-full h-full">
                {board.map((cell, i) => (
                  <motion.button
                    key={i}
                    id={`cell-${i}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleClick(i)}
                    className={`
                      aspect-square rounded-[2rem] flex items-center justify-center text-4xl md:text-6xl font-display transition-all duration-500
                      ${cell === null ? 'bg-white/30 hover:bg-white/50' : 'bg-white/60'}
                      ${winningLine?.includes(i) ? 'neon-glow-blue bg-y2k-blue/10 border-white' : 'border border-white/60 shadow-inner'}
                    `}
                  >
                    <AnimatePresence mode="wait">
                      {cell === 'X' && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0 }}
                          key="X"
                          className="text-y2k-deep drop-shadow-[0_4px_15px_rgba(0,100,255,0.4)]"
                        >
                          X
                        </motion.span>
                      )}
                      {cell === 'O' && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0 }}
                          key="O"
                          className="text-y2k-purple drop-shadow-[0_4px_15px_rgba(139,92,246,0.4)]"
                        >
                          O
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                ))}
              </div>

              {/* Winner Overlay */}
              <AnimatePresence>
                {winner && (
                  <motion.div
                    initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                    animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 flex items-center justify-center bg-white/30 rounded-[2.5rem]"
                  >
                    <motion.div
                      initial={{ y: 20, opacity: 0, scale: 0.9 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center p-10 glass-panel border-white shadow-2xl"
                    >
                      {winner === 'Draw' ? (
                        <div className="flex flex-col items-center mb-8">
                          <RefreshCw className="w-20 h-20 mb-6 text-y2k-deep opacity-30 animate-spin-slow" />
                          <h2 className="text-4xl font-display text-y2k-black tracking-tighter">DRAW</h2>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center mb-8">
                          <Trophy className={`w-20 h-20 mb-6 ${winner === 'X' ? 'text-y2k-blue' : 'text-y2k-purple'}`} />
                          <h2 className={`text-4xl font-display tracking-tighter ${winner === 'X' ? 'text-y2k-blue' : 'text-y2k-purple'}`}>
                            {winner} Wins
                          </h2>
                        </div>
                      )}
                      <p className="font-mono text-[11px] opacity-40 mb-12 uppercase tracking-[0.4em] font-bold">
                        {winner === 'Draw' ? 'stalemate reached' : 'uplink secured'}
                      </p>
                      <button
                        id="reset-btn"
                        onClick={resetBoard}
                        className="px-12 py-5 glossy-black text-white font-display text-[11px] tracking-widest rounded-full hover:scale-110 active:scale-95 transition-all flex items-center justify-center gap-4 shadow-2xl"
                      >
                        <RefreshCw size={16} />
                        REBOOT UNIT
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer System Details */}
      
    </div>
  );
}

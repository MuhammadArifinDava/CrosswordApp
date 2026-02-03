import { useEffect, useState, useRef, useMemo, useCallback, lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
import { Container } from "../components/Container";
import { Spinner } from "../components/Spinner";
import { CrosswordGrid } from "../components/CrosswordGrid";
import { Alert } from "../components/Alert";
import { VscCheck, VscChromeClose, VscDebugRestart, VscLightbulb, VscColorMode, VscFilePdf, VscShare, VscAdd, VscRemove } from "react-icons/vsc";
import { FaTrophy, FaPalette, FaRobot, FaUserFriends } from "react-icons/fa";

// Hooks
import { useSound } from "../hooks/useSound";
import { useTheme } from "../hooks/useTheme";
import { useAchievements } from "../hooks/useAchievements";
import { useDragScroll } from "../hooks/useDragScroll";
import { useAuth } from "../context/useAuth";

const ShareModal = lazy(() => import("../components/ShareModal"));

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

function CrosswordPlayer() {
  const { id } = useParams();
  const { user } = useAuth(); // Assuming useAuth provides current user info

  // Custom Hooks
  // ...
  
  // Socket State
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [remoteCursors, setRemoteCursors] = useState({}); // { socketId: { user, row, col } }

  // ... existing state

  // Initialize Socket (DISABLED FOR NOW)
  /*
  useEffect(() => {
    let newSocket;
    const initSocket = async () => {
        try {
            const { io } = await import("socket.io-client");
            // Determine socket URL based on environment
            const socketUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
            newSocket = io(socketUrl);
            setSocket(newSocket);

            newSocket.on("connect", () => {
                console.log("Connected to multiplayer server");
                setIsConnected(true);
                newSocket.emit("join_puzzle", id);
            });

            newSocket.on("disconnect", () => {
                console.log("Disconnected from multiplayer server");
                setIsConnected(false);
            });

            newSocket.on("connect_error", (err) => {
                console.error("Socket connection error:", err);
                setIsConnected(false);
            });

            newSocket.on("cell_updated", ({ row, col, char }) => {
                setUserAnswers(prev => {
                    const newGrid = prev.map(r => [...r]);
                    newGrid[row][col] = char;
                    return newGrid;
                });
            });

            // Sync Logic
            newSocket.on("request_sync", ({ requesterId }) => {
                if (answersRef.current && answersRef.current.length > 0) {
                    newSocket.emit("provide_sync", {
                        requesterId,
                        state: answersRef.current,
                        puzzleId: id
                    });
                }
            });

            newSocket.on("apply_sync", (remoteState) => {
                console.log("Received sync state from peer");
                setUserAnswers(remoteState);
            });

            newSocket.on("remote_cursor_moved", ({ id: socketId, user, row, col }) => {
                setRemoteCursors(prev => ({
                    ...prev,
                    [socketId]: { user, row, col }
                }));
            });
        } catch (error) {
            console.error("Failed to load socket.io-client", error);
        }
    };

    initSocket();

    return () => {
        if (newSocket) newSocket.disconnect();
    };
  }, [id]);
  */

  // Broadcast cursor moves (DISABLED)
  /*
  useEffect(() => {
    if (socket && activeCell) {
        socket.emit("cursor_move", { 
            puzzleId: id, 
            row: activeCell.row, 
            col: activeCell.col,
            user: user?.username || "Guest"
        });
    }
  }, [activeCell, socket, id, user]);
  */

  const { playClick, playSuccess, playError, playVictory } = useSound();
  const { theme, setTheme } = useTheme();
  const { checkAchievements, newUnlock } = useAchievements();
  
  // Refs for Drag Scroll
  const acrossListRef = useDragScroll();
  const downListRef = useDragScroll();
  
  // Ref for preventing double input
  const lastKeyTime = useRef(0);

  // State
  const [crossword, setCrossword] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Game state
  const [userAnswers, setUserAnswers] = useState([]);
  const answersRef = useRef([]); // Ref for socket sync
  useEffect(() => { answersRef.current = userAnswers; }, [userAnswers]);

  const [activeCell, setActiveCell] = useState(null); // { row, col }
  const [direction, setDirection] = useState("across"); // "across" | "down"
  const [isComplete, setIsComplete] = useState(false);
  const [startTime] = useState(Date.now());
  const [timer, setTimer] = useState(0);
  const [showErrors, setShowErrors] = useState(false);
  
  // New features
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  // Auto-Save Effect
  useEffect(() => {
    if (id && userAnswers.length > 0) {
        localStorage.setItem(`crossword_progress_${id}`, JSON.stringify(userAnswers));
    }
  }, [userAnswers, id]);
  const [activeTab, setActiveTab] = useState("across"); // For mobile view
  const mobileInputRef = useRef(null);
  
  // Leaderboard & PDF
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [finalScore, setFinalScore] = useState(0);

  // Sync activeTab with direction
  useEffect(() => {
    setActiveTab(direction);
  }, [direction]);

  // Timer
  useEffect(() => {
    if (isComplete || loading) return;
    const interval = setInterval(() => {
        setTimer(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, isComplete, loading]);

  // Focus mobile input on cell selection
  useEffect(() => {
    if (activeCell && mobileInputRef.current) {
        mobileInputRef.current.focus({ preventScroll: true });
    }
  }, [activeCell]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let alive = true;
    api.get(`/crosswords/${id}`)
      .then(res => {
        if (!alive) return;
        const cw = res.data;
        setCrossword(cw);
        
        // Load progress or init
        const savedProgress = localStorage.getItem(`crossword_progress_${id}`);
        if (savedProgress) {
            setUserAnswers(JSON.parse(savedProgress));
        } else {
            const initialGrid = Array(cw.rows).fill(null).map(() => Array(cw.cols).fill(""));
            setUserAnswers(initialGrid);
        }
        
        setLoading(false);
        // Set initial focus to first numbered cell
        // Find cell with num 1
        let found = false;
        for(let r=0; r<cw.rows; r++) {
            for(let c=0; c<cw.cols; c++) {
                if (cw.grid[r][c]?.num === 1) {
                    setActiveCell({row: r, col: c});
                    found = true;
                    break;
                }
            }
            if (found) break;
        }
      })
      .catch(err => {
        if (!alive) return;
        setError("Failed to load crossword.");
        setLoading(false);
      });
    return () => { alive = false; };
  }, [id]);

  // Check completion
  useEffect(() => {
    if (!crossword || isComplete) return;
    
    let complete = true;
    let correct = true;
    
    for (let r = 0; r < crossword.rows; r++) {
      for (let c = 0; c < crossword.cols; c++) {
        const cell = crossword.grid[r][c];
        if (cell?.active) {
          if (!userAnswers[r][c]) {
            complete = false;
            break;
          }
          if (userAnswers[r][c].toUpperCase() !== cell.char) {
            correct = false;
          }
        }
      }
      if (!complete) break;
    }

    if (complete && correct) {
      setIsComplete(true);
      import("canvas-confetti").then(({ default: confetti }) => {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
        });
      });
    }
  }, [userAnswers, crossword, isComplete]);

  // Calculate highlighted cells (current word)
  const highlightedCells = useMemo(() => {
    if (!activeCell || !crossword) return [];
    
    const { row, col } = activeCell;
    const cells = [];
    
    // Find the start of the word in the current direction
    let r = row;
    let c = col;
    
    if (direction === "across") {
        while (c > 0 && crossword.grid[r][c-1]?.active) c--;
        while (c < crossword.cols && crossword.grid[r][c]?.active) {
            cells.push(`${r},${c}`);
            c++;
        }
    } else {
        while (r > 0 && crossword.grid[r-1][c]?.active) r--;
        while (r < crossword.rows && crossword.grid[r][c]?.active) {
            cells.push(`${r},${c}`);
            r++;
        }
    }
    
    return cells;
  }, [activeCell, direction, crossword]);

  // Find current clue based on active cell
  const currentClue = useMemo(() => {
      if (!activeCell || !crossword) return null;
      const { row, col } = activeCell;
      
      // We need to find the clue that corresponds to the word at this position
      // This is a bit tricky because we need to trace back to the number
      
      let r = row;
      let c = col;
      if (direction === "across") {
          while (c > 0 && crossword.grid[r][c-1]?.active) c--;
      } else {
          while (r > 0 && crossword.grid[r-1][c]?.active) r--;
      }
      
      const num = crossword.grid[r][c]?.num;
      if (!num) return null; // Should not happen for start of word
      
      return crossword.clues[direction].find(cl => cl.number === num);
  }, [activeCell, direction, crossword]);


  const handleKeyDown = (e) => {
    // Record time to prevent double-firing with handleMobileInput
    // Only update if it's a real keyboard event (not from mobile input handler)
    if (!e.fromMobile) {
        lastKeyTime.current = Date.now();
    }

    if (!activeCell || isComplete) return;

    const { row, col } = activeCell;

    // Navigation
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
      playClick(); // SFX
      let nextRow = row;
      let nextCol = col;

      if (e.key === 'ArrowUp') nextRow--;
      if (e.key === 'ArrowDown') nextRow++;
      if (e.key === 'ArrowLeft') nextCol--;
      if (e.key === 'ArrowRight') nextCol++;

      if (nextRow >= 0 && nextRow < crossword.rows && nextCol >= 0 && nextCol < crossword.cols) {
          if (crossword.grid[nextRow][nextCol]?.active) {
              setActiveCell({ row: nextRow, col: nextCol });
          }
      }
      return;
    }

    // Spacebar toggles direction (Smart Toggle)
    if (e.code === 'Space') {
        e.preventDefault();
        const hasAcross = (col > 0 && crossword.grid[row][col-1]?.active) || (col < crossword.cols - 1 && crossword.grid[row][col+1]?.active);
        const hasDown = (row > 0 && crossword.grid[row-1][col]?.active) || (row < crossword.rows - 1 && crossword.grid[row+1][col]?.active);
        
        if (hasAcross && hasDown) {
            setDirection(d => d === "across" ? "down" : "across");
        }
        return;
    }

    // Backspace
    if (e.key === 'Backspace') {
      playClick(); // SFX
      const newAnswers = [...userAnswers];
      newAnswers[row] = [...newAnswers[row]];
      
      if (newAnswers[row][col] === "") {
           let prevRow = row;
           let prevCol = col;
           if (direction === "across") prevCol--;
           else prevRow--;
           
           if (prevRow >= 0 && prevRow < crossword.rows && prevCol >= 0 && prevCol < crossword.cols && crossword.grid[prevRow][prevCol]?.active) {
               setActiveCell({ row: prevRow, col: prevCol });
               const nextAnswers = [...newAnswers];
               nextAnswers[prevRow] = [...nextAnswers[prevRow]];
               nextAnswers[prevRow][prevCol] = "";
               setUserAnswers(nextAnswers);
           }
      } else {
          newAnswers[row][col] = "";
          setUserAnswers(newAnswers);
          // if (socket) {
          //     socket.emit("update_cell", { puzzleId: id, row, col, char: "" });
          // }
      }
      return;
    }

    // Typing letters
    if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
      playClick(); // SFX
      const char = e.key.toUpperCase();
      const newAnswers = [...userAnswers];
      newAnswers[row] = [...newAnswers[row]];
      newAnswers[row][col] = char;
      setUserAnswers(newAnswers);

      // if (socket) {
      //     socket.emit("update_cell", { puzzleId: id, row, col, char });
      // }

      // Move to next cell with Smart Skip (Skip filled cells)
      let nextRow = row;
      let nextCol = col;
      
      while(true) {
          if (direction === "across") nextCol++;
          else nextRow++;
          
          // Check bounds
          if (nextRow < 0 || nextRow >= crossword.rows || nextCol < 0 || nextCol >= crossword.cols) {
              break;
          }
          
          // Check active
          if (!crossword.grid[nextRow][nextCol]?.active) {
              break;
          }
          
          // Found empty cell? Stop here.
          if (!newAnswers[nextRow][nextCol]) {
              setActiveCell({ row: nextRow, col: nextCol });
              break;
          }
          
          // If filled, continue loop to skip
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCell, crossword, userAnswers, direction, isComplete]);

  const handleCellClick = (r, c) => {
    playClick(); // SFX
    // Smart Direction Switching
    const hasAcross = (c > 0 && crossword.grid[r][c-1]?.active) || (c < crossword.cols - 1 && crossword.grid[r][c+1]?.active);
    const hasDown = (r > 0 && crossword.grid[r-1][c]?.active) || (r < crossword.rows - 1 && crossword.grid[r+1][c]?.active);

    if (activeCell && activeCell.row === r && activeCell.col === c) {
      if (hasAcross && hasDown) {
          setDirection(direction === "across" ? "down" : "across");
      }
    } else {
      let newDir = direction;
      // If the new cell only supports one direction, switch to it
      if (hasAcross && !hasDown) newDir = "across";
      else if (!hasAcross && hasDown) newDir = "down";
      
      setActiveCell({ row: r, col: c });
      setDirection(newDir);
    }
    
    // Ensure mobile input is refocused
    if (mobileInputRef.current) {
        mobileInputRef.current.focus({ preventScroll: true });
    }
  };

  const handleMobileInput = (e) => {
    // Prevent double input if keydown already handled it (within 100ms)
    if (Date.now() - lastKeyTime.current < 100) {
        e.target.value = " "; 
        return;
    }

    // Handle mobile input logic
    const val = e.target.value;
    
    // Check if it was a backspace (value length decreased or became empty)
    // We maintain a single space " " as default value
    if (val.length === 0) {
        handleKeyDown({ key: 'Backspace', preventDefault: () => {}, fromMobile: true });
        e.target.value = " "; // Reset to space
        return;
    }

    // Check for character input
    const char = val.slice(-1);
    if (char.match(/[a-zA-Z]/)) {
        handleKeyDown({ key: char, preventDefault: () => {}, fromMobile: true });
    }
    
    e.target.value = " "; // Reset to space
  };

  const handleHint = () => {
      if (hintsRemaining <= 0 || isComplete || !activeCell) return;
      
      const { row, col } = activeCell;
      const correctChar = crossword.grid[row][col]?.char;
      
      // If already correct, try to find another empty cell in current word
      if (userAnswers[row][col] === correctChar) {
          // Implementation for finding next empty cell could go here
          // For now, just don't use a hint charge if it's already correct
          return;
      }
      
      const newAnswers = [...userAnswers];
      newAnswers[row] = [...newAnswers[row]];
      newAnswers[row][col] = correctChar;
      setUserAnswers(newAnswers);
      setHintsRemaining(h => h - 1);
  };

  const fetchLeaderboard = useCallback(() => {
    api.get(`/scores/${id}`)
       .then(res => setLeaderboardData(res.data))
       .catch(err => console.error(err));
  }, [id]);

  const handleExportPDF = async () => {
    try {
        const { default: jsPDF } = await import("jspdf");
        const { default: autoTable } = await import("jspdf-autotable");
        const doc = new jsPDF();
        
        // Title
        doc.setFontSize(22);
        doc.text(crossword.title, 105, 20, { align: "center" });
        
        doc.setFontSize(12);
        doc.text(crossword.description || "", 105, 30, { align: "center" });

        // Clues
        const acrossClues = crossword.clues.across.map(c => [`${c.number}. ${c.clue}`]);
        const downClues = crossword.clues.down.map(c => [`${c.number}. ${c.clue}`]);

        doc.setFontSize(14);
        doc.text("Across", 14, 40);
        doc.text("Down", 110, 40);

        autoTable(doc, {
            body: acrossClues,
            startY: 45,
            theme: 'plain',
            margin: { right: 110 } // Left column
        });

        autoTable(doc, {
            body: downClues,
            startY: 45,
            theme: 'plain',
            margin: { left: 110 } // Right column
        });
        
        doc.save(`${crossword.title}.pdf`);
    } catch (error) {
        console.error("Failed to load PDF libraries", error);
    }
  };

  const checkAnswers = async () => {
      let allCorrect = true;
      let isFull = true;
      
      // Check correctness
      for(let r=0; r<crossword.rows; r++) {
          for(let c=0; c<crossword.cols; c++) {
              if (crossword.grid[r][c]?.active) {
                  if (!userAnswers[r][c]) isFull = false;
                  if (userAnswers[r][c] !== crossword.grid[r][c].char) {
                      allCorrect = false;
                  }
              }
          }
      }

      if (allCorrect && isFull) {
          setIsComplete(true);
          playVictory(); // SFX
          
          // Check Achievements
          const hintsUsed = 3 - hintsRemaining;
          const stats = {
              timeSolved: timer,
              hintsUsed: hintsUsed,
              errors: 0 // We don't track backspaces as errors yet, need to implement that if strict
          };
          checkAchievements(stats);
          
          import("canvas-confetti").then(({ default: confetti }) => {
               confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 }
               });
          });
          
          // Calculate Score
          // Base: 1000
          // Hints: -50 * (3 - hintsRemaining)
          // Time: -1 * timer
          let score = 1000 - (hintsUsed * 50) - timer;
          if (score < 0) score = 0;
          
          setFinalScore(score);
          
          // Submit Score
          try {
              const payload = {
                  crosswordId: id,
                  userAnswers: userAnswers, // Send full grid for validation
                  timeSeconds: timer,
                  hintsUsed: hintsUsed
              };
              await api.post('/scores', payload);
              fetchLeaderboard();
              setShowLeaderboard(true);
          } catch (err) {
              console.error("Failed to submit score", err);
          }

      } else {
          playError(); // SFX
          setShowErrors(true);
          setTimeout(() => setShowErrors(false), 2000); // Hide after 2 seconds
      }
  };

  const handleClueClick = (clue, dir) => {
      setDirection(dir);
      setActiveCell({ row: clue.row, col: clue.col });
  };

  if (loading) return <Container><div className="flex justify-center pt-20"><Spinner /></div></Container>;
  if (error) return <Container><Alert>{error}</Alert></Container>;
  if (!crossword) return null;

  return (
    <Container>
      <div className="py-8 pb-32 transition-colors duration-300">
        <div className="flex justify-between items-start mb-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1 transition-colors">{crossword.title}</h1>
                <div className="flex items-center gap-3 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        crossword.difficulty === 'Easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                        crossword.difficulty === 'Hard' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                    }`}>
                        {crossword.difficulty || 'Medium'}
                    </span>
                    {/* Live/Offline Indicator Hidden
                    <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 ${
                        isConnected 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' 
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                        <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></span>
                        {isConnected ? 'Live' : 'Offline'}
                    </span>
                    */}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        by {crossword.author?.username || 'Unknown'}
                    </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors">{crossword.description}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
                <div className="flex gap-2">
                    <button 
                        onClick={() => setShowShareModal(true)}
                        className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        title="Share Result"
                    >
                        <VscShare size={20} />
                    </button>
                    <button 
                        onClick={handleExportPDF}
                        className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        title="Export as PDF"
                    >
                        <VscFilePdf size={20} />
                    </button>
                    <button 
                        onClick={() => { setShowLeaderboard(true); fetchLeaderboard(); }}
                        className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        title="Leaderboard"
                    >
                        <FaTrophy size={20} />
                    </button>
                    <div className="relative">
                        <button 
                            onClick={() => setShowThemeMenu(!showThemeMenu)}
                            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            title="Change Theme"
                        >
                            <FaPalette size={20} />
                        </button>
                        
                        {/* Theme Menu */}
                        {showThemeMenu && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 p-2 z-50 flex flex-col gap-1">
                                {['light', 'dark'].map(t => (
                                    <button
                                        key={t}
                                        onClick={() => { setTheme(t); setShowThemeMenu(false); }}
                                        className={`no-cursor-target cursor-pointer text-left px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${theme === t ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                                    >
                                        {t} {theme === t && '✓'}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400 transition-colors">{formatTime(timer)}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-widest">Time</div>
                </div>
            </div>
        </div>

        {/* Current Clue Bar */}
        <div className="sticky top-[70px] z-30 bg-blue-600/90 dark:bg-blue-900/90 backdrop-blur-md text-white p-4 rounded-xl shadow-lg mb-6 border border-white/10 transition-all">
            <div className="text-xs uppercase opacity-70 font-bold tracking-wider mb-1">
                Current Clue ({direction.toUpperCase()})
            </div>
            <div className="text-lg font-medium">
                {currentClue ? (
                    <>
                        <span className="font-bold mr-2">{currentClue.number}.</span>
                        {currentClue.clue}
                    </>
                ) : (
                    <span className="italic opacity-50">Select a cell to see the clue</span>
                )}
            </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-8 items-start justify-center">
            {/* Grid Area */}
            <div className="flex-1 w-full flex flex-col items-center bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden transition-colors relative group">
                {/* Zoom Controls */}
                <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 bg-white/90 dark:bg-gray-900/90 p-1.5 rounded-lg shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                        onClick={() => setZoomLevel(prev => Math.min(prev + 0.1, 2))}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 transition-colors"
                        title="Zoom In"
                    >
                        <VscAdd size={20} />
                    </button>
                    <button 
                        onClick={() => setZoomLevel(1)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 text-xs font-bold transition-colors"
                        title="Reset Zoom"
                    >
                        {Math.round(zoomLevel * 100)}%
                    </button>
                    <button 
                        onClick={() => setZoomLevel(prev => Math.max(prev - 0.1, 0.5))}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 transition-colors"
                        title="Zoom Out"
                    >
                        <VscRemove size={20} />
                    </button>
                </div>

                <div className="w-full overflow-auto custom-scrollbar" style={{ maxHeight: '80vh' }}>
                    <div 
                        className="origin-top-left transition-transform duration-200 ease-out"
                        style={{ 
                            transform: `scale(${zoomLevel})`,
                            width: `${100 * zoomLevel}%`,
                            minWidth: 'min-content'
                        }}
                    >
                        <CrosswordGrid
                            grid={crossword.grid}
                            rows={crossword.rows}
                            cols={crossword.cols}
                            userAnswers={userAnswers}
                            activeCell={activeCell}
                            direction={direction}
                            onCellClick={handleCellClick}
                            highlightedCells={highlightedCells}
                            showErrors={showErrors}
                            remoteCursors={{}} // Pass empty object to hide remote cursors
                        />
                    </div>
                </div>
            </div>

            {/* Clues Area */}
            <div className="w-full xl:w-96 flex flex-col gap-6 h-[600px]">
                <div className="flex gap-2">
                    <button 
                        onClick={checkAnswers}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
                        title="Check Answers"
                    >
                        <VscCheck size={20} /> Check
                    </button>
                    <button 
                        onClick={handleHint}
                        disabled={hintsRemaining <= 0}
                        className={`flex-1 ${hintsRemaining > 0 ? 'bg-purple-500 hover:bg-purple-600 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'} font-bold py-3 px-4 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2`}
                        title="Reveal Cell"
                    >
                        <VscLightbulb size={20} /> Hint ({hintsRemaining})
                    </button>
                    <button 
                        onClick={() => {
                            if(confirm("Restart puzzle?")) {
                                window.location.reload();
                            }
                        }}
                        className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-transform active:scale-95"
                        title="Restart"
                    >
                        <VscDebugRestart size={20} />
                    </button>
                </div>

                {/* Mobile Tabs */}
                <div className="flex xl:hidden bg-gray-200 dark:bg-gray-700 p-1 rounded-xl">
                    <button
                        onClick={() => { setActiveTab("across"); setDirection("across"); }}
                        className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-all ${
                            activeTab === "across"
                                ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        }`}
                    >
                        Across
                    </button>
                    <button
                        onClick={() => { setActiveTab("down"); setDirection("down"); }}
                        className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-all ${
                            activeTab === "down"
                                ? "bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        }`}
                    >
                        Down
                    </button>
                </div>

                <div className={`flex-1 surface bg-white/80 dark:bg-gray-800 dark:border-gray-700 rounded-3xl p-6 overflow-hidden flex-col shadow-sm transition-colors ${activeTab === 'down' ? 'hidden xl:flex' : 'flex'}`}>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2 transition-colors">
                        <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                        Across
                    </h3>
                    <div className="overflow-y-auto pr-2 custom-scrollbar">
                        <ul className="space-y-2">
                            {crossword.clues.across.map((clue, i) => (
                                <li 
                                    key={i} 
                                    onClick={() => handleClueClick(clue, "across")}
                                    className={`p-3 rounded-xl cursor-pointer transition-colors border border-transparent clue-item ${
                                        currentClue === clue && direction === "across" 
                                        ? "bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300" 
                                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                                    }`}
                                >
                                    <span className="font-bold text-blue-600 dark:text-blue-400 mr-2">{clue.number}.</span>
                                    {clue.clue}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                
                <div className={`flex-1 surface bg-white/80 dark:bg-gray-800 dark:border-gray-700 rounded-3xl p-6 overflow-hidden flex-col shadow-sm transition-colors ${activeTab === 'across' ? 'hidden xl:flex' : 'flex'}`}>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2 transition-colors">
                        <span className="w-2 h-8 bg-purple-500 rounded-full"></span>
                        Down
                    </h3>
                    <div className="overflow-y-auto pr-2 custom-scrollbar">
                        <ul className="space-y-2">
                            {crossword.clues.down.map((clue, i) => (
                                <li 
                                    key={i} 
                                    onClick={() => handleClueClick(clue, "down")}
                                    className={`p-3 rounded-xl cursor-pointer transition-colors border border-transparent clue-item ${
                                        currentClue === clue && direction === "down" 
                                        ? "bg-purple-100 dark:bg-purple-900/40 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300" 
                                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                                    }`}
                                >
                                    <span className="font-bold text-purple-600 dark:text-purple-400 mr-2">{clue.number}.</span>
                                    {clue.clue}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Mobile Input (Hidden) */}
      <input
        ref={mobileInputRef}
        type="text"
        className="fixed top-0 left-0 opacity-0 pointer-events-none h-0 w-0"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="characters"
        spellCheck="false"
        defaultValue=" "
        onChange={handleMobileInput}
      />

      {/* Completion Modal */}
      {isComplete && !showLeaderboard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl transform scale-100 animate-in zoom-in-95 duration-300 transition-colors">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 dark:text-green-400">
                      <VscCheck size={40} />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Puzzle Solved!</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">Great job! You completed <strong>{crossword.title}</strong>.</p>
                  
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
                      <div className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-bold mb-1">Final Score</div>
                      <div className="text-4xl font-mono font-bold text-blue-600 dark:text-blue-400">{finalScore}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Time: {formatTime(timer)}</div>
                  </div>
                  
                  <div className="flex gap-4 justify-center">
                      <button 
                          onClick={() => { fetchLeaderboard(); setShowLeaderboard(true); }}
                          className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors flex items-center gap-2"
                      >
                          <FaTrophy /> Leaderboard
                      </button>
                      <button 
                          onClick={() => window.location.reload()}
                          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
                      >
                          Play Again
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 max-w-lg w-full shadow-2xl transform scale-100 animate-in zoom-in-95 duration-300 transition-colors flex flex-col max-h-[80vh]">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <FaTrophy className="text-yellow-500" /> Leaderboard
                      </h2>
                      <button 
                          onClick={() => setShowLeaderboard(false)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 dark:text-gray-400"
                      >
                          <VscChromeClose size={24} />
                      </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                      {leaderboardData.length === 0 ? (
                          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                              No scores yet. Be the first!
                          </div>
                      ) : (
                          <table className="w-full text-left">
                              <thead className="text-xs uppercase text-gray-500 dark:text-gray-400 font-bold border-b border-gray-200 dark:border-gray-700">
                                  <tr>
                                      <th className="pb-3 pl-2">Rank</th>
                                      <th className="pb-3">User</th>
                                      <th className="pb-3">Score</th>
                                      <th className="pb-3 text-right pr-2">Time</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                  {leaderboardData.map((score, index) => (
                                      <tr key={index} className={`text-sm ${index < 3 ? 'font-bold' : ''}`}>
                                          <td className="py-3 pl-2 text-gray-500 dark:text-gray-400">
                                              {index === 0 && '🥇'}
                                              {index === 1 && '🥈'}
                                              {index === 2 && '🥉'}
                                              {index > 2 && `#${index + 1}`}
                                          </td>
                                          <td className="py-3 text-gray-900 dark:text-white">{score.user?.username || 'Anonymous'}</td>
                                          <td className="py-3 text-blue-600 dark:text-blue-400">{score.score}</td>
                                          <td className="py-3 text-right pr-2 text-gray-500 dark:text-gray-400 font-mono">{formatTime(score.timeSeconds)}</td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      )}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                      <button 
                          onClick={handleExportPDF}
                          className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium transition-colors flex items-center gap-2"
                      >
                          <VscFilePdf /> Export PDF
                      </button>
                      <button 
                          onClick={() => setShowLeaderboard(false)}
                          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
                      >
                          Close
                      </button>
                  </div>
              <div className="mt-6 pt-6 border-t dark:border-gray-700 flex justify-center">
                       <button
                           onClick={() => { setShowLeaderboard(false); setShowShareModal(true); }}
                           className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-2"
                       >
                           <VscShare /> Share Result
                       </button>
                  </div>
              </div>
          </div>
      )}

      {/* Share Modal */}
      <Suspense fallback={null}>
        <ShareModal 
            isOpen={showShareModal} 
            onClose={() => setShowShareModal(false)} 
            stats={{
                timeSolved: timer,
                hintsUsed: 3 - hintsRemaining,
                score: finalScore
            }}
            theme={theme}
        />
      </Suspense>

      {/* Achievement Unlock Notification */}
      {newUnlock && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl z-[60] flex items-center gap-4 animate-in slide-in-from-bottom-10 fade-in duration-500">
              <div className="text-4xl">{newUnlock.icon}</div>
              <div>
                  <div className="text-xs uppercase tracking-wider text-yellow-400 font-bold">Achievement Unlocked</div>
                  <div className="font-bold text-lg">{newUnlock.title}</div>
                  <div className="text-sm opacity-80">{newUnlock.description}</div>
              </div>
          </div>
      )}

    </Container>
  );
}

export default CrosswordPlayer;

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export function CrosswordGrid({ grid, rows, cols, onCellClick, activeCell, userAnswers, showAnswers, direction, highlightedCells = [], showErrors = false, remoteCursors = {} }) {
  
  // Calculate which cells should be highlighted (part of the active word)
  // highlightedCells is an array of strings "row,col" passed from parent
  // OR we can calculate it here if we pass the current word info.
  // Ideally parent controls this.
  
  const highlightedSet = useMemo(() => new Set(highlightedCells), [highlightedCells]);

  return (
    <div 
      className="inline-grid gap-1 p-8 bg-gray-200/50 dark:bg-gray-800/50 rounded-xl select-none custom-cursor-area"
      style={{ 
        gridTemplateColumns: `repeat(${cols}, auto)`,
        cursor: "crosshair" // Fallback
      }}
    >
      <style>{`
        .custom-cursor-area {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="%23EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>') 16 16, crosshair;
        }
        .custom-cursor-area .crossword-cell:hover {
           cursor: pointer;
        }
      `}</style>
      {grid.map((row, rIndex) => (
        row.map((cell, cIndex) => {
          const isActive = cell?.active;
          const isSelected = activeCell && activeCell.row === rIndex && activeCell.col === cIndex;
          const isHighlighted = highlightedSet.has(`${rIndex},${cIndex}`);
          
          // Check for remote cursors
          const remoteUsersHere = Object.values(remoteCursors).filter(
            cursor => cursor.row === rIndex && cursor.col === cIndex
          );

          if (!isActive) {
            return <div key={`${rIndex}-${cIndex}`} className="w-8 h-8 sm:w-10 sm:h-10 opacity-0" />;
          }

          const cellValue = showAnswers ? cell.char : (userAnswers?.[rIndex]?.[cIndex] || "");
          const isCorrect = showAnswers ? true : (cellValue && cellValue.toUpperCase() === cell.char);
          const isWrong = !showAnswers && cellValue && cellValue.toUpperCase() !== cell.char;

          // 3D & State Logic
          let baseClass = "relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-sm sm:text-xl font-bold uppercase transition-all duration-150 transform rounded-md border-2 crossword-cell";
          let colorClass = "bg-white border-gray-300 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 shadow-[0_4px_0_0_rgba(0,0,0,0.2)]";
          let hoverClass = "hover:-translate-y-1 hover:shadow-[0_6px_0_0_rgba(59,130,246,0.6)] hover:border-blue-400 hover:z-20";
          
          if (isSelected) {
            colorClass = "bg-yellow-400 border-yellow-500 text-black shadow-[0_2px_0_0_rgba(0,0,0,0.2)] translate-y-[2px]";
            hoverClass = ""; // No hover effect when selected (it's already pressed)
          } else if (showErrors && isWrong) {
            colorClass = "bg-red-100 border-red-300 text-red-600 dark:bg-red-900/50 dark:border-red-800 dark:text-red-200 shadow-[0_4px_0_0_rgba(220,38,38,0.3)]";
          } else if (isHighlighted) {
            colorClass = "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-900/40 dark:border-blue-700 dark:text-blue-100 shadow-[0_4px_0_0_rgba(37,99,235,0.2)]";
          }
          
          // Remote cursor styling (override border)
          if (remoteUsersHere.length > 0) {
              colorClass = `${colorClass} ring-2 ring-green-500 ring-offset-2`;
          }

          return (
            <motion.div
              key={`${rIndex}-${cIndex}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={!isSelected ? { scale: 1.1 } : {}}
              className={`
                ${baseClass}
                ${colorClass}
                ${hoverClass}
                ${cell.num ? 'items-end pb-0.5' : ''}
              `}
              onClick={(e) => {
                e.stopPropagation();
                onCellClick && onCellClick(rIndex, cIndex);
              }}
            >
              {cell.num && (
                <span className={`absolute top-0.5 left-0.5 text-[0.6rem] leading-none font-bold ${isSelected ? 'text-black/60' : 'text-gray-400 dark:text-gray-500'}`}>
                  {cell.num}
                </span>
              )}
              <span className="mb-0.5 drop-shadow-sm">{cellValue}</span>
              
              {/* Remote User Indicator */}
              {remoteUsersHere.length > 0 && (
                  <div className="absolute -top-3 -right-3 flex flex-col gap-1 z-50">
                      {remoteUsersHere.map((u, i) => (
                          <span key={i} className="text-[0.5rem] bg-green-500 text-white px-1 rounded shadow-sm whitespace-nowrap">
                              {u.user}
                          </span>
                      ))}
                  </div>
              )}
            </motion.div>
          );
        })
      ))}
    </div>
  );
}

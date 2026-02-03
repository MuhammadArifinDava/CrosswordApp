/**
 * Advanced Crossword Generator Algorithm
 * 
 * Approach: Constructive Heuristic with Backtracking-like attempts.
 * 1.  **Preprocessing**: Input words are sanitized (uppercase, non-alpha removed) and sorted by length (descending).
 * 2.  **Placement Strategy**:
 *     -   **First Word**: Placed horizontally in the center of the grid.
 *     -   **Subsequent Words**: The algorithm searches for "Intersections" — common letters between the unplaced word and words already on the grid.
 * 3.  **Validation**: For every potential intersection, we check:
 *     -   **Bounds**: Is it inside the grid?
 *     -   **Collisions**: Does it overwrite an existing letter with a different one?
 *     -   **Isolation**: Does it accidentally touch other words (creating invalid 2-letter words)? We check immediate neighbors.
 * 4.  **Optimization**: The generator runs **20 attempts** with slight random variations in word order (after the first few longest ones).
 * 5.  **Selection**: It selects the "Best" result based on most words placed (Primary) and smallest bounding box area (Secondary).
 */

class CrosswordGenerator {
  constructor(wordsWithClues) {
    // wordsWithClues: [{ word: "HELLO", clue: "Greeting" }, ...]
    this.originalWords = wordsWithClues.map(w => ({
      ...w,
      word: w.word.toUpperCase().replace(/[^A-Z]/g, "")
    }));
    this.gridSize = 40; // Larger canvas to avoid boundary issues during generation
  }

  /**
   * Main entry point. Tries multiple attempts to find the best layout.
   */
  generate() {
    let bestResult = null;
    const attempts = 20; // Try 20 different permutations

    for (let i = 0; i < attempts; i++) {
      // Shuffle words for this attempt, but keep longest ones generally earlier for better skeletal structure
      // Strategy: Sort by length (desc), then slightly shuffle the top N
      let currentWords = [...this.originalWords];
      
      if (i > 0) {
        // Randomize order for subsequent attempts
        currentWords.sort(() => Math.random() - 0.5);
      } else {
        // First attempt: strict length sort (First-Fit Decreasing)
        currentWords.sort((a, b) => b.word.length - a.word.length);
      }

      const result = this.attemptGeneration(currentWords);
      
      if (result) {
        if (!bestResult || 
            result.placedCount > bestResult.placedCount || 
            (result.placedCount === bestResult.placedCount && result.area < bestResult.area)) {
          bestResult = result;
        }
      }
    }

    return bestResult ? this.finalize(bestResult) : null;
  }

  /**
   * Single attempt to generate a grid from a list of words.
   */
  attemptGeneration(words) {
    const grid = Array(this.gridSize).fill(null).map(() => Array(this.gridSize).fill(null));
    const placedWords = [];

    if (words.length === 0) return null;

    // Place first word in the middle
    const firstWord = words[0];
    const startRow = Math.floor(this.gridSize / 2);
    const startCol = Math.floor(this.gridSize / 2) - Math.floor(firstWord.word.length / 2);

    this.placeWordOnGrid(grid, firstWord, startRow, startCol, "across", placedWords);

    // Try to place remaining words
    const unplaced = words.slice(1);
    let changed = true;
    
    // Multi-pass placement: sometimes placing a word opens up spots for previously skipped words
    while (changed && unplaced.length > 0) {
      changed = false;
      for (let i = 0; i < unplaced.length; i++) {
        const currentWord = unplaced[i];
        const position = this.findPositionForWord(grid, currentWord, placedWords);
        
        if (position) {
          this.placeWordOnGrid(grid, currentWord, position.row, position.col, position.direction, placedWords);
          unplaced.splice(i, 1);
          i--;
          changed = true;
        }
      }
    }

    // Fallback: Try to place disconnected words
    // If words are still unplaced, try to place them without intersection
    if (unplaced.length > 0) {
        // Sort unplaced by length (longest first) to optimize space
        unplaced.sort((a, b) => b.word.length - a.word.length);

        for (let i = 0; i < unplaced.length; i++) {
            const currentWord = unplaced[i];
            
            // Find bounds of current placed words
            let minRow = this.gridSize, maxRow = 0;
            placedWords.forEach(w => {
                minRow = Math.min(minRow, w.row);
                maxRow = Math.max(maxRow, w.row + w.length); // approx
            });
            
            // Try to place below the current grid with some padding
            // We scan for the first valid empty spot
            let placed = false;
            
            // Limit search space to avoid performance hit
            for (let r = 0; r < this.gridSize; r++) {
                if (placed) break;
                for (let c = 0; c < this.gridSize; c++) {
                    // Try Across
                    if (this.canPlace(grid, currentWord.word, r, c, "across")) {
                        this.placeWordOnGrid(grid, currentWord, r, c, "across", placedWords);
                        unplaced.splice(i, 1);
                        i--;
                        placed = true;
                        break;
                    }
                    // Try Down
                    if (this.canPlace(grid, currentWord.word, r, c, "down")) {
                        this.placeWordOnGrid(grid, currentWord, r, c, "down", placedWords);
                        unplaced.splice(i, 1);
                        i--;
                        placed = true;
                        break;
                    }
                }
            }
        }
    }

    // Calculate bounding box area for quality metric
    if (placedWords.length < 2) return null;

    let minRow = this.gridSize, maxRow = 0, minCol = this.gridSize, maxCol = 0;
    placedWords.forEach(w => {
      minRow = Math.min(minRow, w.row);
      minCol = Math.min(minCol, w.col);
      if (w.direction === "across") {
        maxRow = Math.max(maxRow, w.row);
        maxCol = Math.max(maxCol, w.col + w.length - 1);
      } else {
        maxRow = Math.max(maxRow, w.row + w.length - 1);
        maxCol = Math.max(maxCol, w.col);
      }
    });
    
    const area = (maxRow - minRow + 1) * (maxCol - minCol + 1);

    return {
      grid,
      placedWords,
      placedCount: placedWords.length,
      area,
      minRow, maxRow, minCol, maxCol
    };
  }

  placeWordOnGrid(grid, wordObj, row, col, direction, placedList) {
    const { word } = wordObj;
    for (let i = 0; i < word.length; i++) {
      const r = direction === "across" ? row : row + i;
      const c = direction === "across" ? col + i : col;
      grid[r][c] = word[i];
    }
    
    placedList.push({
      ...wordObj,
      row,
      col,
      direction,
      length: word.length
    });
  }

  findPositionForWord(grid, wordObj, placedWords) {
    const { word } = wordObj;
    const possibleMoves = [];

    // Try to intersect with every already placed word
    for (const placed of placedWords) {
      const intersect = this.findIntersection(word, placed.word);
      if (!intersect) continue;

      for (const match of intersect) {
        // Determine proposed position
        const newDirection = placed.direction === "across" ? "down" : "across";
        let newRow, newCol;

        if (newDirection === "down") {
          newCol = placed.col + match.indexInPlaced;
          newRow = placed.row - match.indexInNew;
        } else {
          newRow = placed.row + match.indexInPlaced;
          newCol = placed.col - match.indexInNew;
        }

        if (this.canPlace(grid, word, newRow, newCol, newDirection)) {
            possibleMoves.push({ row: newRow, col: newCol, direction: newDirection });
        }
      }
    }
    
    // If multiple valid moves, pick one that minimizes grid expansion (heuristic)
    // For now, just pick the first valid one or random one
    return possibleMoves.length > 0 ? possibleMoves[0] : null;
  }

  findIntersection(word1, word2) {
    const matches = [];
    for (let i = 0; i < word1.length; i++) {
      for (let j = 0; j < word2.length; j++) {
        if (word1[i] === word2[j]) {
          matches.push({ indexInNew: i, indexInPlaced: j });
        }
      }
    }
    return matches.length > 0 ? matches : null;
  }

  canPlace(grid, word, row, col, direction) {
    // Check bounds
    // checking if word fits. dont want crash or ugly overlaps.
    if (row < 0 || col < 0 || 
        (direction === "across" && col + word.length >= this.gridSize) ||
        (direction === "down" && row + word.length >= this.gridSize)) {
      return false;
    }

    for (let i = 0; i < word.length; i++) {
      const r = direction === "across" ? row : row + i;
      const c = direction === "across" ? col + i : col;
      const char = word[i];
      const existing = grid[r][c];

      // If cell is occupied, it must match
      if (existing !== null && existing !== char) {
        return false;
      }

      // If cell is empty, check neighbors to ensure we don't form invalid words
      // However, if it's an intersection (existing !== null), we don't check neighbors perpendicular to the intersection point
      // because that's the other word.
      
      if (existing === null) {
        // Check immediate neighbors perpendicular to placement direction
        // make sure we dont touch other words by accident. no illegal 2-letter words allowed.
        if (direction === "across") {
          if (grid[r-1]?.[c] || grid[r+1]?.[c]) return false;
        } else {
          if (grid[r]?.[c-1] || grid[r]?.[c+1]) return false;
        }
      }
      
      // Check ends (head and tail)
      if (i === 0) {
        const rPrev = direction === "across" ? r : r - 1;
        const cPrev = direction === "across" ? c - 1 : c;
        if (grid[rPrev]?.[cPrev]) return false;
      }
      if (i === word.length - 1) {
        const rNext = direction === "across" ? r : r + 1;
        const cNext = direction === "across" ? c + 1 : c;
        if (grid[rNext]?.[cNext]) return false;
      }
    }

    return true;
  }

  finalize(bestResult) {
    const { placedWords, minRow, maxRow, minCol, maxCol } = bestResult;

    // Add padding
    const rStart = Math.max(0, minRow - 1);
    const cStart = Math.max(0, minCol - 1);
    const rEnd = Math.min(this.gridSize - 1, maxRow + 1);
    const cEnd = Math.min(this.gridSize - 1, maxCol + 1);

    const rows = rEnd - rStart + 1;
    const cols = cEnd - cStart + 1;
    
    // Normalize coordinates
    const finalWords = placedWords.map(w => ({
      ...w,
      row: w.row - rStart,
      col: w.col - cStart
    }));

    // Sort words for numbering: top-to-bottom, left-to-right
    finalWords.sort((a, b) => {
      if (a.row !== b.row) return a.row - b.row;
      return a.col - b.col;
    });

    // Assign numbers
    let currentNum = 0;
    const clues = { across: [], down: [] };
    const startPositions = new Map();

    finalWords.forEach(w => {
      const key = `${w.row},${w.col}`;
      let number;
      
      if (startPositions.has(key)) {
        number = startPositions.get(key);
      } else {
        currentNum++;
        number = currentNum;
        startPositions.set(key, number);
      }

      clues[w.direction].push({
        number,
        clue: w.clue,
        answer: w.word,
        row: w.row,
        col: w.col
      });
    });

    // Construct final grid
    const finalGrid = Array(rows).fill(null).map(() => Array(cols).fill(null));

    // Initialize grid
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        finalGrid[r][c] = { char: null, num: null, active: false };
      }
    }

    // Fill grid
    finalWords.forEach(w => {
      // Safety check: skip words that are out of bounds
      if (w.row < 0 || w.row >= rows || w.col < 0 || w.col >= cols) {
        return;
      }

      const key = `${w.row},${w.col}`;
      if (startPositions.has(key)) {
         if (finalGrid[w.row] && finalGrid[w.row][w.col]) {
             finalGrid[w.row][w.col].num = startPositions.get(key);
         }
      }

      for (let i = 0; i < w.length; i++) {
        const r = w.direction === "across" ? w.row : w.row + i;
        const c = w.direction === "across" ? w.col + i : w.col;
        
        // Ensure cell exists before accessing
        if (finalGrid[r] && finalGrid[r][c]) {
            finalGrid[r][c].char = w.word[i];
            finalGrid[r][c].active = true;
        }
      }
    });

    return {
      grid: finalGrid,
      clues,
      rows,
      cols,
      placedCount: placedWords.length,
      totalWords: this.originalWords.length,
      placedWords: finalWords // Exposed for debugging/testing
    };
  }
}

module.exports = CrosswordGenerator;

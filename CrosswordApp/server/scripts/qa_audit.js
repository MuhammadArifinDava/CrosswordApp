const CrosswordGenerator = require('../src/utils/crosswordGenerator');

function runTest(name, words) {
    console.log(`\n--- Test: ${name} ---`);
    try {
        const generator = new CrosswordGenerator(words);
        const result = generator.generate();
        
        if (result) {
            console.log(`Status: SUCCESS`);
            console.log(`Placed: ${result.placedCount}/${words.length}`);
            // Basic validation
            if (result.placedCount === 0 && words.length > 0 && words[0].word.length > 0) {
                 console.log(`Warning: 0 words placed.`);
            }
        } else {
            console.log(`Status: FAILED (No result)`);
        }
    } catch (err) {
        console.log(`Status: CRASH`);
        console.log(`Error: ${err.message}`);
        console.log(err.stack);
    }
}

// 1. Long Word (>40 chars)
const longWord = "SUPERCALIFRAGILISTICEXPIALIDOCIOUSEVENLONGERTHANTHAT";
runTest("Long Word Crash Check", [
    { word: longWord, clue: "Very long word" },
    { word: "CAT", clue: "Pet" }
]);

// 2. Special Characters & Emojis
runTest("Special Chars & Emojis", [
    { word: "CA@#$T", clue: "Symbols" }, // Should probably be stripped or handled
    { word: "DOG🐶", clue: "Emoji" },
    { word: "HELLO-WORLD", clue: "Hyphen" }
]);

// 3. Disconnected Words (No common letters)
runTest("Disconnected Words", [
    { word: "AAAAA", clue: "A" },
    { word: "BBBBB", clue: "B" }
]);

// 4. Empty/Invalid Inputs
runTest("Empty/Invalid Inputs", [
    { word: "", clue: "Empty" },
    { word: "   ", clue: "Spaces" },
    { word: "A", clue: "Single char" } // Might be too short
]);

// 5. Standard Case
runTest("Standard Case", [
    { word: "REACT", clue: "Library" },
    { word: "NODE", clue: "Runtime" },
    { word: "EXPRESS", clue: "Framework" },
    { word: "MONGO", clue: "DB" }
]);

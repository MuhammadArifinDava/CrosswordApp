const CrosswordGenerator = require('../src/utils/crosswordGenerator');

function runTest(name, words) {
    console.log(`\n--- Test: ${name} ---`);
    try {
        const generator = new CrosswordGenerator(words);
        const result = generator.generate();
        
        if (result) {
            console.log(`Status: SUCCESS`);
            console.log(`Placed: ${result.placedCount}/${words.length}`);
        } else {
            console.log(`Status: FAILED (No result)`);
        }
    } catch (err) {
        console.log(`Status: CRASH`);
        console.log(`Error: ${err.message}`);
        console.log(err.stack);
    }
}

// Test Case: Long Word (>40 chars)
const longWord = "SUPERCALIFRAGILISTICEXPIALIDOCIOUSEVENLONGERTHANTHAT";
const words = [
    { word: longWord, clue: "Very long word" },
    { word: "CAT", clue: "Pet" },
    { word: "DOG", clue: "Pet" },
    { word: "FISH", clue: "Pet" },
    { word: "BIRD", clue: "Pet" }
];

runTest("Long Word Crash Check", words);

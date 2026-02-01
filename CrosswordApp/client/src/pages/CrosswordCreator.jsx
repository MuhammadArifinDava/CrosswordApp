import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { Container } from "../components/Container";
import { Alert } from "../components/Alert";
import { CrosswordGrid } from "../components/CrosswordGrid";
import { Spinner } from "../components/Spinner";
import { VscAdd, VscTrash, VscDebugStart, VscSave, VscSymbolKeyword } from "react-icons/vsc";

function CrosswordCreator() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [words, setWords] = useState([
    { word: "", clue: "" },
    { word: "", clue: "" },
    { word: "", clue: "" },
    { word: "", clue: "" },
    { word: "", clue: "" },
  ]);
  const [generatedData, setGeneratedData] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [validationWarning, setValidationWarning] = useState("");

  const handleWordChange = (index, field, value) => {
    const newWords = [...words];
    newWords[index][field] = value;
    setWords(newWords);
    // Reset generated data if words change to encourage re-generation
    if (generatedData) setGeneratedData(null);
    setValidationWarning(""); // Clear warning on change
  };

  const addWord = () => {
    if (words.length >= 15) {
        setError("Maximum 15 words allowed.");
        return;
    }
    setWords([...words, { word: "", clue: "" }]);
  };

  const removeWord = (index) => {
    if (words.length <= 2) return;
    const newWords = words.filter((_, i) => i !== index);
    setWords(newWords);
    if (generatedData) setGeneratedData(null);
  };

  const handleGenerate = async () => {
    setError("");
    setValidationWarning("");
    const validWords = words.filter(w => w.word.trim() && w.clue.trim());
    
    if (validWords.length < 5) {
      setError("Please enter at least 5 valid words with clues (Max 15).");
      return;
    }
    if (validWords.length > 15) {
      setError("Please enter no more than 15 words.");
      return;
    }

    // Check for duplicates
    const uniqueWords = new Set(validWords.map(w => w.word.trim().toUpperCase()));
    if (uniqueWords.size !== validWords.length) {
      setError("Duplicate words detected. Please ensure all words are unique.");
      return;
    }

    // Check for minimum word length
    const shortWords = validWords.filter(w => w.word.trim().length < 2);
    if (shortWords.length > 0) {
        setError(`Words must be at least 2 letters long (${shortWords[0].word}).`);
        return;
    }

    setBusy(true);
    try {
      const { data } = await api.post("/crosswords/generate", { words: validWords });
      setGeneratedData(data.data);
      if (data.data.placedCount < validWords.length) {
          setValidationWarning(`⚠️ Warning: Only ${data.data.placedCount} out of ${validWords.length} words could be placed in the grid. Some words were excluded to maintain valid connections.`);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to generate crossword. Try adding more intersecting words.");
    } finally {
      setBusy(false);
    }
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }
    if (!generatedData) {
      setError("Please generate the puzzle first.");
      return;
    }

    setBusy(true);
    try {
      await api.post("/crosswords", {
        title,
        description,
        ...generatedData,
        isPublished: true,
        difficulty
      });
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to publish.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Container>
      <div className="py-8 pb-32">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Create New Crossword</h1>
        
        <div className="flex flex-col xl:flex-row gap-8 items-start">
            {/* Left Column: Form */}
            <div className="w-full xl:w-1/2 space-y-6">
                <div className="surface rounded-3xl p-6 md:p-8 shadow-sm">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
                        <VscSymbolKeyword className="text-blue-500" />
                        Details & Words
                    </h2>

                    {error && <Alert className="mb-6">{error}</Alert>}
                    {validationWarning && (
                        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 flex items-start gap-3">
                            <span className="text-xl">⚠️</span>
                            <div>
                                <p className="font-bold">Partial Generation</p>
                                <p className="text-sm">{validationWarning}</p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4 mb-8">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="e.g. Science Fun"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Difficulty</label>
                            <select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Description (Optional)</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 transition-colors h-24 resize-none"
                                placeholder="A brief description..."
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm text-gray-400 uppercase tracking-wider font-bold mb-2">
                            <span>Word</span>
                            <span>Clue</span>
                            <span className="w-8"></span>
                        </div>
                        {words.map((w, i) => (
                            <div key={i} className="flex gap-3 group">
                                <input
                                    type="text"
                                    value={w.word}
                                    onChange={(e) => handleWordChange(i, "word", e.target.value.toUpperCase())}
                                    className="w-1/3 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-900 font-mono uppercase focus:outline-none focus:border-blue-500"
                                    placeholder="WORD"
                                />
                                <input
                                    type="text"
                                    value={w.clue}
                                    onChange={(e) => handleWordChange(i, "clue", e.target.value)}
                                    className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-900 focus:outline-none focus:border-blue-500"
                                    placeholder="Clue for this word"
                                />
                                <button
                                    onClick={() => removeWord(i)}
                                    className="w-8 h-10 flex items-center justify-center text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                    disabled={words.length <= 2}
                                >
                                    <VscTrash />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={addWord}
                        className="mt-4 flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600 font-medium px-2 py-1 rounded-lg hover:bg-blue-500/10 transition-colors"
                    >
                        <VscAdd /> Add Another Word
                    </button>

                    <div className="mt-8 pt-6 border-t border-gray-200 flex gap-4">
                        <button
                            onClick={handleGenerate}
                            disabled={busy}
                            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                        >
                            {busy ? <Spinner size="sm" /> : <VscDebugStart />}
                            Generate Puzzle
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Column: Preview */}
            <div className="w-full xl:w-1/2">
                <div className="sticky top-24">
                    <div className={`surface rounded-3xl p-6 md:p-8 min-h-[400px] flex flex-col items-center justify-center text-center transition-all shadow-sm ${generatedData ? 'border-blue-500/30 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)]' : ''}`}>
                        {!generatedData ? (
                            <div className="text-gray-400">
                                <div className="text-6xl mb-4 opacity-50">🧩</div>
                                <p>Add words and click Generate to see the preview here.</p>
                            </div>
                        ) : (
                            <div className="w-full">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-gray-900">Preview</h3>
                                    <div className="text-sm px-3 py-1 bg-gray-100 rounded-full text-gray-600">
                                        {generatedData.placedCount} / {generatedData.totalWords} words placed
                                    </div>
                                </div>
                                
                                <div className="overflow-auto max-h-[600px] flex justify-center p-4 bg-gray-100 rounded-2xl mb-6">
                                    <CrosswordGrid
                                        grid={generatedData.grid}
                                        rows={generatedData.rows}
                                        cols={generatedData.cols}
                                        showAnswers={true}
                                    />
                                </div>

                                <button
                                    onClick={handlePublish}
                                    disabled={busy}
                                    className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-6 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-green-900/20 flex items-center justify-center gap-2"
                                >
                                    {busy ? <Spinner size="sm" /> : <VscSave />}
                                    Publish Crossword
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </Container>
  );
}

export default CrosswordCreator;

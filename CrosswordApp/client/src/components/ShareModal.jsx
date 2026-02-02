import React, { useRef, useState } from 'react';
import { FaShareAlt, FaDownload, FaTimes, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const ShareModal = ({ isOpen, onClose, stats, theme }) => {
  const cardRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (!cardRef.current) return;
    setLoading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false
      });
      setImageUrl(canvas.toDataURL('image/png'));
    } catch (err) {
      console.error("Failed to generate share card", err);
    }
    setLoading(false);
  };

  // Auto-generate when opened
  React.useEffect(() => {
    if (isOpen) {
      // Small delay to ensure render
      setTimeout(generateImage, 500);
    } else {
      setImageUrl(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 flex justify-between items-center border-b dark:border-gray-700">
          <h3 className="font-display font-bold text-xl dark:text-white">Share Result 📸</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* Preview Area */}
        <div className="p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 flex-1 overflow-y-auto">
          
          {loading ? (
            <div className="animate-pulse text-gray-400">Generating beautiful card...</div>
          ) : imageUrl ? (
            <img src={imageUrl} alt="Share Card" className="rounded-xl shadow-lg max-w-full border-4 border-white dark:border-gray-700" />
          ) : (
             <div className="text-gray-400">Rendering...</div>
          )}

          {/* Hidden Source for Canvas */}
          <div className="fixed left-[-9999px] top-[-9999px]">
            <div ref={cardRef} className="w-[400px] h-[600px] bg-gradient-to-br from-indigo-500 to-purple-600 p-8 flex flex-col justify-between text-white relative overflow-hidden font-display">
              {/* Decorative Circles */}
              <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-[-20px] left-[-20px] w-60 h-60 bg-blue-500/20 rounded-full blur-3xl"></div>
              
              <div className="z-10 text-center mt-8">
                <div className="text-sm tracking-[0.3em] uppercase opacity-80 mb-2">Daily Crossword</div>
                <h1 className="text-5xl font-black mb-1 drop-shadow-md">SOLVED!</h1>
                <div className="text-xl font-medium opacity-90">I crushed it today 🔥</div>
              </div>

              <div className="z-10 grid grid-cols-2 gap-4 my-8">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center">
                  <span className="text-3xl font-bold">{formatTime(stats.timeSolved)}</span>
                  <span className="text-xs uppercase opacity-70 mt-1">Time</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center">
                  <span className="text-3xl font-bold">{stats.hintsUsed}/3</span>
                  <span className="text-xs uppercase opacity-70 mt-1">Hints</span>
                </div>
                <div className="col-span-2 bg-white/20 backdrop-blur-md rounded-2xl p-4 flex items-center justify-center gap-3">
                  <span className="text-4xl">🏆</span>
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-lg">Crossword Master</span>
                    <span className="text-xs opacity-75">Rank: Legend</span>
                  </div>
                </div>
              </div>

              <div className="z-10 text-center mb-8">
                <div className="text-sm opacity-60 mb-2">Play now at</div>
                <div className="font-mono bg-black/20 rounded-lg py-2 px-4 inline-block">crossword-gacor.app</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700 flex gap-3">
          {imageUrl && (
            <>
              <a href={imageUrl} download="crossword-result.png" className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-colors">
                <FaDownload /> Download
              </a>
              {/* Note: Web Share API often doesn't support files directly in all browsers, but let's try */}
              <button onClick={() => {
                if (navigator.share) {
                  fetch(imageUrl).then(res => res.blob()).then(blob => {
                    navigator.share({
                      title: 'My Crossword Score',
                      files: [new File([blob], 'score.png', { type: 'image/png' })]
                    }).catch(console.error);
                  });
                }
              }} className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-colors">
                 <FaWhatsapp /> Share
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { Container } from "../components/Container";
import { Spinner } from "../components/Spinner";
import { VscPlay } from "react-icons/vsc";

function HomePage() {
  const [crosswords, setCrosswords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/crosswords")
      .then(res => {
        setCrosswords(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <Container>
      <div className="py-12">
        <div className="text-center mb-12">
            <img src="/crossword.svg" alt="Crossword Logo" className="w-20 h-20 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                Crossword
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Challenge your mind with our collection of community-created crosswords.
            </p>
        </div>

        {loading ? (
            <div className="flex justify-center"><Spinner /></div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {crosswords.map(cw => (
                    <Link to={`/play/${cw._id}`} key={cw._id} className="group">
                        <div className="surface h-full rounded-2xl p-6 border border-black/5 hover:border-black/10 transition-all hover:translate-y-[-4px] shadow-sm hover:shadow-md">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                {cw.title}
                            </h3>
                            <div className="flex gap-2 mb-3">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                    cw.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                    cw.difficulty === 'Hard' ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {cw.difficulty || 'Medium'}
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                {cw.description || "No description provided."}
                            </p>
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-black/5">
                                <span className="text-xs text-gray-500">
                                    By {cw.author?.username || "Unknown"}
                                </span>
                                <span className="flex items-center gap-1 text-sm font-semibold text-gray-700 group-hover:text-blue-600">
                                    <VscPlay /> Play
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}

                {crosswords.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-400">
                        No puzzles found. Be the first to create one!
                    </div>
                )}
            </div>
        )}
      </div>
    </Container>
  );
}

export default HomePage;

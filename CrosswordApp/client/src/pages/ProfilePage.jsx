import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { Container } from "../components/Container";
import { Alert } from "../components/Alert";
import { Spinner } from "../components/Spinner";
import { useAuth } from "../context/useAuth";
import { VscEdit, VscPlay } from "react-icons/vsc";

function ProfilePage() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [crosswords, setCrosswords] = useState([]);
  
  useEffect(() => {
    let alive = true;
    api.get("/crosswords/user/my")
      .then((res) => {
        if (!alive) return;
        setCrosswords(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        if (!alive) return;
        console.error(err);
        setLoading(false);
      });
    return () => { alive = false; };
  }, []);

  return (
    <Container>
      <div className="py-12">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Profile</h1>
                <p className="text-gray-600 dark:text-white/60">Manage your account and puzzles</p>
            </div>
            <div className="flex gap-4">
                <button 
                    onClick={logout}
                    className="px-6 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition-colors"
                >
                    Logout
                </button>
            </div>
        </div>

        <div className="surface rounded-3xl p-8 mb-8">
            <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                    {(user?.username || "U").slice(0, 2).toUpperCase()}
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.username}</h2>
                    <p className="text-gray-600 dark:text-white/60">{user?.email}</p>
                </div>
            </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Puzzles</h2>
        
        {loading ? (
            <div className="flex justify-center"><Spinner /></div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {crosswords.map(cw => (
                    <div key={cw._id} className="surface rounded-2xl p-6 border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/20 transition-all">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{cw.title}</h3>
                        <div className="flex gap-2 mb-3">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                cw.difficulty === 'Easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                cw.difficulty === 'Hard' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                                'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                            }`}>
                                {cw.difficulty || 'Medium'}
                            </span>
                        </div>
                        <p className="text-gray-600 dark:text-white/60 text-sm mb-4 line-clamp-2">
                            {cw.description || "No description provided."}
                        </p>
                        <div className="flex items-center gap-2 mt-auto pt-4 border-t border-black/5 dark:border-white/5">
                            <Link 
                                to={`/play/${cw._id}`} 
                                className="flex-1 px-4 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-600 dark:text-blue-400 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                            >
                                <VscPlay /> Play
                            </Link>
                            {/* Edit not implemented yet, but we could add it */}
                        </div>
                    </div>
                ))}
                
                {crosswords.length === 0 && (
                    <div className="col-span-full text-center py-12 surface rounded-3xl border border-dashed border-black/10 dark:border-white/10">
                        <p className="text-gray-500 dark:text-white/40 mb-4">You haven't created any puzzles yet.</p>
                        <Link to="/create" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold">
                            Create your first puzzle
                        </Link>
                    </div>
                )}
            </div>
        )}
      </div>
    </Container>
  );
}

export default ProfilePage;

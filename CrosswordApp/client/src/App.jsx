import { Navigate, Route, Routes } from "react-router-dom";
import TargetCursor from "./components/TargetCursor";
import { Navbar } from "./components/Navbar";
import { SmoothScroll } from "./components/SmoothScroll";
import Ballpit from "./components/Ballpit";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import HomePage from "./pages/HomePage";
import CrosswordCreator from "./pages/CrosswordCreator";
import CrosswordPlayer from "./pages/CrosswordPlayer";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";

import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <SmoothScroll>
      <div className="min-h-full relative overflow-hidden">
        <div className="fixed inset-0 z-0 pointer-events-none">
           <Ballpit
              count={60}
              gravity={0}
              friction={0.996}
              wallBounce={1}
              followCursor={false}
              colors={[0x3b82f6, 0x8b5cf6, 0xec4899]} 
            />
        </div>
        <TargetCursor targetSelector="button:not(.no-cursor-target), a, .cursor-target, .clickable, input, textarea, .crossword-cell, .clue-item" />
        <div className="relative z-10">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/play/:id" element={<CrosswordPlayer />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/create" element={<CrosswordCreator />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </SmoothScroll>
  );
}

export default App;


import { Navigate, Route, Routes } from "react-router-dom";
import TargetCursor from "./components/TargetCursor";
import { Navbar } from "./components/Navbar";
import { SmoothScroll } from "./components/SmoothScroll";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { Spinner } from "./components/Spinner";
import { lazy, Suspense } from "react";

const HomePage = lazy(() => import("./pages/HomePage"));
const CrosswordCreator = lazy(() => import("./pages/CrosswordCreator"));
const CrosswordPlayer = lazy(() => import("./pages/CrosswordPlayer"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const Ballpit = lazy(() => import("./components/Ballpit"));

function App() {
  return (
    <SmoothScroll>
      <div className="min-h-full relative overflow-hidden">
        <div className="fixed inset-0 z-0 pointer-events-none">
           <Suspense fallback={null}>
             <Ballpit
                count={60}
                gravity={0}
                friction={0.996}
                wallBounce={1}
                followCursor={false}
                colors={[0x3b82f6, 0x8b5cf6, 0xec4899]} 
              />
           </Suspense>
        </div>
        <TargetCursor targetSelector="button:not(.no-cursor-target), a, .cursor-target, .clickable, input, textarea, .crossword-cell, .clue-item" />
        <div className="relative z-10">
          <Navbar />
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[50vh]">
              <Spinner />
            </div>
          }>
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
          </Suspense>
        </div>
      </div>
    </SmoothScroll>
  );
}

export default App;


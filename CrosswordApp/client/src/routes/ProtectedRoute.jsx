import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { Spinner } from "../components/Spinner";
import { Container } from "../components/Container";

function ProtectedRoute() {
  const { isAuthenticated, authLoading } = useAuth();

  if (authLoading) {
    return (
      <Container>
        <div className="py-8">
          <Spinner />
        </div>
      </Container>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
}

export { ProtectedRoute };

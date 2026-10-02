import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MapPage from "./pages/MapPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useAuthCheck } from "./hooks/useAuthCheck";
import NotFoundPage from "./pages/NotFoundPage";
import Layout from "./Layout";

function App() {
  useAuthCheck();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<MapPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;

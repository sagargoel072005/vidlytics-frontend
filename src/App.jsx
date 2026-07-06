import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./components/Login";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard";
import History from "./components/History";
import ComparisonDetails from "./components/ComparisonDetails";
import Profile from "./components/Profile";
import Layout from "./components/Layout";

import "./index.css";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* Ab pehle auth check hoga, fir Layout render hoga */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/history"
              element={<History />}
            />
            <Route
              path="/profile"
              element={<Profile />}
            />

            <Route
              path="/history/:id"
              element={<ComparisonDetails />}
            />

          </Route>
        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;
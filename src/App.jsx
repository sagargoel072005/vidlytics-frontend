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
import NewStudy from "./components/NewStudy";
import StudyDetails from "./components/StudyDetails";
import StudyHistory from "./components/StudyHistory";
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
            <Route
             path="/study"
            element={<NewStudy />} />

            <Route
             path="/study/:id" 
             element={<StudyDetails />} />

             <Route 
             path="/study/history" 
             element={<StudyHistory />} />

          </Route>
        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;
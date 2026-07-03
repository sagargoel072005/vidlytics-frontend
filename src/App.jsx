import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import History from "./components/History";
import ComparisonDetails from "./components/ComparisonDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={ <Dashboard /> } />

        <Route
          path="/history"
          element={
            <History />
          }
        />

        <Route
          path="/history/:id"
          element={
            <ComparisonDetails />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landingpage from "./Components/Landingpage";
import Homepage from "./Components/Homepage";
import Courses from "./Components/Courses";
import Notes from "./Components/Notes";
import Projects from "./Components/Projects";
import Profile from "./Components/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/Courses" element={<Courses />} />
        <Route path="/Notes" element={<Notes />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;

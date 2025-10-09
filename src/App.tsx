import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landingpage from "./Components/Landingpage";
import Homepage from "./Components/Homepage";
import Courses from "./Components/Courses";
import Notes from "./Components/Notes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/Courses" element={<Courses />} />
        <Route path="/Notes" element={<Notes />} />
      </Routes>
    </Router>
  );
}

export default App;

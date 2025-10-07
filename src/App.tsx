import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landingpage from "./Components/Landingpage";
import Homepage from "./Components/Homepage";
import Courses from "./Components/Courses";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/Courses" element={<Courses />} />
      </Routes>
    </Router>
  );
}

export default App;

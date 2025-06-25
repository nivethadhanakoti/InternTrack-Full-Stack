import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Profile from "./Profile";
import Coordinator from "./Coordinator";
import InternshipForm from "./InternshipForm";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/coordinator" element={<Coordinator />} />
        <Route path="/edit" element={<InternshipForm />} /> 
      </Routes>
    </Router>
  );
};

export default App;

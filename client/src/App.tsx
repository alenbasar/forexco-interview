import React from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Convert from "./components/Convert";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <div className="content">
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/sign-up" element={<Signup />} />
            <Route path="/convert" element={<Convert />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;

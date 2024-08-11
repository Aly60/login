import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import Login from "./Login";

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <h1 className="text-center text-2xl mt-10">
                Welcome to the Home Page
              </h1>
            }
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

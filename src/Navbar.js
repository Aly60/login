import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-700 p-4">
      <div className="container mx-auto flex justify-between">
        <Link to="/" className="text-white text-lg font-bold">
          Home
        </Link>
        <div>
          <Link
            to="/login"
            className="bg-white text-blue-700 font-bold py-2 px-4 rounded hover:bg-gray-200"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

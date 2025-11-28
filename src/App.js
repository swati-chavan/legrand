import React from "react";
import { BrowserRouter as Router} from "react-router-dom";
import Navbar from "./component/Navbar";
import Test from "./component/test";

function App() {
  return (
    <Router>
      <Navbar/>
      <Test/>
    </Router>
  );
}

export default App;

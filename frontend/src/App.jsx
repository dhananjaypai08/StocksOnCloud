import { BrowserRouter, Route, Routes } from "react-router-dom";
import {Home} from './pages/Home'
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";
import { Portfolio } from "./pages/Portfolio";

function App() {
  return (
    <div>
      <BrowserRouter>
      
        <Routes>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          {/* <Route path="/" element={<Landing />} /> */}
          {/* <Route path="/ai" element={<AI />} />
          <Route path="/crypto" element={<Crypto/>} /> */}
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
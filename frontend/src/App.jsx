import { BrowserRouter, Route, Routes } from "react-router-dom";
import {Home} from './pages/Home'

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/signin" element={<Signup />} />
          <Route path="/signup" element={<Signin />} /> */}
          <Route path="/home" element={<Home />} />
          {/* <Route path="/ai" element={<AI />} />
          <Route path="/crypto" element={<Crypto/>} />
          <Route path="/portfolio" element={<Portfolio />} /> */}
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
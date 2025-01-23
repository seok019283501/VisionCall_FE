import VisionCallProvider from './components/provider/VisionCallProvider';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import Sidebar from './components/sidbars/Sidebar';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'
function App() {
  return (
    <VisionCallProvider>
    <Sidebar>
      <Router>
        <Routes>
          <Route path="/sign-in" element={<SignIn/>}/>
          <Route path="/sign-up" element={<SignUp/>}/>
        </Routes>
      </Router>
    </Sidebar>
    </VisionCallProvider>
  );
}

export default App;

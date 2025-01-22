import VisionCallProvider from './components/provider/VisionCallProvider';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function App() {
  return (
    <VisionCallProvider>
    <Router>
      <Routes>
        <Route path="/sign-in" element={<SignIn/>}/>
        <Route path="/sign-up" element={<SignUp/>}/>
      </Routes>
    </Router>
    </VisionCallProvider>
  );
}

export default App;

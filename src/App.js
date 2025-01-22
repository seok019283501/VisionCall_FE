import logo from './logo.svg';
import SignIn from './components/auth/SignIn';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function App() {
  return (
    <Router>
      <Routes>
      <Route path="/sign-in" element={<SignIn/>}/>
      </Routes>
    </Router>
  );
}

export default App;

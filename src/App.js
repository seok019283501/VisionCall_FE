import VisionCallProvider from './components/provider/VisionCallProvider';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import Sidebar from './components/sidbars/Sidebar';
import CallRoom from './components/call-room/CallRoom';
import Home from './components/Home';
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import './App.css'
const App = () => {
  return (
    <VisionCallProvider>
      <Router>
        <MainLayout />
      </Router>
    </VisionCallProvider>
  );
};

const MainLayout = () => {
  const location = useLocation(); // 현재 경로를 가져옴

  // 회원가입과 로그인 페이지에서만 Sidebar 숨기기
  const hideSidebar = location.pathname === "/sign-in" || location.pathname === "/sign-up";

  return (
    <div className="App">
      {/* Sidebar는 특정 경로에서만 숨기기 */}
      {!hideSidebar && <Sidebar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path='/call-room/:room_number' element={<CallRoom/>}/>
      </Routes>
    </div>
  );
};

export default App;

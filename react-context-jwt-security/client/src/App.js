import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Join from './pages/Join';
import Login from './pages/Login';
import Home from './pages/Home';
import User from './pages/User';
import About from './pages/About';
import LoginContextProvider, { LoginContext } from './contexts/LoginContextProvider';
import { useContext } from 'react';
import Admin from './pages/Admin';

function App() {
  const {isLogin} = useContext(LoginContext);
  return (
    <BrowserRouter>
    {/* <LoginContextProvider> */}
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/join" element={<Join/>}></Route>
        {/* { isLogin && */}
        <Route path="/user" element={<User/>}></Route>  
         {/* }  */}
        <Route path="/about" element={<About/>}></Route>
        <Route path='/admin' element={<Admin/>}></Route>
      </Routes>
    {/* </LoginContextProvider> */}
    </BrowserRouter>
  );
}

export default App;

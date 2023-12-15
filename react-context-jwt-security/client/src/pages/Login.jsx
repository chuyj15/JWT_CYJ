import React from 'react'
import Header from '../components/Header/Header'
import LoginContextConsumer from '../contexts/LoginContextConsumer'
import LoginForm from '../components/Login/LoginForm'
//alt +shift+o 누르면 주석해놓은 부분 임포트가 사라진다. 
const Login = () => {
  return (
    <>
    <Header/>
    <div className="container">
        <h2>Login 페이지</h2>
        <LoginContextConsumer/>

        <LoginForm/>
    </div>
    </>
  )
}

export default Login
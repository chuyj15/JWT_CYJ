import React, { useContext } from 'react'
import { LoginContext } from './LoginContextProvider'
//필수적이지 않음
const LoginContextConsumer = () => {
    const { isLogin, userInfo } = useContext(LoginContext)


  return (
    <div>
        <h3>로그인 여부 : {isLogin ? '로그인' : '로그아웃'}</h3>
        <h3>유저 아이디 : {userInfo?.userId}</h3>
    </div>
  )
}

export default LoginContextConsumer
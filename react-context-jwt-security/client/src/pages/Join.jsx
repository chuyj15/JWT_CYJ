import React, { useContext } from 'react'
import Header from '../components/Header/Header'
import LoginContextConsumer from '../contexts/LoginContextConsumer'
import JoinForm from '../components/Join/JoinForm'
import * as auth from '../apis/auth'
import { useNavigate } from 'react-router-dom'
import { LoginContext } from '../contexts/LoginContextProvider'
const Join = () => {
  const {login} = useContext(LoginContext)
  const navigate = useNavigate()
  const join = async (form)=>{
    console.log(form)
    let response
    try {
      response = await auth.join(form)
    } catch (error) {
      console.error(`${error} : 회원가입 요청 중 에러 발생`)
      return
    }
    const data = response.data
    const status = response.status
    console.log(`data : ${data}`)
    console.log(`status : ${status}`)
    if (status ===200){
      console.log('회원가입 성공')
      alert(`회원가입 성공`)
      // navigate('/login')
      login(form.userId, form.userPw) //회원가입 후 바로 로그인
    } else {
      console.log('회원가입 실패')
      alert(`회원가입 실패`)
    }
  }

  return (
    <>
    <Header/>
    <div className="container">
        <h2>Join 페이지</h2>
        <LoginContextConsumer/>

        <JoinForm join={join}/>
    </div>
    </>
  )
}

export default Join
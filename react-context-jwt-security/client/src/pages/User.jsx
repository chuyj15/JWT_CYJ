import React, { useContext, useEffect, useState } from 'react'
import Header from '../components/Header/Header'
import LoginContextConsumer from '../contexts/LoginContextConsumer'
import UserForm from '../components/UserForm/UserForm'
import * as auth from '../apis/auth'
import { LoginContext } from '../contexts/LoginContextProvider'
import { useNavigate } from 'react-router-dom'
//회원정보 조회, 수정, 삭제 메소드를 props로 내려줄거에요.
const User = () => {
  //컨텍스트에서 가져와서 쓸수도 있겠지만 가장 최근의 유저정보를 불러오기 위해서 새로 작성해줄거임. 
  const [userInfo, setUserInfo] = useState()
  const navigate = useNavigate();
  const {isLogin, roles, logout, loginCheck} = useContext(LoginContext)
  const getUserInfo = async ()=>{
    //로그아웃 상태이거나 유저권한이 아닌 경우
    if (!isLogin || !roles.isUser) {
      console.log(`${!isLogin} and ${!roles.isUser}`) //true and true
      //왜 이런 오류가,,,,?????
      //아마도 useContext로 값을 가져오기 전에 이 함수가 useEffect에서 실행되기 때문일 것 같습니다..
      //useEffect에서 처리를 해줍니다..
      //TODO : 지금 로그인이 안됐을 때도 /user 로 들어가집니다. 해결부탁..
      navigate('/login')
      return
    }
    const response = await auth.info()
    const data = response.data
    console.log(`getUserInfo`)
    console.log(data)
    setUserInfo(data)
  }
  const updateUser = async (form)=>{
    console.log(form)
    let response
    let data
    try {
      response = await auth.update(form)
      data = response.data
      const status = response.status
      if (status === 200){
        alert('회원정보 수정 성공')
      } else {
        alert(`회원정보 수정 실패`)
      }
    } catch (error) {
      console.log(`${error}`)
    }
  }

  
  //회원탈퇴
  const deleteUser = async (userId) =>{
    let response
    try {
      response = await auth.remove(userId)
    } catch (error) {
      console.error(`${error} : 회원탈퇴 요청 중 에러 발생`)
      return
    }
    const data = response.data
    const status = response.status
    console.log(`data : ${data}`)
    console.log(`status : ${status}`)
    if (status ===200){
      console.log('회원탈퇴 성공')
      alert(`회원탈퇴 성공`)
      // navigate('/login')
      //탈퇴 시 로그아웃도 해줘야 함
      logout()
    } else {
      console.log('회원탈퇴 실패')
      alert(`회원탈퇴 실패`)
    }
  }

  useEffect(()=>{
    if (!isLogin){
      return
    }
    getUserInfo()
  }, [isLogin]) //이거는 뭐지?
  // }, []) //이거는 뭐지?
  
  return (
    <>
    <Header/>
    <div className="container">
        <h2>User 페이지</h2>
        <LoginContextConsumer/>
        <UserForm userInfo={userInfo} updateUser={updateUser} deleteUser={deleteUser}/>
    </div>
    </>
  )
}

export default User
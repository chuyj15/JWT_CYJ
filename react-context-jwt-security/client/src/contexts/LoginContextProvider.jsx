import React, { createContext, useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
import api from '../apis/api';
import Cookies from 'js-cookie';
import * as auth from '../apis/auth'
import * as Swal from '../apis/alert'

export const LoginContext = createContext();
LoginContext.displayName = 'LoginContextName'
/**
 * 로그인 여부
 * 로그인 요청
 * 로그아웃 요청
 * 
 * 로그인 세팅
 * 로그아웃 세팅
 */

const LoginContextProvider = ({ children }) => {
    // const navigate = useNavigate();
    //✨상태로 관리 : 로그인 여부, 유저정보, 권한정보, 아이디저장여부
    const [isLogin, setLogin] = useState(false)
    const [userInfo, setUserInfo] = useState({})
    const [roles, setRoles] = useState({ isUser: false, isAdmin: false })
    const [rememberUserId, setRememberUserId] = useState()

    //✨로그인 체크 (유저정보를 가져오는 작업) //ComponentDidMount에서도 호출되어야 한다. 
    // 쿠키안의 jwt토큰을 해석하기 위한 체킹
    //앞으로 useEffect 시에 계속 사용될 예정입니다 (?)
    const loginCheck = async () => {
        //쿠키에서 토큰 꺼내와서 헤더에 담아주고, 서버에 유저정보를 요청해야 함
        const accessToken = Cookies.get(`accessToken`)
        console.log(`accessToken : ${accessToken}`)
        if (!accessToken) {
            console.log(`쿠키에 accessToken이 없음`)
            logoutSetting() //굳이 해줘야 하나?
            return
        }
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`
        let response
        let data
        try {
            response = await auth.info()
        } catch (error) {
            console.log(`error: ${error}`)
            console.log(`status : ${response.status}`)
            return
        }
        data = response.data
        if (data == 'UNAUTHORISED' || response.status == 401){
            console.error(`accessToken (jwt)이 만료되었거나 인증에 실패하였습니다`)
        }
        console.log(`data : ${data}, 사용자 정보 요청 성공~`)
        loginSetting(data, accessToken)
    }

    //✨로그인 : jwt토큰을 받아와서 쿠키에 저장
    const login = async (username, password) => {
        console.log(`username : ${username}`)
        console.log(`password : ${password}`)
        try {
            const response = await auth.login(username, password)
            const data = response.data
            const status = response.status
            const headers = response.headers
            const authorization = headers.authorization //TODO : 왜???...
            const accessToken = authorization.replace("Bearer ", "") //이게 prefix 뺀 jwt
            console.log(`data : ${data}`)
            console.log(`status : ${status}`)
            console.log(`headers : ${headers}`)
            console.log(`authorization : ${authorization}`)
            console.log(`accessToken : ${accessToken}`)
            //status == 200 이면 로그인성공으로 판단하겠습니다. 
            if (status == 200) {
                //🏓쿠키에 accessToken(jwt) 저장
                Cookies.set(`accessToken`, accessToken)
                //로그인 체크 메소드( /users/{userId} 를 통해 userData를 받아오겠음. )
                loginCheck()
                //sweetalert 사용하려면 모듈을 임포트 해줘야 합니다. 
                Swal.alert(`로그인 성공`, `메인화면으로 갑니다~`, `success`, ()=>{window.location.href='/'})
            }
        } catch (error) {
            //로그인 실패 시 로직
            // alert('아이디 또는 비밀번호가 일치하지 않습니다.') 
            Swal.alert(`로그인 실패`, `로그인 재시도 해보세요....`, `error`)      
        }
    }
    //✨로그인 세팅
    //accessToken : 쿠키에 저장해놓은 jwt 토큰
    const loginSetting = (userData, accessToken) => {
        const { no, userId, authList } = userData
        const roleList = authList.map((auth) => auth.auth) //궁금한 점 : {} 있을때 없을때 차이
        //궁금한 점 : 아까 username으로 한 건 어디서 userId로 변환되는지?
        console.log(`no : ${no}`)
        console.log(`userId : ${userId}`)
        console.log(`roleList : ${roleList}`)
        //axios 객체의 header(Authorization : `Bearer ${accessToken}`) 셋팅해주기
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`
        //로그인 여부 : true로 셋팅
        setLogin(true)
        //유저정보 셋팅
        const updateUserInfo = { no, userId, roleList }
        setUserInfo(updateUserInfo)
        //권한정보 셋팅
        const updatedRoles = { isUser: false, isAdmin: false }
        roleList.forEach((role) => {
            if (role == 'ROLE_USER') updatedRoles.isUser = true
            if (role == 'ROLE_ADMIN') updatedRoles.isAdmin = true
        })
        setRoles(updatedRoles)

    }

    //✨로그아웃 세팅
    const logoutSetting = () => {
        //axios 객체에 header에서 jwt 삭제해주기
        api.defaults.headers.common.Authorization = undefined
        //쿠키에 jwt 삭제
        Cookies.remove(`accessToken`)
        //로그인 여부 : false
        setLogin(false)
        //유저 정보 비우기
        setUserInfo(null)
        //권한 정보 비우기
        setRoles(null)
    }
    //✨로그아웃 
    const logout = () => {
        // const check = window.confirm(`정말로 로그아웃 하시겠어요?`)
        Swal.confirm(`로그아웃할거에요?`, `로그아웃을 진행합니다`, `warning`, (result)=>{
            if (result.isConfirmed){
                logoutSetting()
                window.location.href='/'
            }
        })
        //result: 확인버튼눌렀을때 true, 아니면 false
      
    }

    useEffect(() => {
        //로그인하고 새로고침 시 로그아웃이 되는걸 막는 방법입니다. 
        loginCheck()
    }, [])

    return (
        <>
            <LoginContext.Provider value={{ isLogin, logout, login, userInfo, roles, loginCheck }}>
                {children}
            </LoginContext.Provider>
        </>
    )
}

export default LoginContextProvider
import React, { useContext, useEffect } from 'react'
import Header from '../components/Header/Header'
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../contexts/LoginContextProvider';

const Admin = () => {
    const { isLogin, roles, userInfo } = useContext(LoginContext);
    const navigate = useNavigate()
    useEffect(() => {
        
        if (!isLogin || !userInfo) {
            alert('로그인이 필요합니다')
            navigate('/login')
            return  //함수가 여기서 멈춰야 함. 뒤에꺼도 하면 안됨. 
        }
        // if (!userInfo){
        //     return
        // }

        if (!roles.isAdmin) {
            alert(`권한이 없습니다`)
            navigate(-1) //뒤로가기
            return
        }

        //스트릭트?모드 때문에 로그인이필요합니다 알람이 두번 뜨고 있음. 

    }, [userInfo])
    return (
        <>
            <Header />
            {isLogin && roles.isAdmin &&
                <>
                    <div className="container">
                        <h1>Admin</h1>
                        <hr />
                        <h2>관리자 페이지</h2>
                    </div>
                    <center>
                        <img src="/img/loading.webp" alt="loading" />
                    </center>
                </>
            }

        </>
    )
}

export default Admin
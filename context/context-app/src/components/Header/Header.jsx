import React, { useContext } from 'react'
import './Header.css'
import { Link } from 'react-router-dom'
import { LoginContext } from '../../contexts/LoginContextProvider'
const Header = () => {
    //로그인 여부, 로그아웃 함수 받아오기
    const { isLogin, logout } = useContext(LoginContext);

    return (

        <header>
            <div className="logo">
                <Link to="/">
                    <img src="https://i.imgur.com/fzADqJo.png" className='logo' alt="로고이미지" />
                </Link>
            </div>

            {!isLogin &&
                <ul>
                    <li><Link to="/login">로그인</Link></li>
                    <li><Link to="/join">회원가입</Link></li>
                    <li><Link to="/about">소개</Link></li>
                </ul>
            }
            {isLogin &&
                <ul>
                    <li><Link to="/user">마이페이지</Link></li>
                    <li><button className="link" onClick={logout}>로그아웃</button></li>
                </ul>
            }
        </header>


    )
}

export default Header
import React, { useContext } from 'react'
import './LoginForm.css'
import { LoginContext } from '../../contexts/LoginContextProvider'
const LoginForm = () => {
    const {login} = useContext(LoginContext)
    const onLogin = (e) => {
        //데이터 셋팅
        e.preventDefault() //submit동작 막기
        const form = e.target
        const username = form.username.value
        const password = form.password.value
        //유효성 검사를 추가해도 됨
        login(username, password)

    }

    return (
        <>
            <div className="form">
                <h2 className="login-title">Login</h2>

                <form className='login-form' 
                onSubmit={(e) => onLogin(e)}
                >
                    <div>
                        <label htmlFor="name">username</label>
                        <input type="text" id='username' placeholder='username' name='username' autoComplete='username' required 
                        //TODO :  defaultValue={} : 나중에 아이디저장시 구현예정

                        //autoComplete 속성은 사용자가 이전에 입력한 값으로 자동 완성을 제어하는 데 사용
                        />
                    </div>

                    <div>
                        <label htmlFor="password">password</label>
                        <input type="password" id="password" placeholder='password' name="password" autoComplete='password' required />
                    </div>

                    <button type='submit' className='btn btn--form btn-login' 
                    // onClick={()=>{login}}
                    >Login</button>
                    
                </form>
            </div>
        </>
    )
}

export default LoginForm
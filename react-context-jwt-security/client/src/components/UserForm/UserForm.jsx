import React from 'react'
import './UserForm.css'
const UserForm = ({userInfo, updateUser, deleteUser}) => {
    const onUpdate = (e) =>{
        e.preventDefault();
        const form = e.target;
        const userId = form.username.value
        const userPw = form.password.value
        const name = form.name.value
        const email = form.email.value
        console.log(userId, userPw, name, email)
        updateUser({userId, userPw, name, email})
    }

    return (
        <>
            <div className="form">
                <h2 className="login-title">UserInfo(회원정보 수정)</h2>

                <form className='login-form' onSubmit={(e) => onUpdate(e)}>
                    <div>
                        <label htmlFor="username">username</label>
                        <input type="text" id='username' placeholder='username' name='username' autoComplete='username' defaultValue={userInfo?.userId}  />
                    </div>

                    <div>
                        <label htmlFor="password">password</label>
                        <input type="password" id="password" placeholder='password' name="password" autoComplete='password' required />
                    </div>
                    <div>
                        <label htmlFor="name">Name</label>
                        <input type="text" id='name' placeholder='name' name='name' autoComplete='name' required  defaultValue={userInfo?.name} />
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input type="text" id='email' placeholder='email' name='email' autoComplete='email' required  defaultValue={userInfo?.email} />
                    </div>

                    <button type='submit' className='btn btn--form btn-login'>회원정보 수정</button>
                    <button type='button' className='btn btn--form btn-login' onClick={()=>deleteUser(userInfo?.userId)}>회원탈퇴</button>

                </form>
            </div>
        </>
    )
}

export default UserForm
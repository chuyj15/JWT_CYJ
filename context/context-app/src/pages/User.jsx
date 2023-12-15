import React from 'react'
import Header from '../components/Header/Header'
import LoginContextConsumer from '../contexts/LoginContextConsumer'

const User = () => {
  return (
    <>
    <Header/>
    <div className="container">
        <h1>User</h1>
        <hr />
        <h2>User 페이지</h2>
        <LoginContextConsumer/>
    </div>
    </>
  )
}

export default User
import React from 'react'
import {useAuth} from '../context/DataContext'

const Home = () => {
     const { user, setUser, logout } = useAuth()
  return (
    <div>Hello {user.email}
    <button className=' px-4 py-2 rounded-xl' onClick={logout}>Logout</button>
    </div>
    
  )
}

export default Home
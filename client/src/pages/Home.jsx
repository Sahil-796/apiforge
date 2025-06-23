import React, { useEffect } from 'react'
import {useAuth} from '../context/DataContext'
import { Navigate, useNavigate } from 'react-router-dom';



const Home = () => {
     const { user, logout } = useAuth()
     const navigate = useNavigate()

      if(!user) {
        return <Navigate to='/login'/>
      }
     
    
  return (
    <div>
    <button className=' px-4 py-2 rounded-xl' onClick={logout}>Logout</button>
    </div>
    
  )
}

export default Home
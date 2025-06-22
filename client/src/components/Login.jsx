import React, { useState, useEffect } from 'react';
import {useAuth} from '../context/DataContext'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


const Login = () => {
  
   const { user, setUser, logout } = useAuth()
   const [msg, setMsg] = useState("")
   const [email, setEmail] = useState("")
   const [password, setPassword] = useState("")

      const handleSUbmit = async (e) => {
        e.preventDefault()
        setMsg('')
        setLoading(true)

        try {
          const res = await axios.post('http://localhost:3000/api/auth/login',
            {email, password},
            {withCredentials: true}
          );
          // handle success, e.g. set user context or redirect
          setMsg('Login successful');
          setUser(res.data.user)
        } catch (err) {
          setMsg(err.response?.data?.message || 'Login failed');
        } finally {
          setLoading(false);
        }
        }
    
        const handleGoogleLogin = () => {
          window.location.href = 'http://localhost:3000/api/auth/google';
        };





  return (
    <div className='bg-black text-white'>
  
      <form className="grid w-full max-w-sm items-center gap-3">

        <Label htmlFor="email">Email</Label>
      <Input className='bg-[#1f1e1e]' type="email" id="email" placeholder="Email" />
      </form>

     </div>
  
  );
};

export default Login;

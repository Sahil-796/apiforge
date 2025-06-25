import React, { useState, useEffect } from 'react';
import {useAuth} from '../context/DataContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {
  const navigate = useNavigate()
  
   const { setUser } = useAuth()
   
   const [error, setError] = useState("")
   const [email, setEmail] = useState("")
   const [password, setPassword] = useState("")
   const [loading, setLoading] = useState(false)

      const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
          const res = await axios.post('http://localhost:3000/api/auth/login',
            {email, password},
            {withCredentials: true,
              headers: {
      'Content-Type': 'application/json'
    }
            }
          );
          // handle success, e.g. set user context or redirect
          navigate('/');
          setUser(res.data.user)
        } catch (err) {
          console.log(err || 'yay')
          setError(err.response?.data?.message || 'Login failed');
        } finally {
          setLoading(false);
        }
        }
    
        const handleGoogleLogin = () => {
          window.location.href = 'http://localhost:3000/api/auth/google';

        };





  return (
    <div className='bg-[#1a1a1a]  min-h-dvh flex flex-col items-center justify-center text-white gap-6 p-4 '>

      <h1 className='text-6xl text-[#35C89C] md:text-[#21C292] font-bold font-grotesk'>APIFORGE</h1>

      <div className='w-full max-w-sm sm:max-w-md p-6 rounded-xl shadow-md bg-[#2f2f2f] flex flex-col gap-5'>

        
        
        <form 
        onSubmit={handleSubmit}
        className="gap-6 flex flex-col">

        <div className='flex flex-col gap-4'>
        
        <div className='flex flex-col gap-2'>
        <label htmlFor="email">Email</label>        
        <input 
        value={email}
        onChange={((e)=>setEmail(e.target.value))}
        required
        className=' px-4 py-1 outline-1 outline-white rounded-sm bg-[#1a1a1a]' type="email" placeholder="Email" />
        </div>

        <div className='flex flex-col gap-2'>
        <label htmlFor="email">Password</label>        
        <input 
        value={password}
        onChange={((e)=>setPassword(e.target.value))}
        required
        className='px-4 py-1 outline-1 outline-white rounded-sm bg-[#1a1a1a] p' type="password" placeholder="Password" />
        </div>
        
        </div>

        <button className='bg-[#3b82f6] font-semibold rounded-md py-1.5 px-4 border hover:bg-[#2563eb] transition self-center cursor-pointer'>Login</button>

        </form>

        <div className='flex items-center'>
         <hr className="flex-grow border-gray-300"/>
          <span className="px-4 text-gray-500">OR</span>
          <hr className="flex-grow border-gray-300"/>
        </div>

        <div>
          <button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-[#1a1a1a] border border-gray-300 text-white py-2 px-4 rounded-md cursor-pointer transition">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google logo" className="w-5 h-5" />
          Continue with Google
          </button>


        </div>

          {error ? (
 <h3
  className={`self-center text-red-500 transition-all duration-300 ${
    error === '' ? 'opacity-0 h-0' : 'opacity-100 h-auto'
  }`}
>
  {error}
</h3>
):
(<p>{loading}</p>)
}

      </div>
      

     </div>
  
  );
};

export default Login;

import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('Login successful!');
      } else {
        setMsg(data.message || 'Login failed');
      }
    } catch (err) {
      setMsg('Network error');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/api/auth/google';
  };

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="bg-green-600 text-black px-4 py-2 rounded font-bold"
      >
        Login
      </button>
      <Dialog open={show} onClose={() => setShow(false)} className="fixed inset-0 z-50 flex items-center justify-center">
       <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm" aria-hidden="true" />

        <Dialog.Panel className="relative bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md z-50 animate-scaleIn">
          <button
            onClick={() => setShow(false)}
            className="absolute top-2 right-2 text-green-400 text-xl font-bold z-10"
            aria-label="Close"
          >
            &times;
          </button>
          <div className="flex flex-col items-center mb-6">
            {/* Logo placeholder */}
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-2">
              <span className="text-black text-2xl font-bold">Logo</span>
            </div>
            <h2 className="text-2xl font-bold text-green-500 mb-2">Login</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              className="w-full px-4 py-2 rounded bg-black text-green-400 border border-green-700 focus:outline-none"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="w-full px-4 py-2 rounded bg-black text-green-400 border border-green-700 focus:outline-none"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-black font-bold py-2 rounded transition"
            >
              Login
            </button>
          </form>
          <div className="my-4 flex items-center">
            <div className="flex-grow border-t border-green-700"></div>
            <span className="mx-2 text-green-500">or</span>
            <div className="flex-grow border-t border-green-700"></div>
          </div>
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center bg-black border border-green-600 text-green-400 py-2 rounded hover:bg-green-800 transition"
          >
            {/* Google logo placeholder */}
            <span className="bg-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
              <span className="text-green-600 font-bold">G</span>
            </span>
            Login with Google
          </button>
          {msg && <div className="mt-4 text-center text-green-400">{msg}</div>}
        </Dialog.Panel>
        {/* Tailwind custom animation */}
        <style>
          {`
            .animate-scaleIn {
              animation: scaleIn 0.2s cubic-bezier(0.4,0,0.2,1);
            }
            @keyframes scaleIn {
              0% { transform: scale(0.95); opacity: 0; }
              100% { transform: scale(1); opacity: 1; }
            }
          `}
        </style>
      </Dialog>
    </>
  );
};

export default Login;
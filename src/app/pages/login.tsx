'use client'
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (token: string) => void;
  onToggle: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onToggle }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [token, setToken] = useState<string | null>(null);
  const [isSignup, setIsSignup] = useState<boolean>(true); // Track if user is signing up or logging in

  const handleLogin = (token: string) => {
    setToken(token);
  };

  const toggleSignup = () => {
    setIsSignup(!isSignup); // Toggle between signup and login
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8002/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username, password }).toString(),
      });

      if (response.ok) {
        const data = await response.json();
        onLogin(data.access_token); // Trigger login callback with token
      } else {
        setError('Failed to log in');
      }
    } catch (error) {
      setError('An error occurred during login');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="h-screen md:flex">
      <div className="relative overflow-hidden md:flex w-1/2 bg-gradient-to-tr from-blue-800 to-purple-700 justify-around items-center hidden">
        <div>
          <h1 className="text-white font-bold text-4xl font-sans">ASK_MUZZAMIL</h1>
          <p className="text-white mt-1">Powered by Gemini Flash 1.5</p>
        </div>
        <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
      </div>
    <div className="flex md:w-1/2  justify-center py-10 items-center bg-white">
      
        <form className="bg-white shadow-2xl rounded-lg px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
          <h1 className="text-gray-800 text-center font-bold w-[400px] text-2xl mb-4">Login</h1>
          {error && <p className="text-red-500">{error}</p>} {/* Display login errors */}
          <div className="mb-4">
            <label className="block text-gray-400 text-sm font-bold mb-1" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 text-sm font-bold mb-1" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Login
            </button>
          </div>
          <button
            type="button"
            onClick={onToggle}
            className="inline-block  align-baseline text-center  mx-auto flex mt-2 font-bold text-sm text-blue-500 hover:text-blue-800"
          >
            <p className='text-gray-400 mr-1'>Don't have an account?</p> Sign up
         </button>
        </form>
      </div>
    </div>
    
  );
};

export default Login;
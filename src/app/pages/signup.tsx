'use client';
import React, { useState } from 'react';

interface SignupProps {
  onLogin: (token: string) => void;
  onToggle: () => void; // Switch between login and signup views
}

const Signup: React.FC<SignupProps> = ({ onLogin, onToggle }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // To display errors

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Reset error state

    try {
      const response = await fetch('http://localhost:8002/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        // Assuming the backend sends the email verification link and responds with success
        alert('Signup successful! Please check your email to verify your account.'); // Notify the user
        onToggle(); // Redirect to login page after successful signup
      } else if (response.status === 409) {
        setError('Username already exists. Please choose another one.');
      } else {
        setError('Failed to sign up. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('An error occurred. Please try again later.');
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
        <form className="bg-white shadow-2xl rounded-lg px-8 pt-6 w-[400px] pb-8 mb-4" onSubmit={handleSignup}>
          <h1 className="text-gray-800 text-center font-bold text-2xl mb-6">Sign Up</h1>
          {error && <p className="text-red-500 text-sm">{error}</p>} {/* Display error */}
          <div className="mb-4">
            <label className="block text-gray-400 text-sm font-bold  mb-1" htmlFor="username">Username</label>
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
            <label className="block text-gray-400 text-sm font-bold mb-1" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-400 text-sm font-bold mb-1" htmlFor="password">Password</label>
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
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-3 w-full"
            >
              Sign Up
            </button>
          </div>
          <button
            type="button"
            onClick={onToggle} // Redirect to login page when clicked
            className="inline-block align-baseline text-center mx-auto flex font-bold text-sm text-blue-500 hover:text-blue-800"
          >
            <p className='text-gray-400 mr-1'>Already have an account?</p> Login
          </button>
        </form>
      </div>
    </div>
    
  );
};

export default Signup;
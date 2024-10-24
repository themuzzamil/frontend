import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const EditUser: React.FC<{ token: string }> = ({ token }) => {
  const [userId, setUserId] = useState<number>(0); // User ID to edit
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch current user data (optional, if you want to pre-fill the form)
  useEffect(() => {
    const fetchUserData = async () => {
      // Replace with your logic to get the current user's ID
      const response = await fetch(`http://localhost:8002/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setName(userData.name);
        setEmail(userData.email);
      } else {
        setError('Failed to fetch user data.');
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = {
      name,
      email,
      password,
    };
  
    try {
      const response = await fetch(`http://localhost:8002/Edit/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
  
      const data = await response.json();
      console.log('User updated successfully:', data);
      router.push('/profile'); // Redirect to the profile or desired page after successful update
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error updating user:', error.message);
        setError(error.message);
      } else {
        console.error('Unexpected error:', error);
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg bg-gray-800">
      <h1 className="text-2xl font-bold text-white mb-4">Edit User</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white" htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-white" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-white" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default EditUser;

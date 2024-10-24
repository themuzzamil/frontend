// pages/verify-email.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const VerifyEmail = () => {
  const router = useRouter();
  const { token } = router.query; // Retrieve token from the URL
  const [message, setMessage] = useState('Verifying...');

  useEffect(() => {
    if (token) {
      fetch(`http://localhost:8002/verify-email?token=${token}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Verification failed');
          }
          return response.json();
        })
        .then((data) => {
          if (data.message) {
            setMessage(data.message);
            // Redirect to login after a slight delay to give users a moment to read the message
            setTimeout(() => {
              router.push('/login');
            }, 2000); // Delay before redirecting
          } else {
            setMessage('Failed to verify email.');
          }
        })
        .catch((error) => {
          console.error('Verification error:', error);
          setMessage('Error verifying email.');
        });
    } else {
      setMessage('Invalid or missing token.');
    }
  }, [token, router]);

  return (
    <div className="h-screen flex justify-center items-center">
      <h1 className="text-2xl">{message}</h1>
    </div>
  );
};

export default VerifyEmail;

import React from 'react';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 relative">

      <button
        onClick={() => navigate('/')}
        className="absolute top-5 right-5 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow"
      >
        ← Back to Home
      </button>

      <h1 className="text-4xl font-bold text-red-500 mb-6">Developer Contact Info</h1>

      <div className="bg-gray-800 p-6 rounded shadow-lg w-full max-w-md text-center">
        <p className="text-xl mb-4">
          <span className="font-semibold text-red-500">Name:</span> Mudit Kumar
        </p>
        <p className="text-xl mb-4">
          <span className="font-semibold text-red-500">Email:</span> muditchauhan28@gmail.com
        </p>
        <p className="text-xl mb-4">
          <span className="font-semibold text-red-500">Phone:</span> +91-9458073803
        </p>
        <p className="text-xl mb-4">
          <span className="font-semibold text-red-500">LinkedIn:</span>{' '}
          <a
            href="https://www.linkedin.com/in/mudit-kumar-003a61186/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            linkedin.com/in/muditkumar
          </a>
        </p>
        <p className="text-xl mb-4">
          <span className="font-semibold text-red-500">GitHub:</span>{' '}
          <a
            href="https://github.com/mudit2838"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            github.com/muditkumar
          </a>
        </p>
      </div>
    </div>
  );
};

export default Contact;

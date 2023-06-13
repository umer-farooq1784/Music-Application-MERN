import React, { useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import { motion } from "framer-motion";

const ContactUsPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/send-email', { name, email, message });
      alert('Email sent successfully!');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.log(error);
      alert('An error occurred while sending the email.');
    }
  };

  return (
    <div className='w-full h-full'>
      <Header/>
    <div className="w-auto flex flex-col items-center justify-center p-4 border border-gray-300 rounded-md bottom-96">
    
      <h2 className="px-8 py-2 flex-col items-center rounded-md w-full text-white bg-red-600 
          hover: shadow-lg justify-self-center text-center">Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block font-semibold mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-md text-base font-semibold text-textColor outline-none shadow-sm border border-gray-300 bg-transparent"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block font-semibold mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-md text-base font-semibold text-textColor outline-none shadow-sm border border-gray-300 bg-transparent"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block font-semibold mb-1">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 rounded-md text-base font-semibold text-textColor outline-none shadow-sm border border-gray-300 bg-transparent"
            rows="4"
            required
          ></textarea>
        </div>
        <div className="flex items-center justify-center w-60 cursor-pointer p-4">
               

          <motion.button whileTap={{scale: 0.75}} className="px-8 py-2 rounded-md w-full text-white bg-red-600 
          hover: shadow-lg">
            Submit
          </motion.button>
                

        </div>
      </form>
    </div>
    </div>
    
  );
};

export default ContactUsPage;

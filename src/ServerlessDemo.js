import React, { useState, useEffect } from 'react';

function ServerlessDemo() {
  const [message, setMessage] = useState('Loading...');
  const [inputValue, setInputValue] = useState('');

  // Function to call the serverless function
  const callFunction = async (nameParam = '') => {
    setMessage('Loading...');
    try {
      const response = await fetch(`/api/hello${nameParam ? `?name=${nameParam}` : ''}`);
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error('Error calling serverless function:', error);
      setMessage('Error calling serverless function. See console for details.');
    }
  };

  // Call the function when component mounts
  useEffect(() => {
    callFunction();
  }, []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    callFunction(inputValue);
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md my-8">
      <h2 className="text-2xl font-bold mb-4">Netlify Python Serverless Function Demo</h2>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <p className="text-gray-800">{message}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter your name"
            className="flex-grow px-4 py-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r"
          >
            Submit
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-sm text-gray-600">
        <p>This component demonstrates how to call a Python serverless function deployed on Netlify.</p>
        <p className="mt-2">The function is located at <code>/netlify/functions/hello.py</code> and is accessible via the <code>/api/hello</code> endpoint.</p>
      </div>
    </div>
  );
}

export default ServerlessDemo;
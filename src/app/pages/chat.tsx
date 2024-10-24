'use client'; // Ensure this is at the top for client components
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation'; // Use Next.js router for redirection
import MDR from '../../components/MArkdown';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"; // Import Sidebar components
import { AppSidebar } from "@/components/ui/app-sidebar";

const Chat: React.FC<{ token: string }> = ({ token }) => {
  const [input, setInput] = useState(''); // Input state for the user's message
  const [messages, setMessages] = useState<{ user: string; bot: string }[]>([]); // Messages state
  const messagesEndRef = useRef<null | HTMLDivElement>(null); // Ref to keep track of the chat bottom
  const router = useRouter();
  const [open, setOpen] = useState(false); // Sidebar state

  // Check for token in localStorage and redirect to login if not found
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      router.push('/login'); // Redirect to login page if no token is found
    }
  }, [router]);

  // Scroll to the latest message whenever messages are updated
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userMessage = input.trim(); // Get and trim the user's input message
    if (!userMessage) return; // Do not submit if the input is empty

    setMessages([...messages, { user: userMessage, bot: '...' }]); // Add the user's message and a placeholder bot response

    try {
      // Fetch the bot response from the server
      const response = await fetch('http://localhost:8001/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the request header
        },
        body: JSON.stringify({ prompt: userMessage }), // Send the user's message as the prompt
      });

      // Handle errors in response
      if (!response.ok) {
        const errorMessage = await response.text();
        console.error('Error response:', response.status, errorMessage);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the response data
      const data = await response.json();

      // Update the bot's response for the last message
      setMessages((prevMessages) =>
        prevMessages.map((msg, i) =>
          i === prevMessages.length - 1 ? { ...msg, bot: data.data } : msg
        )
      );
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: userMessage, bot: 'Error fetching response' },
      ]);
    }

    setInput(''); // Clear the input field after submission
  };

  return (
    <div className="relative h-full w-full bg-slate-950">
      <div className="flex flex-col h-screen bg-[radial-gradient(circle_500px_at_50%_200px,#3e3e3e,transparent)]">
        <div className="flex-grow overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-center text-gray-400">
              Chat with Muzzamil-AI
            </h1>
            <p className="text-center text-sm text-gray-400 mt-4 mb-4">
              Powered by Gemini Flash 1.5
            </p>
            <SidebarProvider open={open} onOpenChange={setOpen}>
              <AppSidebar />
              <main>
                <SidebarTrigger />
                {/* Chat messages */}
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div key={index} className="flex flex-col">
                      {/* User message */}
                      <div className="self-end bg-[#292C39] text-[#FCD9B8] p-4 m-2 rounded-lg max-w-xl min-w-80">
                        <p className="text-lg">{message.user}</p>
                      </div>
                      {/* Bot message */}
                      <div className="self-start p-3 m-2 text-gray-300 rounded-lg max-w-full min-w-80 mt-2 flex items-top space-x-2">
                        <img
                          src="/favicon.ico"
                          alt="favicon"
                          className="w-8 h-8 rounded-full"
                        />
                        {message.bot === '...' ? (
                          <p className="animate-pulse opacity-0 transition-opacity duration-1000 text-2xl">
                            ...
                          </p>
                        ) : (
                          <MDR content={message.bot} />
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </main>
            </SidebarProvider>
          </div>
        </div>

        <div className="p-4 border-t border-[#FCD9B8] flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="flex items-center space-x-4 w-full max-w-3xl"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow bg-[#292C39] text-[#FCD9B8] p-4 rounded-md resize-none"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  e.currentTarget.form?.requestSubmit();
                }
              }}
            />
            <button
              type="submit"
              className="bg-[#FCD9B8] text-[#292C39] border border-[#FCD9B8] px-4 py-2 rounded-md hover:bg-transparent hover:text-[#FCD9B8] hover:border-[#FCD9B8]"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;


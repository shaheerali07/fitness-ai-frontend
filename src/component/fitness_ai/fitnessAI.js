// In your FitnessAIChatbot component
import { Howl } from "howler";
import parse from "html-react-parser";
import React, { useEffect, useRef, useState } from "react";
import PuffLoader from "react-spinners/PuffLoader";
import api from "../../service/axios";
function FitnessAIChatbot() {
  const [messages, setMessages] = useState([
    {
      text: "Hi there, how can I be of service for you today?",
      sender: "agent",
    },
  ]);
  // Initialize sound using Howl from howler.js
  const notificationSound = new Howl({
    src: [
      "https://commondatastorage.googleapis.com/codeskulptor-assets/week7-brrring.m4a",
    ], // URL to a sound
    volume: 0.5,
  });
  const email = localStorage.getItem("fitnessemail");
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    setLoading(true);
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");

      api
        .get(
          `/chatbot/askMe?question=${encodeURIComponent(input)}&email=${email}`
        )
        .then((res) => {
          setLoading(false);
          if (res.data) {
            setMessages((prevMessages) => [
              ...prevMessages,
              { text: res.data, sender: "agent" }, // Store raw HTML
            ]);
            // Play notification sound when a response comes
            notificationSound.play();
          }
        })
        .catch((error) => {
          setLoading(false);
          console.error("Error calling the chatbot API:", error);
        });
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default action (like form submission)
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-150px)] rounded-lg bg-gray-100">
      <div className="flex items-center px-4 py-3 rounded-lg bg-gray-200">
        <img src="Fitness AI.png" alt="Agent Avatar" className=" h-10 w-10" />
        <div className="ml-4 text-lg text-black font-semibold">Fitness AI</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={` text-[17px] px-4 py-2  rounded-lg custom-container ${
                message.sender === "user"
                  ? "bg-blue-500 text-white text-right"
                  : "bg-gray-300 text-black text-left"
              }`}
              // Use dangerouslySetInnerHTML to render the HTML content
              // dangerouslySetInnerHTML={{ __html: parse(message.text) }}
            >
              {parse(message.text)}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 bg-gray-200 flex items-center">
        <input
          type="text"
          value={input}
          disabled={loading}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 p-2 border border-gray-300 text-base text-black rounded-lg focus:outline-none"
          placeholder="Type your message..."
        />
        <button
          disabled={loading}
          onClick={handleSend}
          className="ml-4 px-4 py-2 bg-blue-500 text-base text-white rounded-lg"
        >
          {loading ? <PuffLoader size={20} color={"#fff"} /> : "Send"}
        </button>
      </div>
    </div>
  );
}

export default FitnessAIChatbot;

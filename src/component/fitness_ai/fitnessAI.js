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

  const notificationSound = new Howl({
    src: [
      // "https://commondatastorage.googleapis.com/codeskulptor-assets/week7-brrring.m4a",
      "/sounds/alert.wav",
    ],
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

      const question =
        input === "Suggest me diet plans"
          ? "Suggest me diet plans according my fitness goal, height, weight etc. and for whole week"
          : input === "Suggest me exercise plans"
          ? "Suggest me exercise plans according my fitness goal, height, weight etc. and for whole week"
          : input;

      api
        .get(
          `/chatbot/askMe?question=${encodeURIComponent(
            question
          )}&email=${encodeURIComponent(email)}`
        )
        .then((res) => {
          setLoading(false);
          if (res.data) {
            setMessages((prevMessages) => [
              ...prevMessages,
              { text: res.data, sender: "agent" },
            ]);
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
      e.preventDefault();
      handleSend();
    }
  };

  const handlePromptClick = (promptText) => {
    setLoading(true);
    setMessages([...messages, { text: promptText, sender: "user" }]);
    const question =
      promptText === "Suggest me diet plans"
        ? "Suggest me diet plans according my fitness goal, height, weight etc. and for whole week"
        : promptText === "Suggest me exercise plans"
        ? "Suggest me exercise plans according my fitness goal, height, weight etc. and for whole week"
        : promptText;
    api
      .get(
        `/chatbot/askMe?question=${encodeURIComponent(
          question
        )}&email=${encodeURIComponent(email)}`
      )
      .then((res) => {
        setLoading(false);
        if (res.data) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: res.data, sender: "agent" },
          ]);
          notificationSound.play();
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error calling the chatbot API:", error);
      });
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
              className={`text-[17px] px-4 py-2 rounded-lg ${
                message.sender === "user"
                  ? "bg-[#5534a5] text-white text-right"
                  : "bg-gray-300 text-black text-left"
              }`}
            >
              {parse(message.text)}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Predefined Prompts Section */}
      <div className="p-4 flex space-x-2">
        <button
          onClick={() => handlePromptClick("Suggest me diet plans")}
          style={{
            border: "2px solid #5534a5",
          }}
          className="px-3 text-[17px] py-1  rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
        >
          Suggest me diet plans
        </button>
        <button
          style={{
            border: "2px solid #5534a5",
          }}
          onClick={() => handlePromptClick("Suggest me exercise plans")}
          className="px-3 text-[17px] py-1  rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
        >
          Suggest me exercise plans
        </button>
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
          className="ml-4 px-4 py-2 bg-[#5534a5] text-base text-white rounded-lg"
        >
          {loading ? <PuffLoader size={20} color={"#fff"} /> : "Send"}
        </button>
      </div>
    </div>
  );
}

export default FitnessAIChatbot;

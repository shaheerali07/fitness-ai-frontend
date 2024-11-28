import { Howl } from "howler";
import { useEffect, useRef, useState } from "react";
import PuffLoader from "react-spinners/PuffLoader";

import { SUPPORT_QUESTIONS } from "../../data/data";
import api from "../../service/axios";
function Support() {
  const [messages, setMessages] = useState([]);
  const notificationSound = new Howl({
    src: ["/sounds/alert.wav"],
  });
  const [loading, setLoading] = useState(false);
  const email = localStorage.getItem("fitnessemail");
  const [feedbackContent, setFeedBackContent] = useState(0);
  const chatEndRef = useRef(null);
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12; // convert to 12-hour format, handle 0 as 12
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${formattedMinutes} ${ampm}`;
  };
  const sendFeedBack = () => {
    if (!feedbackContent) {
      return;
    }
    if (feedbackContent === "0") {
      return;
    }
    const today = new Date();
    const currentTime = formatTimestamp(new Date());
    setMessages([
      ...messages,
      {
        text: SUPPORT_QUESTIONS.find(
          (el) => el.id === parseInt(feedbackContent)
        ).question,
        sender: "user",
        timestamp: currentTime,
      },
    ]);
    const header = {
      email: localStorage.getItem("fitnessemail"),
      password: localStorage.getItem("fitnesspassword"),
    };
    const updateData = {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      date: today.getDate(),
      hour: today.getHours(),
      minute: today.getMinutes(),
      questionId: parseInt(feedbackContent),
    };
    api
      .post("/feedback/asksupport", { header: header, updateData: updateData })
      .then((res) => {
        if (res.data) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              text: res.data.message,
              sender: "support",
              timestamp: formatTimestamp(new Date()),
            },
          ]);
          notificationSound.play();
          setFeedBackContent("0");
        } else {
          setFeedBackContent("0");
        }
      })
      .catch(() => {
        setFeedBackContent("0");
      });
  };
  const fetchUserChatHistory = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/feedback/getFeedback?email=${email}`);
      if (response.data && response.data.message.length) {
        setLoading(false);
        const chatHistory = response.data.message[0].messages.map((message) => {
          return {
            text: message.message,
            sender: message.sender === "user" ? "user" : "support",
            timestamp: formatTimestamp(message.timestamp),
          };
        });
        setMessages(chatHistory);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-150px)] rounded-lg bg-gray-100">
      <div className="flex items-center px-4 py-3 rounded-lg bg-gray-200">
        <img src="Support_active.png" alt="ai Avatar" className=" h-10 w-10" />
        <div className="ml-4 text-lg text-black font-semibold">
          Live Chat Support
        </div>
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
              className={`relative text-[17px] px-4 py-2 rounded-lg ${
                message.sender === "user"
                  ? "bg-[#5534a5] text-white text-right"
                  : "!bg-gray-300 text-black text-left"
              }`}
            >
              <div
                className={` custom-style
              ${message.sender === "user" ? "bg-[#5534a5] " : "!bg-gray-300 "}
              `}
              >
                {message.text}
              </div>
              {message.text !==
                "Hi there, how can I be of service for you today?" && (
                <div
                  className={`text-xs ${
                    message.sender === "user"
                      ? "text-white-100"
                      : "text-gray-500"
                  } mt-1 text-right`}
                >
                  {message.timestamp}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 bg-gray-200 flex items-center">
        <select
          onChange={(e) => setFeedBackContent(e.target.value)}
          className="ml-4 px-4 py-2 bg-white border text-[16px] border-gray-300 rounded-lg w-full text-black"
        >
          <option value={"0"}>Select a question</option>
          {SUPPORT_QUESTIONS.map((question) => (
            <option key={question.id} value={question.id}>
              {question.question}
            </option>
          ))}
        </select>
        <button
          disabled={loading || feedbackContent === "0"}
          onClick={sendFeedBack}
          className="ml-4 disabled:cursor-not-allowed px-4 py-2 bg-[#5534a5] hover:bg-[#4c2f8b] transition text-base text-white rounded-lg"
        >
          {loading ? <PuffLoader size={20} color={"#fff"} /> : "Send"}
        </button>
      </div>
    </div>
  );
}

export default Support;

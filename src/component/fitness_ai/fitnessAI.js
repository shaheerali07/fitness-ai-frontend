import { Howl } from "howler";
import parse from "html-react-parser";
import React, { useEffect, useRef, useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import PuffLoader from "react-spinners/PuffLoader";
import { toast } from "react-toastify";
import api from "../../service/axios";

function FitnessAIChatbot() {
  const [messages, setMessages] = useState([]);

  const notificationSound = new Howl({
    src: ["/sounds/alert.wav"],
  });

  const user = localStorage.getItem("user");
  const email = user ? JSON.parse(user).email : "";
  const userId = user ? JSON.parse(user).id : "";
  const [loading, setLoading] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [input, setInput] = useState("");
  const [selectedWeek, setSelectedWeek] = useState("currentWeek");
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
  const fetchUserChatHistory = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/chatbot/chatHistory?userId=${userId}`);
      if (response.data) {
        setLoading(false);
        const chatHistory = response.data.messages.map((message) => {
          return {
            text: message.message,
            sender: message.sender === "user" ? "user" : "ai",
            timestamp: formatTimestamp(message.timestamp),
            shouldSave: message.shouldSave,
            saveType: message.saveType,
          };
        });
        chatHistory.unshift({
          text: "Hi there, how can I be of service for you today?",
          sender: "ai",
          timestamp: formatTimestamp(new Date()),
        });
        setMessages(chatHistory);
      } else {
        setLoading(false);
        setMessages([
          {
            text: "Hi there, how can I be of service for you today?",
            sender: "ai",
            timestamp: formatTimestamp(new Date()),
          },
        ]);
      }
    } catch (error) {
      setLoading(false);
      setMessages([
        {
          text: "Hi there, how can I be of service for you today?",
          sender: "ai",
          timestamp: formatTimestamp(new Date()),
        },
      ]);
      console.error("Error fetching chat history:", error);
    }
  };

  useEffect(() => {
    fetchUserChatHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    setLoading(true);
    if (input.trim()) {
      const currentTime = formatTimestamp(new Date());
      setMessages([
        ...messages,
        { text: input, sender: "user", timestamp: currentTime },
      ]);
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
              {
                text: res.data.message,
                sender: "ai",
                timestamp: formatTimestamp(new Date()),
                shouldSave: res.data.shouldSave,
                saveType: res.data.saveType,
              },
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
    const currentTime = formatTimestamp(new Date());
    setMessages([
      ...messages,
      { text: promptText, sender: "user", timestamp: currentTime },
    ]);
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
            {
              text: res.data.message,
              sender: "ai",
              timestamp: formatTimestamp(new Date()),
              shouldSave: res.data.shouldSave,
              saveType: res.data.saveType,
            },
          ]);
          notificationSound.play();
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error calling the chatbot API:", error);
      });
  };
  function generatePayloads(jsonData, selectedWeek) {
    const email = localStorage.getItem("fitnessemail");
    const password = localStorage.getItem("fitnesspassword");
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-based

    // Function to get start date of a week
    const getStartOfWeek = (weekOffset) => {
      const dayOfWeek = currentDate.getDay();
      const currentMonday = new Date(currentDate);
      currentMonday.setDate(
        currentDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
      ); // Get the start of the current week
      const startOfWeek = new Date(currentMonday);
      startOfWeek.setDate(currentMonday.getDate() + 7 * weekOffset); // Adjust for the given week offset (0 = current, 1 = second, etc.)
      return startOfWeek;
    };
    if (selectedWeek === "lifetime") {
      // Generate start dates for all weeks in the year
      const weekStartDates = Array.from({ length: 52 }, (_, index) => {
        const startOfWeek = getStartOfWeek(index);
        return new Date(startOfWeek);
      });

      // Generate payloads for each week
      return weekStartDates.flatMap((weekStart) =>
        jsonData.dietPlan.map((dayData, index) => {
          const date = new Date(weekStart);
          date.setDate(weekStart.getDate() + index); // Adjust to the specific day in the week

          // Organize meal data
          const meal = {
            breakfast: dayData["Breakfast"]
              ? [dayData["Breakfast"].foodName]
              : [],
            snack1: dayData["Snack 1"] ? [dayData["Snack 1"].foodName] : [],
            lunch: dayData["Lunch"] ? [dayData["Lunch"].foodName] : [],
            snack2: dayData["Snack 2"] ? [dayData["Snack 2"].foodName] : [],
            dinner: dayData["Dinner"] ? [dayData["Dinner"].foodName] : [],
          };

          // Organize amount data
          const amount = {
            breakfast: meal.breakfast.length > 0 ? ["100"] : [],
            snack1: meal.snack1.length > 0 ? ["100"] : [],
            lunch: meal.lunch.length > 0 ? ["100"] : [],
            snack2: meal.snack2.length > 0 ? ["100"] : [],
            dinner: meal.dinner.length > 0 ? ["100"] : [],
          };
          const status = {
            breakfast: ["incomplete"],
            snack1: ["incomplete"],
            lunch: ["incomplete"],
            snack2: ["incomplete"],
            dinner: ["incomplete"],
          };

          // Payload structure for each day
          return {
            header: {
              email: email,
              password: password,
            },
            updateData: {
              year: date.getFullYear(),
              month: date.getMonth() + 1,
              date: date.getDate(),
              day: index + 1, // Day of the week: Monday is 1, Tuesday is 2, etc.
              meal: meal,
              amount: amount,
              status: status,
            },
          };
        })
      );
    }

    // Determine the start date based on the selected week
    let startOfWeek;
    switch (selectedWeek) {
      case "secondWeek":
        startOfWeek = getStartOfWeek(1); // Second week
        break;
      case "thirdWeek":
        startOfWeek = getStartOfWeek(2); // Third week
        break;
      case "currentWeek":
      default:
        startOfWeek = getStartOfWeek(0); // Current week
        break;
    }

    // Generate payloads for each day in the selected week
    return jsonData.dietPlan.map((dayData, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index); // Adjust to the specific day in the week

      // Organize meal data
      const meal = {
        breakfast: dayData["Breakfast"] ? [dayData["Breakfast"].foodName] : [],
        snack1: dayData["Snack 1"] ? [dayData["Snack 1"].foodName] : [],
        lunch: dayData["Lunch"] ? [dayData["Lunch"].foodName] : [],
        snack2: dayData["Snack 2"] ? [dayData["Snack 2"].foodName] : [],
        dinner: dayData["Dinner"] ? [dayData["Dinner"].foodName] : [],
      };

      // Organize amount data
      const amount = {
        breakfast: meal.breakfast.length > 0 ? ["100"] : [],
        snack1: meal.snack1.length > 0 ? ["100"] : [],
        lunch: meal.lunch.length > 0 ? ["100"] : [],
        snack2: meal.snack2.length > 0 ? ["100"] : [],
        dinner: meal.dinner.length > 0 ? ["100"] : [],
      };
      const status = {
        breakfast: ["incomplete"],
        snack1: ["incomplete"],
        lunch: ["incomplete"],
        snack2: ["incomplete"],
        dinner: ["incomplete"],
      };
      // Payload structure for each day
      return {
        header: {
          email: email,
          password: password,
        },
        updateData: {
          year: currentYear,
          month: currentMonth,
          date: date.getDate(),
          day: index + 1, // Day of the week: Monday is 1, Tuesday is 2, etc.
          meal: meal,
          amount: amount,
          status: status,
        },
      };
    });
  }
  // function generateExercisePayloads(jsonData, selectedWeek) {
  //   const email = localStorage.getItem("fitnessemail");
  //   const password = localStorage.getItem("fitnesspassword");
  //   const currentDate = new Date();
  //   const currentYear = currentDate.getFullYear();
  //   const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-based

  //   // Function to get the start date of a specific week
  //   const getStartOfWeek = (weekOffset) => {
  //     const dayOfWeek = currentDate.getDay();
  //     const currentMonday = new Date(currentDate);
  //     currentMonday.setDate(
  //       currentDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
  //     ); // Start of current week (Monday)
  //     const startOfWeek = new Date(currentMonday);
  //     startOfWeek.setDate(currentMonday.getDate() + 7 * weekOffset); // Adjust for week offset
  //     return startOfWeek;
  //   };

  //   // Determine the start date based on the selected week
  //   let startOfWeek;
  //   switch (selectedWeek) {
  //     case "secondWeek":
  //       startOfWeek = getStartOfWeek(1); // Second week
  //       break;
  //     case "thirdWeek":
  //       startOfWeek = getStartOfWeek(2); // Third week
  //       break;
  //     case "currentWeek":
  //     default:
  //       startOfWeek = getStartOfWeek(0); // Current week
  //       break;
  //   }

  //   // Generate payloads for each day in the selected week
  //   return jsonData
  //     .map((dayData, index) => {
  //       const date = new Date(startOfWeek);
  //       date.setDate(startOfWeek.getDate() + index); // Set date for each day in the week

  //       // Generate separate payloads for each exercise type
  //       return ["Warm-up", "Main Exercise", "Cool-down"].map(
  //         (exerciseType) => ({
  //           header: {
  //             email: email,
  //             password: password,
  //           },
  //           updateData: {
  //             year: currentYear,
  //             month: currentMonth,
  //             date: date.getDate(),
  //             day: index, // Day of the week: Monday is 0, Tuesday is 1, etc.
  //             exerciseType: {
  //               exerciseName: [dayData[exerciseType]],
  //               exerciseTime: ["-"], // Placeholder for exercise time
  //             },
  //           },
  //         })
  //       );
  //     })
  //     .flat(); // Flatten the array so each exercise has its own entry
  // }
  function generateExercisePayloads(jsonData, selectedWeek) {
    const email = localStorage.getItem("fitnessemail");
    const password = localStorage.getItem("fitnesspassword");
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-based

    // Function to get the start date of a specific week
    const getStartOfWeek = (weekOffset) => {
      const dayOfWeek = currentDate.getDay();
      const currentMonday = new Date(currentDate);
      currentMonday.setDate(
        currentDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
      ); // Start of current week (Monday)
      const startOfWeek = new Date(currentMonday);
      startOfWeek.setDate(currentMonday.getDate() + 7 * weekOffset); // Adjust for week offset
      return startOfWeek;
    };

    if (selectedWeek === "lifetime") {
      // Generate start dates for all weeks in the year
      const weekStartDates = Array.from({ length: 52 }, (_, index) => {
        const startOfWeek = getStartOfWeek(index);
        return new Date(startOfWeek);
      });

      // Generate payloads for each week
      return weekStartDates.flatMap((weekStart) =>
        jsonData.map((dayData, index) => {
          const date = new Date(weekStart);
          date.setDate(weekStart.getDate() + index); // Set date for each day in the week

          // Gather all exercises for the day in arrays
          const exerciseNames = ["Warm-up", "Main Exercise", "Cool-down"].map(
            (exerciseType) => dayData[exerciseType]
          );
          const exerciseTimes = exerciseNames.map(() => "-"); // Placeholder for exercise times
          const exerciseStatus = exerciseNames.map(() => "incomplete"); // Placeholder for exercise status

          // Return a single payload for the day
          return {
            header: {
              email: email,
              password: password,
            },
            updateData: {
              year: date.getFullYear(),
              month: date.getMonth() + 1,
              date: date.getDate(),
              day: index, // Day of the week: Monday is 0, Tuesday is 1, etc.
              exerciseType: {
                exerciseName: exerciseNames,
                exerciseTime: exerciseTimes,
                exerciseStatus: exerciseStatus,
              },
            },
          };
        })
      );
    }

    // Determine the start date based on the selected week
    let startOfWeek;
    switch (selectedWeek) {
      case "secondWeek":
        startOfWeek = getStartOfWeek(1); // Second week
        break;
      case "thirdWeek":
        startOfWeek = getStartOfWeek(2); // Third week
        break;
      case "currentWeek":
      default:
        startOfWeek = getStartOfWeek(0); // Current week
        break;
    }

    // Generate payloads for each day in the selected week
    return jsonData.map((dayData, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index); // Set date for each day in the week

      // Gather all exercises for the day in arrays
      const exerciseNames = ["Warm-up", "Main Exercise", "Cool-down"].map(
        (exerciseType) => dayData[exerciseType]
      );
      const exerciseTimes = exerciseNames.map(() => "-"); // Placeholder for exercise times
      const exerciseStatus = exerciseNames.map(() => "incomplete"); // Placeholder for exercise status

      // Return a single payload for the day
      return {
        header: {
          email: email,
          password: password,
        },
        updateData: {
          year: currentYear,
          month: currentMonth,
          date: date.getDate(),
          day: index, // Day of the week: Monday is 0, Tuesday is 1, etc.
          exerciseType: {
            exerciseName: exerciseNames,
            exerciseTime: exerciseTimes,
            exerciseStatus: exerciseStatus,
          },
        },
      };
    });
  }

  function handleSaveMessage(message) {
    if (message.shouldSave) {
      setIsSaveModalOpen(true);
      setMessage(message);
    }
  }
  // Function to get the start and end date for a given week number
  const getWeekDates = (weekNumber) => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const currentMonday = new Date(today);
    currentMonday.setDate(
      today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
    ); // Get the start of the current week

    // Calculate the start date of the desired week
    const startOfWeek = new Date(currentMonday);
    startOfWeek.setDate(currentMonday.getDate() + 7 * (weekNumber - 1));

    // Calculate the end date of the desired week
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return {
      start: startOfWeek.toLocaleDateString(),
      end: endOfWeek.toLocaleDateString(),
    };
  };

  const handleSave = () => {
    if (message && message.saveType === "diet") {
      // Implement save logic here
      setLoading(true);

      const html = message.text;

      // Parse the HTML string to extract table data
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Extract table headers
      const headers = Array.from(doc.querySelectorAll("thead th")).map(
        (header) => header.textContent.trim()
      );

      // Extract table rows data
      const data = Array.from(doc.querySelectorAll("tbody tr")).map((row) => {
        const cells = Array.from(row.querySelectorAll("td"));
        const rowData = {};

        // Populate rowData with header as key and cell content as value
        headers.forEach((header, index) => {
          const cellText = cells[index].textContent.trim();

          // Extract food name and calories if they exist in the cell
          const match = cellText.match(/^(.*) \((\d+ kcal)\)$/);
          if (match) {
            rowData[header] = {
              foodName: match[1].trim(),
              kcal: parseInt(match[2].replace(" kcal", ""), 10),
            };
          } else {
            rowData[header] = cellText; // If no calories are found, just store the text
          }
        });

        return rowData;
      });

      // JSON format output
      const jsonData = {
        saveType: message.saveType,
        timestamp: message.timestamp,
        dietPlan: data,
      };

      // Generate payloads for each day
      const payloads = generatePayloads(jsonData, selectedWeek);
      Promise.all(
        payloads.map((apiData) =>
          api.post("/diet/setdiet", apiData).then((res) => {
            if (res.data.success) {
              console.log("Diet data saved successfully");
            } else {
              console.error("Error saving diet data:", res.data.error);
            }
          })
        )
      )
        .then(() => {
          setLoading(false);
          setIsSaveModalOpen(false);
          setSelectedWeek("");
          setMessage(null);
          toast.success("Diet data saved successfully!");
        })
        .catch((error) => {
          toast.error("Error saving diet data");
          console.error("Error saving diet data:", error);
        });
    } else if (message && message.saveType === "exercise") {
      // Exercise save logic here

      const html = message.text;
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const headers = Array.from(doc.querySelectorAll("thead th")).map(
        (header) => header.textContent.trim()
      );

      // Extract table data into a structured array
      const data = Array.from(doc.querySelectorAll("tbody tr")).map((row) => {
        const cells = Array.from(row.querySelectorAll("td"));
        const rowData = {};

        headers.forEach((header, index) => {
          rowData[header] = cells[index].textContent.trim();
        });

        return rowData;
      });

      // Use generatePayloads to create exercise payloads based on selected week
      const exercisePayloads = generateExercisePayloads(data, selectedWeek);

      // Optionally, you can now post each payload to the backend if needed:
      Promise.all(
        exercisePayloads.map((payload) =>
          api.post("/exercise/setexercise", payload).then((res) => {
            if (res.data.success) {
              console.log(
                "Exercise data saved successfully for:",
                payload.updateData.date
              );
            } else {
              console.error("Error saving exercise data:", res.data.error);
            }
          })
        )
      )
        .then(() => {
          setLoading(false);
          setIsSaveModalOpen(false);
          setSelectedWeek("");
          setMessage(null);
          toast.success("Exercise data saved successfully!");
        })
        .catch((error) => {
          toast.error("Error saving exercise data");
          console.error("Error saving exercise data:", error);
        });
    } else {
      console.error("Invalid message or save type");
    }
  };

  return (
    <>
      {/* Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 relative rounded-lg shadow-xl w-[400px]">
            {/* Select Box */}
            <div className="mb-4">
              <label
                htmlFor="weekSelect"
                className="block text-gray-700 mb-2 text-[18px] font-bold"
              >
                Select Week in which you want to save the diet plan
              </label>
              <select
                id="weekSelect"
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md !text-black !text-[16px]"
                placeholder="Select a Week"
              >
                <option value="currentWeek">
                  Current Week ({getWeekDates(1).start} - {getWeekDates(1).end})
                </option>
                <option value="secondWeek">
                  Second Week ({getWeekDates(2).start} - {getWeekDates(2).end})
                </option>
                <option value="thirdWeek">
                  Third Week ({getWeekDates(3).start} - {getWeekDates(3).end})
                </option>
                {/* <option value="lifetime">Repeat (Whole Year)</option> */}
              </select>
            </div>

            {/* Save Button */}
            <div className="flex justify-center">
              <button
                onClick={handleSave}
                className="bg-[#5534a5] text-white px-4 py-2 text-[18px] rounded-lg hover:bg-[#4c2f8b] transition"
              >
                Save
              </button>
            </div>

            {/* Close Button */}
            <div className="absolute top-[2px] right-[3px]">
              <button
                onClick={() => {
                  setIsSaveModalOpen(false);
                  setMessage(null);
                  setSelectedWeek("");
                }}
                className="text-gray-500 hover:text-gray-700 text-[12px]"
              >
                <IoMdCloseCircleOutline size={22} />
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col h-[calc(100vh-150px)] rounded-lg bg-gray-100">
        <div className="flex items-center px-4 py-3 rounded-lg bg-gray-200">
          <img
            src="Fitness AI_active.png"
            alt="ai Avatar"
            className=" h-10 w-10"
          />
          <div className="ml-4 text-lg text-black font-semibold">
            Fitness AI
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
                  className={`
                  ${
                    message.sender === "user"
                      ? "bg-[#5534a5] "
                      : "!bg-gray-300 "
                  }
                  `}
                >
                  {parse(message.text)}
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

                {/* Conditionally render the save button if message.shouldSave is true */}
                {message.shouldSave && (
                  <button
                    className="absolute disabled:cursor-not-allowed bottom-[2px] left-[45%] bg-[#5534a5] hover:bg-[#4c2f8b] transition text-white text-xs px-2 py-1 rounded "
                    onClick={() => handleSaveMessage(message)}
                    disabled={loading}
                  >
                    Add To Plan
                  </button>
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 flex space-x-2">
          <button
            onClick={() => handlePromptClick("Suggest me diet plans")}
            style={{ border: "2px solid #5534a5" }}
            disabled={loading}
            className="px-3 disabled:cursor-not-allowed text-[17px] py-1 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
          >
            Suggest me diet plans
          </button>
          <button
            style={{ border: "2px solid #5534a5" }}
            disabled={loading}
            onClick={() => handlePromptClick("Suggest me exercise plans")}
            className="px-3 disabled:cursor-not-allowed text-[17px] py-1 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
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
            className="ml-4 disabled:cursor-not-allowed px-4 py-2 bg-[#5534a5] hover:bg-[#4c2f8b] transition text-base text-white rounded-lg"
          >
            {loading ? <PuffLoader size={20} color={"#fff"} /> : "Send"}
          </button>
        </div>
      </div>
    </>
  );
}

export default FitnessAIChatbot;

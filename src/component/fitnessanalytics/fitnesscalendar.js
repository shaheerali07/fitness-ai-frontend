import React, { useEffect, useState } from "react";

function FitnessCalendar({ planData, setPlanData }) {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const today = new Date();
  const dayOfWeek = today.getDay(); // Get the current day of the week (0=Sun, 1=Mon, etc.)
  const [accidentID, setAccidentID] = useState(dayOfWeek - 1);
  const year = [];
  const month = [];
  const date = [];

  // Ensure the Monday of the current week is correctly set
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Adjust if today is Sunday

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(monday); // Copy the Monday date to avoid modifying it directly
    currentDate.setDate(monday.getDate() + i); // Add the days to Monday to get the full week
    year.push(currentDate.getFullYear());
    month.push(currentDate.getMonth() + 1); // Month is 0-indexed
    date.push(currentDate.getDate());
  }

  useEffect(() => {
    const currentDate = new Date();
    const newData = {
      ...planData,
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
      date: currentDate.getDate(),
      day: currentDate.getDay(),
    };
    setPlanData(newData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex border rounded-xl w-[100%] h-[13%] justify-center items-center bg-[#F1EEF6] mb-4">
      {daysOfWeek.map((item, index) => (
        <button
          className={`flex justify-center items-center w-[15%] h-[60%] ${
            index === accidentID ? "bg-[#5534A5]" : ""
          } rounded-lg mr-1 ml-1 duration-500 hover:shadow-2xl`}
          onClick={(e) => {
            setAccidentID(index);
            const newData = {
              ...planData,
              year: year[index],
              month: month[index],
              date: date[index],
              day: index,
            };
            setPlanData(newData);
          }}
        >
          <div className="flex flex-col justify-center items-center">
            <p
              className={`${
                index === accidentID ? "text-[white]" : "text-[black]"
              } text-[17px] mt-[50%]`}
            >
              {month[index] + "/" + date[index]}
            </p>
            <p
              className={`${
                index === accidentID ? "text-[white]" : "text-[#757575]"
              } text-[13px] mt-[-20%]`}
            >
              {item}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}

export default FitnessCalendar;

import React, { useEffect, useState } from "react";

function DietCalendar({ dietPlan, setDietPlan, btnEnable, setBtnEnable }) {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const today = new Date();
  const dayOfWeek = today.getDay(); // Get the current day of the week (0=Sun, 1=Mon, etc.)
  const [accidentID, setAccidentID] = useState(dayOfWeek);
  const year = [];
  const month = [];
  const date = [];
  console.log(accidentID);
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
      ...dietPlan,
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
      date: currentDate.getDate(),
      day: currentDate.getDay(),
    };
    setDietPlan(newData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex justify-center items-center ml-[] min-[300px]:w-[90%] min-[300px]:h-[10%] min-[300px]:ml-[5%] min-[720px]:w-[90%] min-[720px]:h-[10%] min-[720px]:ml-[5%] min-[1000px]:w-[90%] min-[1000px]:h-[12%] min-[1000px]:ml-[5%] min-[1500px]:w-[90%] min-[1500px]:h-[15%] min-[150px]:ml-[5%]">
        {daysOfWeek.map((item, index) => (
          <button
            disabled={btnEnable}
            className={`flex justify-center items-center w-[40%] h-[70%] ${
              index + 1 === accidentID ? "bg-[#5534A5]" : "bg-[white]"
            } border rounded-lg mr-1 ml-1 duration-500 hover:shadow-2xl min-[300px]:mt-[2%]`}
            onClick={(e) => {
              setAccidentID(index + 1);
              const newData = {
                ...dietPlan,
                year: year[index],
                month: month[index],
                date: date[index],
                day: index + 1,
              };
              setDietPlan(newData);
              setBtnEnable(true);
            }}
          >
            <div
              className={`flex flex-col justify-center items-center w-[100%] h-[70%] ${
                btnEnable === false ? "" : "bg-[#F1EEF6]"
              } duration-300`}
            >
              <p
                className={`${
                  index + 1 === accidentID ? "text-[white]" : "text-[#5534A5]"
                } mt-[10%] min-[300px]:text-[12px] min-[720px]:text-[12px] min-[1500px]:text-[20px]`}
              >
                {month[index] + "/" + date[index]}
              </p>
              <p
                className={`${
                  index + 1 === accidentID ? "text-[white]" : "text-[#5534A5]"
                } text-[25px] mt-[-10%] min-[300px]:text-[15px] min-[720px]:text-[15px] min-[1500px]:text-[25px]`}
              >
                {item}
              </p>
            </div>
          </button>
        ))}
      </div>
      <div className="w-[80%] h-[2px] bg-[#5534A5] min-[300px]:w-[96%] min-[300px]:ml-[2%] min-[720px]:w-[96%] min-[720px]:ml-[2%] min-[1000px]:w-[92%] min-[1000px]:ml-[4%] min-[1500px]:w-[92%] min-[1500px]:ml-[4%]"></div>
    </>
  );
}

export default DietCalendar;

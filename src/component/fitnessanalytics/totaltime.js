import React, { useContext } from "react";
import { ExerciseContext } from "../../store/state.provider";
function TotalTime() {
  const { totalTime, completedPercentage } = useContext(ExerciseContext);
  // const [totalTime, setTotalTime] = useState("N/A");
  // const [completedPercentage, setCompletedPercentage] = useState(0);
  // useEffect(() => {
  //   const fetchTotalTime = async () => {
  //     try {
  //       const { startDate, endDate } = getWeekStartAndEnd();

  //       const { data } = await api.get("/exercise/getTotalExerciseTime", {
  //         params: {
  //           startDate,
  //           endDate,
  //         },
  //       });
  //       if (data && data.totalDuration) {
  //         setTotalTime(data.totalDuration);
  //       } else {
  //         console.log("Error fetching total time");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching exercise stats:", error);
  //     }
  //   };
  //   const fetchCompletedPercentage = async () => {
  //     try {
  //       const { startDate, endDate } = getWeekStartAndEnd();

  //       const { data } = await api.get(
  //         "/exercise/getCompletedExercisePercentage",
  //         {
  //           params: {
  //             startDate,
  //             endDate,
  //           },
  //         }
  //       );
  //       if (data && data.overallCompletionPercentage) {
  //         setCompletedPercentage(parseInt(data.overallCompletionPercentage));
  //       } else {
  //         console.log("Error fetching completed percentage");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching exercise stats:", error);
  //     }
  //   };

  //   fetchTotalTime();
  //   fetchCompletedPercentage();
  // }, []);
  const formatTime = (totalSeconds) => {
    if (totalSeconds >= 3600) {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${
        minutes > 1 ? "s" : ""
      } ${seconds} second${seconds > 1 ? "s" : ""}`;
    } else if (totalSeconds >= 60) {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes} minute${minutes > 1 ? "s" : ""} ${seconds} second${
        seconds > 1 ? "s" : ""
      }`;
    } else {
      return `${totalSeconds} second${totalSeconds > 1 ? "s" : ""}`;
    }
  };
  return (
    <div className="flex  border rounded-xl  w-[100%] h-[48%] justify-center items-center mt-2">
      <div className="flex justify-center w-[45%] h-[80%]">
        <div className="flex flex-col justify-center items-center w-[40%] h-[100%] rounded-xl">
          <img src="totaltime.png" alt="" width="50%" height="50%"></img>
        </div>
        <div className="flex flex-col justify-center items-start w-[60%] h-[100%]">
          <p className="text-[#757575] text-[15px] text-left">Total Time</p>
          <p className="text-black text-[14px] text-left">
            {formatTime(totalTime)}
          </p>
        </div>
      </div>

      <div className="flex justify-center w-[45%] h-[80%]">
        <div className="flex flex-col justify-center items-center w-[40%] h-[100%] rounded-xl">
          <img src="totalcomplete.png" alt="" width="50%" height="50%"></img>
        </div>
        <div className="flex flex-col justify-center items-center w-[60%] h-[100%]">
          <p className="text-[#757575] text-[15px] text-left">Complete</p>
          <p className="text-black  text-[18px] text-left">
            {isNaN(completedPercentage) ? 0 : completedPercentage}%
          </p>
        </div>
      </div>
    </div>
  );
}

export default TotalTime;

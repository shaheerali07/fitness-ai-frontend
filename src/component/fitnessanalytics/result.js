import React, { useState } from "react";
import api from "../../service/axios";
import { getWeekStartAndEnd } from "../../utils/auth";

function ResultWeekly(props) {
  return (
    <div
      className="flex flex-col justify-center  w-[90%] h-[30%] 
        mt-2 mb-2"
    >
      <p className="text-[80%] text-left text-[#757575]">{props.category} </p>
      <div className="flex justify-between items-center">
        <p className="text-[black]">{props.time}</p>
        <p
          className={`w-[30%] h-[60%] bg-[${props.color}] rounded-xl min-[1500px]:w-[50%]`}
        >
          {isNaN(props.progress) ? "0" : parseInt(props.progress)}%
        </p>
      </div>
    </div>
  );
}

function Result({ history }) {
  const [resultCounter, setResultCounter] = useState(0);
  const [resultAccuracy, setResultAccuracy] = useState(0);
  const [resultDurtime, setResultDurtime] = useState(0);

  const [progressCounter, setProgressCounter] = useState();
  const [progressAccuracy, setProgressAccuracy] = useState();
  const [progressDurtime, setProgressDurtime] = useState();

  const targetCounter = 500;
  const targetAccuracy = 100;
  const targetDurtime = 3000;

  React.useEffect(() => {
    const fetchCompletedPercentage = async () => {
      try {
        const { startDate, endDate } = getWeekStartAndEnd();

        const { data } = await api.get("/exercise/getTotals", {
          params: {
            startDate,
            endDate,
          },
        });
        if (data && data.totalCounter) {
          setResultCounter(parseInt(data.totalCounter));
          setProgressCounter(
            (parseInt(data.totalCounter) / targetCounter) * 100
          );
          setResultAccuracy(parseInt(data.averageAccuracy));
          setProgressAccuracy(
            (parseInt(data.averageAccuracy) / targetAccuracy) * 100
          );
          setResultDurtime(parseInt(data.totalDuration));
          setProgressDurtime(
            (parseInt(data.totalDuration) / targetDurtime) * 100
          );
        } else {
          console.log("Error fetching completed percentage");
        }
      } catch (error) {
        console.error("Error fetching exercise stats:", error);
      }
    };
    fetchCompletedPercentage();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center  w-[80%] h-[80%] md:w-[100%] xl:w-[100%]">
      <ResultWeekly
        category="Total Counter"
        time={Number(resultCounter.toFixed(1)) + ""}
        progress={progressCounter}
        color="#00E0FF"
      />
      <ResultWeekly
        category="Total Time"
        time={Number(resultDurtime.toFixed(1)) + " s"}
        progress={progressDurtime}
        color="#929292"
      />
      <ResultWeekly
        category="Total Accuracy"
        time={Number(resultAccuracy.toFixed(1)) + " %"}
        progress={progressAccuracy}
        color="#A85CF9"
      />
    </div>
  );
}

export default Result;

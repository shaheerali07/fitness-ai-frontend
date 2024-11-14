import { LineChart } from "@mui/x-charts/LineChart";
import React, { useState } from "react";

const WeeklyExerciseStatsChart = () => {
  const [xLabels, setXLabels] = useState([]);
  const [resultAccuracy, setResultAccuracy] = useState([]);
  const [resultCounter, setResultCounter] = useState([]);
  const [resultDurtime, setResultDurtime] = useState([]);

  // useEffect(() => {
  //   const fetchExerciseStats = async () => {
  //     try {
  //       const { startDate, endDate } = getWeekStartAndEnd();

  //       const { data } = await api.get("/exercise/getWeeklyExerciseStats", {
  //         params: {
  //           startDate,
  //           endDate,
  //         },
  //       });

  //       // Process the response to separate data for the chart
  //       const chartData = data.chartData;
  //       console.log(chartData);

  //       const dates = chartData.map((item) => item.date);
  //       const accuracies = chartData.map((item) => item.accuracy);
  //       const counters = chartData.map((item) => item.counter);
  //       const durations = chartData.map((item) => item.duration);

  //       setXLabels(dates);
  //       setResultAccuracy(accuracies);
  //       setResultCounter(counters);
  //       setResultDurtime(durations);
  //     } catch (error) {
  //       console.error("Error fetching exercise stats:", error);
  //     }
  //   };

  //   fetchExerciseStats();
  // }, []);
  return (
    <LineChart
      className="w-[80%]"
      series={[
        { data: resultAccuracy, label: "Accuracy" },
        { data: resultCounter, label: "Counter" },
        { data: resultDurtime, label: "Duration" },
      ]}
      xAxis={[{ scaleType: "point", data: xLabels }]}
    />
  );
};

export default WeeklyExerciseStatsChart;

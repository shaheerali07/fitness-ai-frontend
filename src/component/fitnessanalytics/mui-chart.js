import { LineChart } from "@mui/x-charts/LineChart";
import React, { useContext } from "react";
import { ExerciseContext } from "../../store/state.provider";

const WeeklyExerciseStatsChart = () => {
  const {
    resultChartAccuracy,
    resultChartCounter,
    resultChartDurtime,
    xLabels,
  } = useContext(ExerciseContext);

  return (
    <LineChart
      className="w-[80%]"
      series={[
        { data: resultChartAccuracy, label: "Accuracy" },
        { data: resultChartCounter, label: "Counter" },
        {
          data: resultChartDurtime,
          label: "Duration",
          valueFormatter: (value) => `${value} s`,
        },
      ]}
      xAxis={[{ scaleType: "point", data: xLabels }]}
    />
  );
};

export default WeeklyExerciseStatsChart;

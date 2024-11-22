// File: ExerciseProvider.jsx
import { Pose } from "@mediapipe/pose";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from "../service/axios";
import { getWeekStartAndEnd } from "../utils/auth";

export const ExerciseContext = createContext();

export const ExerciseProvider = ({ children }) => {
  const [progressCounter, setProgressCounter] = useState(0);
  const [progressAccuracy, setProgressAccuracy] = useState(0);
  const [progressDurtime, setProgressDurtime] = useState(0);
  const [resultCounter, setResultCounter] = useState(0);
  const [resultAccuracy, setResultAccuracy] = useState(0);
  const [resultDurtime, setResultDurtime] = useState(0);
  const [totalTime, setTotalTime] = useState("N/A");
  const [completedPercentage, setCompletedPercentage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [xLabels, setXLabels] = useState([]);
  const [resultChartAccuracy, setResultChartAccuracy] = useState([]);
  const [resultChartCounter, setResultChartCounter] = useState([]);
  const [resultChartDurtime, setResultChartDurtime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalExercises, setTotalExercises] = useState(0);
  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : "";
  useEffect(() => {
    if (totalExercises) {
      const targetAccuracy = totalExercises * 100;
      const targetDurtime = totalExercises * 10;
      const targetCounter = totalExercises * 10;
      setProgressAccuracy((resultAccuracy / targetAccuracy) * 100);
      setProgressDurtime((resultDurtime / targetDurtime) * 100);
      setProgressCounter((resultCounter / targetCounter) * 100);
    }
  }, [resultCounter, resultAccuracy, resultDurtime, totalExercises]);

  const fetchCompletedPercentage = async () => {
    const { startDate, endDate } = getWeekStartAndEnd();
    const { data } = await api.get("/exercise/getTotals", {
      params: { startDate, endDate, userId },
    });
    if (data && data.totalCounter) {
      setResultCounter(parseInt(data.totalCounter));
      setResultAccuracy(parseInt(data.averageAccuracy));

      setResultDurtime(parseInt(data.totalDuration));
    }
  };

  const fetchTotalTime = async () => {
    const { startDate, endDate } = getWeekStartAndEnd();
    const { data } = await api.get("/exercise/getTotalExerciseTime", {
      params: { startDate, endDate, userId },
    });
    if (data && data.totalDuration) {
      setTotalTime(data.totalDuration);
    }
  };

  const fetchCompletedTimePercentage = async () => {
    const { startDate, endDate } = getWeekStartAndEnd();
    const { data } = await api.get("/exercise/getCompletedExercisePercentage", {
      params: { startDate, endDate, userId },
    });
    if (data && data.overallCompletionPercentage) {
      setCompletedPercentage(parseInt(data.overallCompletionPercentage));
    }
  };

  const fetchCompletedChartPercentage = async () => {
    const { startDate, endDate } = getWeekStartAndEnd();
    const { data } = await api.get("/exercise/getCompletedExercisePercentage", {
      params: { startDate, endDate, userId },
    });
    if (data && data.overallCompletionPercentage) {
      setTotalExercises(parseInt(data.totalExercises));
      setProgress(
        isNaN(data.overallCompletionPercentage)
          ? 0
          : parseInt(data.overallCompletionPercentage)
      );
    }
  };

  const fetchExerciseStats = async () => {
    const { startDate, endDate } = getWeekStartAndEnd();
    const { data } = await api.get("/exercise/getWeeklyExerciseStats", {
      params: { startDate, endDate, userId },
    });
    const chartData = data.chartData;
    const dates = chartData.map((item) => item.date);
    const accuracies = chartData.map((item) => item.accuracy);
    const counters = chartData.map((item) => item.counter);
    const durations = chartData.map((item) => item.duration);

    setXLabels(dates);
    setResultChartAccuracy(accuracies);
    setResultChartCounter(counters);
    setResultChartDurtime(durations);
  };

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchCompletedPercentage(),
        fetchTotalTime(),
        fetchCompletedTimePercentage(),
        fetchCompletedChartPercentage(),
        fetchExerciseStats(),
      ]);
    } catch (error) {
      console.error("Error fetching exercise data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Refetch function for manual data refresh
  const refetch = () => {
    fetchAllData();
  };
  const userPose = useMemo(() => {
    return new Pose({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });
  }, []);

  userPose?.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  return (
    <ExerciseContext.Provider
      value={{
        progressCounter,
        progressAccuracy,
        progressDurtime,
        resultCounter,
        resultAccuracy,
        resultDurtime,
        totalTime,
        completedPercentage,
        progress,
        xLabels,
        resultChartAccuracy,
        resultChartCounter,
        resultChartDurtime,
        loading,
        refetch,
        userPose,
        userId,
      }}
    >
      {children}
    </ExerciseContext.Provider>
  );
};

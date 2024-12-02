import { useContext, useState } from "react";
// import Camera from "./camera/camera";
import { ExerciseContext } from "../../store/state.provider";
import PoseDetection from "../fitness_ai/poseDetection";
import Result from "./result/result";

function Analytics() {
  const [stateResultData, setStateResultData] = useState({
    btnStateStart: false,
    iswebcamEnable: false,
    kind_exercise: {
      index: "",
      category: "",
      exercise: "",
    },
  });

  const [exerciseResult, setExerciseResult] = useState({
    year: "",
    month: "",
    date: "",
    day: "",
    hour: "",
    minute: "",
    index: "",
    category: "",
    exercise: "",
    counter: "",
    accuracy: "",
    durtime: "",
  });
  const { userPose } = useContext(ExerciseContext);

  return (
    <div className="flex flex-col xl:flex-row justify-start items-center   w-[100%] h-[100%] sm:h-[150%] md:h-[170%] xl:h-[80%]">
      {/* <Camera2
        setStateResultData={setStateResultData}
        stateResultData={stateResultData}
        exerciseResult={exerciseResult}
        setExerciseResult={setExerciseResult}
        userPose={userPose}
      ></Camera2> */}
      <PoseDetection
        setStateResultData={setStateResultData}
        stateResultData={stateResultData}
        exerciseResult={exerciseResult}
        setExerciseResult={setExerciseResult}
        userPose={userPose}
      ></PoseDetection>
      <Result
        setStateResultData={setStateResultData}
        stateResultData={stateResultData}
        exerciseResult={exerciseResult}
        setExerciseResult={setExerciseResult}
      ></Result>
    </div>
  );
}

export default Analytics;

import { useContext } from "react";
import { ExerciseContext } from "../../store/state.provider";

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

function Result() {
  const {
    progressCounter = 0,
    progressAccuracy = 0,
    progressDurtime = 0,
    resultCounter = 0,
    resultAccuracy = 0,
    resultDurtime = 0,
  } = useContext(ExerciseContext);
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

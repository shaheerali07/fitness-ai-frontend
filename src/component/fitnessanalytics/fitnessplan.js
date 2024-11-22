import React, { useContext, useEffect, useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import PuffLoader from "react-spinners/PuffLoader";
import { toast } from "react-toastify";
import api from "../../service/axios";
import { ExerciseContext } from "../../store/state.provider";
import { getAllExercises } from "../../utils/auth";

function FitnessPlan({ planData, setPlanData }) {
  const { refetch } = useContext(ExerciseContext);
  const [dailyPlanExercise, setDailyPlanExercise] = useState([]);

  const [dailyPlanTime, setDailyPlanTime] = useState([]);
  const [dailyPlanStatus, setDailyPlanStatus] = useState([]);

  const [accidentID, setAccidentID] = useState(null);
  const [exerciseType, setExerciseType] = useState("");
  const [exerciseStartTime, setExerciseStartTime] = useState("");
  const [exerciseEndTime, setExerciseEndTime] = useState("");
  const [showWidget, setShowWidget] = useState(false);
  const [updateSignal, setUpdateSignal] = useState(0);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [loader, setLoader] = useState(false);
  const [counterDetails, setCounterDetails] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    counter: 0,
  });
  const allExercises = getAllExercises();
  useEffect(() => {
    setDailyPlanExercise(planData.exerciseType);
    setDailyPlanTime(planData.exerciseTime);
    setDailyPlanStatus(planData.exerciseStatus);
  }, [planData]);
  useEffect(() => {
    if (planData.year === "") return;
    setLoader(true);
    const localEmail = localStorage.getItem("fitnessemail");
    const localPassword = localStorage.getItem("fitnesspassword");
    const header = {
      email: localEmail,
      password: localPassword,
    };

    const updateData = {
      year: planData.year,
      month: planData.month,
      date: planData.date,
      day: planData.day,
      exerciseType: {
        exerciseName: dailyPlanExercise,
        exerciseTime: dailyPlanTime,
        exerciseStatus: dailyPlanStatus,
      },
    };
    const apiData = { header: header, updateData: updateData };
    api.post("/exercise/setexercise", apiData).then((res) => {
      if (res.data.message === "success") {
        toast.success("Exercise plan updated successfully.");
        setLoader(false);
      } else {
        setLoader(false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateSignal]);
  const updateExercisePlan = async (index) => {
    setActiveIndex(index);
    setIsSaveModalOpen(true);
  };
  const handleSave = async () => {
    try {
      setLoader(true);
      // Define the API endpoint
      const url = "/exercise/updateexercise";
      const email = localStorage.getItem("fitnessemail");
      const password = localStorage.getItem("fitnesspassword");

      // Construct the request body
      const requestBody = {
        _id: planData.id, // ID of the exercise entry
        exerciseStatusIndex: activeIndex, // Index of the exercise to update
        hours: counterDetails.hours,
        minutes: counterDetails.minutes,
        seconds: counterDetails.seconds,
        counter: counterDetails.counter,
        email: email,
        password: password,
      };

      // Make the API call
      const response = await api.post(url, requestBody);

      // Handle the response
      if (response.data.message === "Exercise status updated successfully.") {
        setLoader(false);
        await refetch();
        toast.success("Exercise status updated successfully.");

        // Update the exercise status in the local state
        const newStatus = dailyPlanStatus;
        newStatus[activeIndex] = "complete";
        setDailyPlanStatus(newStatus);
        setUpdateSignal((prev) => prev + 1);
        setIsSaveModalOpen(false);

        setActiveIndex(null);
        setCounterDetails({
          hours: 0,
          minutes: 0,
          seconds: 0,
          counter: 0,
        });
      } else {
        setLoader(false);
        console.log("Error updating exercise status:", response.data.message);
        toast.error("An error occurred while updating the exercise status.");
      }
    } catch (error) {
      setLoader(false);

      console.error(
        "Error in updating exercise status:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <>
      {loader ? (
        <PuffLoader />
      ) : (
        <>
          {isSaveModalOpen && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-8 relative rounded-lg shadow-xl w-[400px]">
                {/* Modal Header (if you want a title) */}
                <div className="mb-4 text-center">
                  <h2 className="text-xl text-black font-semibold">
                    Set Exercise Details
                  </h2>
                </div>

                {/* Input Fields for Hours, Minutes, Seconds, and Counter */}
                <div className="space-y-4">
                  {/* <p className="text-black text-sm">Enter Following Details</p> */}
                  <div className="flex w-full justify-between">
                    <div className="flex w-full flex-col items-start">
                      <label
                        htmlFor="hours"
                        className="text-sm font-medium text-gray-700"
                      >
                        Enter Duration (In Seconds)
                      </label>
                      <input
                        id="hours"
                        type="number"
                        placeholder="How Long Did You Exercise? "
                        onChange={(e) =>
                          setCounterDetails({
                            ...counterDetails,
                            hours: e.target.value,
                          })
                        }
                        min="0"
                        className="w-full mt-1 px-3 py-2 text-black text-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5534a5] focus:border-[#5534a5]"
                      />
                    </div>
                    {/* <div className="flex flex-col items-start">
                      <label
                        htmlFor="minutes"
                        className="text-sm font-medium text-gray-700"
                      >
                        Minutes
                      </label>
                      <input
                        id="minutes"
                        type="number"
                        onChange={(e) =>
                          setCounterDetails({
                            ...counterDetails,
                            minutes: e.target.value,
                          })
                        }
                        min="0"
                        className="w-20 px-3 py-2 text-black text-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5534a5] focus:border-[#5534a5]"
                      />
                    </div>
                    <div className="flex flex-col items-start">
                      <label
                        htmlFor="seconds"
                        className="text-sm font-medium text-gray-700"
                      >
                        Seconds
                      </label>
                      <input
                        id="seconds"
                        type="number"
                        onChange={(e) =>
                          setCounterDetails({
                            ...counterDetails,
                            seconds: e.target.value,
                          })
                        }
                        min="0"
                        className="w-20 px-3 py-2 text-black text-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5534a5] focus:border-[#5534a5]"
                      />
                    </div> */}
                  </div>

                  {/* Counter input */}
                  <div className="flex flex-col items-start">
                    <label
                      htmlFor="counter"
                      className="text-sm font-medium text-gray-700"
                    >
                      Enter Counter
                    </label>
                    <input
                      id="counter"
                      placeholder="How Many Times Did You Exercise?"
                      type="number"
                      onChange={(e) =>
                        setCounterDetails({
                          ...counterDetails,
                          counter: e.target.value,
                        })
                      }
                      min="0"
                      className="w-full mt-1 px-3 py-2 text-black text-[14px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5534a5] focus:border-[#5534a5]"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-center mt-6">
                  <button
                    onClick={handleSave}
                    className="bg-[#5534a5] text-white px-4 py-2 text-[18px] rounded-lg hover:bg-[#4c2f8b] transition"
                  >
                    Save
                  </button>
                </div>

                {/* Close Button */}
                <div className="absolute top-0 right-1">
                  <button
                    onClick={() => {
                      setIsSaveModalOpen(false);
                      setActiveIndex(null);
                    }}
                    disabled={loader}
                    className="text-gray-500 hover:text-gray-700 text-[12px]"
                  >
                    <IoMdCloseCircleOutline size={22} />
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col items-center border rounded-xl w-full xl:h-[84%]  pb-[20px]">
            <button
              className="border rounded-[50%] w-[5%] md:w-[3%] xl:w-[5%]  mt-[2%] ml-[80%] text-[black] hover:bg-[#A85CF9] text-[60%]"
              onClick={(e) => {
                showWidget === false
                  ? setShowWidget(true)
                  : setShowWidget(false);
              }}
              disabled={loader}
            >
              <img src="plus.png" alt="" width="30px"></img>
            </button>

            {showWidget && (
              <div className="mt-1 w-[95%] xl:h-[30%] bg-[#F1EEF6] border rounded-xl">
                {/* <p className="text-[black] text-[15px] text-left mt-1 xl:mt-3">
                  Exercise Name
                </p>
                <input
                  className="form-control w-[20%] h-[20%] mr-1 ml-1 mt-1 xl:mt-[-3%]"
                  style={{
                    width: "98%",
                  }}
                  value={exerciseType}
                  onChange={(e) => {
                    setExerciseType(e.target.value);
                  }}
                ></input> */}
                <p className="text-[black] text-[16px] text-left ml-2 mt-2 xl:mt-3">
                  Exercise Name
                </p>
                <select
                  className="form-control w-[20%] h-[20%] mr-1 ml-1 "
                  style={{ width: "98%" }}
                  value={exerciseType}
                  onChange={(e) => setExerciseType(e.target.value)}
                >
                  <option value="" disabled>
                    Select an exercise
                  </option>
                  {allExercises.map((exercise, index) => (
                    <option key={index} value={exercise}>
                      {exercise}
                    </option>
                  ))}
                </select>

                <div className="flex justify-between mt-1">
                  <button
                    className="text-[#5534A5] border-[1px] disabled:cursor-not-allowed rounded-full border-[#5534A5] hover:bg-[#957cd0] hover:text-white transition px-5 text-[18px] ml-20 mt-1"
                    disabled={loader || !exerciseType}
                    onClick={(e) => {
                      const newType = dailyPlanExercise;
                      newType.push(exerciseType);
                      const newTime = dailyPlanTime;
                      newTime.push(exerciseStartTime + "-" + exerciseEndTime);
                      const newStatus = dailyPlanStatus;
                      newStatus.push("incomplete");

                      setDailyPlanExercise(newType);
                      setDailyPlanTime(newTime);
                      setDailyPlanStatus(newStatus);
                      setShowWidget(false);
                      const newData = {
                        ...planData,
                        exerciseType: newType,
                        exerciseTime: newTime,
                      };
                      setPlanData(newData);
                      setExerciseStartTime("");
                      setExerciseEndTime("");
                      setExerciseType("");
                      setUpdateSignal((prev) => prev + 1);
                    }}
                  >
                    Add
                  </button>
                  <button
                    className="text-[black] disabled:cursor-not-allowed border-[1px] rounded-full border-black hover:bg-[#878689] hover:text-white transition px-5 text-[18px] mr-20 mt-1"
                    onClick={(e) => {
                      setShowWidget(false);
                    }}
                    disabled={loader}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {dailyPlanExercise.map((item, index) => (
              <div className="flex border w-[94%] md:h-[20%] xl:h-[15%] rounded-xl mt-2 justify-between z-[0]">
                <div className="w-[12px] bg-[#5534A5] rounded-xl" />
                <div className="flex w-[94%] rounded-xl">
                  <div className="flex flex-col items-start">
                    <p className="text-black capitalize text-left ml-5 text-[16px]">
                      {item.replace(/-/g, " ")}
                    </p>
                    {dailyPlanStatus[index] === "incomplete" ? (
                      <button
                        disabled={loader}
                        onClick={() => updateExercisePlan(index)}
                        className="bg-[#5534a5] ml-5 hover:bg-[#4c2f8b] cursor-pointer transition text-white text-xs px-2 py-1 rounded "
                      >
                        Mark as complete
                      </button>
                    ) : (
                      <span className="bg-green-500 ml-5 cursor-pointer hover:bg-green-300 transition text-white text-xs px-2 py-1 rounded ">
                        Completed
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex mt-2 h-[80%]">
                  <button
                    disabled={loader}
                    onClick={(e) => {
                      const newDataType = [];
                      const newDataTime = [];
                      const newDataStaus = [];
                      let j = 0;
                      for (let i = 0; i < dailyPlanExercise.length; i++) {
                        if (i !== index) {
                          newDataType[j] = dailyPlanExercise[i];
                          newDataTime[j] = dailyPlanTime[i];
                          newDataStaus[j] = dailyPlanStatus[i];
                          j++;
                        }
                      }
                      setDailyPlanExercise(newDataType);
                      setDailyPlanTime(newDataTime);
                      setDailyPlanStatus(newDataStaus);
                      setUpdateSignal((prev) => prev + 1);
                    }}
                  >
                    <img
                      alt="close"
                      src={
                        index === accidentID ? "close_hover.png" : "close.png"
                      }
                      onMouseEnter={() => {
                        setAccidentID(index);
                      }}
                      onMouseLeave={() => {
                        setAccidentID(null);
                      }}
                      width="35px"
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

export default FitnessPlan;

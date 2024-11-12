import React, { useEffect, useRef, useState } from "react";
import toastr from "toastr";
import api from "../../../service/axios";
import "./Result.css";
import { kind_select } from "./select_kind_exercise";

function Result({
  setStateResultData,
  stateResultData,
  exerciseResult,
  setExerciseResult,
}) {
  const [videokey, setVideoKey] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [btn_name, setBtnName] = useState("Start");
  const [isSelectDisabled, setIsSelectDisabled] = useState(false);
  const [sampleVideoURL, setSampleVideo] = useState("");
  const [number_category, setNumberCategory] = useState("");
  const [number_subcategory, setNumberSubcategory] = useState("");
  const [number_exercise, setNumberExercise] = useState("");
  const [iswebcamEnable, setWebCamEnable] = useState(false);

  const selectCategoryRef = useRef(null);
  const selectSubcategoryRef = useRef(null);
  const selectExerciseRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [exercises, setExercises] = useState([]);

  const setSaveExercise = (e) => {
    if (!exerciseResult.durtime) return;
    const selectedKind = kind_select.kinds.find(
      (kind) => kind.category === number_category
    );
    exerciseResult.category = number_category;
    exerciseResult.exercise = number_subcategory;
    exerciseResult.index = selectedKind.index;
    if (selectedKind.category === "GYM EXERCISES") {
      exerciseResult.exercise = number_exercise;
    }
    const header = {
      email: localStorage.getItem("fitnessemail"),
      password: localStorage.getItem("fitnesspassword"),
    };
    api
      .post("/exercise/setlogs", { header, updateData: exerciseResult })
      .then((res) => {
        if (res.data.message === "success")
          toastr.success("Saved successfully!");
      });
  };
  useEffect(() => {
    setVideoKey((prev) => prev + 1);
  }, [sampleVideoURL]);
  useEffect(() => {
    // Initialize categories on mount
    setCategories(kind_select.kinds.map((kind) => kind.category));
  }, []);
  useEffect(() => {
    setWebCamEnable(stateResultData.iswebcamEnable);
  }, [stateResultData.iswebcamEnable]);
  useEffect(() => {
    // Load subcategories based on the selected category
    if (number_category) {
      const selectedKind = kind_select.kinds.find(
        (kind) => kind.category === number_category
      );
      if (selectedKind && typeof selectedKind.exercises === "object") {
        if (selectedKind.category === "GYM EXERCISES") {
          setSubcategories(Object.keys(selectedKind.exercises));
          setExercises([]);
          return;
        }
        setSubcategories(Object.values(selectedKind.exercises));
        setExercises([]); // Reset exercises when category changes
      }
    }
  }, [number_category]);

  useEffect(() => {
    // Load exercises based on the selected subcategory
    if (number_category && number_subcategory) {
      const selectedKind = kind_select.kinds.find(
        (kind) => kind.category === number_category
      );
      if (selectedKind && selectedKind.exercises[number_subcategory]) {
        setExercises(selectedKind.exercises[number_subcategory]);
      }
    }
  }, [number_subcategory]);

  useEffect(() => {
    // Load video whenever category, subcategory, or exercise changes
    if (number_category && number_subcategory) {
      const selectedKind = kind_select.kinds.find(
        (kind) => kind.category === number_category
      );
      if (selectedKind.category === "GYM EXERCISES") {
        return;
      }

      let params = {
        category: number_category,
        exercise: number_subcategory,
        index: selectedKind.index,
      };

      api
        .get("/video/video_load", {
          params: params,
          responseType: "blob",
        })
        .then((res) => {
          const blob = new Blob([res.data], { type: res.data.type });
          setSampleVideo(URL.createObjectURL(blob));
        })
        .catch((err) => {
          console.error("Failed to load video", err);
        });
    }
  }, [number_category, number_subcategory]);
  useEffect(() => {
    // Load video whenever category, subcategory, or exercise changes
    if (number_category && number_subcategory && number_exercise) {
      const selectedKind = kind_select.kinds.find(
        (kind) => kind.category === number_category
      );
      let params = {
        category: number_category,
        exercise: number_subcategory,
        index: selectedKind.index,
      };
      if (selectedKind.category === "GYM EXERCISES") {
        params = {
          category: encodeURIComponent(number_category),
          subcategory: encodeURIComponent(number_subcategory),
          exercise: encodeURIComponent(number_exercise),
          index: encodeURIComponent(selectedKind.index),
        };
      }
      api
        .get("/video/video_load", {
          params: params,
          responseType: "blob",
        })
        .then((res) => {
          const blob = new Blob([res.data], { type: res.data.type });
          setSampleVideo(URL.createObjectURL(blob));
        })
        .catch((err) => {
          console.error("Failed to load video", err);
        });
    }
  }, [number_category, number_subcategory, number_exercise]);

  return (
    <div
      className="flex flex-col items-center xl:justify-center
                        w-[90vw] h-[160vw] ml-[1vw] mt-[60vw]
                        md:w-[90vw] md:h-[150vw] md:mt-[50vw]
                        xl:w-[30vw] xl:h-[40vw] xl:mt-[-1%] xl:ml-[10px]
                        border rounded-xl"
    >
      <div className="flex xl:flex-col justify-center items-center w-[80%] xl:h-[56%]">
        <video
          id="samplevideo"
          className="w-[50%] xl:w-[100%] xl:ml-[0px]"
          key={videokey}
          autoPlay
          controls
          width="80%"
          height="80%"
          onEnded={() => {
            const video = document.getElementById("samplevideo");
            video.currentTime = 0;
            video.play();
          }}
        >
          <source src={sampleVideoURL} type="video/mp4"></source>
        </video>
        <div className="flex flex-col xl:flex-row justify-center items-center w-[80%] h-[100%] xl:w-[100%]">
          <button
            className="w-[90%] h-[30%] mt-2 mb-2 border-solid border-1 border-[#A85CF9] rounded-xl text-[black] hover:bg-[#5534A5] hover:text-[white] duration-300"
            onClick={setSaveExercise}
          >
            Save
          </button>
          <button
            className="w-[90%] h-[30%] mt-2 mb-2 border-solid border-1 border-[#A85CF9] rounded-xl text-[black] hover:bg-[#5534A5] hover:text-[white] duration-300"
            onClick={() => {
              if (iswebcamEnable) {
                if (!number_subcategory) {
                  alert("Please select Subcategory");
                  return;
                }
                setIsSelectDisabled(!isSelectDisabled);
                const selectedKind = kind_select.kinds.find(
                  (kind) => kind.category === number_category
                );
                let new_data = {
                  ...stateResultData,
                  btnStateStart: !stateResultData.btnStateStart,
                  kind_exercise: {
                    index: selectedKind.index,
                    category: number_category,
                    exercise: number_subcategory,
                  },
                };
                if (selectedKind.category === "GYM EXERCISES") {
                  new_data.kind_exercise.exercise = number_exercise;
                }
                setStateResultData(new_data);
                setBtnName(stateResultData.btnStateStart ? "Start" : "Stop");
              } else {
                alert("Please Turn on Camera");
              }
            }}
          >
            {btn_name}
          </button>
        </div>
      </div>

      {/* Category Selection */}
      <select
        ref={selectCategoryRef}
        disabled={isSelectDisabled}
        className="form-control"
        style={{ width: "80%", marginTop: "2vw" }}
        onChange={(e) => {
          setNumberCategory(e.target.value);
          setNumberSubcategory("");
        }}
      >
        <option>Select Category</option>
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>

      {/* Subcategory Selection */}
      {subcategories.length > 0 && (
        <select
          ref={selectSubcategoryRef}
          disabled={isSelectDisabled}
          className="form-control"
          style={{ width: "80%", marginTop: "2vw" }}
          onChange={(e) => setNumberSubcategory(e.target.value)}
        >
          <option>Select Subcategory</option>
          {subcategories.map((subcategory, index) => (
            <option key={index} value={subcategory}>
              {subcategory}
            </option>
          ))}
        </select>
      )}

      {/* Exercise Selection */}
      {Array.isArray(exercises) && exercises.length && (
        <select
          ref={selectExerciseRef}
          disabled={isSelectDisabled}
          className="form-control"
          style={{ width: "80%", marginTop: "2vw" }}
          onChange={(e) => setNumberExercise(e.target.value)}
        >
          <option>Select Exercise</option>
          {exercises.map((exercise, index) => (
            <option key={index} value={exercise}>
              {exercise}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export default Result;

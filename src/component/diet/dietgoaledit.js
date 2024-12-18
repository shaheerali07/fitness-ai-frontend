import React, { useEffect, useState } from "react";
import api from "../../service/axios";

function DietGoalEdit(props) {
  // const [targetKcal, setTargetKcal] = useState(0);
  const [senderCheck, setSenderCheck] = useState(false);
  const [loader, setLoader] = useState(true);

  // const setSaveTargetKcal = () => {
  //   const header = {
  //     email: localStorage.getItem("fitnessemail"),
  //   };
  //   const updateData = {
  //     targetKcal: targetKcal,
  //   };
  //   setSenderCheck(false);
  //   api
  //     .post("/diet/settargetkcal", { header: header, updateData: updateData })
  //     .then((res) => {
  //       setLoader(false);
  //       setSenderCheck(true);
  //       console.log("ok");
  //       props.setTargetKcal(targetKcal);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       setLoader(false);
  //     });
  // };

  useEffect(() => {
    const header = {
      email: localStorage.getItem("fitnessemail"),
    };
    const updateData = {
      targetKcal: props.targetKcal,
    };
    setSenderCheck(false);
    api
      .post("/diet/settargetkcal", { header: header, updateData: updateData })
      .then((res) => {
        setLoader(false);
        // if (res.data.message === "success") {
        //   setTargetKcal(res.data.result.targetKcal);
        //   props.setTargetKcal(res.data.result.targetKcal);
        // }
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  }, [props.targetKcal]);

  return (
    <div
      className="flex border rounded-xl  w-[100%] h-[75%] items-center mt-2 mb-2
                        min-[1000px]:w-[30%]"
    >
      <div className="flex items-center justify-center bg-[#F1EEF6] w-[70px] h-[70px]  rounded-xl ml-[11%] ">
        <img src={props.imgsrc} width="80%"></img>
      </div>
      <div className="flex flex-col ml-[5%] w-[60%]">
        <p className="text-[#757575] text-[15px] text-left mt-2 mb-1">
          {props.title}
        </p>
        <div className="flex w-[100%] items-center h-[50%] pr-3">
          <span className="text-black text-[20px] text-left mt-2 mb-2">
            {parseInt(props.targetKcal)} Kcal
          </span>

          {/* <button
            className="ml-3 z-10 text-[black] flex items-center justify-center text-[15px] mt-[-1%] h-[38px] w-[40%] border rounded-md bg-[#F1EEF6] hover:bg-[#5534A5] hover:text-[white] duration-300 "
            onClick={setSaveTargetKcal}
            disabled={loader}
          >
            {loader ? <PuffLoader size={20} /> : "Save"}
          </button> */}
          <div className="w-[10%] h-[38px]">
            {senderCheck && (
              <img
                src="./check.png"
                style={{
                  width: "20px",
                  height: "20px",
                  marginLeft: "40%",
                  marginTop: "30%",
                }}
              ></img>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DietGoalEdit;

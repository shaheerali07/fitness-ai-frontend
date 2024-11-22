import React from "react";
import MUIChart from "./mui-chart";
import Result from "./result";
function Chart() {
  return (
    <div className="flex flex-col xl:flex-row justify-center items-center w-[96%]">
      <div className="w-[100%] h-[230px] sm:h-[300px] md:h-[500px] xl:h-[40vh] xl:w-[60%]">
        <MUIChart />
      </div>

      <div className="flex flex-col justify-center items-center w-[100%] xl:w-[40%] md:h-[100%]">
        <Result />
      </div>
    </div>
  );
}

export default Chart;

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
function SideBar({ mainContent, setMainContent }) {
  const [showSideBarState, setSideBar] = useState(true);
  const [accidentID, setAccidentID] = useState(0);
  const sideBar_Dash_Btn = [
    "OverView",
    "Fitness AI",
    "Fitness Analytics",
    "Diet Analytics",
    "Exercise",
    "Support",
  ];

  useEffect(() => {
    setSideBar(mainContent.showSideBar);
    if (mainContent.sideBar === 0) {
      setAccidentID(0);
    }
  }, [mainContent]);

  const setHandle = (index) => {
    const newData = { ...mainContent, showSideBar: !showSideBarState };
    setMainContent(newData);
    setSideBar(!showSideBarState);
    const email = localStorage.getItem("fitnessemail");
    if (email) {
      setAccidentID(index);
      const newData = { ...mainContent, sideBar: index };
      setMainContent(newData);
    } else {
      toast.info("please Log in!");
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center w-[0%] xl:w-[22%]  h-[100%] z-1">
        <button
          className="absolute top-[30px] left-[0px] block xl:hidden"
          onClick={() => {
            setSideBar(!showSideBarState);
            // const newData = { ...mainContent, showSideBar: showSideBarState }
            // setMainContent(newData)
          }}
        >
          <img src="dropdown.png" width="30px"></img>
        </button>
        <div
          className={`absolute w-[20%] md:w-[35%] xl:w-[20%] bg-[#F1EEF6] xl:bg-[white] flex flex-col ${
            !showSideBarState ? "hidden" : ""
          } justify-start items-center h-[90%] xl:block mt-[100px]`}
        >
          {sideBar_Dash_Btn.map((item, index) => (
            <div
              key={index}
              className={`flex items-center w-[90%] h-[15%]  mt-2 mb-2`}
            >
              <div
                className={`w-[5%]  h-[50%] ${
                  accidentID === index ? "bg-[#5534A5]" : ""
                } rounded-xl ml-[-5%]`}
              />
              <button
                className={`${
                  accidentID === index ? "text-[#5534A5]" : "text-[#757575]"
                } flex items-center font-1xl hover:text-[#5534A5] duration-500 w-[50%]`}
                onClick={() => setHandle(index)}
              >
                <img
                  className="mr-1 ml-[60%] sm:ml-[20%] md:ml-10 md:mr-6  "
                  width="40px"
                  src={`${
                    accidentID === index ? item + "_active.png" : item + ".png"
                  }`}
                />
                <p className="mt-[6%] text-[0px] sm:text-[17px]">{item}</p>
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="w-[4px] h-[100%] border z-10"></div>
    </>
  );
}

export default SideBar;

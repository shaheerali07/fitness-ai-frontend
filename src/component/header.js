import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
function Header({
  sideBarIndex,
  headerContent,
  setHeaderContent,
  setSideBarIndex,
  setShowModal,
  setShowChangePasswordModal,
  userDetails,
}) {
  const content = [
    "OverView",
    "Fitness AI",
    "Fitness Analytics",
    "Diet Analytics",
    "Exercise Analytics",
    "Support",
  ];

  const signInBtn = useRef(null);
  const navigate = useNavigate();

  const [showWidget, setShowWidget] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState("user.png");
  const [avatarName, setAvatarName] = useState("Log in");
  const [email, setEmail] = useState("");

  const handeKeyPress = (event) => {
    if (event.key === "Enter") {
      signInBtn.current.click();
    }
  };
  // let loginstate = false;
  useEffect(() => {
    if (userDetails) {
      const name = userDetails.username;
      setAvatarSrc(userDetails.profilePicture);
      setEmail(userDetails.email);
      setAvatarName(name);
      return;
    }
    // const localEmail = localStorage.getItem("fitnessemail");
    // const localPassword = localStorage.getItem("fitnesspassword");
    // api
    //   .get("/admin/signin", {
    //     params: { email: localEmail, password: localPassword },
    //   })
    //   .then((res) => {
    //     const newData = res.data;
    //     if (newData.message === "success") {
    //       const name = newData.name;
    //       setAvatarSrc(newData.profilePic);
    //       setEmail(localEmail);
    //       setAvatarName(name);
    //       if (!loginstate) toastr.success("Welcome to fitness");
    //       loginstate = true;
    //     }
    //   })
    //   .catch((err) => {
    //     console.log("err: ", err);
    //   });
  }, [userDetails]);
  return (
    <>
      <div className="flex flex-col justify-center w-[100%] h-[15%]">
        <div className=" flex justify-between mt-4">
          <div></div>
          <p
            className={`text-[#5534A5] text-[20px] md:text-[50px] ml-[30%] md:ml-[10%]`}
          >
            {content[sideBarIndex]}
          </p>
          <div className="flex flex-col relative">
            {" "}
            {/* Make this div relative */}
            <div className="flex flex-col items-center justify-center gap-[0px]">
              <button
                onClick={(e) => {
                  showWidget === true
                    ? setShowWidget(false)
                    : setShowWidget(true);
                }}
              >
                <img
                  className="rounded-full mt-[0.5rem]"
                  src={avatarSrc}
                  width="80px"
                />
              </button>
              <p
                className="text-[#757575] text-[14px] font-bold cursor-pointer"
                onClick={(e) => setShowWidget(!showWidget)}
              >
                {avatarName}
              </p>
            </div>
            {/* Show widget aligned to bottom left of avatarName */}
            {showWidget && (
              <div className="absolute bottom-4 right-3 transform translate-y-full flex flex-col justify-center items-center w-[200px] h-[160px] border rounded-xl bg-[#F1EEF6] shadow-xl z-10">
                <div className="flex flex-col w-full h-full justify-start p-2 gap-[10px]">
                  <button
                    className="text-[#5534A5] text-[15px] hover:bg-[#5534A5] hover:text-[white] duration-500 border w-full h-[40px]"
                    onClick={() => setShowModal(true)}
                  >
                    Edit Profile
                  </button>
                  <button
                    className="text-[#5534A5] text-[15px] hover:bg-[#5534A5] hover:text-[white] duration-500 border w-full h-[40px]"
                    onClick={(e) => {
                      setShowChangePasswordModal(true);
                    }}
                  >
                    Change Password
                  </button>
                  <button
                    className="text-[#5534A5] text-[15px] hover:bg-[#5534A5] hover:text-[white] duration-500 border w-full h-[40px]"
                    onClick={(e) => {
                      setShowWidget(false);
                      localStorage.clear();
                      setAvatarName("Log in");
                      setSideBarIndex(0);
                      window.location.reload();
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default Header;
import React, { useEffect, useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import toastr from "toastr";
import ChangePasswordModal from "../component/changePassword/changePassword";
import MainBox from "../component/mainbox";
import Onboarding from "../component/onboarding/onboarding";
import SideBar from "../component/sidebar";
import api from "../service/axios";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [mainContent, setMainContent] = useState({
    sideBar: 0,
    showSideBar: false,
  });
  const [showModal, setShowModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const fetchUserByEmail = () => {
    api
      .get("/admin/getUserByEmail", {
        params: { email: localStorage.getItem("fitnessemail") },
      })
      .then((res) => {
        const message = res.data.message;
        if (message === "success") {
          const result = res.data.data;
          setUser(result);
          // Check if fitnessGoal is missing
          if (!result.fitnessGoal) {
            setShowModal(true); // Open the modal if fitnessGoal is missing
          }
        } else {
          toastr.error("Email or password is not correct.");
        }
      })
      .catch((err) => {
        toastr.error(
          err?.response?.data?.message ??
            "Something went wrong. Please try again."
        );
      });
  };

  useEffect(() => {
    fetchUserByEmail();
  }, []);

  // const onSubmit = (data) => {
  //   // API call to update user
  //   const updateData = {
  //     ...data,
  //     email: localStorage.getItem("fitnessemail"),
  //   };
  //   api
  //     .post("/admin/signupUpdate", { updateData })
  //     .then((res) => {
  //       if (res.data.message === "success") {
  //         toastr.success("User updated successfully!");
  //         setShowModal(false); // Close the modal after successful submission
  //       } else {
  //         toastr.error("Failed to update user.");
  //       }
  //     })
  //     .catch((err) => {
  //       toastr.error("An error occurred while updating.");
  //       toastr.error(
  //         err?.response?.data?.message ??
  //           "Something went wrong. Please try again."
  //       );
  //     });
  // };

  const handleChangePassword = (data) => {
    delete data.confirmPassword;
    const updateData = {
      ...data,
    };
    api
      .post("/admin/changePassword", { updateData })
      .then((res) => {
        if (res.data.message === "success") {
          toastr.success("Password updated successfully!");
          setShowChangePasswordModal(false); // Close the modal after successful submission
        } else {
          toastr.error("Failed to update user.");
        }
      })
      .catch((err) => {
        toastr.error("An error occurred while updating.");
        toastr.error(
          err?.response?.data?.message ??
            "Something went wrong. Please try again."
        );
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="flex w-screen h-screen">
          <SideBar mainContent={mainContent} setMainContent={setMainContent} />
          <MainBox
            mainContent={mainContent}
            setMainContent={setMainContent}
            setShowModal={setShowModal}
            setShowChangePasswordModal={setShowChangePasswordModal}
            userDetails={user}
          />
        </div>
      </header>

      {/* Modal for onboarding */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-[80%] h-[90%] overflow-scroll relative">
            {user && user.fitnessGoal && (
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setShowModal(false);
                  fetchUserByEmail();
                }}
              >
                <IoMdCloseCircleOutline size={24} />
              </button>
            )}

            <h2 className="text-2xl font-bold mb-2">
              Complete Your Onboarding
            </h2>
            <Onboarding
              userDetails={user}
              setShowModal={setShowModal}
              fetchUserByEmail={fetchUserByEmail}
            />
          </div>
        </div>
      )}
      {/* Modal for change password */}

      {showChangePasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowChangePasswordModal(false)}
          userDetails={user}
          onSubmit={(data) => {
            handleChangePassword(data);
          }}
        />
      )}
    </div>
  );
}

export default Dashboard;

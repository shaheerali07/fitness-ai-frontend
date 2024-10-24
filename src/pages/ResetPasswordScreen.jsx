// File: src/components/ResetPasswordScreen.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

import { useLocation } from "react-router-dom";
import toastr from "toastr";
import api from "../service/axios";

const ResetPasswordScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const onSubmit = async (data) => {
    try {
      const res = await api.post("/admin/resetPassword", {
        newPassword: data.newPassword,
        email,
      });

      if (res.status === 200) {
        toastr.success("Password reset successfully!");
        window.location.replace("/login"); // Optionally, navigate the user to the login page after resetting password
        // Optionally, navigate the user to the login page after resetting password
      } else {
        toastr.error("Password reset failed. Please try again.");
      }
    } catch (err) {
      console.error("Error during password reset: ", err);
      toastr.error(
        err?.response?.data?.message ??
          "Something went wrong. Please try again."
      );
    }
  };

  // This is used to check if the two password fields match
  const newPassword = watch("newPassword");

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div
        className="flex-1 !bg-blue-600 flex flex-col justify-center items-center text-white p-10"
        style={{
          backgroundImage: "url('/fitness-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <footer className="absolute bottom-5 text-sm">
          © 2024 Fitness AI. All rights reserved.
        </footer>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex flex-col justify-center items-center p-10">
        <h2 className="text-3xl font-bold mb-6">Reset Your Password</h2>
        <p className="mb-6">
          Enter your new password below. Make sure to confirm it correctly.
        </p>

        {/* Reset Password Form */}
        <form className="w-full max-w-sm" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*[\W_]).*$/,
                  message:
                    "Password must contain at least one uppercase letter and one special character",
                },
              })}
              className={`w-full p-3  ${
                errors.newPassword
                  ? "border-red-500 border-[1px]"
                  : "border-gray-300 border"
              } rounded focus:outline-none focus:border-blue-500`}
            />
            <span
              className={`${
                errors.newPassword && "bottom-[35%]"
              } absolute inset-y-0 right-0  pr-3 flex items-center cursor-pointer`}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </span>
            {errors.newPassword && (
              <p className="text-red-500 text-sm">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="mb-4 relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              {...register("confirmNewPassword", {
                required: "Please confirm your new password",
                validate: (value) =>
                  value === newPassword || "Passwords do not match",
              })}
              className={`w-full p-3  ${
                errors.confirmNewPassword
                  ? "border-red-500 border-[1px]"
                  : "border-gray-300 border"
              } rounded focus:outline-none focus:border-blue-500`}
            />
            <span
              className={`${
                errors.confirmNewPassword && "bottom-[35%]"
              } absolute inset-y-0 right-0  pr-3 flex items-center cursor-pointer`}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </span>
            {errors.confirmNewPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmNewPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded mb-4 hover:bg-gray-800 transition"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordScreen;

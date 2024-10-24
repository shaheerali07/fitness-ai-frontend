// File: src/components/SignupScreen.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import toastr from "toastr";
import api from "../service/axios";
import { loginUser } from "../utils/auth";

const SignupScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const payload = {
      email: data.email,
      password: data.password,
      username: data.username,
    };
    try {
      const res = await api.post("/admin/signup", {
        email: payload.email,
        password: payload.password,
        username: payload.username,
      });

      const newData = res.data;
      if (newData.message === "success") {
        toastr.success("Signup successful, welcome to fitness!");
        // Optionally log the user in after signup
        await loginUser({
          email: data.email,
          password: data.password,
          token: newData.token,
        });
        // Redirect to dashboard
      } else {
        console.log(newData);
        toastr.error("Signup failed, please try again.");
      }
    } catch (err) {
      console.error("Error during signup: ", err);
      toastr.error(
        err?.response?.data?.message ??
          "Something went wrong. Please try again."
      );
    }
  };

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
        <h2 className="text-3xl font-bold mb-6">Create Your Account</h2>
        <p className="mb-6">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 font-medium">
            Log in now
          </a>
          .
        </p>

        {/* Signup Form */}
        <form className="w-full max-w-sm" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 font-bold mb-2"
            >
              Username
            </label>
            <input
              type="text"
              placeholder="Username"
              {...register("username", { required: "Username is required" })}
              className={`w-full p-3  ${
                errors.username
                  ? "border-red-500 border-[1px]"
                  : "border-gray-300 border"
              } rounded focus:outline-none focus:border-blue-500`}
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Enter a valid email address",
                },
              })}
              className={`w-full p-3  ${
                errors.email
                  ? "border-red-500 border-[1px]"
                  : "border-gray-300 border"
              } rounded focus:outline-none focus:border-blue-500`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-6 relative">
            <label
              htmlFor="password"
              className="block text-gray-700 font-bold mb-2"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
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
                errors.password
                  ? "border-red-500 border-[1px]"
                  : "border-gray-300 border"
              } rounded focus:outline-none focus:border-blue-500`}
            />
            <span
              className={`${
                errors.password
                  ? errors.password.message ===
                    "Password must contain at least one uppercase letter and one special character"
                    ? "top-[1%]"
                    : "top-[15%]"
                  : "top-[37%]"
              } absolute inset-y-0 right-0  pr-3 flex items-center cursor-pointer`}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </span>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          <div className="mb-6 relative">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 font-bold mb-2"
            >
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              {...register("confirmPassword", {
                required: "Confirm Password is required",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              className={`w-full p-3  ${
                errors.confirmPassword
                  ? "border-red-500 border-[1px]"
                  : "border-gray-300 border"
              } rounded focus:outline-none focus:border-blue-500`}
            />
            <span
              className={`${
                errors.confirmPassword ? "top-[15%]" : "top-[37%]"
              } absolute inset-y-0 right-0  pr-3 flex items-center cursor-pointer`}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </span>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          {/* Signup Button */}
          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded mb-4 hover:bg-gray-800 transition"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupScreen;

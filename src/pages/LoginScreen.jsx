// File: src/components/LoginScreen.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import PuffLoader from "react-spinners/PuffLoader";
import { toast } from "react-toastify";
import api from "../service/axios";
import { loginUser } from "../utils/auth";
const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.get("/admin/signin", {
        params: { email: data.email, password: data.password },
      });

      const newData = res.data;
      if (newData.message === "success") {
        setLoading(false);
        setError(false);
        // First log in the user, then navigate
        await loginUser({
          email: data.email,
          name: newData.name,
          token: newData.token,
          id: newData.id,
        });
      } else {
        setLoading(false);
        setError(true);
        toast.error("Email or password is not correct");
      }
    } catch (err) {
      setLoading(false);
      toast.error(
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
        <h2 className="text-3xl font-bold mb-6">Welcome Back!</h2>
        <p className="mb-6">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-blue-500 font-medium">
            Create a new account
          </a>
          , it&apos;s FREE! Takes less than a minute.
        </p>

        {/* Form */}
        <form className="w-full max-w-sm" onSubmit={handleSubmit(onSubmit)}>
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
                errors.email || error
                  ? "border-red-500 border-[1px]"
                  : " border border-gray-300"
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
              {...register("password", { required: "Password is required" })}
              className={`w-full p-3  ${
                error || errors.password
                  ? "!border-red-500 border-[1px]"
                  : "border border-gray-300"
              } rounded focus:outline-none focus:border-blue-500`}
            />
            <span
              className={`${
                errors.password ? "top-[15%]" : "top-[37%]"
              } absolute inset-y-0 right-0  pr-3 flex items-center cursor-pointer`}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </span>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Buttons */}
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-black text-white p-3 rounded mb-4 hover:bg-gray-800 transition"
          >
            {loading ? <PuffLoader size={20} color={"#fff"} /> : "Log In"}
          </button>
          <div className="flex items-start justify-start gap-1">
            Forgot password?
            <a href="/forgot-password" className=" text-center block">
              <span className="text-blue-500">Click here</span>
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;

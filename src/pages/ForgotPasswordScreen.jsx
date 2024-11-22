// File: src/components/ForgotPasswordScreen.jsx
import React from "react";
import { useForm } from "react-hook-form";
import PuffLoader from "react-spinners/PuffLoader";
import { toast } from "react-toastify";
import api from "../service/axios";

const ForgotPasswordScreen = () => {
  const [loading, setLoading] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post("/admin/forgotPassword", {
        email: data.email,
      });
      if (res.status === 200) {
        setLoading(false);
        toast.success("Password reset link sent to your email!");
        // window.location.replace(`/reset-password?email=${data.email}`);
      } else {
        setLoading(false);

        toast.error("Failed to send reset link. Please try again.");
      }
    } catch (err) {
      setLoading(false);

      console.error("Error during forgot password: ", err);
      toast.error(
        err?.response?.data?.message ??
          "Something went wrong. Please try again.",
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
        <h2 className="text-3xl font-bold mb-6">Forgot Your Password?</h2>
        <p className="mb-6">
          Enter your email address below, and we'll send you instructions to
          reset your password.
        </p>

        {/* Forgot Password Form */}
        <form className="w-full max-w-sm" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
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
              className={`w-full p-3 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded focus:outline-none focus:border-blue-500`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-black text-white p-3 rounded mb-4 hover:bg-gray-800 transition"
          >
            {loading ? (
              <PuffLoader size={20} color={"#fff"} />
            ) : (
              "Send Reset Link"
            )}
          </button>
          <span className=" !text-black !block !text-center !font-body">
            Back to{" "}
            <a href="/login" className="!text-primary-100 !underline">
              Log In
            </a>
          </span>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;

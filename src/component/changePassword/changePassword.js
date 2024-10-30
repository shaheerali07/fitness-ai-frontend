import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const ChangePasswordModal = ({ onClose, onSubmit, userDetails }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm();
  const newPasswordValue = watch("newPassword");
  useEffect(() => {
    if (userDetails) {
      setValue("email", userDetails.email);
    }
  }, [userDetails, setValue]);

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
        <h2 className="text-xl font-bold text-center mb-6">Change Password</h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-2">Email</label>
            <Controller
              name="email"
              control={control}
              rules={{ required: "Email is required", pattern: /^\S+@\S+$/i }}
              render={({ field }) => (
                <input
                  {...field}
                  readOnly
                  type="email"
                  className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              )}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message || "Invalid email format"}
              </p>
            )}
          </div>

          {/* Current Password Field */}
          <div className="flex flex-col relative">
            <label className="text-gray-700 font-semibold mb-2">
              Current Password
            </label>
            <Controller
              name="currentPassword"
              control={control}
              rules={{ required: "Current password is required" }}
              render={({ field }) => (
                <input
                  {...field}
                  type={showCurrentPassword ? "text" : "password"}
                  className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your current password"
                />
              )}
            />
            <span
              className={`${
                errors.currentPassword ? "top-[0%]" : "top-[35%]"
              } absolute inset-y-0 right-0  pr-3 flex items-center cursor-pointer`}
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </span>
            {errors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New Password Field */}
          <div className="flex flex-col relative">
            <label className="text-gray-700 font-semibold mb-2">
              New Password
            </label>
            <Controller
              name="newPassword"
              control={control}
              rules={{
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
              }}
              render={({ field }) => (
                <input
                  {...field}
                  type={showPassword ? "text" : "password"}
                  className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your new password"
                />
              )}
            />
            <span
              className={`${
                errors.newPassword
                  ? errors.newPassword.message ===
                    "Password must contain at least one uppercase letter and one special character"
                    ? "top-[-17%]"
                    : "top-[-3%]"
                  : "top-[35%]"
              } absolute inset-y-0 right-0  pr-3 flex items-center cursor-pointer`}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </span>
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>
          {/* Confirm Password Field */}
          <div className="flex flex-col relative">
            <label className="text-gray-700 font-semibold mb-2">
              Confirm Password
            </label>
            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: "Please confirm your password",
                validate: (value) =>
                  value === newPasswordValue || "Passwords do not match",
              }}
              render={({ field }) => (
                <input
                  {...field}
                  type={showConfirmPassword ? "text" : "password"}
                  className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Re-enter your new password"
                />
              )}
            />
            <span
              className={`${
                errors.confirmPassword
                  ? errors.confirmPassword.message ===
                    "Password must contain at least one uppercase letter and one special character"
                    ? "top-[-17%]"
                    : "top-[-3%]"
                  : "top-[35%]"
              } absolute inset-y-0 right-0  pr-3 flex items-center cursor-pointer`}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </span>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full !bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Change Password
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full !bg-gray-300 text-gray-700 p-3 rounded-lg mt-4 hover:bg-gray-400 transition-colors duration-200"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;

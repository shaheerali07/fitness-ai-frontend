import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Tooltip } from "react-tooltip";

const BasicInfo = () => {
  const { control, setValue, getValues } = useFormContext();
  const [imagePreview, setImagePreview] = useState(null);

  const profilePicture = getValues("profilePicture");

  useEffect(() => {
    if (profilePicture) {
      setImagePreview(profilePicture);
    }
  }, [profilePicture]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImagePreview(base64String); // Set image preview for display
        setValue("profilePicture", base64String); // Set base64 string in React Hook Form
      };
      reader.readAsDataURL(file); // Convert file to base64
    }
  };
  return (
    <>
      <Tooltip id="my-tooltip" place={"bottom"} style={{ fontSize: "12px" }} />
      <div>
        <div className="flex justify-center mb-4">
          <div className="relative">
            {/* Profile Picture Circle */}
            <div
              className="w-32 h-32 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer"
              onClick={() => document.getElementById("fileInput").click()}
            >
              {/* Display Preview or Placeholder */}
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="w-32 h-32 object-contain rounded-full"
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content="Upload profile picture"
                  data-tooltip-variant="info"
                />
              ) : (
                <span className="text-gray-500">Upload</span>
              )}
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
        </div>
        <h2 className="text-xl text-left font-semibold mb-4">
          Basic Information
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1 items-start">
            <label className="block text-gray-700 font-bold mb-2">Name</label>
            <Controller
              name="username"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <input
                    readOnly
                    className=" w-full p-3 border border-gray-300 h-9 rounded focus:outline-none focus:border-blue-500"
                    {...field}
                    placeholder="Enter your name"
                  />
                  {fieldState.error && (
                    <p className="text-red-500 text-sm">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
          <div className="flex flex-col gap-1 items-start">
            <label className="block text-gray-700 font-bold mb-2">Email</label>
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <input
                    readOnly
                    {...field}
                    className=" w-full p-3 border border-gray-300 h-9 rounded focus:outline-none focus:border-blue-500"
                    type="email"
                    placeholder="Enter your email"
                  />
                  {fieldState.error && (
                    <p className="text-red-500 text-sm">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
          <div className="flex flex-col gap-1 items-start">
            <label className="block text-gray-700 font-bold mb-2">Gender</label>
            <Controller
              name="gender"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <select
                    {...field}
                    className=" w-full border border-gray-300 h-9 pl-2 rounded  focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {fieldState.error && (
                    <p className="text-red-500 text-sm">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
          <div className="flex flex-col gap-1 items-start">
            <label className="block text-gray-700 font-bold mb-2">
              Date of Birth
            </label>
            <Controller
              name="dob"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <input
                    {...field}
                    className=" w-full pl-2 pr-2 border border-gray-300 h-9 rounded focus:outline-none focus:border-blue-500"
                    type="date"
                  />
                  {fieldState.error && (
                    <p className="text-red-500 text-sm">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
          <div className="flex flex-col gap-1 items-start">
            {/* Radio buttons for cm/ft */}
            <div className="flex items-center justify-center gap-4">
              <label className="block text-gray-700 font-bold ">Height</label>
              <Controller
                name="heightUnit"
                control={control}
                render={({ field }) => (
                  <>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...field}
                        value="cm"
                        checked={field.value === "cm"}
                        className="mr-1"
                      />
                      cm
                    </label>

                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...field}
                        value="ft"
                        checked={field.value === "ft"}
                        className="mr-1"
                      />
                      ft
                    </label>
                  </>
                )}
              />
            </div>

            {/* Height input */}
            <Controller
              name="height"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <input
                    {...field}
                    className="w-full p-3 border border-gray-300 h-9 rounded focus:outline-none focus:border-blue-500"
                    type="number"
                    placeholder="Enter height"
                  />
                  {fieldState.error && (
                    <p className="text-red-500 text-sm">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <div className="flex flex-col gap-1 items-start">
            <div className="flex items-center justify-center gap-4">
              <label className="block text-gray-700 font-bold ">Weight</label>
              <Controller
                name="weightUnit"
                control={control}
                render={({ field }) => (
                  <>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...field}
                        value="kg"
                        checked={field.value === "kg"}
                        className="mr-1"
                      />
                      kg
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...field}
                        value="lbs"
                        checked={field.value === "lbs"}
                        className="mr-1"
                      />
                      lbs
                    </label>
                  </>
                )}
              />
            </div>
            <Controller
              name="weight"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <input
                    className=" w-full p-3 border border-gray-300 h-9 rounded focus:outline-none focus:border-blue-500"
                    type="number"
                    {...field}
                    placeholder="Weight (kg/lbs)"
                  />
                  {fieldState.error && (
                    <p className="text-red-500 text-sm">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BasicInfo;

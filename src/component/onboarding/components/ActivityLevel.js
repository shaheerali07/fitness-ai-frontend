import React from "react";
import { Controller, useFormContext } from "react-hook-form";

const ActivityLevel = () => {
  const { control } = useFormContext();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-left">Activity Level</h2>
      <div className="grid grid-cols-1 gap-4">
        {/* Current Activity Level */}
        <div className="mb-4 flex flex-col gap-1 items-start">
          <label className="block text-gray-700 font-bold mb-2">
            Current Activity Level
          </label>
          <Controller
            name="activityLevel"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...field}
                      value="Sedentary"
                      checked={field.value === "Sedentary"}
                    />
                    <span className="ml-2">
                      Sedentary (little or no exercise)
                    </span>
                  </label>
                </div>
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...field}
                      value="Lightly active"
                      checked={field.value === "Lightly active"}
                    />
                    <span className="ml-2">
                      Lightly active (1-3 days a week)
                    </span>
                  </label>
                </div>
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...field}
                      value="Moderately active"
                      checked={field.value === "Moderately active"}
                    />
                    <span className="ml-2">
                      Moderately active (3-5 days a week)
                    </span>
                  </label>
                </div>
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...field}
                      value="Very active"
                      checked={field.value === "Very active"}
                    />
                    <span className="ml-2">Very active (6-7 days a week)</span>
                  </label>
                </div>
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...field}
                      value="Super active"
                      checked={field.value === "Super active"}
                    />
                    <span className="ml-2">
                      Super active (professional athlete)
                    </span>
                  </label>
                </div>
                {fieldState.error && (
                  <p className="text-red-500 text-xs mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />
        </div>

        {/* Exercise Days */}
        <div className="mb-4 flex flex-col gap-1 items-start">
          <label className="block text-gray-700 font-bold mb-2">
            How many days per week are you available for exercise?
          </label>
          <Controller
            name="exerciseDays"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <select
                  className={`w-full pl-2 border ${
                    fieldState.error ? "border-red-500" : "border-gray-300"
                  } h-9 rounded focus:outline-none focus:border-blue-500`}
                  {...field}
                >
                  {[...Array(7).keys()].map((day) => (
                    <option key={day} value={day + 1}>
                      {day + 1} day{day + 1 > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
                {fieldState.error && (
                  <p className="text-red-500 text-xs mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />
        </div>

        {/* Workout Duration */}
        <div className="mb-4 flex flex-col gap-1 items-start">
          <label className="block text-gray-700 font-bold mb-2">
            Preferred workout duration per session
          </label>
          <Controller
            name="workoutDuration"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <select
                  className={`w-full pl-2 border ${
                    fieldState.error ? "border-red-500" : "border-gray-300"
                  } h-9 rounded focus:outline-none focus:border-blue-500`}
                  {...field}
                >
                  <option value="10 mins">10 mins</option>
                  <option value="20 mins">20 mins</option>
                  <option value="30 mins">30 mins</option>
                  <option value="45 mins">45 mins</option>
                  <option value="1 hour+">1 hour+</option>
                </select>
                {fieldState.error && (
                  <p className="text-red-500 text-xs mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default ActivityLevel;

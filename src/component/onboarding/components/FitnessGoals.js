import React from "react";
import { Controller, useFormContext } from "react-hook-form";

const FitnessGoals = () => {
  const { control } = useFormContext();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-left">Fitness Goals</h2>
      <div className="grid grid-cols-2 gap-4">
        {/* Primary Fitness Goal */}
        <div className="flex flex-col gap-1 items-start">
          <label className="block text-gray-700 font-bold mb-2">
            Primary Fitness Goal
          </label>
          <Controller
            name="fitnessGoal"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <select
                  className={`w-full pl-2 border ${
                    fieldState.error ? "border-red-500" : "border-gray-300"
                  } h-9 rounded focus:outline-none focus:border-blue-500`}
                  {...field}
                >
                  <option value="">Select goal</option>
                  <option value="Lose weight">Lose weight</option>
                  <option value="Gain muscle">Gain muscle</option>
                  <option value="Improve endurance">Improve endurance</option>
                  <option value="General fitness">General fitness</option>
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

        {/* Target Weight */}
        <div className="flex flex-col gap-1 items-start">
          <label className="block text-gray-700 font-bold mb-2">
            Target Weight
          </label>
          <Controller
            name="targetWeight"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <input
                  className={`w-full p-3 border ${
                    fieldState.error ? "border-red-500" : "border-gray-300"
                  } h-9 rounded focus:outline-none focus:border-blue-500`}
                  type="number"
                  placeholder="Enter target weight"
                  {...field}
                />
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

export default FitnessGoals;

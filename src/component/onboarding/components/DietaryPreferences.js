import React from "react";
import { Controller, useFormContext } from "react-hook-form";

const DietaryPreferences = () => {
  const { control } = useFormContext();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-left">
        Dietary Preferences
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {/* Dietary Preferences */}
        <div className="mb-4 flex flex-col gap-1 items-start">
          <label className="block text-gray-700 font-bold mb-2">
            Do you have any specific dietary preferences or restrictions?
          </label>
          <Controller
            name="dietaryPreferences"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      value="Vegan"
                      checked={field.value.includes("Vegan")}
                      onChange={() => {
                        const newValue = field.value.includes("Vegan")
                          ? field.value.filter((v) => v !== "Vegan")
                          : [...field.value, "Vegan"];
                        field.onChange(newValue);
                      }}
                    />
                    <span className="ml-2">Vegan</span>
                  </label>
                </div>
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      value="Vegetarian"
                      checked={field.value.includes("Vegetarian")}
                      onChange={() => {
                        const newValue = field.value.includes("Vegetarian")
                          ? field.value.filter((v) => v !== "Vegetarian")
                          : [...field.value, "Vegetarian"];
                        field.onChange(newValue);
                      }}
                    />
                    <span className="ml-2">Vegetarian</span>
                  </label>
                </div>
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      value="Pescatarian"
                      checked={field.value.includes("Pescatarian")}
                      onChange={() => {
                        const newValue = field.value.includes("Pescatarian")
                          ? field.value.filter((v) => v !== "Pescatarian")
                          : [...field.value, "Pescatarian"];
                        field.onChange(newValue);
                      }}
                    />
                    <span className="ml-2">Pescatarian</span>
                  </label>
                </div>
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      value="Gluten-free"
                      checked={field.value.includes("Gluten-free")}
                      onChange={() => {
                        const newValue = field.value.includes("Gluten-free")
                          ? field.value.filter((v) => v !== "Gluten-free")
                          : [...field.value, "Gluten-free"];
                        field.onChange(newValue);
                      }}
                    />
                    <span className="ml-2">Gluten-free</span>
                  </label>
                </div>
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      value="Lactose intolerant"
                      checked={field.value.includes("Lactose intolerant")}
                      onChange={() => {
                        const newValue = field.value.includes(
                          "Lactose intolerant",
                        )
                          ? field.value.filter(
                              (v) => v !== "Lactose intolerant",
                            )
                          : [...field.value, "Lactose intolerant"];
                        field.onChange(newValue);
                      }}
                    />
                    <span className="ml-2">Lactose intolerant</span>
                  </label>
                </div>
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      value="No specific preference"
                      checked={field.value.includes("No specific preference")}
                      onChange={() => {
                        const newValue = field.value.includes(
                          "No specific preference",
                        )
                          ? field.value.filter(
                              (v) => v !== "No specific preference",
                            )
                          : [...field.value, "No specific preference"];
                        field.onChange(newValue);
                      }}
                    />
                    <span className="ml-2">No specific preference</span>
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

        {/* Calorie Intake */}
        <div className="mb-4 flex flex-col gap-1 items-start">
          <label className="block text-gray-700 font-bold mb-2">
            Daily Calorie Intake Goal (if applicable)
          </label>
          <Controller
            name="calorieIntake"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <input
                  className={`w-full p-3 border ${
                    fieldState.error ? "border-red-500" : "border-gray-300"
                  } h-9 rounded focus:outline-none focus:border-blue-500`}
                  type="number"
                  placeholder="Calorie intake (in kcal)"
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

export default DietaryPreferences;

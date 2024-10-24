import React from "react";
import { Controller, useFormContext } from "react-hook-form";

const UserAgreement = () => {
  const { control } = useFormContext();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-left">User Agreement</h2>
      <div className="grid grid-cols-1 gap-2">
        {/* Agreement Terms */}
        <div className="flex flex-col gap-1 items-start">
          <p className="m-0">Please read and agree to the terms below:</p>
          <ul className="list-disc m-0 flex flex-col items-start pl-3 text-gray-700 font-bold">
            <li>
              You agree to follow the workout plan as per your fitness level.
            </li>
            <li>You understand the risks involved in physical activities.</li>
            <li>
              You confirm that all information provided is accurate and
              up-to-date.
            </li>
          </ul>
        </div>

        {/* Agree to Terms and Conditions */}
        <div className="flex flex-col gap-1 items-start">
          <Controller
            name="agreeTerms"
            control={control}
            render={({ field, fieldState }) => (
              <label className="inline-flex items-center">
                <input type="checkbox" {...field} checked={field.value} />
                <span className="ml-2 block text-gray-700">
                  I agree to the terms and conditions
                </span>
                {fieldState.error && (
                  <p className="text-red-500 text-xs mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </label>
            )}
          />
        </div>

        {/* Agree to Receive Emails */}
        {/* <div className="mb-4 flex flex-col gap-1 items-start">
          <Controller
            name="receiveEmails"
            control={control}
            render={({ field, fieldState }) => (
              <label className="inline-flex items-center">
                <input type="checkbox" {...field} checked={field.value} />
                <span className="ml-2 block text-gray-700">
                  I agree to receive emails about my fitness journey
                </span>
                {fieldState.error && (
                  <p className="text-red-500 text-xs mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </label>
            )}
          />
        </div> */}
      </div>
    </div>
  );
};

export default UserAgreement;

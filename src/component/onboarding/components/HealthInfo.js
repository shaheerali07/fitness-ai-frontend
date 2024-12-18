import { Controller, useFormContext } from "react-hook-form";
const injuryOptions = [
  "Shoulder Impingement",
  "Rotator Cuff Tear",
  "Labral Tear (Shoulder)",
  "Knee Pain (General)",
  "Patellar Tendinitis",
  "ACL Tear (Post-Surgery)",
  "Meniscus Tear",
  "Ankle Sprain",
  "Plantar Fasciitis",
  "Achilles Tendinitis",
  "Lower Back Pain (General)",
  "Herniated Disc",
  "Sciatica",
  "Tennis Elbow",
  "Golf Elbow",
  "Hip Bursitis",
  "Frozen Shoulder",
  "IT Band Syndrome",
  "Carpal Tunnel Syndrome",
  "Hamstring Strain",
  "Quadriceps Strain",
];
const HealthInfo = () => {
  const { control, watch } = useFormContext();
  const hasConditions = watch("medicalConditions") === "yes";
  const takesMedication = watch("medication") === "yes";
  const hasExerciseLimitations = watch("exerciseLimitations") === "yes";
  const hasInjury = watch("injury") === "yes";
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-left">
        Health Information
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {/* Medical Conditions */}
        <div className="mb-4 flex flex-col gap-1 items-start">
          <label className="block text-gray-700 font-bold mb-2">
            Do you have any pre-existing medical conditions or injuries that may
            affect your workouts?
          </label>
          <Controller
            name="medicalConditions"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...field}
                    value="yes"
                    checked={field.value === "yes"}
                  />
                  <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...field}
                    value="no"
                    checked={field.value === "no"}
                  />
                  <span className="ml-2">No</span>
                </label>
                {fieldState.error && (
                  <p className="text-red-500 text-xs mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />
          {hasConditions && (
            <div className="mt-2">
              <label className="block text-gray-700 text-left font-bold mb-2">
                Please specify:
              </label>
              <Controller
                name="conditionsDetail"
                control={control}
                render={({ field }) => (
                  <input
                    className="w-full p-3 border border-gray-300 h-9 rounded focus:outline-none focus:border-blue-500"
                    {...field}
                    placeholder="Specify conditions"
                  />
                )}
              />
            </div>
          )}
        </div>

        {/* Medication */}
        <div className="mb-4 flex flex-col gap-1 items-start">
          <label className="block text-gray-700 font-bold mb-2">
            Are you currently taking any medication?
          </label>
          <Controller
            name="medication"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...field}
                    value="yes"
                    checked={field.value === "yes"}
                  />
                  <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...field}
                    value="no"
                    checked={field.value === "no"}
                  />
                  <span className="ml-2">No</span>
                </label>
                {fieldState.error && (
                  <p className="text-red-500 text-xs mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />
          {takesMedication && (
            <div className="mt-2">
              <label className="block text-gray-700 text-left font-bold mb-2">
                Please specify:
              </label>
              <Controller
                name="medicationDetail"
                control={control}
                render={({ field }) => (
                  <input
                    className="w-full p-3 border border-gray-300 h-9 rounded focus:outline-none focus:border-blue-500"
                    {...field}
                    placeholder="Specify medication"
                  />
                )}
              />
            </div>
          )}
        </div>

        {/* Exercise Limitations */}
        <div className="mb-4 flex flex-col gap-1 items-start">
          <label className="block text-gray-700 font-bold mb-2">
            Have you been advised by a healthcare professional to avoid specific
            exercises?
          </label>
          <Controller
            name="exerciseLimitations"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...field}
                    value="yes"
                    checked={field.value === "yes"}
                  />
                  <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex items-center ">
                  <input
                    type="radio"
                    {...field}
                    value="no"
                    checked={field.value === "no"}
                  />
                  <span className="ml-2">No</span>
                </label>
                {fieldState.error && (
                  <p className="text-red-500 text-xs mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />
          {hasExerciseLimitations && (
            <div className="mt-2">
              <label className="block text-gray-700 text-left font-bold mb-2">
                Please specify:
              </label>
              <Controller
                name="exerciseLimitationsDetail"
                control={control}
                render={({ field }) => (
                  <input
                    className="w-full p-3 border border-gray-300 h-9 rounded focus:outline-none focus:border-blue-500"
                    {...field}
                    placeholder="Specify limitations"
                  />
                )}
              />
            </div>
          )}
        </div>

        {/* Injury Section */}
        <div className="mb-4 flex flex-col gap-1 items-start">
          <label className="block text-gray-700 font-bold mb-2">
            Do you have any current injuries?
          </label>
          <Controller
            name="injury"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...field}
                    value="yes"
                    checked={field.value === "yes"}
                  />
                  <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...field}
                    value="no"
                    checked={field.value === "no"}
                  />
                  <span className="ml-2">No</span>
                </label>
                {fieldState.error && (
                  <p className="text-red-500 text-xs mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />
          {hasInjury && (
            <div className="mt-2">
              <label className="block text-gray-700 text-left font-bold mb-2">
                Please select the injury:
              </label>
              <Controller
                name="injuryDetail"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <select
                      {...field}
                      className="w-full p-2 border border-gray-300 h-10 rounded focus:outline-none focus:border-blue-500"
                    >
                      <option value="" disabled>
                        Select an injury
                      </option>
                      {injuryOptions.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
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
          )}
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
                  I agree to the{" "}
                  <a
                    href="/conditions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline ml-1"
                  >
                    terms and conditions
                  </a>
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
      </div>
    </div>
  );
};

export default HealthInfo;

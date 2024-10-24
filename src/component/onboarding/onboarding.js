import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toastr from "toastr";
import * as yup from "yup";

import api from "../../service/axios";
import ActivityLevel from "./components/ActivityLevel";
import BasicInfo from "./components/BasicInfo";
import DietaryPreferences from "./components/DietaryPreferences";
import FitnessGoals from "./components/FitnessGoals";
import HealthInfo from "./components/HealthInfo";
import StepperComponent from "./components/Stepper";
const Onboarding = ({ userDetails, setShowModal, fetchUserByEmail }) => {
  const schema = yup.object().shape({
    profilePicture: yup.string(),
    gender: yup.string().required("Gender is required"),
    dob: yup.date().required("Date of Birth is required"),
    height: yup.number().required("Height is required").positive(),
    heightUnit: yup.string().required("Height unit is required"),
    weight: yup.number().required("Weight is required").positive(),
    weightUnit: yup.string().required("Weight unit is required"),
    fitnessGoal: yup.string().required("Fitness Goal is required"),
    targetWeight: yup.number().positive(),
    activityLevel: yup.string().required("Activity level is required"),
    exerciseDays: yup
      .number()
      .required("Exercise Days are required")
      .positive()
      .integer(),
    workoutDuration: yup.string().required("Workout duration is required"),
    dietaryPreferences: yup.array().of(yup.string()),
    calorieIntake: yup
      .number()
      .required("Calorie intake is required")
      .positive(),
    medicalConditions: yup.string(),
    medication: yup.string().required(),
    exerciseLimitations: yup.string().required(),
    medicationDetail: yup.string(),
    exerciseLimitationsDetail: yup.string(),
    agreeTerms: yup.boolean(),
    // receiveEmails: yup.boolean(),
  });

  const defaultValues = {
    gender: "",
    // dob: "1983-03-15",
    dob: "",
    profilePicture: "user.png",
    height: 0,
    heightUnit: "cm",
    weight: 0,
    weightUnit: "kg",
    fitnessGoal: "",
    targetWeight: 0,
    activityLevel: "",
    exerciseDays: 0,
    workoutDuration: "",
    dietaryPreferences: [],
    calorieIntake: 0,
    medicalConditions: "",
    medication: "",
    exerciseLimitations: "",
    medicationDetail: "",
    exerciseLimitationsDetail: "",
    agreeTerms: true,
    // receiveEmails: true,
    username: "", // Add username as an empty string for default
    email: "",
  };

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });
  useEffect(() => {
    if (userDetails) {
      console.log(userDetails);
      const formattedDob = userDetails.dob
        ? new Date(userDetails.dob).toISOString().split("T")[0]
        : "";
      methods.reset({
        profilePicture: userDetails.profilePicture,
        gender: userDetails.gender,
        dob: formattedDob,
        height: userDetails.height,
        heightUnit: userDetails.heightUnit,
        weight: userDetails.weight,
        weightUnit: userDetails.weightUnit,
        fitnessGoal: userDetails.fitnessGoal,
        targetWeight: userDetails.targetWeight,
        activityLevel: userDetails.activityLevel,
        exerciseDays: userDetails.exerciseDays,
        workoutDuration: userDetails.workoutDuration,
        dietaryPreferences: userDetails.dietaryPreferences,
        calorieIntake: userDetails.calorieIntake,
        medicalConditions: userDetails.medicalConditions,
        medication: userDetails.medication,
        exerciseLimitations: userDetails.exerciseLimitations,
        medicationDetail: userDetails.medicationDetail,
        exerciseLimitationsDetail: userDetails.exerciseLimitationsDetail,
        conditionsDetail: userDetails.conditionsDetail,
        agreeTerms: userDetails.agreeTerms,
        // receiveEmails: userDetails.receiveEmails,
        username: userDetails.username, // Update with userDetails
        email: userDetails.email, // Update with userDetails
      });
    }
  }, [userDetails, methods]);
  const [step, setStep] = useState(0);

  const onNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const onBack = () => {
    setStep((prevStep) => (prevStep > 0 ? prevStep - 1 : prevStep));
  };

  const onSubmit = (data) => {
    // API call to update user
    const updateData = {
      ...data,
    };
    api
      .post("/admin/signupUpdate", { updateData })
      .then((res) => {
        if (res.data.message === "success") {
          toastr.success("User updated successfully!");
          setShowModal(false); // Close the modal after successful submission
          fetchUserByEmail();
        } else {
          toastr.error("Failed to update user.");
        }
      })
      .catch((err) => {
        toastr.error("An error occurred while updating.");
        toastr.error(
          err?.response?.data?.message ??
            "Something went wrong. Please try again."
        );
      });
  };
  return (
    <div className="max-w-[60rem] mx-auto p-6">
      <StepperComponent step={step} />
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {step === 0 && <BasicInfo />}
          {step === 1 && <FitnessGoals />}
          {step === 2 && <ActivityLevel />}
          {step === 3 && <DietaryPreferences />}
          {step === 4 && <HealthInfo />}
          {/* {step === 5 && <UserAgreement />} */}

          <div className="flex justify-between mt-4">
            {step > 0 && (
              <button
                type="button"
                onClick={onBack}
                className="btn btn-secondary"
              >
                Back
              </button>
            )}
            {step < 4 && (
              <button
                type="button"
                onClick={onNext}
                className="btn btn-primary"
              >
                Next
              </button>
            )}
            {step === 4 && (
              <button type="submit" className="btn btn-success">
                Complete
              </button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default Onboarding;

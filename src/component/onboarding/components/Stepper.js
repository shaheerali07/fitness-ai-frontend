import React from "react";
import Stepper from "react-stepper-horizontal";

const StepperComponent = ({ step }) => {
  return (
    <div className="mb-8">
      <Stepper
        steps={[
          { title: "Basic Info" },
          { title: "Fitness Goals" },
          { title: "Activity Level" },
          { title: "Dietary Preferences" },
          { title: "Health Info" },
          // { title: "Agreement" },
        ]}
        activeStep={step}
        completeColor="green"
        activeColor="blue"
        circleFontSize={0}
        titleFontSize={13}
        size={20}
      />
    </div>
  );
};

export default StepperComponent;

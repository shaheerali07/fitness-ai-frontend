import React from "react";
import Meal from "./meal.js";
function DietDaily({
  dietPlan,
  setDietPlan,
  updateWeeklySignal,
  setUpdateWeeklySignal,
  refetch,
}) {
  const mealType = ["Breakfast", "Snack1", "Lunch", "Snack2", "Dinner"];

  return (
    <div className="flex flex-col xl:flex-row w-[100%] pb-[20px] ml-[0%] mt-3">
      {mealType.map((item, index) => (
        <Meal
          title={item}
          meal={dietPlan.food}
          amount={dietPlan.amount}
          status={dietPlan.status}
          index={index}
          refetch={refetch}
          dietPlan={dietPlan}
          setDietPlan={setDietPlan}
          updateWeeklySignal={updateWeeklySignal}
          setUpdateWeeklySignal={setUpdateWeeklySignal}
        />
      ))}
    </div>
  );
}

export default DietDaily;

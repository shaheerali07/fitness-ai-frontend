import React, { useEffect, useState } from "react";
import api from "../../service/axios.js";
import DietCalendar from "./dietcalendar.js";
import DietDaily from "./dietdaily.js";
function DietPlan({ setdietCal, updateWeeklySignal, setUpdateWeeklySignal }) {
  const [btnEnable, setBtnEnable] = useState(false);

  const [dietPlan, setDietPlan] = useState({
    year: "",
    month: "",
    date: "",
    day: "",
    food: {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack1: [],
      snack2: [],
    },
    amount: {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack1: [],
      snack2: [],
    },
    dietMenu: {
      foodName: [],
      kcal: [],
      protein: [],
      water: [],
      mineral: [],
      carbohydrate: [],
    },
    status: {
      breakfast: ["incomplete"],
      lunch: ["incomplete"],
      dinner: ["incomplete"],
      snack1: ["incomplete"],
      snack2: ["incomplete"],
    },
  });

  useEffect(() => {
    setdietCal(dietPlan);
  }, [dietPlan]);

  const fetchDietPlan = async () => {
    if (dietPlan.year === "") {
      return;
    }

    const localEmail = localStorage.getItem("fitnessemail");
    const localPassword = localStorage.getItem("fitnesspassword");
    const header = {
      email: localEmail,
      password: localPassword,
    };

    const getData = {
      year: dietPlan.year,
      month: dietPlan.month,
      date: dietPlan.date,
      day: dietPlan.day,
    };

    try {
      const res = await api.get("/diet/getdiet", {
        params: {
          header: header,
          getData: getData,
        },
      });

      setBtnEnable(false);
      const message = res.data.message;
      const result = res.data.result;

      if (message === "success") {
        const newData = {
          ...dietPlan,
          id: result.plandiet._id,
          food: {
            breakfast: result.plandiet.meal.breakfast,
            lunch: result.plandiet.meal.lunch,
            dinner: result.plandiet.meal.dinner,
            snack1: result.plandiet.meal.snack1,
            snack2: result.plandiet.meal.snack2,
          },
          amount: {
            breakfast: result.plandiet.amount.breakfast,
            lunch: result.plandiet.amount.lunch,
            dinner: result.plandiet.amount.dinner,
            snack1: result.plandiet.amount.snack1,
            snack2: result.plandiet.amount.snack2,
          },
          status: {
            breakfast: result.plandiet.status.breakfast,
            lunch: result.plandiet.status.lunch,
            dinner: result.plandiet.status.dinner,
            snack1: result.plandiet.status.snack1,
            snack2: result.plandiet.status.snack2,
          },
          dietMenu: {
            foodName: result.dietMenu.foodName,
            kcal: result.dietMenu.kcal,
            protein: result.dietMenu.protein,
            water: result.dietMenu.water,
            mineral: result.dietMenu.mineral,
            carbohydrate: result.dietMenu.carbohydrate,
          },
        };
        setDietPlan(newData);
      } else {
        const newData = {
          ...dietPlan,
          food: {
            breakfast: [],
            lunch: [],
            dinner: [],
            snack1: [],
            snack2: [],
          },
          amount: {
            breakfast: [],
            lunch: [],
            dinner: [],
            snack1: [],
            snack2: [],
          },
          status: {
            breakfast: ["incomplete"],
            lunch: ["incomplete"],
            dinner: ["incomplete"],
            snack1: ["incomplete"],
            snack2: ["incomplete"],
          },
          dietMenu: {
            foodName: result.dietMenu.foodName,
            kcal: result.dietMenu.kcal,
            protein: result.dietMenu.protein,
            water: result.dietMenu.water,
            mineral: result.dietMenu.mineral,
            carbohydrate: result.dietMenu.carbohydrate,
          },
        };
        setDietPlan(newData);
      }
    } catch (error) {
      console.error("Error fetching diet plan:", error);
    }
  };

  useEffect(() => {
    fetchDietPlan();
  }, [dietPlan.day]);
  return (
    <div className="border rounded-xl w-[100%] pb-[20px] mt-[2%] ">
      <DietCalendar
        dietPlan={dietPlan}
        setDietPlan={setDietPlan}
        btnEnable={btnEnable}
        setBtnEnable={setBtnEnable}
      />
      <DietDaily
        dietPlan={dietPlan}
        setDietPlan={setDietPlan}
        refetch={fetchDietPlan}
        updateWeeklySignal={updateWeeklySignal}
        setUpdateWeeklySignal={setUpdateWeeklySignal}
      />
    </div>
  );
}

export default DietPlan;

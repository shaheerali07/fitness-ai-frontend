import { useEffect, useState } from "react";
import api from "../../service/axios";
import { getWeekStartAndEnd } from "../../utils/auth";
import DietStats from "./dietStats";

function DietGoal({ dietCal, updateWeeklySignal }) {
  const [dailyTotalKcal, setDailyTotalKcal] = useState(0);
  const [weeklyTotalKcal, setWeeklyTotalKcal] = useState(0);
  // const [targetKcal, setTargetKcal] = useState(0);
  const [dailyTotalCarbs, setDailyTotalCarbs] = useState(0);
  const [weeklyTotalCarbs, setWeeklyTotalCarbs] = useState(0);
  const [dailyTotalProteins, setDailyTotalProteins] = useState(0);
  const [weeklyTotalProteins, setWeeklyTotalProteins] = useState(0);
  const [dailyTotalMinerals, setDailyTotalMinerals] = useState(0);
  const [weeklyTotalMinerals, setWeeklyTotalMinerals] = useState(0);
  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : "";
  const calc_kcal = (foodName, dietMenu) => {
    return dietMenu.kcal[dietMenu.foodName.indexOf(foodName)];
  };
  const calc_protein = (foodName, dietMenu) => {
    return dietMenu.protein[dietMenu.foodName.indexOf(foodName)];
  };
  const calc_carbs = (foodName, dietMenu) => {
    return dietMenu.carbohydrate[dietMenu.foodName.indexOf(foodName)];
  };
  const calc_mineral = (foodName, dietMenu) => {
    return dietMenu.mineral[dietMenu.foodName.indexOf(foodName)];
  };

  const calc_DailyTotalKcal = (dialyData) => {
    const breakfastFood = dialyData.food.breakfast;
    const snack1Food = dialyData.food.snack1;
    const lunchFood = dialyData.food.lunch;
    const snack2Food = dialyData.food.snack2;
    const dinnerFood = dialyData.food.dinner;

    const breakfastAmount = dialyData.amount.breakfast;
    const snack1Amount = dialyData.amount.snack1;
    const lunchAmount = dialyData.amount.lunch;
    const snack2Amount = dialyData.amount.snack2;
    const dinnerAmount = dialyData.amount.dinner;

    const dialyFoodMenu = [
      breakfastFood,
      snack1Food,
      lunchFood,
      snack2Food,
      dinnerFood,
    ];
    const amountMenu = [
      breakfastAmount,
      snack1Amount,
      lunchAmount,
      snack2Amount,
      dinnerAmount,
    ];
    const dietMenu = dialyData.dietMenu;

    let myTotalKcal = 0;
    dialyFoodMenu.map((item, i) => {
      item.map((itx, j) => {
        myTotalKcal =
          myTotalKcal + (calc_kcal(itx, dietMenu) * amountMenu[i][j]) / 100;
      });
    });
    return myTotalKcal;
  };
  const calc_DailyTotalCarbs = (dialyData) => {
    const breakfastFood = dialyData.food.breakfast;
    const snack1Food = dialyData.food.snack1;
    const lunchFood = dialyData.food.lunch;
    const snack2Food = dialyData.food.snack2;
    const dinnerFood = dialyData.food.dinner;

    const breakfastAmount = dialyData.amount.breakfast;
    const snack1Amount = dialyData.amount.snack1;
    const lunchAmount = dialyData.amount.lunch;
    const snack2Amount = dialyData.amount.snack2;
    const dinnerAmount = dialyData.amount.dinner;

    const dialyFoodMenu = [
      breakfastFood,
      snack1Food,
      lunchFood,
      snack2Food,
      dinnerFood,
    ];
    const amountMenu = [
      breakfastAmount,
      snack1Amount,
      lunchAmount,
      snack2Amount,
      dinnerAmount,
    ];
    const dietMenu = dialyData.dietMenu;

    let myTotalKcal = 0;
    dialyFoodMenu.map((item, i) => {
      item.map((itx, j) => {
        myTotalKcal =
          myTotalKcal + (calc_carbs(itx, dietMenu) * amountMenu[i][j]) / 100;
      });
    });
    return myTotalKcal;
  };
  const calc_DailyTotalProteins = (dialyData) => {
    const breakfastFood = dialyData.food.breakfast;
    const snack1Food = dialyData.food.snack1;
    const lunchFood = dialyData.food.lunch;
    const snack2Food = dialyData.food.snack2;
    const dinnerFood = dialyData.food.dinner;

    const breakfastAmount = dialyData.amount.breakfast;
    const snack1Amount = dialyData.amount.snack1;
    const lunchAmount = dialyData.amount.lunch;
    const snack2Amount = dialyData.amount.snack2;
    const dinnerAmount = dialyData.amount.dinner;

    const dialyFoodMenu = [
      breakfastFood,
      snack1Food,
      lunchFood,
      snack2Food,
      dinnerFood,
    ];
    const amountMenu = [
      breakfastAmount,
      snack1Amount,
      lunchAmount,
      snack2Amount,
      dinnerAmount,
    ];
    const dietMenu = dialyData.dietMenu;

    let myTotalKcal = 0;
    dialyFoodMenu.map((item, i) => {
      item.map((itx, j) => {
        myTotalKcal =
          myTotalKcal + (calc_protein(itx, dietMenu) * amountMenu[i][j]) / 100;
      });
    });
    return myTotalKcal;
  };
  const calc_DailyTotalMinerals = (dialyData) => {
    const breakfastFood = dialyData.food.breakfast;
    const snack1Food = dialyData.food.snack1;
    const lunchFood = dialyData.food.lunch;
    const snack2Food = dialyData.food.snack2;
    const dinnerFood = dialyData.food.dinner;

    const breakfastAmount = dialyData.amount.breakfast;
    const snack1Amount = dialyData.amount.snack1;
    const lunchAmount = dialyData.amount.lunch;
    const snack2Amount = dialyData.amount.snack2;
    const dinnerAmount = dialyData.amount.dinner;

    const dialyFoodMenu = [
      breakfastFood,
      snack1Food,
      lunchFood,
      snack2Food,
      dinnerFood,
    ];
    const amountMenu = [
      breakfastAmount,
      snack1Amount,
      lunchAmount,
      snack2Amount,
      dinnerAmount,
    ];
    const dietMenu = dialyData.dietMenu;

    let myTotalKcal = 0;
    dialyFoodMenu.map((item, i) => {
      item.map((itx, j) => {
        myTotalKcal =
          myTotalKcal + (calc_mineral(itx, dietMenu) * amountMenu[i][j]) / 100;
      });
    });
    return myTotalKcal;
  };

  const weeklyTotalCalcKcal = (data) => {
    const breakfastFood = data.meal.breakfast;
    const snack1Food = data.meal.snack1;
    const lunchFood = data.meal.lunch;
    const snack2Food = data.meal.snack2;
    const dinnerFood = data.meal.dinner;

    const breakfastAmount = data.amount.breakfast;
    const snack1Amount = data.amount.snack1;
    const lunchAmount = data.amount.lunch;
    const snack2Amount = data.amount.snack2;
    const dinnerAmount = data.amount.dinner;

    const dialyFoodMenu = [
      breakfastFood,
      snack1Food,
      lunchFood,
      snack2Food,
      dinnerFood,
    ];
    const amountMenu = [
      breakfastAmount,
      snack1Amount,
      lunchAmount,
      snack2Amount,
      dinnerAmount,
    ];
    const dietMenu = dietCal.dietMenu;

    let myTotalKcal = 0;

    dialyFoodMenu.map((item, i) => {
      item.map((itx, j) => {
        let temp = isNaN(calc_kcal(itx, dietMenu))
          ? 0
          : calc_kcal(itx, dietMenu);

        myTotalKcal = myTotalKcal + (temp * amountMenu[i][j]) / 100;
      });
    });

    return myTotalKcal;
  };
  const weeklyTotalCalcCarbs = (data) => {
    const breakfastFood = data.meal.breakfast;
    const snack1Food = data.meal.snack1;
    const lunchFood = data.meal.lunch;
    const snack2Food = data.meal.snack2;
    const dinnerFood = data.meal.dinner;

    const breakfastAmount = data.amount.breakfast;
    const snack1Amount = data.amount.snack1;
    const lunchAmount = data.amount.lunch;
    const snack2Amount = data.amount.snack2;
    const dinnerAmount = data.amount.dinner;

    const dialyFoodMenu = [
      breakfastFood,
      snack1Food,
      lunchFood,
      snack2Food,
      dinnerFood,
    ];
    const amountMenu = [
      breakfastAmount,
      snack1Amount,
      lunchAmount,
      snack2Amount,
      dinnerAmount,
    ];
    const dietMenu = dietCal.dietMenu;

    let myTotalCarbs = 0;
    dialyFoodMenu.map((item, i) => {
      item.map((itx, j) => {
        myTotalCarbs =
          myTotalCarbs + (calc_carbs(itx, dietMenu) * amountMenu[i][j]) / 100;
      });
    });
    return myTotalCarbs;
  };
  const weeklyTotalCalcProteins = (data) => {
    const breakfastFood = data.meal.breakfast;
    const snack1Food = data.meal.snack1;
    const lunchFood = data.meal.lunch;
    const snack2Food = data.meal.snack2;
    const dinnerFood = data.meal.dinner;

    const breakfastAmount = data.amount.breakfast;
    const snack1Amount = data.amount.snack1;
    const lunchAmount = data.amount.lunch;
    const snack2Amount = data.amount.snack2;
    const dinnerAmount = data.amount.dinner;

    const dialyFoodMenu = [
      breakfastFood,
      snack1Food,
      lunchFood,
      snack2Food,
      dinnerFood,
    ];
    const amountMenu = [
      breakfastAmount,
      snack1Amount,
      lunchAmount,
      snack2Amount,
      dinnerAmount,
    ];
    const dietMenu = dietCal.dietMenu;

    let myTotalCarbs = 0;
    dialyFoodMenu.map((item, i) => {
      item.map((itx, j) => {
        myTotalCarbs =
          myTotalCarbs + (calc_protein(itx, dietMenu) * amountMenu[i][j]) / 100;
      });
    });
    return myTotalCarbs;
  };
  const weeklyTotalCalcMinerals = (data) => {
    const breakfastFood = data.meal.breakfast;
    const snack1Food = data.meal.snack1;
    const lunchFood = data.meal.lunch;
    const snack2Food = data.meal.snack2;
    const dinnerFood = data.meal.dinner;

    const breakfastAmount = data.amount.breakfast;
    const snack1Amount = data.amount.snack1;
    const lunchAmount = data.amount.lunch;
    const snack2Amount = data.amount.snack2;
    const dinnerAmount = data.amount.dinner;

    const dialyFoodMenu = [
      breakfastFood,
      snack1Food,
      lunchFood,
      snack2Food,
      dinnerFood,
    ];
    const amountMenu = [
      breakfastAmount,
      snack1Amount,
      lunchAmount,
      snack2Amount,
      dinnerAmount,
    ];
    const dietMenu = dietCal.dietMenu;

    let myTotalCarbs = 0;
    dialyFoodMenu.map((item, i) => {
      item.map((itx, j) => {
        myTotalCarbs =
          myTotalCarbs + (calc_mineral(itx, dietMenu) * amountMenu[i][j]) / 100;
      });
    });
    return myTotalCarbs;
  };
  const today = new Date();
  const dayOfWeek = today.getDay();
  const year = [];
  const month = [];
  const date = [];

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date();
    const futureDate = new Date(
      currentDate.setDate(currentDate.getDate() - dayOfWeek + i)
    );
    year.push(futureDate.getFullYear());
    month.push(futureDate.getMonth() + 1);
    date.push(futureDate.getDate() + 1);
  }

  // useEffect(() => {
  //   if (dietCal === null) {
  //     return;
  //   }

  //   setDailyTotalKcal(calc_DailyTotalKcal(dietCal));

  //   const header = {
  //     email: localStorage.getItem("fitnessemail"),
  //     password: localStorage.getItem("fitnesspassword"),
  //   };
  //   const updateData = {
  //     year: year,
  //     month: month,
  //     date: date,
  //   };
  //   let weeklytotalcal = 0;

  //   api
  //     .get("/diet/getweeklytotaldata", {
  //       params: { header: header, updateData: updateData },
  //     })
  //     .then((res) => {
  //       res.data.result.map((item, i) => {
  //         weeklytotalcal = weeklytotalcal + weeklyTotalCalcKcal(item._id);
  //       });
  //       setWeeklyTotalKcal(weeklytotalcal);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, [updateWeeklySignal, dietCal]);
  useEffect(() => {
    if (dietCal === null) {
      return;
    }
    setDailyTotalKcal(parseInt(calc_DailyTotalKcal(dietCal)));
    setDailyTotalCarbs(parseInt(calc_DailyTotalCarbs(dietCal)));
    setDailyTotalProteins(parseInt(calc_DailyTotalProteins(dietCal)));
    setDailyTotalMinerals(parseInt(calc_DailyTotalMinerals(dietCal)));

    const { startDate, endDate } = getWeekStartAndEnd();
    let weeklytotalcal = 0;
    let weeklytotalcarbs = 0;
    let weeklytotalproteins = 0;
    let weeklytotalminerals = 0;

    api
      .get("/diet/getWeeklyTotalStats", {
        params: { startDate, endDate, userId },
      })
      .then((res) => {
        if (res.data.message === "success") {
          res.data.result.map((item) => {
            weeklytotalcal = weeklytotalcal + weeklyTotalCalcKcal(item);
            weeklytotalcarbs = weeklytotalcarbs + weeklyTotalCalcCarbs(item);
            weeklytotalproteins =
              weeklytotalproteins + weeklyTotalCalcProteins(item);
            weeklytotalminerals =
              weeklytotalminerals + weeklyTotalCalcMinerals(item);
          });
          setWeeklyTotalKcal(parseInt(weeklytotalcal));
          // setTargetKcal(parseInt(weeklytotalcal));
          setWeeklyTotalCarbs(parseInt(weeklytotalcarbs));
          setWeeklyTotalProteins(parseInt(weeklytotalproteins));
          setWeeklyTotalMinerals(parseInt(weeklytotalminerals));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [updateWeeklySignal, dietCal]);
  return (
    <>
      <DietStats
        weeklyTotalKcal={weeklyTotalKcal}
        dailyTotalKcal={dailyTotalKcal}
        weeklyTotalConsumedKcal={weeklyTotalKcal}
        weeklyTotalCarbs={weeklyTotalCarbs}
        dailyTotalCarbs={dailyTotalCarbs}
        weeklyTotalConsumedCarbs={weeklyTotalCarbs}
        weeklyTotalProteins={weeklyTotalProteins}
        dailyTotalProteins={dailyTotalProteins}
        weeklyTotalConsumedProteins={weeklyTotalProteins}
        weeklyTotalMinerals={weeklyTotalMinerals}
        dailyTotalMinerals={dailyTotalMinerals}
        weeklyTotalConsumedMinerals={weeklyTotalMinerals}
      />
      {/* <div
        className=" flex flex-col justify-between w-[100%] h-[20%]
                        min-[300px]:h-[40%]
                        min-[720px]:h-[40%]
                        min-[1000px]:flex-row min-[1000px]:h-[18%]
                        min-[1500px]:h-[18%]" */}
      {/* <DietGoalEdit
          imgsrc="karory.png"
          title="Diet Goal (Kcal)"
          content="Calorie Counting"
          targetKcal={weeklyTotalKcal}
          setTargetKcal={setTargetKcal}
        />
        <DietGoalPlan
          imgsrc="sumcarory.png"
          title="Weekly Total Calory"
          content={String(parseInt(weeklyTotalKcal)) + " kcal"}
        />
        <DietGoalPlan
          imgsrc="sum.png"
          title="Carory Comsumed Today"
          content={String(parseInt(dailyTotalKcal)) + " kcal"}
        /> */}
      {/* </div> */}
      {/* <div className="flex flex-col justify-center mt-4 items-center w-[100%] h-[5px]  bg-red-300">
        <Progress
          className="w-[100%]"
          barClassName="my-progress"
          value={(parseInt(weeklyTotalKcal) / targetKcal) * 100}
        />
      </div> */}
    </>
  );
}

export default DietGoal;

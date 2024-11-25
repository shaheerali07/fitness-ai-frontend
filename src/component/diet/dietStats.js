const KcalCard = ({ goal, title, todayConsumed, weeklyConsumed, icon }) => {
  return (
    <div className="border rounded-lg shadow-md p-3 bg-white">
      <div className="flex items-center justify-between px-2 bg-[#F1EEF6] py-2 rounded-md">
        <h3 className="text-lg font-semibold text-gray-700 m-0">{title}</h3>
        <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">
          <img src={icon} alt="icon" className="h-4 w-4" />
        </div>
      </div>
      <ul className="mt-4 mb-0 text-gray-600 p-0">
        <li className="flex items-center space-x-2">
          <span className="w-7 h-7  flex items-center justify-center bg-[#F1EEF6] rounded">
            <img src="target 1.png" alt="icon" className="h-4 w-4" />
          </span>
          <span className="text-[14px] font-[500]">Goal: {goal}</span>
        </li>
        <li className="flex items-center space-x-2 mt-2">
          <span className="w-7 h-7 flex items-center justify-center bg-[#F1EEF6] rounded">
            <img src="date 1.png" alt="icon" className="h-4 w-4" />
          </span>
          <span className="text-[14px] font-[500]">
            Today Consumed: {todayConsumed}
          </span>
        </li>
        <li className="flex items-center space-x-2 mt-2">
          <span className="w-7 h-7 flex items-center justify-center bg-[#F1EEF6] rounded">
            <img src="7-days 1.png" alt="icon" className="h-4 w-4" />
          </span>
          <span className="text-[14px] font-[500]">
            Weekly Consumed: {weeklyConsumed}
          </span>
        </li>
      </ul>
    </div>
  );
};

const DietStats = ({
  weeklyTotalKcal = 0,
  dailyTotalKcal = 0,
  weeklyTotalConsumedKcal = 0,
  weeklyTotalCarbs = 0,
  dailyTotalCarbs = 0,
  weeklyTotalConsumedCarbs = 0,
  weeklyTotalProteins = 0,
  dailyTotalProteins = 0,
  weeklyTotalConsumedProteins = 0,
  weeklyTotalMinerals = 0,
  dailyTotalMinerals = 0,
  weeklyTotalConsumedMinerals = 0,
}) => {
  const cards = [
    {
      goal: weeklyTotalKcal || 0,
      todayConsumed: dailyTotalKcal || 0,
      weeklyConsumed: weeklyTotalConsumedKcal || 0,
      icon: "mineral.png",
      title: "Kcal",
    },
    {
      goal: weeklyTotalCarbs || 0,
      todayConsumed: dailyTotalCarbs || 0,
      weeklyConsumed: weeklyTotalConsumedCarbs || 0,
      icon: "carbs.png",
      title: "Carbs",
    },
    {
      goal: weeklyTotalProteins || 0,
      todayConsumed: dailyTotalProteins || 0,
      weeklyConsumed: weeklyTotalConsumedProteins || 0,
      icon: "proteins.png",
      title: "Protein",
    },

    {
      goal: weeklyTotalMinerals || 0,
      todayConsumed: dailyTotalMinerals || 0,
      weeklyConsumed: weeklyTotalConsumedMinerals || 0,
      icon: "water 1.png",
      title: "Minerals",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <KcalCard
          key={index}
          index={index}
          goal={card.goal}
          todayConsumed={card.todayConsumed}
          weeklyConsumed={card.weeklyConsumed}
          icon={card.icon}
          title={card.title}
        />
      ))}
    </div>
  );
};

export default DietStats;

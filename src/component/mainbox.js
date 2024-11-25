import { useContext, useEffect, useState } from "react";
import { ExerciseContext } from "../store/state.provider.js";
import Analytics from "./analytics/analytics.js";
import Diet from "./diet/diet.js";
import FitnessAIChatbot from "./fitness_ai/fitnessAI.js";
import FitnessAnalytics from "./fitnessanalytics/fitnessanalytics.js";
import Header from "./header.js";
import OverView from "./overview/overview.js";
import Support from "./support/support.js";
function MainBox({
  mainContent,
  setMainContent,
  setShowModal,
  setShowChangePasswordModal,
  userDetails,
}) {
  const { refetch } = useContext(ExerciseContext);
  const [headerContent, setHeaderContent] = useState({
    email: "",
    password: "",
  });
  const [sideBarIndex, setSideBarIndex] = useState(0);
  const spaceTag = <></>;
  useEffect(() => {
    setSideBarIndex(mainContent.sideBar);
  }, [mainContent.sideBar]);

  useEffect(() => {
    if (sideBarIndex === 0) {
      const newData = {
        sideBar: 0,
      };
      setMainContent(newData);
    }
    if (sideBarIndex > 0) {
      refetch();
    }
  }, [sideBarIndex]);

  const setSideBarState = () => {
    if (!mainContent.showSideBar) {
      return;
    }
    const newData = {
      ...mainContent,
      showSideBar: !mainContent.showSideBar,
    };
    setMainContent(newData);
  };

  return (
    <div
      className="w-[100%] xl:w-[100%] h-[full] xl:px-5"
      onMouseDown={setSideBarState}
    >
      <Header
        sideBarIndex={sideBarIndex}
        headerContent={headerContent}
        setHeaderContent={setHeaderContent}
        setSideBarIndex={setSideBarIndex}
        setShowModal={setShowModal}
        setShowChangePasswordModal={setShowChangePasswordModal}
        userDetails={userDetails}
      />

      {sideBarIndex === 0 ? <OverView /> : spaceTag}
      {sideBarIndex === 1 ? <FitnessAIChatbot /> : spaceTag}
      {sideBarIndex === 2 ? <FitnessAnalytics /> : spaceTag}
      {sideBarIndex === 3 ? <Diet /> : spaceTag}
      {sideBarIndex === 4 ? <Analytics /> : spaceTag}
      {sideBarIndex === 5 ? <Support /> : spaceTag}
    </div>
  );
}

export default MainBox;

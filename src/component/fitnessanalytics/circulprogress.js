import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import * as React from "react";

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        {...props}
        size={120}
        thickness={4}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          className="!text-2xl"
          color="text.secondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

export default function CircularWithValueLabel() {
  const [progress, setProgress] = React.useState(0);

  // React.useEffect(() => {
  //   const fetchCompletedPercentage = async () => {
  //     try {
  //       const { startDate, endDate } = getWeekStartAndEnd();

  //       const { data } = await api.get(
  //         "/exercise/getCompletedExercisePercentage",
  //         {
  //           params: {
  //             startDate,
  //             endDate,
  //           },
  //         }
  //       );
  //       if (data && data.overallCompletionPercentage) {
  //         setProgress(
  //           isNaN(data.overallCompletionPercentage)
  //             ? 0
  //             : parseInt(data.overallCompletionPercentage)
  //         );
  //       } else {
  //         console.log("Error fetching completed percentage");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching exercise stats:", error);
  //     }
  //   };
  //   fetchCompletedPercentage();
  // }, []);

  return <CircularProgressWithLabel value={progress} />;
}

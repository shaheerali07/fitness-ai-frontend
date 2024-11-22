import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { ExerciseContext } from "../../store/state.provider";

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        {...props}
        size={120}
        thickness={4}
        sx={{
          color: "#a85cf9",
        }}
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
  const { progress } = React.useContext(ExerciseContext);

  return <CircularProgressWithLabel value={progress} />;
}

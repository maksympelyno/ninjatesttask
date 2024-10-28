import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import shield from "../../assets/shield.png";

export const AnimatedButton = styled(Button)(() => ({
  position: "relative",
  color: "#fff",
  backgroundColor: "transparent",
  border: "2px solid rgba(255, 255, 255, 0.5)",
  fontWeight: "bold",
  overflow: "hidden",
  transition: "background-color 0.3s ease",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "-100%",
    left: "50%",
    width: "60px", // Size of the falling image
    height: "60px",
    backgroundImage: `url(${shield})`,
    backgroundSize: "cover",
    transform: "translateX(-50%)",
    animation: "falling-animation 1s ease forwards",
  },
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  "&:hover::before": {
    animation: "falling-animation 1s ease forwards", // Trigger animation on hover
  },
  "@keyframes falling-animation": {
    "0%": {
      top: "-100%", // Start above the button
      opacity: 1,
    },
    "100%": {
      top: "100%", // End below the button
      opacity: 0,
    },
  },
}));

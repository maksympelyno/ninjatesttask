import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

export const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "red",
    },
    "&:hover fieldset": {
      borderColor: "darkred",
    },
    "&.Mui-focused fieldset": {
      borderColor: "red",
    },
  },
  input: {
    color: "#fff",
  },
  label: {
    color: "#fff",
  },
});

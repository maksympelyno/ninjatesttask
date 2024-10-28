import React from "react";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface PaginationProps {
  onNext: () => void;
  onPrev: () => void;
}

const Pagination: React.FC<PaginationProps> = ({ onNext, onPrev }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
      <IconButton onClick={onPrev} color="inherit">
        <ArrowBackIcon />
      </IconButton>
      <IconButton onClick={onNext} color="inherit">
        <ArrowForwardIcon />
      </IconButton>
    </div>
  );
};

export default Pagination;

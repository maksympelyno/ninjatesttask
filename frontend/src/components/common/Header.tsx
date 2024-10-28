import React from "react";
import { AppBar, IconButton, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/`);
  };
  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#00000b", height: "60px", borderBottom: "2px solid rgba(255, 255, 255, 0.5)" }}
    >
      <Toolbar>
        <IconButton onClick={handleClick} sx={{ margin: "auto" }}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Marvel_Logo.svg"
            alt="Marvel Heroes Header"
            style={{ maxHeight: "50px", display: "block" }}
          />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

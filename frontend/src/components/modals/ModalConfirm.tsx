import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import deadpool from "../../assets/deadpool_shock.png";

interface ModalConfirmProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ModalConfirm: React.FC<ModalConfirmProps> = ({ open, onClose, onConfirm }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxWidth: 300,
          bgcolor: "#222",
          border: "2px solid #f00",
          boxShadow: 24,
          p: 4,
          color: "#f00",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" align="center">
          Ви впевнені, що хочете видалити?
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
          <Button variant="outlined" onClick={onConfirm} sx={{ color: "#f00", borderColor: "#f00", marginRight: 1 }}>
            Так
          </Button>
          <Button variant="outlined" onClick={onClose} sx={{ color: "#f00", borderColor: "#f00" }}>
            Ні
          </Button>
        </Box>
        <Box
          component="img"
          src={deadpool}
          alt="Deadpool"
          sx={{
            maxWidth: "25%",
            position: "absolute",
            bottom: 0,
            left: 0,
            borderRadius: "4px",
          }}
        />
      </Box>
    </Modal>
  );
};

export default ModalConfirm;

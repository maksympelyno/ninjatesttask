import React, { useState } from "react";
import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import { PhotoCamera, Delete } from "@mui/icons-material";
import { StyledTextField } from "../styledComponents/StyledTextField";
import { createCharacter } from "../../services/character.service";
import { CharacterCreateData } from "../../types/character.interface";

interface ModalCreateProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

const ModalCreate: React.FC<ModalCreateProps> = ({ open, onClose, onSave }) => {
  const [nickname, setNickname] = useState<string>("");
  const [realName, setRealName] = useState<string>("");
  const [originDescription, setOriginDescription] = useState<string>("");
  const [superpowers, setSuperpowers] = useState<string>("");
  const [catchPhrase, setCatchPhrase] = useState<string>("");
  const [images, setImages] = useState<(File | null)[]>(Array(5).fill(null));
  const [uploading, setUploading] = useState<boolean>(false);

  const handleImageChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = file;
      setImages(newImages);
    }
  };

  const handleDeleteImage = (index: number) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  const handleSave = async () => {
    setUploading(true);
    try {
      const files = images.filter((file): file is File => file !== null);
      const data: CharacterCreateData = {
        nickname,
        realName,
        originDescription,
        superpowers,
        catchPhrase,
        files,
      };

      await createCharacter(data);
      onSave();
      onClose();
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          backgroundColor: "#000",
          color: "#fff",
          padding: 3,
          borderRadius: 2,
          width: "90%",
          maxWidth: 600,
          maxHeight: "80%",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          boxShadow: 24,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Create New Character
        </Typography>
        <StyledTextField
          fullWidth
          label="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <StyledTextField
          fullWidth
          label="Real Name"
          value={realName}
          onChange={(e) => setRealName(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <StyledTextField
          fullWidth
          label="Origin Description"
          value={originDescription}
          onChange={(e) => setOriginDescription(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <StyledTextField
          fullWidth
          label="Superpowers"
          value={superpowers}
          onChange={(e) => setSuperpowers(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <StyledTextField
          fullWidth
          label="Catchphrase"
          value={catchPhrase}
          onChange={(e) => setCatchPhrase(e.target.value)}
          sx={{ marginBottom: 2 }}
        />

        {Array.from({ length: 5 }, (_, index) => (
          <Box key={index} sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
            {images[index] ? (
              <>
                <img
                  src={URL.createObjectURL(images[index])}
                  alt={`Image ${index + 1}`}
                  style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4, marginRight: 2 }}
                />
                <IconButton onClick={() => handleDeleteImage(index)} sx={{ color: "#f00" }}>
                  <Delete />
                </IconButton>
              </>
            ) : (
              <IconButton component="label" color="primary">
                <PhotoCamera />
                <input type="file" hidden accept="image/*" onChange={(event) => handleImageChange(index, event)} />
              </IconButton>
            )}
            <Typography variant="body2" sx={{ color: "#fff" }}>
              {images[index] ? "" : "Add Photo"}
            </Typography>
          </Box>
        ))}

        <Button
          variant="outlined"
          onClick={handleSave}
          disabled={uploading}
          sx={{ color: "#fff", borderColor: "#f00" }}
        >
          {uploading ? "Uploading..." : "Create"}
        </Button>
      </Box>
    </Modal>
  );
};

export default ModalCreate;

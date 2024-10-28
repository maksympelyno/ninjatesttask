import React, { useState } from "react";
import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import { PhotoCamera, Delete } from "@mui/icons-material";
import { StyledTextField } from "../styledComponents/StyledTextField";
import { updateCharacter } from "../../services/character.service";
import { CharacterUpdateData } from "../../types/character.interface";

interface ModalEditProps {
  open: boolean;
  id: number;
  onClose: () => void;
  nickname: string | undefined;
  realName: string;
  originDescription: string;
  superpowers: string;
  catchPhrase: string;
  images: string[];
  onSave: (editedData: any) => void;
}

const ModalEdit: React.FC<ModalEditProps> = ({
  open,
  id,
  onClose,
  nickname,
  realName,
  originDescription,
  superpowers,
  catchPhrase,
  images,
  onSave,
}) => {
  const [editedNickname, setEditedNickname] = useState(nickname);
  const [editedRealName, setEditedRealName] = useState(realName);
  const [editedOriginDescription, setEditedOriginDescription] = useState(originDescription);
  const [editedSuperpowers, setEditedSuperpowers] = useState(superpowers);
  const [editedCatchPhrase, setEditedCatchPhrase] = useState(catchPhrase);
  const [newImages, setNewImages] = useState<(File | null)[]>(Array(5).fill(null)); // Store new image files
  const [existingImages, setExistingImages] = useState(images); // State for existing images
  const [previewImages, setPreviewImages] = useState<string[]>(images); // Preview URLs for UI

  const handleImageChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newImagesState = [...newImages];
      newImagesState[index] = file;

      const previewImagesState = [...previewImages];
      previewImagesState[index] = URL.createObjectURL(file);
      setNewImages(newImagesState);
      setPreviewImages(previewImagesState);
    }
  };

  const handleDeleteImage = (index: number) => {
    const updatedExistingImages = [...existingImages];
    const updatedPreviewImages = [...previewImages];

    updatedExistingImages[index] = "";
    updatedPreviewImages[index] = "";
    setExistingImages(updatedExistingImages);
    setPreviewImages(updatedPreviewImages);

    const newImagesState = [...newImages];
    newImagesState[index] = null;
    setNewImages(newImagesState);
  };

  const handleSave = async () => {
    try {
      const files = newImages.filter((file): file is File => file !== null);
      const data: CharacterUpdateData = {
        nickname: editedNickname || "",
        real_name: editedRealName || "",
        origin_description: editedOriginDescription || "",
        superpowers: editedSuperpowers || "",
        catch_phrase: editedCatchPhrase || "",
        newImages: files,
        images: existingImages,
      };

      const updatedData = await updateCharacter(id, data);
      onSave(updatedData);
      onClose();
    } catch (error) {
      console.error("Upload error:", error);
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
          Edit Character
        </Typography>
        <StyledTextField
          fullWidth
          label="Nickname"
          value={editedNickname}
          onChange={(e) => setEditedNickname(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <StyledTextField
          fullWidth
          label="Real Name"
          value={editedRealName}
          onChange={(e) => setEditedRealName(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <StyledTextField
          fullWidth
          label="Origin Description"
          value={editedOriginDescription}
          onChange={(e) => setEditedOriginDescription(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <StyledTextField
          fullWidth
          label="Superpowers"
          value={editedSuperpowers}
          onChange={(e) => setEditedSuperpowers(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <StyledTextField
          fullWidth
          label="Catchphrase"
          value={editedCatchPhrase}
          onChange={(e) => setEditedCatchPhrase(e.target.value)}
          sx={{ marginBottom: 2 }}
        />

        {/* Image editing fields */}
        {Array.from({ length: 5 }, (_, index) => (
          <Box key={index} sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
            {previewImages[index] ? (
              <>
                <img
                  src={previewImages[index]}
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
              {previewImages[index] ? "" : "Add Photo"}
            </Typography>
          </Box>
        ))}

        <Button variant="outlined" onClick={handleSave} sx={{ color: "#fff", borderColor: "#f00" }}>
          Save
        </Button>
      </Box>
    </Modal>
  );
};

export default ModalEdit;

import React, { useState, useEffect } from "react";
import { Typography, Box, Card, CardMedia, Grid, Button, useMediaQuery, useTheme } from "@mui/material";
import ModalConfirm from "./modals/ModalConfirm";
import ModalEdit from "./modals/ModalEdit";
import { useNavigate, useParams } from "react-router-dom";
import { deleteCharacterData, fetchCharacterData } from "../services/character.service";
import { CharacterData } from "../types/character.interface";
import { fetchSuperheroes } from "../store/slices/superheroesSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";

const CharacterDetails: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { nickname } = useParams<string>();
  const [characterData, setCharacterData] = useState<CharacterData | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);

  useEffect(() => {
    const getCharacterData = async () => {
      if (nickname) {
        try {
          const data = await fetchCharacterData(nickname);
          setCharacterData(data);
        } catch (error) {
          console.error("Failed to fetch character data", error);
        }
      }
    };
    getCharacterData();
  }, [nickname]);

  const handleConfirmDelete = async () => {
    if (characterData && characterData.id) {
      try {
        await deleteCharacterData(characterData.id);
        setOpenModal(false);
        dispatch(fetchSuperheroes(1));
        navigate("/");
      } catch (error) {
        console.error("Failed to delete character", error);
      }
    }
  };

  const handleDeleteClick = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const handleEditClick = () => setOpenEditModal(true);
  const handleCloseModalEdit = () => setOpenEditModal(false);
  const handleSaveEdit = (updatedData: any) => {
    if (updatedData.nickname) {
      setCharacterData(updatedData);
      navigate(`/character/${updatedData.nickname}`);
    }
    setOpenEditModal(false);
  };
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  if (!characterData) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ backgroundColor: "#000", color: "#f00", minHeight: "100vh", padding: "20px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          marginBottom: "20px",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#ff3333", flexGrow: 1, textAlign: "center" }}>
          {characterData.nickname}
        </Typography>
        {!isSmallScreen && (
          <Box sx={{ position: "absolute", right: 0, display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              onClick={handleEditClick}
              sx={{
                color: "#f00",
                borderColor: "#f00",
                "&:hover": { backgroundColor: "rgba(255, 0, 0, 0.1)", borderColor: "#f00" },
              }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              onClick={handleDeleteClick}
              sx={{ color: "#f00", borderColor: "#f00", "&:hover": { backgroundColor: "#f00", color: "#fff" } }}
            >
              Delete
            </Button>
          </Box>
        )}
      </Box>

      <Box sx={{ display: "flex", color: "white", flexDirection: "column", alignItems: "center" }}>
        <Typography variant="h6" gutterBottom>
          Real Name: {characterData.real_name}
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: "800px", textAlign: "center" }}>
          <strong>Origin:</strong> {characterData.origin_description}
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: "800px", textAlign: "center" }}>
          <strong>Superpowers:</strong> {characterData.superpowers}
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ maxWidth: "800px", textAlign: "center", fontStyle: "italic" }}>
          "{characterData.catch_phrase}"
        </Typography>
      </Box>

      <Box sx={{ marginTop: "20px", color: "white" }}>
        <Typography variant="h6" gutterBottom align="center">
          Images:
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {characterData.images.map((image: string, index: number) => (
            <Grid item key={index}>
              <Card
                sx={{
                  maxWidth: "100%",
                  backgroundColor: "#333",
                  color: "#f00",
                  border: "2px solid #f00",
                  "&:hover": { transform: "scale(1.05)", transition: "transform 0.3s ease-in-out" },
                }}
              >
                <CardMedia
                  component="img"
                  image={image}
                  alt={`${characterData.nickname} ${index}`}
                  sx={{ objectFit: "contain", maxHeight: 200, width: "auto" }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>

        {isSmallScreen && (
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1, marginTop: 2 }}>
            <Button
              variant="outlined"
              onClick={handleEditClick}
              sx={{
                color: "#f00",
                borderColor: "#f00",
                "&:hover": { backgroundColor: "rgba(255, 0, 0, 0.1)", borderColor: "#f00" },
              }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              onClick={handleDeleteClick}
              sx={{ color: "#f00", borderColor: "#f00", "&:hover": { backgroundColor: "#f00", color: "#fff" } }}
            >
              Delete
            </Button>
          </Box>
        )}
      </Box>

      <ModalConfirm open={openModal} onClose={handleCloseModal} onConfirm={handleConfirmDelete} />
      <ModalEdit
        open={openEditModal}
        onClose={handleCloseModalEdit}
        id={characterData.id}
        nickname={characterData.nickname}
        realName={characterData.real_name}
        originDescription={characterData.origin_description}
        superpowers={characterData.superpowers}
        catchPhrase={characterData.catch_phrase}
        images={characterData.images}
        onSave={handleSaveEdit}
      />
    </Box>
  );
};

export default CharacterDetails;

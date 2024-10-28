import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Grid } from "@mui/material";
import {
  fetchSuperheroes,
  setCurrentPage,
  selectCurrentPage,
  selectBackendPage,
  selectSuperheroes,
} from "../store/slices/superheroesSlice";
import CharacterBlock from "./CharacterBlock";
import Pagination from "./common/Pagination";
import ModalCreate from "./modals/ModalCreate";
import { AppDispatch, RootState } from "../store/store";
import { AnimatedButton } from "./styledComponents/AnimatedButton";

const CharacterList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentPage: number = useSelector((state: RootState) => selectCurrentPage(state));
  const backendPage: number = useSelector((state: RootState) => selectBackendPage(state));
  const characters = useSelector((state: RootState) => selectSuperheroes(state));
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchSuperheroes(backendPage));
  }, [backendPage, isAddModalOpen]);

  const handleNext = () => {
    if (currentPage % 4 <= Math.ceil(characters.length / 5)) {
      dispatch(setCurrentPage(currentPage + 1));
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      dispatch(setCurrentPage(currentPage - 1));
    }
  };

  const onCreateSuperHero = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
  };

  const handleSaveSuperHero = () => {
    setIsAddModalOpen(false);
  };

  const localPageIndex = (currentPage - 1) % 4;

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
      }}
    >
      <AnimatedButton onClick={onCreateSuperHero} sx={{ marginBottom: 3 }}>
        Create SuperHero
      </AnimatedButton>

      <Grid container justifyContent="center" spacing={2}>
        {characters.slice(localPageIndex * 5, localPageIndex * 5 + 5).map((character) => (
          <Grid item key={character.id} xs={12} sm={6} md={4} lg={2}>
            <CharacterBlock nickname={character.nickname} image={character.image} />
          </Grid>
        ))}
      </Grid>

      <Pagination onNext={handleNext} onPrev={handlePrev} />
      <ModalCreate open={isAddModalOpen} onClose={handleCloseModal} onSave={handleSaveSuperHero} />
    </Container>
  );
};

export default CharacterList;

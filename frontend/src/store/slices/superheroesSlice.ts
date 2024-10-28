import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

type Status = "idle" | "loading" | "succeeded" | "failed";

interface Superhero {
  id: number;
  nickname: string;
  image: string;
}

interface SuperheroState {
  items: Superhero[];
  status: Status;
  error: string | null;
  currentPage: number;
  backendPage: number;
  totalPages: number;
}

const initialState: SuperheroState = {
  items: [],
  status: "idle",
  error: null,
  currentPage: 1,
  backendPage: 1,
  totalPages: 0,
};

export const fetchSuperheroes = createAsyncThunk(
  "superheroes/fetchSuperheroes",
  async (backendPage: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:3000/superheroes?page=${backendPage}`);
      return {
        heroes: response.data.heroes,
        totalPages: response.data.totalPages,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch superheroes");
    }
  }
);

const superheroesSlice = createSlice({
  name: "superheroes",
  initialState,
  reducers: {
    setCurrentPage(state, action: PayloadAction<number>) {
      const newPage = action.payload;
      state.currentPage = newPage;

      let newBackendPage = Math.floor(newPage / 4) + 1;
      if (newPage % 4 == 0) {
        newBackendPage = Math.floor(newPage / 4);
      }
      if (newBackendPage !== state.backendPage) {
        state.backendPage = newBackendPage;
      }
    },
    resetSuperheroes(state) {
      state.items = [];
      state.status = "idle";
      state.error = null;
      state.currentPage = 1;
      state.backendPage = 1;
      state.totalPages = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuperheroes.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchSuperheroes.fulfilled,
        (state, action: PayloadAction<{ heroes: Superhero[]; totalPages: number }>) => {
          state.status = "succeeded";
          state.items = action.payload.heroes;
          state.totalPages = action.payload.totalPages;
          console.log("Total pages", state.totalPages);
        }
      )
      .addCase(fetchSuperheroes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentPage, resetSuperheroes } = superheroesSlice.actions;

export const selectCurrentPage = (state: { superheroes: SuperheroState }) => state.superheroes.currentPage;
export const selectBackendPage = (state: { superheroes: SuperheroState }) => state.superheroes.backendPage;
export const selectTotalPages = (state: { superheroes: SuperheroState }) => state.superheroes.totalPages;
export const selectSuperheroes = (state: { superheroes: SuperheroState }) => state.superheroes.items;
export const selectSuperheroesStatus = (state: { superheroes: SuperheroState }) => state.superheroes.status;
export const selectSuperheroesError = (state: { superheroes: SuperheroState }) => state.superheroes.error;

export default superheroesSlice.reducer;

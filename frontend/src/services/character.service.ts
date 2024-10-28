import axios from "axios";
import { CharacterCreateData, CharacterData, CharacterUpdateData } from "../types/character.interface";

export const fetchCharacterData = async (nickname: string): Promise<CharacterData> => {
  try {
    const response = await axios.get<CharacterData>(`http://localhost:3000/superheroes/${nickname}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching character data:", error);
    throw error;
  }
};

export const deleteCharacterData = async (id: number): Promise<void> => {
  try {
    await axios.delete(`http://localhost:3000/superheroes/${id}`);
  } catch (error) {
    console.error("Error deleting character:", error);
    throw error;
  }
};

export const createCharacter = async (data: CharacterCreateData) => {
  const formData = new FormData();
  formData.append("nickname", data.nickname);
  formData.append("real_name", data.realName);
  formData.append("origin_description", data.originDescription);
  formData.append("superpowers", data.superpowers);
  formData.append("catch_phrase", data.catchPhrase);

  data.files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await axios.post<CharacterCreateData>("http://localhost:3000/superheroes", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateCharacter = async (id: number, data: CharacterUpdateData) => {
  const formData = new FormData();
  formData.append("nickname", data.nickname);
  formData.append("real_name", data.real_name);
  formData.append("origin_description", data.origin_description);
  formData.append("superpowers", data.superpowers);
  formData.append("catch_phrase", data.catch_phrase);

  data.images.forEach((img) => {
    if (img) {
      formData.append("newImages", img);
    }
  });

  data.newImages.forEach((file) => {
    formData.append("files", file);
  });

  const response = await axios.patch(`http://localhost:3000/superheroes/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

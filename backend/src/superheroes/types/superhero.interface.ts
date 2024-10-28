export interface SuperheroInterface {
  id: number;
  nickname: string;
  real_name: string;
  origin_description: string;
  superpowers: string;
  catch_phrase: string;
  images: string[];
}

export interface SuperheroBriefInterface {
  id: number;
  nickname: string;
  image: string | null;
}

export interface SuperheroResponse {
  totalPages: number;
  heroes: SuperheroBriefInterface[];
}

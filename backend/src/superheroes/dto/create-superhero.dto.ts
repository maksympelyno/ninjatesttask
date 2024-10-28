import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSuperheroDto {
  @IsNotEmpty()
  @IsString()
  nickname: string;

  @IsNotEmpty()
  @IsString()
  real_name: string;

  @IsNotEmpty()
  @IsString()
  origin_description: string;

  @IsNotEmpty()
  @IsString()
  superpowers: string;

  @IsNotEmpty()
  @IsString()
  catch_phrase: string;
}

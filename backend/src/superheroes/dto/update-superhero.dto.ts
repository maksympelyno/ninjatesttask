import { PartialType } from '@nestjs/mapped-types';
import { CreateSuperheroDto } from './create-superhero.dto';
import { IsOptional } from 'class-validator';

export class UpdateSuperheroDto extends PartialType(CreateSuperheroDto) {
  @IsOptional()
  newImages: string[];
}

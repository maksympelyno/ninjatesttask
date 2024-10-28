import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

import { CreateSuperheroDto } from './dto/create-superhero.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import {
  SuperheroResponse,
  SuperheroInterface,
} from './types/superhero.interface';
import { UpdateSuperheroDto } from './dto/update-superhero.dto';

@Injectable()
export class SuperheroesService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createSuperhero(
    createSuperheroDto: CreateSuperheroDto,
    files: Express.Multer.File[],
  ): Promise<SuperheroInterface> {
    try {
      const existingHero = await this.databaseService.superhero.findUnique({
        where: { nickname: createSuperheroDto.nickname },
      });

      if (existingHero) {
        throw new ConflictException(
          `Superhero with nickname ${createSuperheroDto.nickname} already exists`,
        );
      }

      let imageUrls: string[] = [];
      if (files && files.length > 0) {
        const images = await this.cloudinaryService.uploadFiles(files);
        imageUrls = images.map((image) => image.secure_url);
      }

      const superhero = await this.databaseService.superhero.create({
        data: {
          nickname: createSuperheroDto.nickname,
          real_name: createSuperheroDto.real_name,
          origin_description: createSuperheroDto.origin_description,
          superpowers: createSuperheroDto.superpowers,
          catch_phrase: createSuperheroDto.catch_phrase,
          images: imageUrls,
        },
      });

      return superhero;
    } catch (error) {
      throw new NotFoundException(
        error.message || 'Failed to create superhero',
      );
    }
  }

  async findAll(page: number = 1): Promise<SuperheroResponse> {
    const limit = 20;
    const offset = (page - 1) * limit;
    const totalHeroes = await this.databaseService.superhero.count();

    const totalPages = Math.ceil(totalHeroes / limit);

    const heroes = await this.databaseService.superhero.findMany({
      skip: offset,
      take: limit,
      select: {
        id: true,
        nickname: true,
        images: true,
      },
    });

    console.log(heroes);
    return {
      totalPages,
      heroes: heroes.map((hero) => ({
        id: hero.id,
        nickname: hero.nickname,
        image: hero.images[0] || null,
      })),
    };
  }

  async findOne(nickname: string): Promise<SuperheroInterface> {
    const hero = await this.databaseService.superhero.findUnique({
      where: { nickname },
    });

    if (!hero) {
      throw new NotFoundException(
        `Superhero with nickname #${nickname} not found`,
      );
    }

    return hero;
  }

  async update(
    id: number,
    updateSuperheroDto: UpdateSuperheroDto,
    files: Express.Multer.File[],
  ) {
    const existingHero = await this.databaseService.superhero.findUnique({
      where: { id },
    });

    if (!existingHero) {
      throw new NotFoundException(`Superhero with id #${id} not found`);
    }

    if (typeof updateSuperheroDto.newImages == 'string') {
      updateSuperheroDto.newImages = [updateSuperheroDto.newImages];
    }

    const oldImagesFromClient = updateSuperheroDto.newImages || [];

    delete updateSuperheroDto.newImages;

    let newImageUrls: string[] = [];

    if (files && files.length > 0) {
      const uploadedImages = await this.cloudinaryService.uploadFiles(files);
      newImageUrls = uploadedImages.map((image) => image.secure_url);
    }

    const updatedImages = [...oldImagesFromClient, ...newImageUrls];

    const updatedHero = await this.databaseService.superhero.update({
      where: { id },
      data: {
        ...updateSuperheroDto,
        images: updatedImages,
      },
    });

    return updatedHero;
  }

  async delete(id: number): Promise<void> {
    const existingHero = await this.databaseService.superhero.findUnique({
      where: { id },
    });

    if (!existingHero) {
      throw new NotFoundException(`Superhero with id #${id} not found`);
    }

    await this.databaseService.superhero.delete({
      where: { id },
    });
  }
}

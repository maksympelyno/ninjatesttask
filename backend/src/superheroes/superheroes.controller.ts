import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Res,
  Query,
} from '@nestjs/common';
import { SuperheroesService } from './superheroes.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CreateSuperheroDto } from './dto/create-superhero.dto';
import { UpdateSuperheroDto } from './dto/update-superhero.dto';

@Controller('superheroes')
export class SuperheroesController {
  constructor(private readonly superheroesService: SuperheroesService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 5, { storage: memoryStorage() }))
  async createSuperhero(
    @Body() createSuperheroDto: CreateSuperheroDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.superheroesService.createSuperhero(createSuperheroDto, files);
  }

  @Get()
  async findAllSuperheroes(@Query('page') page: number) {
    return await this.superheroesService.findAll(page);
  }

  @Get(':nickname')
  async findOneSuperhero(@Param('nickname') nickname: string) {
    return await this.superheroesService.findOne(nickname);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files', 5, { storage: memoryStorage() }))
  async updateSuperhero(
    @Param('id') id: number,
    @Body() updateSuperheroDto: UpdateSuperheroDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return await this.superheroesService.update(+id, updateSuperheroDto, files);
  }

  @Delete(':id')
  async deleteSuperhero(@Param('id') id: string, @Res() res) {
    await this.superheroesService.delete(+id);
    return res
      .status(200)
      .json({ message: `Superhero with id #${id} successfully deleted.` });
  }
}

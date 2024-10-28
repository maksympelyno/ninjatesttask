import { Test, TestingModule } from '@nestjs/testing';
import { SuperheroesController } from './superheroes.controller';
import { SuperheroesService } from './superheroes.service';
import { CreateSuperheroDto } from './dto/create-superhero.dto';
import { UpdateSuperheroDto } from './dto/update-superhero.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('SuperheroesController', () => {
  let controller: SuperheroesController;
  let service: jest.Mocked<SuperheroesService>;

  beforeEach(async () => {
    service = {
      createSuperhero: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<SuperheroesService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuperheroesController],
      providers: [{ provide: SuperheroesService, useValue: service }],
    }).compile();

    controller = module.get<SuperheroesController>(SuperheroesController);
  });

  describe('createSuperhero', () => {
    it('should create a superhero successfully', async () => {
      const createSuperheroDto: CreateSuperheroDto = {
        nickname: 'Superman',
        real_name: 'Clark Kent',
        origin_description: 'Kryptonian',
        superpowers: 'Super strength, flight',
        catch_phrase: 'Up, up, and away!',
      };

      const mockFile = { originalname: 'image.jpg' } as Express.Multer.File;
      const files: Express.Multer.File[] = [mockFile];

      service.createSuperhero.mockResolvedValue({
        ...createSuperheroDto,
        images: ['http://image-url'],
        id: 1,
      });

      const result = await controller.createSuperhero(
        createSuperheroDto,
        files,
      );

      expect(result.nickname).toBe(createSuperheroDto.nickname);
      expect(service.createSuperhero).toHaveBeenCalledWith(
        createSuperheroDto,
        files,
      );
    });

    it('should throw ConflictException if superhero exists', async () => {
      const createSuperheroDto: CreateSuperheroDto = {
        nickname: 'Superman',
        real_name: 'Clark Kent',
        origin_description: 'Kryptonian',
        superpowers: 'Super strength, flight',
        catch_phrase: 'Up, up, and away!',
      };

      const mockFile = { originalname: 'image.jpg' } as Express.Multer.File;
      const files: Express.Multer.File[] = [mockFile];

      service.createSuperhero.mockRejectedValue(new ConflictException());

      await expect(
        controller.createSuperhero(createSuperheroDto, files),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAllSuperheroes', () => {
    it('should return paginated superheroes', async () => {
      const page = 1;
      const mockResponse = {
        totalPages: 2,
        heroes: [{ id: 1, nickname: 'Superman', image: 'http://image-url' }],
      };

      service.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAllSuperheroes(page);

      expect(result).toEqual(mockResponse);
      expect(service.findAll).toHaveBeenCalledWith(page);
    });
  });

  describe('findOneSuperhero', () => {
    it('should return a superhero if found', async () => {
      const nickname = 'Superman';
      const mockHero = {
        id: 1,
        nickname,
        images: [''],
        real_name: ' ',
        origin_description: '',
        superpowers: '',
        catch_phrase: '',
      };

      service.findOne.mockResolvedValue(mockHero);

      const result = await controller.findOneSuperhero(nickname);

      expect(result).toEqual(mockHero);
      expect(service.findOne).toHaveBeenCalledWith(nickname);
    });

    it('should throw NotFoundException if superhero not found', async () => {
      const nickname = 'Superman';
      service.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOneSuperhero(nickname)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateSuperhero', () => {
    it('should throw NotFoundException if superhero not found', async () => {
      const id = 1;
      const updateSuperheroDto: UpdateSuperheroDto = {
        nickname: 'Superman',
        newImages: [''],
      };
      const mockFile = { originalname: 'image.jpg' } as Express.Multer.File;
      const files: Express.Multer.File[] = [mockFile];

      service.update.mockRejectedValue(new NotFoundException());

      await expect(
        controller.updateSuperhero(id, updateSuperheroDto, files),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteSuperhero', () => {
    it('should delete a superhero successfully', async () => {
      const id = '1';

      service.delete.mockResolvedValue(undefined);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.deleteSuperhero(id, res);

      expect(service.delete).toHaveBeenCalledWith(+id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: `Superhero with id #${id} successfully deleted.`,
      });
    });

    it('should throw NotFoundException if superhero not found', async () => {
      const id = '1';
      service.delete.mockRejectedValue(new NotFoundException());

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await expect(controller.deleteSuperhero(id, res)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

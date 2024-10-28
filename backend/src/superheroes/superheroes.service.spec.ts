import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SuperheroesService } from './superheroes.service';
import { DatabaseService } from '../database/database.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateSuperheroDto } from './dto/create-superhero.dto';

const databaseMock = {
  superhero: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
};

const cloudinaryMock = {
  uploadFiles: jest.fn(),
};

describe('SuperheroesService', () => {
  let superheroesService: SuperheroesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuperheroesService,
        {
          provide: DatabaseService,
          useValue: databaseMock,
        },
        {
          provide: CloudinaryService,
          useValue: cloudinaryMock,
        },
      ],
    }).compile();

    superheroesService = module.get<SuperheroesService>(SuperheroesService);

    jest.clearAllMocks(); // Очищаємо всі моки перед кожним тестом
  });

  describe('createSuperhero', () => {
    it('should create a superhero if it does not exist', async () => {
      const createSuperheroDto: CreateSuperheroDto = {
        nickname: 'Hero',
        real_name: 'Real Hero',
        origin_description: 'Origin',
        superpowers: 'Flying',
        catch_phrase: 'I am a hero!',
      };

      const files: Express.Multer.File[] = []; // Приклад файлу
      const uploadResponse = [{ secure_url: 'http://example.com/hero.jpg' }];

      databaseMock.superhero.findUnique.mockResolvedValue(null);
      cloudinaryMock.uploadFiles.mockResolvedValue(uploadResponse);
      databaseMock.superhero.create.mockResolvedValue(createSuperheroDto);

      const result = await superheroesService.createSuperhero(
        createSuperheroDto,
        files,
      );

      expect(result).toEqual(createSuperheroDto);
      expect(databaseMock.superhero.findUnique).toBeCalledWith({
        where: { nickname: createSuperheroDto.nickname },
      });
      expect(databaseMock.superhero.create).toBeCalledWith({
        data: {
          ...createSuperheroDto,
          images: [],
        },
      });
    });

    it('should throw NotFoundException if superhero already exists', async () => {
      const createSuperheroDto: CreateSuperheroDto = {
        nickname: 'Hero',
        real_name: 'Real Hero',
        origin_description: 'Origin',
        superpowers: 'Flying',
        catch_phrase: 'I am a hero!',
      };

      databaseMock.superhero.findUnique.mockResolvedValue(createSuperheroDto);

      await expect(
        superheroesService.createSuperhero(createSuperheroDto, []),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return a paginated list of superheroes', async () => {
      const heroesResponse = [
        { id: 1, nickname: 'Hero1', images: ['http://example.com/hero1.jpg'] },
        { id: 2, nickname: 'Hero2', images: ['http://example.com/hero2.jpg'] },
      ];

      databaseMock.superhero.count.mockResolvedValue(30);
      databaseMock.superhero.findMany.mockResolvedValue(heroesResponse);

      const result = await superheroesService.findAll(1);

      expect(result).toEqual({
        totalPages: 2,
        heroes: [
          { id: 1, nickname: 'Hero1', image: 'http://example.com/hero1.jpg' },
          { id: 2, nickname: 'Hero2', image: 'http://example.com/hero2.jpg' },
        ],
      });
      expect(databaseMock.superhero.count).toBeCalledTimes(1);
      expect(databaseMock.superhero.findMany).toBeCalledWith({
        skip: 0,
        take: 20,
        select: { id: true, nickname: true, images: true },
      });
    });
  });

  describe('findOne', () => {
    it('should return a superhero if found', async () => {
      const existingHero = {
        id: 1,
        nickname: 'Hero',
        images: ['http://example.com/hero.jpg'],
      };
      databaseMock.superhero.findUnique.mockResolvedValue(existingHero);

      const result = await superheroesService.findOne(existingHero.nickname);

      expect(result).toEqual(existingHero);
      expect(databaseMock.superhero.findUnique).toBeCalledWith({
        where: { nickname: existingHero.nickname },
      });
    });

    it('should throw NotFoundException if superhero does not exist', async () => {
      databaseMock.superhero.findUnique.mockResolvedValue(null);

      await expect(
        superheroesService.findOne('non-existing-hero'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete an existing superhero', async () => {
      const existingHero = { id: 1, nickname: 'Hero' };
      databaseMock.superhero.findUnique.mockResolvedValue(existingHero);
      databaseMock.superhero.delete.mockResolvedValue(undefined);

      await superheroesService.delete(existingHero.id);

      expect(databaseMock.superhero.findUnique).toBeCalledWith({
        where: { id: existingHero.id },
      });
      expect(databaseMock.superhero.delete).toBeCalledWith({
        where: { id: existingHero.id },
      });
    });

    it('should throw NotFoundException if superhero does not exist', async () => {
      databaseMock.superhero.findUnique.mockResolvedValue(null);

      await expect(superheroesService.delete(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

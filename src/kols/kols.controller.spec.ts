import { Test, TestingModule } from '@nestjs/testing';
import { KolsController } from './kols.controller';

describe('KolsController', () => {
  let controller: KolsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KolsController],
    }).compile();

    controller = module.get<KolsController>(KolsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

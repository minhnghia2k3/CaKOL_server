import { Test, TestingModule } from '@nestjs/testing';
import { KolsService } from './kols.service';

describe('KolsService', () => {
  let service: KolsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KolsService],
    }).compile();

    service = module.get<KolsService>(KolsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

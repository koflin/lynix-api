import { Test, TestingModule } from '@nestjs/testing';
import { ProductTemplatesService } from './product-templates.service';

describe('ProductTemplatesService', () => {
  let service: ProductTemplatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductTemplatesService],
    }).compile();

    service = module.get<ProductTemplatesService>(ProductTemplatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

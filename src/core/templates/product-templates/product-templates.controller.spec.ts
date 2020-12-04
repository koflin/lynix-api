import { Test, TestingModule } from '@nestjs/testing';
import { ProductTemplatesController } from './product-templates.controller';

describe('ProductTemplates Controller', () => {
  let controller: ProductTemplatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductTemplatesController],
    }).compile();

    controller = module.get<ProductTemplatesController>(ProductTemplatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

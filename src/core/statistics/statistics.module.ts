import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyDoc, CompanySchema } from 'src/schemas/company.schema';
import { OrderDoc, OrderSchema } from 'src/schemas/order.schema';
import { ProcessDoc, ProcessSchema } from 'src/schemas/process.schema';
import { ProcessTemplateDoc, ProcessTemplateSchema } from 'src/schemas/processTemplate.schema';
import { ProductTemplateDoc, ProductTemplateSchema } from 'src/schemas/productTemplate.schema';
import { RoleDoc, RoleSchema } from 'src/schemas/role.schema';
import { StepDoc, StepSchema } from 'src/schemas/step.schema';
import { UserDoc, UserSchema } from 'src/schemas/user.schema';

import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: UserDoc.name, schema: UserSchema, collection: 'users',
    },
    {
      name: RoleDoc.name, schema: RoleSchema, collection: 'roles'
    },
    {
      name: CompanyDoc.name, schema: CompanySchema, collection: 'companies'
    },
    {
      name: ProcessDoc.name, schema: ProcessSchema, collection: 'processes'
    },
    {
      name: StepDoc.name, schema: StepSchema
    },
    {
      name: ProcessTemplateDoc.name, schema: ProcessTemplateSchema, collection: 'processTemplates'
    },
    {
      name: OrderDoc.name, schema: OrderSchema, collection: 'orders'
    },
    {
      name: ProductTemplateDoc.name, schema: ProductTemplateSchema, collection: 'productTemplates'
    }
    ]),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService]
})
export class StatisticsModule {}

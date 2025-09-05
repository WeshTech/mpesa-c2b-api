import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateBusinessDto } from './CreateBusiness.dto';

export class CreateBusinessBulkDto {
  @ValidateNested({ each: true })
  @Type(() => CreateBusinessDto)
  businesses: CreateBusinessDto[];
}

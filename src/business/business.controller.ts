import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BusinessService } from './business.service';
import { CreateBusinessBulkDto } from './dtos/CreateBulkBusinesses.dto';

@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post('bulk')
  async createMany(@Body() dto: CreateBusinessBulkDto) {
    return this.businessService.createMany(dto.businesses);
  }

  @Get('account/:businessNo')
  async findByBusinessNo(@Param('businessNo') businessNo: string) {
    return this.businessService.findByBusinessNo(Number(businessNo));
  }
}

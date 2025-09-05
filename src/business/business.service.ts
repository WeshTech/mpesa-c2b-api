import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBusinessDto } from './dtos/CreateBusiness.dto';

@Injectable()
export class BusinessService {
  constructor(private readonly prisma: PrismaService) {}

  async createMany(businesses: CreateBusinessDto[]) {
    return this.prisma.business.createMany({
      data: businesses,
      skipDuplicates: true,
    });
  }

  async findByBusinessNo(businessNo: number) {
    const business = await this.prisma.business.findUnique({
      where: { accountNumber: businessNo },
    });

    if (!business) {
      throw new NotFoundException(
        `Business with account number ${businessNo} not found`,
      );
    }

    return business;
  }
}

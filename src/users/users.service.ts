import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  createUser(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data: {
        ...data,
        userSetting: {
          create: {
            smsEnabled: true,
            notificationsOn: false,
          },
        },
      },
    });
  }

  getUsers() {
    return this.prisma.user.findMany({ include: { userSetting: true } });
  }

  getUserById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updateUserById(id: number, data: Prisma.UserUpdateInput) {
    const findUser = await this.getUserById(id);
    if (!findUser) throw new HttpException('User Not Found', 404);
    if (data.username) {
      const findUser = await this.prisma.user.findUnique({
        where: { username: data.username as string },
      });
      if (findUser) throw new ConflictException('Username already taken!');
    }
    return this.prisma.user.update({ where: { id }, data });
  }

  deleteUserById(id: number) {
    const findUser = this.getUserById(id);
    if (!findUser) throw new HttpException('User Not Found', 404);
    return this.prisma.user.delete({ where: { id } });
  }

  updateUserSettings(userId: number, data: Prisma.UserSettingUpdateInput) {
    const findUser = this.getUserById(userId);
    if (!findUser) throw new HttpException('User Not Found', 404);
    if (!findUser.userSetting) throw new HttpException('Bad request', 400);
    return this.prisma.userSetting.update({ where: { userId }, data });
  }
}

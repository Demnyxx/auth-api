import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  create(createRoleDto: CreateRoleDto) {
    return this.prisma.role.create({ data: createRoleDto });
  }

  findAll() {
    return this.prisma.role.findMany();
  }

  async findOne(id: string) {
    const permission = await this.prisma.role.findUnique({
      where: { id },
    });
    if (!permission)
      throw new NotFoundException(`Le rôle d'ID ${id} n'existe pas.`);
    return permission;
  }

  update(id: string, updateRoleDto: UpdateRoleDto) {
    return this.prisma.role.update({
      where: { id },
      data: updateRoleDto,
    });
  }

  remove(id: string) {
    return this.prisma.role.delete({ where: { id } });
  }
}

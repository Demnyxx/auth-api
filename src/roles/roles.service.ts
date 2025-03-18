import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  create(createRoleDto: CreateRoleDto) {
    const { nom, description } = createRoleDto;
    let permissions = createRoleDto['permissions'];
    if (permissions === undefined) {
      permissions = [];
    }
    return this.prisma.role.create({
      data: {
        nom,
        description,
        rolePermissions: {
          create: permissions.map((permissionId) => ({
            permission: { connect: { id: permissionId } },
          })),
        },
      },
    });
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

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const { nom, description, permissions } = updateRoleDto;
    if (permissions !== undefined && permissions.length > 0) {
      // Delete existing permissions for the role
      await this.prisma.rolePermission.deleteMany({
        where: { roleId: id },
      });

      // Add new permissions
      await this.prisma.role.update({
        where: { id: id },
        data: {
          rolePermissions: {
            create: permissions.map((permissionId) => ({
              permission: { connect: { id: permissionId } },
            })),
          },
        },
      });
    }

    return this.prisma.role.update({
      where: { id },
      data: { nom, description },
    });
  }

  remove(id: string) {
    return this.prisma.role.delete({ where: { id } });
  }
}

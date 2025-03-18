import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Ce mail est déjà utilisé.');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        roleId: createUserDto.roleId,
      },
    });

    return {
      user: user,
      token: this.generateToken(user)['accessToken'],
    };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    return {
      user: user,
      token: this.generateToken(user)['accessToken'],
    };
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const { email, roleId } = updateUserDto;

    return this.prisma.user.update({
      where: { id },
      data: {
        email,
        roleId: roleId,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    const permission = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!permission)
      throw new NotFoundException(`L'utilisateur d'ID ${id} n'existe pas.`);
    return permission;
  }

  async remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }

  generateToken(user: User) {
    return {
      accessToken: this.jwtService.sign({ id: user.id }),
    };
  }
}

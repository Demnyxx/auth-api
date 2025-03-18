import { User as PrismaUser, Role } from '@prisma/client';

export type UserWithRole = PrismaUser & {
  role: Role; // Add the role property
};

import { PrismaClient } from '@prisma/client';

let prismaClient;

export function getPrisma() {
    if (!prismaClient) prismaClient = new PrismaClient();
    return prismaClient;
}
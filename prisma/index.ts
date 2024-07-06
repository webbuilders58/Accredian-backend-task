import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

export async function prismaInit(){
  await prisma.$connect()
}

export async function prismaCleanp(){
  await prisma.$disconnect()
}



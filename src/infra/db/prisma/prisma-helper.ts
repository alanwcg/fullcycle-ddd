import { PrismaClient } from "@prisma/client";

export class PrismaHelper {
  private static prisma: PrismaClient

  private constructor() {}

  static getInstance(): PrismaClient {
    if (!this.prisma) {
      this.prisma = new PrismaClient()

      return this.prisma
    }
    return this.prisma
  }

  static async disconnect(): Promise<void> {
    await this.prisma.$disconnect()
  }
}
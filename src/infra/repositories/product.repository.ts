import { PrismaClient } from '@prisma/client';
import { PrismaHelper } from '../db/prisma/prisma-helper';
import { Product } from '../../domain/entities/product';
import { ProductRepositoryInterface } from '../../domain/repositories/product-repository.interface';

export class ProductRepository implements ProductRepositoryInterface {
  private readonly prisma: PrismaClient

  constructor() {
    this.prisma = PrismaHelper.getInstance()
  }

  async create(entity: Product): Promise<void> {
    await this.prisma.productModel.create({
      data: {
        id: entity.id,
        name: entity.name,
        price: entity.price
      }
    })
  }

  async update(entity: Product): Promise<void> {
    await this.prisma.productModel.update({
      where: {
        id: entity.id
      },
      data: {
        name: entity.name,
        price: entity.price
      }
    })
  }

  async findById(id: string): Promise<Product> {
    const productModel = await this.prisma.productModel.findUnique({
      where: {
        id
      }
    })
    return new Product(productModel.id, productModel.name, productModel.price)
  }

  async findAll(): Promise<Product[]> {
    const productModels = await this.prisma.productModel.findMany()
    return productModels.map(model =>
      new Product(model.id, model.name, model.price)
    )
  }
}
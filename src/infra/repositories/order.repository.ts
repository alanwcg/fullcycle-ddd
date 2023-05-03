import { PrismaClient } from '@prisma/client';
import { PrismaHelper } from '../db/prisma/prisma-helper';
import { Order } from '../../domain/entities/order';
import { OrderItem } from '../../domain/entities/order-item';
import { OrderRepositoryInterface } from '../../domain/repositories/order-repository.interface';

export class OrderRepository implements OrderRepositoryInterface {
  private readonly prisma: PrismaClient

  constructor() {
    this.prisma = PrismaHelper.getInstance()
  }

  async create(entity: Order): Promise<void> {
    await this.prisma.orderModel.create({
      data: {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: {
          create: entity.items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            product_id: item.productId
          }))
        }
      }
    })
  }

  async update(entity: Order): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.orderModel.update({
        where: {
          id: entity.id
        },
        data: {
          id: entity.id,
          customer_id: entity.customerId,
          total: entity.total(),
          items: {
            deleteMany: {}
          }
        }
      }),
      this.prisma.orderModel.update({
        where: {
          id: entity.id
        },
        data: {
          items: {
            create: entity.items.map(item => ({
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              product_id: item.productId
            }))
          }
        }
      })
    ])
  }

  async findById(id: string): Promise<Order> {
    try {
      const orderModel = await this.prisma.orderModel.findUniqueOrThrow({
        where: { id },
        include: { items: true }
      })
      const orderItems = orderModel.items.map(item => {
        const orderItem = new OrderItem(
          item.id,
          item.name,
          item.price,
          item.quantity,
          item.product_id
        )
        return orderItem;
      })
      const order = new Order(
        orderModel.id,
        orderModel.customer_id,
        orderItems
      )
      return order
    } catch (error) {
      throw new Error('Order not found')
    }
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await this.prisma.orderModel.findMany({
      include: {
        items: true
      }
    })
    const orders = orderModels.map(model => {
      const orderItems = model.items.map(item => {
        const orderItem = new OrderItem(
          item.id,
          item.name,
          item.price,
          item.quantity,
          item.product_id
        )
        return orderItem;
      })
      const order = new Order(model.id, model.customer_id, orderItems)
      return order
    })
    return orders
  }
}
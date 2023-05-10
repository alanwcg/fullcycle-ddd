import { PrismaClient, CustomerModel } from '@prisma/client';
import { PrismaHelper } from '../../../db/prisma/prisma-helper';
import { Address } from '../../../../domain/customer/value-objects/address';
import { Customer } from '../../../../domain/customer/entities/customer';
import { CustomerRepositoryInterface } from '../../../../domain/customer/repositories/customer-repository.interface';

export class CustomerRepository implements CustomerRepositoryInterface {
  private readonly prisma: PrismaClient

  constructor() {
    this.prisma = PrismaHelper.getInstance()
  }

  async create(entity: Customer): Promise<void> {
    await this.prisma.customerModel.create({
      data: {
        id: entity.id,
        name: entity.name,
        street: entity.address.street,
        number: entity.address.number,
        zipcode: entity.address.zipcode,
        city: entity.address.city,
        active: entity.isActive(),
        rewardPoints: entity.rewardPoints,
      }
    })
  }

  async update(entity: Customer): Promise<void> {
    await this.prisma.customerModel.update({
      where: {
        id: entity.id
      },
      data: {
        name: entity.name,
        street: entity.address.street,
        number: entity.address.number,
        zipcode: entity.address.zipcode,
        city: entity.address.city,
        active: entity.isActive(),
        rewardPoints: entity.rewardPoints
      }
    })
  }

  async findById(id: string): Promise<Customer> {
    let customerModel: CustomerModel
    try {
      customerModel = await this.prisma.customerModel.findUniqueOrThrow({
        where: {
          id
        }
      })
    } catch (error) {
      throw new Error('Customer not found')
    }
    const customer = new Customer(id, customerModel.name)
    const address = new Address(
      customerModel.street,
      customerModel.number,
      customerModel.zipcode,
      customerModel.city
    )
    customer.changeAddress(address)
    return customer
  }

  async findAll(): Promise<Customer[]> {
    const customerModels = await this.prisma.customerModel.findMany()
    const customers = customerModels.map(model => {
      let customer = new Customer(model.id, model.name)
      customer.addRewardPoints(model.rewardPoints)
      const address = new Address(
        model.street,
        model.number,
        model.zipcode,
        model.city
      )
      customer.changeAddress(address)
      if (model.active) {
        customer.activate()
      }
      return customer
    })
    return customers
  }
}
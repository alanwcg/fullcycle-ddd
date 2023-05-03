import { PrismaHelper } from '../db/prisma/prisma-helper'
import { Customer } from '../../domain/entities/customer'
import { Address } from '../../domain/entities/address'
import { CustomerRepository } from './customer.repository'

describe('Customer repository test', () => {
  const prisma = PrismaHelper.getInstance()

  beforeEach(async () => {
    await prisma.customerModel.deleteMany()
  })
  
  afterAll(async () => {
    await PrismaHelper.disconnect()
  })

  afterEach(async () => {
    await prisma.customerModel.deleteMany()
  })

  it('should create a customer', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('c1', 'Customer 1')
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer.changeAddress(address)

    await customerRepository.create(customer)
    const customerModel = await prisma.customerModel.findUnique({
      where: {
        id: 'c1'
      }
    })

    expect(customerModel).toStrictEqual({
      id: 'c1',
      name: 'Customer 1',
      street: address.street,
      number: address.number,
      zipcode: address.zipcode,
      city: address.city,
      active: customer.isActive(),
      rewardPoints: customer.rewardPoints
    })
  })

  it('should update a customer', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('c1', 'Customer 1')
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer.changeAddress(address)

    await customerRepository.create(customer)
    customer.changeName('Customer 2')
    await customerRepository.update(customer)
    const customerModel = await prisma.customerModel.findUnique({
      where: {
        id: 'c1'
      }
    })

    expect(customerModel).toStrictEqual({
      id: 'c1',
      name: 'Customer 2',
      street: address.street,
      number: address.number,
      zipcode: address.zipcode,
      city: address.city,
      active: customer.isActive(),
      rewardPoints: customer.rewardPoints
    })
  })

  it('should find a customer by id', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('c1', 'Customer 1')
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer.changeAddress(address)

    await customerRepository.create(customer)
    const customerModel = await customerRepository.findById(customer.id)

    expect(customerModel).toStrictEqual(customer)
  })

  it('should throw an error when customer is not found', async () => {
    const customerRepository = new CustomerRepository()
    
    const promise = customerRepository.findById('invalid_id')

    await expect(promise).rejects.toThrowError('Customer not found')
  })

  it('should find all customers', async () => {
    const customerRepository = new CustomerRepository()
    const customer1 = new Customer('p1', 'Customer 1')
    const address1 = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer1.changeAddress(address1)
    customer1.addRewardPoints(10)
    customer1.activate()
    const customer2 = new Customer('p2', 'Customer 2')
    const address2 = new Address('Street 2', 2, 'Zipcode 2', 'City 2')
    customer2.changeAddress(address2)
    customer2.addRewardPoints(20)

    await customerRepository.create(customer1)
    await customerRepository.create(customer2)
    const customers = await customerRepository.findAll()

    expect(customers).toStrictEqual([customer1, customer2])
  })
})
import { PrismaHelper } from '../db/prisma/prisma-helper'
import { Customer } from '../../domain/entities/customer'
import { Address } from '../../domain/entities/address'
import { CustomerRepository } from './customer.repository'
import { Product } from '../../domain/entities/product'
import { ProductRepository } from './product.repository'
import { OrderItem } from '../../domain/entities/order-item'
import { Order } from '../../domain/entities/order'
import { OrderRepository } from './order.repository'

describe('Order repository test', () => {
  const prisma = PrismaHelper.getInstance()

  beforeAll(async () => {
    await prisma.orderItemModel.deleteMany()
    await prisma.orderModel.deleteMany()
    await prisma.customerModel.deleteMany()
    await prisma.productModel.deleteMany()
  })
  
  afterAll(async () => {
    await PrismaHelper.disconnect()
  })

  afterEach(async () => {
    await prisma.orderItemModel.deleteMany()
    await prisma.orderModel.deleteMany()
    await prisma.customerModel.deleteMany()
    await prisma.productModel.deleteMany()
  })

  it ('should create a new order', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('c1', 'Customer 1')
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer.changeAddress(address)
    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product('p1', 'Product 1', 10)
    await productRepository.create(product)

    const orderItem = new OrderItem(
      'oi1',
      product.name,
      product.price,
      2,
      product.id
    )
    const order = new Order('o1', customer.id, [orderItem])
    const orderRepository = new OrderRepository()
    await orderRepository.create(order)

    const orderModel = await prisma.orderModel.findUnique({
      where: { id: order.id },
      include: { items: true }
    })

    expect(orderModel).toStrictEqual({
      id: order.id,
      customer_id: customer.id,
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          product_id: product.id,
          order_id: order.id
        }
      ]
    })
  })

  it ('should update a new order', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('c1', 'Customer 1')
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer.changeAddress(address)
    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product('p1', 'Product 1', 10)
    await productRepository.create(product)

    const orderItem = new OrderItem(
      'oi1',
      product.name,
      product.price,
      1,
      product.id
    )
    const order = new Order('o1', customer.id, [orderItem])
    const orderRepository = new OrderRepository()
    await orderRepository.create(order)

    const orderModel = await prisma.orderModel.findUnique({
      where: { id: order.id },
      include: { items: true }
    })

    order.items[0].changeName('Product 2')
    order.items[0].changePrice(20)
    order.items[0].changeQuantity(2)
    await orderRepository.update(order)

    const updatedOrderModel = await prisma.orderModel.findUnique({
      where: { id: order.id },
      include: { items: true }
    })

    expect(orderModel).toStrictEqual({
      id: order.id,
      customer_id: customer.id,
      total: 10,
      items: [
        {
          id: orderItem.id,
          name: 'Product 1',
          price: 10,
          quantity: 1,
          product_id: product.id,
          order_id: order.id
        }
      ]
    })
    expect(updatedOrderModel).toStrictEqual({
      id: order.id,
      customer_id: customer.id,
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          product_id: product.id,
          order_id: order.id
        }
      ]
    })
  })

  it ('should find an order by id', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('c1', 'Customer 1')
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer.changeAddress(address)
    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product('p1', 'Product 1', 10)
    await productRepository.create(product)

    const orderItem = new OrderItem(
      'oi1',
      product.name,
      product.price,
      2,
      product.id
    )
    const order = new Order('o1', customer.id, [orderItem])
    const orderRepository = new OrderRepository()
    await orderRepository.create(order)

    const orderModel = await orderRepository.findById(order.id)

    expect(orderModel).toStrictEqual(order)
  })

  it ('should throw an error if order is not found', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('c1', 'Customer 1')
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer.changeAddress(address)
    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product('p1', 'Product 1', 10)
    await productRepository.create(product)

    const orderItem = new OrderItem(
      'oi1',
      product.name,
      product.price,
      2,
      product.id
    )
    const order = new Order('o1', customer.id, [orderItem])
    const orderRepository = new OrderRepository()
    await orderRepository.create(order)

    const promise = orderRepository.findById('invalid_id')

    await expect(promise).rejects.toThrowError('Order not found')
  })

  it ('should find all orders', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('c1', 'Customer 1')
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer.changeAddress(address)
    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product1 = new Product('p1', 'Product 1', 10)
    const product2 = new Product('p2', 'Product 2', 20)
    await productRepository.create(product1)
    await productRepository.create(product2)

    const orderItem1 = new OrderItem(
      'oi1',
      product1.name,
      product1.price,
      1,
      product1.id
    )
    const orderItem2 = new OrderItem(
      'oi2',
      product2.name,
      product2.price,
      2,
      product2.id
    )
    const order1 = new Order('o1', customer.id, [orderItem1])
    const order2 = new Order('o2', customer.id, [orderItem2])
    const orderRepository = new OrderRepository()
    await orderRepository.create(order1)
    await orderRepository.create(order2)

    const orderModels = await orderRepository.findAll()

    expect(orderModels).toStrictEqual([order1, order2])
  })
})
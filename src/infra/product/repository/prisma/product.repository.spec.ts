import { Product } from '../../../../domain/product/entities/product'
import { PrismaHelper } from '../../../db/prisma/prisma-helper'
import { ProductRepository } from './product.repository'

describe('Product repository test', () => {
  const prisma = PrismaHelper.getInstance()

  beforeEach(async () => {
    await prisma.productModel.deleteMany()
  })
  
  afterAll(async () => {
    await PrismaHelper.disconnect()
  })

  afterEach(async () => {
    await prisma.productModel.deleteMany()
  })

  it('should create a product', async () => {
    const productRepository = new ProductRepository()
    const product = new Product('p1', 'Product 1', 100)

    await productRepository.create(product)
    const productModel = await prisma.productModel.findUnique({
      where: {
        id: 'p1'
      }
    })

    expect(productModel).toStrictEqual({
      id: 'p1',
      name: 'Product 1',
      price: 100
    })
  })

  it('should update a product', async () => {
    const productRepository = new ProductRepository()
    const product = new Product('p1', 'Product 1', 100)

    await productRepository.create(product)
    const productModel = await prisma.productModel.findUnique({
      where: {
        id: 'p1'
      }
    })
    product.changeName('Product 2')
    product.changePrice(200)
    await productRepository.update(product)
    const updatedProductModel = await prisma.productModel.findUnique({
      where: {
        id: 'p1'
      }
    })

    expect(productModel).toStrictEqual({
      id: 'p1',
      name: 'Product 1',
      price: 100
    })
    expect(updatedProductModel).toStrictEqual({
      id: 'p1',
      name: 'Product 2',
      price: 200
    })
  })

  it('should find a product by id', async () => {
    const productRepository = new ProductRepository()
    const product = new Product('p1', 'Product 1', 100)

    await productRepository.create(product)
    const productModel = await productRepository.findById('p1')

    expect(productModel).toStrictEqual(product)
  })

  it('should find all products', async () => {
    const productRepository = new ProductRepository()
    const product1 = new Product('p1', 'Product 1', 100)
    const product2 = new Product('p2', 'Product 2', 200)

    await productRepository.create(product1)
    await productRepository.create(product2)
    const products = await productRepository.findAll()

    expect(products).toStrictEqual([product1, product2])
  })
})
import { Customer } from '../../customer/entities/customer'
import { Order } from '../entities/order'
import { OrderItem } from '../entities/order-item'
import { OrderService } from './order.service'

describe('Order service unit test', () => {
  it('should get total of all orders', () => {
    const item1 = new OrderItem('i1', 'Item 1', 100, 1, 'p1')
    const item2 = new OrderItem('i2', 'Item 2', 200, 2, 'p2')
    const order1 = new Order('o1', 'c1', [item1])
    const order2 = new Order('o2', 'c1', [item2])

    const total = OrderService.total([order1, order2])

    expect(total).toBe(500)
  })

  it('should place an order', () => {
    const customer = new Customer('c1', 'Customer 1')
    const item = new OrderItem('i1', 'Item 1', 10, 1, 'p1')

    const order = OrderService.placeOrder(customer, [item])

    expect(customer.rewardPoints).toBe(5)
    expect(order.total()).toBe(10)
  })
})
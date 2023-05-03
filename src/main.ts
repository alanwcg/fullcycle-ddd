import { Address } from './domain/entities/address'
import { Customer } from './domain/entities/customer'
import { Order } from './domain/entities/order'
import { OrderItem } from './domain/entities/order-item'

let customer = new Customer('1', 'Alan Cintra')
const address = new Address('Rua Mariza Neves', 230, '55190-194', 'SCC')
customer.changeAddress(address)
customer.activate()

const item1 = new OrderItem('1', 'Item 1', 10, 1, 'p1')
const item2 = new OrderItem('2', 'Item 2', 15, 2, 'p2')
const order = new Order('1', '1', [item1, item2])
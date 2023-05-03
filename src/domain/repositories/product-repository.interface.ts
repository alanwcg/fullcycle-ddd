import { Product } from '../entities/product';
import { RepositoryInterface } from './repository-interface';

export interface ProductRepositoryInterface
  extends RepositoryInterface<Product> {}
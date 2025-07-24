import type { Operation } from './operation'

export type Transaction = {
  id: string
  merchantId: string
  externalRef: string
  amount: number
  currency: 'EUR' | 'USD' | 'GBP'
  createdAt: Date
  operations: Operation[]
}

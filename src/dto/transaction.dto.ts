import { instanceToPlain, plainToInstance, Transform } from 'class-transformer'
import { IsDate, IsNumber, IsString } from 'class-validator'
import { Database } from '../../types/database'
import { transformToNumber } from '../../helpers'

export class Transaction {
  @IsNumber()
  id!: number

  @IsString()
  symbol!: string

  @Transform(({ value }) => transformToNumber(value))
  price!: number

  @IsString()
  portfolioName!: string

  @IsNumber()
  amount!: number

  @IsDate()
  createdAt!: Date

  static create(data: Database['transaction']) {
    return plainToInstance(this, data, { enableImplicitConversion: true })
  }

  static convertToPlain(data: Transaction) {
    return instanceToPlain(data) as Database['transaction']
  }
}

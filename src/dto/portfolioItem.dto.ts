import { plainToInstance, Transform } from 'class-transformer'
import { IsString } from 'class-validator'
import 'reflect-metadata'
import { transformToNumber } from '../helpers'

export class PortfolioItem {
  @IsString()
  symbol!: string

  @Transform(({ value }) => transformToNumber(value))
  avgPrice!: number

  @Transform(({ value }) => transformToNumber(value))
  share!: number

  @IsString()
  portfolioName!: string

  @Transform(({ value }) => transformToNumber(value))
  amount!: number

  @Transform(({ value }) => transformToNumber(value))
  profit!: number

  @Transform(({ value }) => transformToNumber(value))
  changeInShare!: number

  static create(data: PortfolioItem) {
    return plainToInstance(this, data, {
      enableImplicitConversion: true,
      exposeDefaultValues: true,
    })
  }
}

export class CryptoCurrency {
  @Transform(({ value }) => transformToNumber(value))
  rank = 0

  @IsString()
  symbol!: string

  @IsString()
  name!: string

  @Transform(({ value }) => transformToNumber(value))
  price!: number

  static create(data: CryptoCurrency) {
    return plainToInstance(this, data, { enableImplicitConversion: true })
  }
}

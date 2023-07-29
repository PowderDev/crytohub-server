import { plainToInstance, Transform } from 'class-transformer'
import { IsString } from 'class-validator'

export class PortfolioItem {
  @Transform(({ value }) => (Number.isNaN(value) ? 0 : value))
  rank!: number

  @IsString()
  name!: string

  @IsString()
  symbol!: string

  @Transform(({ value }) => (Number.isNaN(value) ? 0 : value))
  avgPrice!: number

  @Transform(({ value }) => (Number.isNaN(value) ? 0 : value))
  share!: number

  static create(data: PortfolioItem) {
    return plainToInstance(this, data)
  }
}

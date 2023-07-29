import { NextFunction, Request, Response } from 'express'

export class AppError extends Error {
  constructor(public message: string, public statusCode = 500) {
    super(message)
    this.statusCode = statusCode
    this.message = message
  }
}

export const errorHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  _: NextFunction,
) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
    })
  } else {
    res.status(500).json({
      message: 'Something went wrong!',
    })
  }
}

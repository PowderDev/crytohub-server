import { z } from 'zod'
import { logger } from './logger'

const envSchema = z.object({
  PORT: z.string().transform((val) => parseInt(val, 10)),
  CMC_API_KEY: z.string(),
  CMC_BASE_URL: z.string(),
  DATABASE_URL: z.string(),
  NODE_ENV: z.string(),
})

type EnvKeys = z.infer<typeof envSchema>
export let envKeys: EnvKeys

export function validateAndSetEnv() {
  const parsed = envSchema.safeParse(process.env)

  if (!parsed.success) {
    logger.error(`Invalid environment variables: ${parsed.error.message}`)
    process.exit(1)
  }

  envKeys = parsed.data
}

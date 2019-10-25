import { Health } from '../entities/Health'

export function getHealth(): Health {
  const health = new Health()
  health.ok = true
  return health
}

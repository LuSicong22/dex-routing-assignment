/**
 * Provides read-only endpoints for querying the state of
 * dexes on the blockchain. In your tests, you're free to mock the returned
 * values of the methods in this class to return different poolPair
 * states for testing different scenarios (e.g. more poolPairs / tokens
 * with different topologies).
 * A complex example has been hard-coded here for visualisation.
 * Based on the state of the poolPairs, there are three possible routes for
 * swapping DOGE to BTC:
 *
 *   - DOGE -> DFI -> BTC
 *     Example calculations:
 *       1 DOGE = 5 / 18993 DFI
 *              = 0.0002633 DFI (via DOGE-DFI pool)
 *       1 DFI  = 2 / 1337 BTC
 *              = 0.001496 BTC (via BTC-DFI pool)
 *       1 DOGE = 0.0002633 DFI
 *              = 0.0002633 * 0.001495 BTC
 *              = 0.0000003936 BTC
 *   - DOGE -> DFI -> ETH -> BTC
 *   - DOGE -> ETH -> BTC
 *   - DOGE -> ETH -> DFI -> BTC
 *                                           ┌───────┐
 *                                           │       │
 *                     ┌────────┐            │  BTC  │
 *                     │        ├─ BTC-DFI ──┤       │
 *     ┌── DOGE-DFI ───┤  DFI   │            └───┬───┘
 *     │               │        │                │
 * ┌───┴────┐          └───┬────┘             BTC-ETH
 * │  DOGE  │              │                     │
 * │        │              │                 ┌───┴───┐
 * └────┬───┘              │                 │       │
 *      |                  └─ ETH-DFI ───────┤  ETH  │
 *      └─────────── DOGE-ETH ───────────────│       |
 *                                           └───────┘
 */
import { Injectable } from '@nestjs/common'

@Injectable()
export class DexService {
  /**
   * Some example dex state. In your tests, you can mock the returned
   * values
   * @private
   */
  private readonly poolPairs: PoolPair[] = [
    {
      symbol: 'ETH-DFI',
      tokenA: 'ETH',
      tokenB: 'DFI',
      priceRatio: [1, 5] // 1 ETH === 5 DFI
    },
    {
      symbol: 'BTC-DFI',
      tokenA: 'BTC',
      tokenB: 'DFI',
      priceRatio: [2, 1_337] // 2 BTC === 1,337 DFI
    },
    {
      symbol: 'DOGE-DFI',
      tokenA: 'DOGE',
      tokenB: 'DFI',
      priceRatio: [18_933, 5] // 18,933 DOGE === 5 DFI
    },
    {
      symbol: 'DOGE-ETH',
      tokenA: 'DOGE',
      tokenB: 'ETH',
      priceRatio: [18_617, 1] // 18,617 DOGE === 1 ETH
    },
    {
      symbol: 'BTC-ETH',
      tokenA: 'BTC',
      tokenB: 'ETH',
      priceRatio: [1, 132] // 1 BTC === 132 ETH
    }
  ]

  async listPools (): Promise<PoolPair[]> {
    return this.poolPairs
  }

  async getPool (symbol: PoolPairSymbol): Promise<PoolPair | undefined> {
    const pools = await this.listPools()
    return pools.filter(poolPair => symbol === poolPair.symbol)[0]
  }

  async listTokens (): Promise<TokenSymbol[]> {
    const tokens: Set<TokenSymbol> = new Set()

    const pools = await this.listPools()
    pools.forEach(poolPair => {
      tokens.add(poolPair.tokenA)
      tokens.add(poolPair.tokenB)
    })

    return [...tokens]
  }
}

export interface PoolPair {
  symbol: PoolPairSymbol
  tokenA: TokenSymbol
  tokenB: TokenSymbol
  priceRatio: [number, number]
}

export type PoolPairSymbol = string

export type TokenSymbol = string

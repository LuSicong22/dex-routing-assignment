import { Injectable } from '@nestjs/common'
import { PoolPair, TokenSymbol } from './DexService'

@Injectable()
export class DexRoutingService {
  // TODO: make use of DexService to retrieve the poolPairs state
  //       and implement the following features

  async listAllRoutes (fromTokenSymbol: TokenSymbol, toTokenSymbol: TokenSymbol): Promise<AllRoutesResult> {
    return {
      fromToken: fromTokenSymbol,
      toToken: toTokenSymbol,
      routes: [] // TODO
    }
  }

  async getBestRoute (fromTokenSymbol: TokenSymbol, toTokenSymbol: TokenSymbol): Promise<BestRouteResult> {
    return {
      fromToken: fromTokenSymbol,
      toToken: toTokenSymbol,
      bestRoute: [], // TODO
      estimatedReturn: 0
    }
  }
}

export interface AllRoutesResult {
  fromToken: TokenSymbol
  toToken: TokenSymbol
  routes: PoolPair[][]
}

export interface BestRouteResult {
  fromToken: TokenSymbol
  toToken: TokenSymbol
  bestRoute: PoolPair[]
  estimatedReturn: number
}

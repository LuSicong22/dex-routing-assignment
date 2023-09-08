import { Injectable } from '@nestjs/common'
import { PoolPair, TokenSymbol, DexService } from './DexService'

@Injectable()
export class DexRoutingService {
  // TODO: make use of DexService to retrieve the poolPairs state
  //       and implement the following features
  constructor (private readonly dexService: DexService) {}

  async listAllRoutes (fromTokenSymbol: TokenSymbol, toTokenSymbol: TokenSymbol): Promise<AllRoutesResult> {
    const poolPairs = await this.dexService.listPools()
    const adjacencyList = await this.getAdjacencyList(poolPairs)
    const routes = this.findAllRoutes(adjacencyList, fromTokenSymbol, toTokenSymbol)
    return {
      fromToken: fromTokenSymbol,
      toToken: toTokenSymbol,
      routes: routes
    }
  }

  async getBestRoute (fromTokenSymbol: TokenSymbol, toTokenSymbol: TokenSymbol): Promise<BestRouteResult> {
    // Get all routes
    const allRoutes = await this.listAllRoutes(fromTokenSymbol, toTokenSymbol)
    let bestRoute: PoolPair[] = []
    let maxReturn = -Infinity

    for (const route of allRoutes.routes) {
      // Calculate each route's return
      let estimatedReturn = 1
      let fromTokenSymbolTemp = fromTokenSymbol
      for (const poolPair of route) {
        if (poolPair.tokenA === fromTokenSymbolTemp) {
          estimatedReturn *= poolPair.priceRatio[1] / poolPair.priceRatio[0]
          fromTokenSymbolTemp = poolPair.tokenB
        } else {
          estimatedReturn *= poolPair.priceRatio[0] / poolPair.priceRatio[1]
          fromTokenSymbolTemp = poolPair.tokenA
        }
      }

      // Check if this route's estimated return is greater than the current maximum
      if (estimatedReturn > maxReturn) {
        maxReturn = estimatedReturn
        bestRoute = route
      }
    }

    return {
      fromToken: fromTokenSymbol,
      toToken: toTokenSymbol,
      bestRoute,
      estimatedReturn: maxReturn
    }
  }

  private async getAdjacencyList (poolPairs: PoolPair[]): Promise<{ [key in TokenSymbol]: PoolPair[] }> {
    const adjacencyList: { [key in TokenSymbol]?: PoolPair[] } = {}

    poolPairs.forEach(poolPair => {
      adjacencyList[poolPair.tokenA] = adjacencyList[poolPair.tokenA] ?? []
      adjacencyList[poolPair.tokenB] = adjacencyList[poolPair.tokenB] ?? []
      adjacencyList[poolPair.tokenA]?.push(poolPair)
      adjacencyList[poolPair.tokenB]?.push(poolPair)
    })

    return adjacencyList as { [key in TokenSymbol]: PoolPair[] }
  }

  private findAllRoutes (adjacencyList: { [key in TokenSymbol]: PoolPair[] }, fromToken: TokenSymbol, toToken: TokenSymbol): PoolPair[][] {
    const visited: { [key in TokenSymbol]?: boolean } = {}
    const routes: PoolPair[][] = []

    const dfs = (token: TokenSymbol, path: PoolPair[]) => {
      visited[token] = true

      if (token === toToken) {
        routes.push([...path])
      } else {
        adjacencyList[token].forEach(poolPair => {
          const nextToken = poolPair.tokenA === token ? poolPair.tokenB : poolPair.tokenA
          if (!visited[nextToken]) {
            path.push(poolPair);
            dfs(nextToken, path)
            path.pop();
          }
        })
      }

      visited[token] = false
    }

    dfs(fromToken, [])
    return routes
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

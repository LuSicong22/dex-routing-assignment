import { Controller, Get, Param } from '@nestjs/common'
import { AllRoutesResult, BestRouteResult, DexRoutingService } from './DexRoutingService'
import { TokenSymbol } from './DexService'

@Controller()
export class DexRoutingController {
  constructor (private readonly dexRoutingService: DexRoutingService) {}

  @Get('/routes/from/:fromToken/to/:toToken')
  async listAllRoutes (
    @Param('fromToken') fromToken: TokenSymbol,
      @Param('toToken') toToken: TokenSymbol
  ): Promise<AllRoutesResult> {
    return await this.dexRoutingService.listAllRoutes(
      fromToken,
      toToken
    )
  }

  @Get('/routes/best/from/:fromToken/to/:toToken')
  async getBestRoute (
    @Param('fromToken') fromToken: TokenSymbol,
      @Param('toToken') toToken: TokenSymbol
  ): Promise<BestRouteResult> {
    return await this.dexRoutingService.getBestRoute(
      fromToken,
      toToken
    )
  }
}

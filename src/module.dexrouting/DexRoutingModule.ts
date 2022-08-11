import { Module } from '@nestjs/common'
import { DexRoutingController } from './DexRoutingController'
import { DexRoutingService } from './DexRoutingService'
import { DexService } from './DexService'

@Module({
  imports: [],
  controllers: [
    DexRoutingController
  ],
  providers: [
    DexService,
    DexRoutingService
  ]
})
export class DexRoutingModule {}

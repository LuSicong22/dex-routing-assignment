import { Module } from '@nestjs/common'
import { DexRoutingModule } from './module.dexrouting/DexRoutingModule'

@Module({
  imports: [
    DexRoutingModule
  ]
})
export class RootModule {}

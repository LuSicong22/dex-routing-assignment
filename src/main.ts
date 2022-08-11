import { NestFactory } from '@nestjs/core'
import { DexRoutingModule } from './module.dexrouting/DexRoutingModule'

async function bootstrap (): Promise<void> {
  const app = await NestFactory.create(DexRoutingModule)
  await app.listen(3000)
}
void bootstrap()

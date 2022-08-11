/**
 * We 💜 automated tests at CakeDeFi + BirthdayResearch.
 * Any code introducing new behaviour should be accompanied by tests to
 * clearly demonstrate said behaviour and the expectations surrounding it.
 *
 * If you feel like the provided example state in DexService.ts is insufficient
 * to cover all cases, feel free to use your modify it / mock the return value
 * as you see fit!
 *
 * Have fun! 🚀
 */

import { Test, TestingModule } from '@nestjs/testing'
import { DexRoutingController } from './DexRoutingController'
import { DexRoutingModule } from './DexRoutingModule'

let testingModule: TestingModule
let controller: DexRoutingController

beforeAll(async () => {
  testingModule = await Test.createTestingModule({
    imports: [
      DexRoutingModule
    ]
  }).compile()

  controller = testingModule.get<DexRoutingController>(DexRoutingController)
})

afterAll(async () => {
  await testingModule.close()
})

describe('/routes', () => {
  describe('/routes/from/:fromToken/to/:toToken', () => {
    it('should return all routes from DOGE to BTC', async () => {
      expect(await controller.listAllRoutes('DOGE', 'BTC')).toStrictEqual({
        fromToken: 'DOGE',
        toToken: 'BTC',
        routes: [] // TODO
      })
    })
  })

  describe('/routes/best/from/:fromToken/to/:toToken', () => {
    it('should return best route from DOGE to BTC', async () => {
      expect(await controller.getBestRoute('DOGE', 'BTC')).toStrictEqual({
        fromToken: 'DOGE',
        toToken: 'BTC',
        bestRoute: [], // TODO
        estimatedReturn: 0
      })
    })
  })
})

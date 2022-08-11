import { DexService } from './DexService'
import { Test, TestingModule } from '@nestjs/testing'
import { DexRoutingModule } from './DexRoutingModule'

let testingModule: TestingModule
let dexService: DexService

beforeAll(async () => {
  testingModule = await Test.createTestingModule({
    imports: [
      DexRoutingModule
    ]
  }).compile()
  await testingModule.init()
  dexService = testingModule.get<DexService>(DexService)
})

afterAll(async () => {
  await testingModule.close()
  jest.clearAllMocks()
})

it('should provide example dex state', async () => {
  expect(await dexService.listPools())
    .toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({ symbol: 'ETH-DFI' }),
        expect.objectContaining({ symbol: 'BTC-DFI' }),
        expect.objectContaining({ symbol: 'DOGE-DFI' }),
        expect.objectContaining({ symbol: 'DOGE-ETH' }),
        expect.objectContaining({ symbol: 'BTC-ETH' })
      ])
    )
})

it('should get pool by symbol', async () => {
  expect(await dexService.getPool('ETH-DFI'))
    .toStrictEqual({
      symbol: 'ETH-DFI',
      tokenA: 'ETH',
      tokenB: 'DFI',
      priceRatio: [1, 5]
    })
})

it('should provide all tokens', async () => {
  expect(await dexService.listTokens())
    .toStrictEqual(
      expect.arrayContaining([
        'ETH',
        'DFI',
        'BTC',
        'DOGE'
      ])
    )
})

// This doesn't really test anything, it's just an
// example of how we can simulate different dex states
it('should provide mocked state', async () => {
  jest.spyOn(dexService, 'listPools')
    .mockReturnValue(new Promise(resolve => {
      resolve([
        {
          symbol: 'AAPL-TSLA',
          tokenA: 'AAPL',
          tokenB: 'TSLA',
          priceRatio: [1, 1]
        },
        {
          symbol: 'NFLX-GOOGL',
          tokenA: 'NFLX',
          tokenB: 'GOOGL',
          priceRatio: [7, 13]
        }
      ])
    }))

  expect(await dexService.listPools()).toStrictEqual([
    {
      symbol: 'AAPL-TSLA',
      tokenA: 'AAPL',
      tokenB: 'TSLA',
      priceRatio: [1, 1]
    },
    {
      symbol: 'NFLX-GOOGL',
      tokenA: 'NFLX',
      tokenB: 'GOOGL',
      priceRatio: [7, 13]
    }
  ])

  expect(await dexService.listTokens()).toStrictEqual(
    expect.arrayContaining([
      'AAPL', 'TSLA', 'NFLX', 'GOOGL'
    ])
  )

  expect(await dexService.getPool('NFLX-GOOGL')).toStrictEqual({
    symbol: 'NFLX-GOOGL',
    tokenA: 'NFLX',
    tokenB: 'GOOGL',
    priceRatio: [7, 13]
  })
})

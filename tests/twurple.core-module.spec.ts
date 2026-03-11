import { describe, expect, it } from 'bun:test'
import { TwurpleCoreModule } from '../src/twurple.core-module'
import {
  getTwurpleConnectionApiToken,
  getTwurpleConnectionChatToken,
  getTwurpleConnectionPubsubToken,
  getTwurpleOptionsToken,
} from '../src/twurple.utils'

class TestOptionsFactory {
  createTwurpleModuleOptions() {
    return {
      config: { authProvider: { id: 'factory' } },
      features: { api: true, chat: true, pubsub: true },
    }
  }
}

describe('TwurpleCoreModule', () => {
  it('forRoot doit exposer les providers attendus', () => {
    const options = {
      config: { authProvider: { id: 'auth' } },
      features: {},
    } as any

    const dynamicModule = TwurpleCoreModule.forRoot(options, 'main')
    const providers = dynamicModule.providers as any[]

    expect(dynamicModule.module).toBe(TwurpleCoreModule)
    expect(providers).toHaveLength(4)

    expect(providers.map((provider) => provider.provide)).toEqual([
      getTwurpleOptionsToken('main'),
      getTwurpleConnectionApiToken('main'),
      getTwurpleConnectionChatToken('main'),
      getTwurpleConnectionPubsubToken('main'),
    ])
    expect((providers[0] as any).useValue).toBe(options)
    expect((dynamicModule.exports as any[]).map((provider) => provider.provide)).toEqual([
      getTwurpleOptionsToken('main'),
      getTwurpleConnectionApiToken('main'),
      getTwurpleConnectionChatToken('main'),
      getTwurpleConnectionPubsubToken('main'),
    ])
  })

  it('forRootAsync doit mapper imports/providers/exports', () => {
    const asyncOptions = {
      imports: ['IMPORT_MARKER'] as any,
      inject: ['CONFIG'],
      useFactory: () => ({ config: { authProvider: {} }, features: { api: true, chat: true, pubsub: true } }),
    }

    const dynamicModule = TwurpleCoreModule.forRootAsync(asyncOptions as any, 'main')
    const providers = dynamicModule.providers as any[]
    const exportsList = dynamicModule.exports as any[]

    expect(dynamicModule.module).toBe(TwurpleCoreModule)
    expect(dynamicModule.imports).toEqual(asyncOptions.imports)
    expect(providers).toHaveLength(4)
    expect(exportsList).toHaveLength(3)
    expect(exportsList.map((provider) => provider.provide)).toEqual([
      getTwurpleConnectionApiToken('main'),
      getTwurpleConnectionChatToken('main'),
      getTwurpleConnectionPubsubToken('main'),
    ])
  })

  it('createAsyncProviders doit lever une erreur sans stratégie async', () => {
    expect(() => TwurpleCoreModule.createAsyncProviders({} as any)).toThrow(
      'Invalid configuration. Must provide useFactory, useClass or useExisting',
    )
  })

  it('createAsyncProviders doit retourner options provider + class provider avec useClass', () => {
    const providers = TwurpleCoreModule.createAsyncProviders({ useClass: TestOptionsFactory } as any, 'main') as any[]

    expect(providers).toHaveLength(2)
    expect(providers[0].provide).toBe(getTwurpleOptionsToken('main'))
    expect(providers[1]).toEqual({ provide: TestOptionsFactory, useClass: TestOptionsFactory })
  })

  it('createAsyncOptionsProvider doit construire useFactory + inject', () => {
    const optionsProvider = TwurpleCoreModule.createAsyncOptionsProvider(
      {
        useFactory: (config: any) => ({ config, features: { api: true } }),
        inject: ['CONFIG'],
      } as any,
      'main',
    ) as any

    expect(optionsProvider.provide).toBe(getTwurpleOptionsToken('main'))
    expect(optionsProvider.inject).toEqual(['CONFIG'])
    expect(typeof optionsProvider.useFactory).toBe('function')
  })

  it('createAsyncOptionsProvider avec useExisting doit appeler createTwurpleModuleOptions', async () => {
    const optionsProvider = TwurpleCoreModule.createAsyncOptionsProvider(
      {
        useExisting: TestOptionsFactory,
      } as any,
      'main',
    ) as any

    expect(optionsProvider.provide).toBe(getTwurpleOptionsToken('main'))
    expect(optionsProvider.inject).toEqual([TestOptionsFactory])

    const resolved = await optionsProvider.useFactory(new TestOptionsFactory())
    expect(resolved).toEqual({
      config: { authProvider: { id: 'factory' } },
      features: { api: true, chat: true, pubsub: true },
    })
  })
})

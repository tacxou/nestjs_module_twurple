import { describe, expect, it } from 'bun:test'
import { TwurpleModule } from '../src/twurple.module'
import { TwurpleCoreModule } from '../src/twurple.core-module'

describe('TwurpleModule', () => {
  it('forRoot doit retourner un DynamicModule valide', () => {
    const options = {
      config: { authProvider: {} },
      features: {},
    } as any

    const dynamicModule = TwurpleModule.forRoot(options)

    expect(dynamicModule.module).toBe(TwurpleModule)
    expect(dynamicModule.imports).toHaveLength(1)
    expect((dynamicModule.imports as any[])[0].module).toBe(TwurpleCoreModule)
    expect(dynamicModule.exports).toEqual([TwurpleCoreModule])
  })

  it('forRootAsync doit retourner un DynamicModule valide', () => {
    const asyncOptions = {
      useFactory: () => ({ config: { authProvider: {} } }),
      inject: ['CONFIG'],
      imports: [],
    }

    const dynamicModule = TwurpleModule.forRootAsync(asyncOptions as any, 'main')

    expect(dynamicModule.module).toBe(TwurpleModule)
    expect(dynamicModule.imports).toHaveLength(1)
    expect((dynamicModule.imports as any[])[0].module).toBe(TwurpleCoreModule)
    expect(dynamicModule.exports).toEqual([TwurpleCoreModule])
  })
})

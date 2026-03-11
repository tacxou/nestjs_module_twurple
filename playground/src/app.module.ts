import { Module } from '@nestjs/common'
import { TwurpleModule, TwurpleOptions } from '@tacxou/nestjs_module_twurple'
import { ConfigModule, ConfigService } from '@nestjs/config'
import cfgapp from './config'
import { AppService } from './app.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [await cfgapp],
    }),
    TwurpleModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        // const cfg = config.get<TwurpleOptions>('twurple.options')
        // console.log('cfg', cfg)
        // console.log('cfg', await cfgapp())
        return {
          config: (await cfgapp()).twurple.options,
          features: {
            chat: true,
          },
        }
      },
    }),
  ],
  providers: [AppService],
})
export class AppModule {
}

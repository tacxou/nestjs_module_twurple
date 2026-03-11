import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import cfgapp from './config'

;(async () => {
  await cfgapp()
  const app = await NestFactory.createApplicationContext(AppModule)
  app.enableShutdownHooks()
})()

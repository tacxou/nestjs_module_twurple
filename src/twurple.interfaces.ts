import { AuthProvider } from '@twurple/auth'
import { ModuleMetadata, Type } from '@nestjs/common'
import { ChatClientOptions } from '@twurple/chat'
import { ApiConfig } from '@twurple/api'
import { PubSubClientConfig } from '@twurple/pubsub/lib/PubSubClient'

export interface TwurpleModuleOptions {
  config: TwurpleOptions
  features?: {
    api?: boolean
    chat?: boolean
    pubsub?: boolean
  }
}

export interface TwurpleModuleFeatureOptions {
  [key: string]: any
}

export interface TwurpleOptions {
  authProvider: AuthProvider
  features?: {
    api?: TwurpleModuleFeatureOptions & Partial<ApiConfig>
    chat?: TwurpleModuleFeatureOptions & Partial<ChatClientOptions>
    pubsub?: TwurpleModuleFeatureOptions & Partial<PubSubClientConfig>
  }
}

export interface TwurpleModuleOptionsFactory {
  createTwurpleModuleOptions(): Promise<TwurpleModuleOptions> | TwurpleModuleOptions
}

export interface TwurpleModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[]
  useClass?: Type<TwurpleModuleOptionsFactory>
  useExisting?: Type<TwurpleModuleOptionsFactory>
  useFactory?: (...args: any[]) => Promise<TwurpleModuleOptions> | TwurpleModuleOptions
}

import {
  TWURPLE_MODULE_CONNECTION,
  TWURPLE_MODULE_CONNECTION_CHAT_TOKEN,
  TWURPLE_MODULE_CONNECTION_PUBSUB_TOKEN,
  TWURPLE_MODULE_CONNECTION_API_TOKEN,
  TWURPLE_MODULE_OPTIONS_TOKEN,
} from './twurple.constants'
import { TwurpleModuleOptions } from './twurple.interfaces'
import { Logger } from '@nestjs/common'

type TwurpleFeatureName = 'api' | 'chat' | 'pubsub'

function createFeatureDisabledError(feature: TwurpleFeatureName, decoratorName: string): Error {
  return new Error(
    `Twurple feature "${feature}" is disabled. Enable options.features.${feature} and options.config.features.${feature} before using @${decoratorName}().`,
  )
}

function createDisabledFeatureProxy<T>(feature: TwurpleFeatureName, decoratorName: string): T {
  const throwFeatureDisabled = (): never => {
    throw createFeatureDisabledError(feature, decoratorName)
  }
  const ignoredProperties = new Set<string>([
    'then',
    'catch',
    'finally',
    'constructor',
    'toString',
    'toJSON',
    'valueOf',
    'onModuleInit',
    'onApplicationBootstrap',
    'onModuleDestroy',
    'beforeApplicationShutdown',
    'onApplicationShutdown',
  ])

  return new Proxy({}, {
    get(_target, prop) {
      if (typeof prop === 'symbol') {
        if (prop === Symbol.toPrimitive) {
          return () => `[Twurple feature "${feature}" disabled]`
        }

        // Node.js inspect symbol
        if (String(prop) === 'Symbol(nodejs.util.inspect.custom)') {
          return () => `[Twurple feature "${feature}" disabled]`
        }

        return undefined
      }

      // Keep Nest lifecycle/introspection checks silent.
      if (ignoredProperties.has(prop)) {
        return undefined
      }

      // Delay the exception until actual usage (method call).
      return () => throwFeatureDisabled()
    },
    set() {
      throwFeatureDisabled()
      return false
    },
  }) as T
}

export function getTwurpleOptionsToken(connection: string): string {
  return `${connection || TWURPLE_MODULE_CONNECTION}_${TWURPLE_MODULE_OPTIONS_TOKEN}`
}

export function getTwurpleConnectionApiToken(connection: string): string {
  return `${connection || TWURPLE_MODULE_CONNECTION}_${TWURPLE_MODULE_CONNECTION_API_TOKEN}`
}

export function getTwurpleConnectionChatToken(connection: string): string {
  return `${connection || TWURPLE_MODULE_CONNECTION}_${TWURPLE_MODULE_CONNECTION_CHAT_TOKEN}`
}

export function getTwurpleConnectionPubsubToken(connection: string): string {
  return `${connection || TWURPLE_MODULE_CONNECTION}_${TWURPLE_MODULE_CONNECTION_PUBSUB_TOKEN}`
}

export async function createTwurpleApiConnection(options: TwurpleModuleOptions) {
  if (!options?.features?.api) {
    return createDisabledFeatureProxy('api', 'InjectTwurpleApi')
  }
  const { config } = options
  Logger.verbose('Initialize TwurpleApi connection singletion...', 'TwurpleModule')
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { ApiClient } = await import('@twurple/api')
  return new ApiClient({ authProvider: config?.authProvider, ...config?.features?.api })
}

export async function createTwurpleChatConnection(options: TwurpleModuleOptions) {
  if (!options?.features?.chat) {
    return createDisabledFeatureProxy('chat', 'InjectTwurpleChat')
  }
  const { config } = options
  Logger.verbose('Initialize TwurpleChat connection singletion...', 'TwurpleModule')
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { ChatClient } = await import('@twurple/chat')
  return new ChatClient({ authProvider: config?.authProvider, ...config?.features?.chat })
}


export async function createTwurplePubsubConnection(options: TwurpleModuleOptions) {
  if (!options?.features?.pubsub) {
    return createDisabledFeatureProxy('pubsub', 'InjectTwurplePubsub')
  }
  const { config } = options
  Logger.verbose('Initialize TwurplePubsub connection singletion...', 'TwurpleModule')
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { PubSubClient } = await import('@twurple/pubsub')
  try {
    return new PubSubClient({ authProvider: config?.authProvider, ...config?.features?.pubsub })
  } catch (e) {
    console.error('e', e)
  }
}

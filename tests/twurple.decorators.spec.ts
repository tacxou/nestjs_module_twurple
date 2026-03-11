import 'reflect-metadata'
import { describe, expect, it } from 'bun:test'
import { SELF_DECLARED_DEPS_METADATA } from '@nestjs/common/constants'
import { InjectTwurpleApi, InjectTwurpleChat, InjectTwurplePubsub } from '../src/twurple.decorators'
import {
  getTwurpleConnectionApiToken,
  getTwurpleConnectionChatToken,
  getTwurpleConnectionPubsubToken,
} from '../src/twurple.utils'

describe('twurple.decorators', () => {
  it('InjectTwurpleApi utilise le bon token', () => {
    class ApiConsumer {
      // eslint-disable-next-line no-useless-constructor
      constructor(@InjectTwurpleApi('main') public readonly apiClient: unknown) {}
    }

    const metadata = Reflect.getMetadata(SELF_DECLARED_DEPS_METADATA, ApiConsumer)
    expect(metadata).toEqual([{ index: 0, param: getTwurpleConnectionApiToken('main') }])
  })

  it('InjectTwurpleChat utilise le bon token', () => {
    class ChatConsumer {
      // eslint-disable-next-line no-useless-constructor
      constructor(@InjectTwurpleChat('main') public readonly chatClient: unknown) {}
    }

    const metadata = Reflect.getMetadata(SELF_DECLARED_DEPS_METADATA, ChatConsumer)
    expect(metadata).toEqual([{ index: 0, param: getTwurpleConnectionChatToken('main') }])
  })

  it('InjectTwurplePubsub utilise le bon token', () => {
    class PubsubConsumer {
      // eslint-disable-next-line no-useless-constructor
      constructor(@InjectTwurplePubsub('main') public readonly pubsubClient: unknown) {}
    }

    const metadata = Reflect.getMetadata(SELF_DECLARED_DEPS_METADATA, PubsubConsumer)
    expect(metadata).toEqual([{ index: 0, param: getTwurpleConnectionPubsubToken('main') }])
  })
})

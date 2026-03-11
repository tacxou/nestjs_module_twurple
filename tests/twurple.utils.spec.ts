import { describe, expect, it } from 'bun:test'
import {
  createTwurpleApiConnection,
  createTwurpleChatConnection,
  createTwurplePubsubConnection,
  getTwurpleConnectionApiToken,
  getTwurpleConnectionChatToken,
  getTwurpleConnectionPubsubToken,
  getTwurpleOptionsToken,
} from '../src/twurple.utils'
import {
  TWURPLE_MODULE_CONNECTION,
  TWURPLE_MODULE_CONNECTION_API_TOKEN,
  TWURPLE_MODULE_CONNECTION_CHAT_TOKEN,
  TWURPLE_MODULE_CONNECTION_PUBSUB_TOKEN,
  TWURPLE_MODULE_OPTIONS_TOKEN,
} from '../src/twurple.constants'

describe('twurple.utils tokens', () => {
  it('génère les tokens par défaut', () => {
    expect(getTwurpleOptionsToken(undefined as any)).toBe(`${TWURPLE_MODULE_CONNECTION}_${TWURPLE_MODULE_OPTIONS_TOKEN}`)
    expect(getTwurpleConnectionApiToken(undefined as any)).toBe(
      `${TWURPLE_MODULE_CONNECTION}_${TWURPLE_MODULE_CONNECTION_API_TOKEN}`,
    )
    expect(getTwurpleConnectionChatToken(undefined as any)).toBe(
      `${TWURPLE_MODULE_CONNECTION}_${TWURPLE_MODULE_CONNECTION_CHAT_TOKEN}`,
    )
    expect(getTwurpleConnectionPubsubToken(undefined as any)).toBe(
      `${TWURPLE_MODULE_CONNECTION}_${TWURPLE_MODULE_CONNECTION_PUBSUB_TOKEN}`,
    )
  })

  it('génère les tokens pour une connexion nommée', () => {
    expect(getTwurpleOptionsToken('secondary')).toBe(`secondary_${TWURPLE_MODULE_OPTIONS_TOKEN}`)
    expect(getTwurpleConnectionApiToken('secondary')).toBe(`secondary_${TWURPLE_MODULE_CONNECTION_API_TOKEN}`)
    expect(getTwurpleConnectionChatToken('secondary')).toBe(`secondary_${TWURPLE_MODULE_CONNECTION_CHAT_TOKEN}`)
    expect(getTwurpleConnectionPubsubToken('secondary')).toBe(`secondary_${TWURPLE_MODULE_CONNECTION_PUBSUB_TOKEN}`)
  })
})

describe('twurple.utils factories', () => {
  it('createTwurpleApiConnection retourne null si feature api absente', async () => {
    const result = await createTwurpleApiConnection({ config: { authProvider: {} }, features: {} } as any)
    expect(result).toBeNull()
  })

  it('createTwurpleChatConnection retourne null si feature chat absente', async () => {
    const result = await createTwurpleChatConnection({ config: { authProvider: {} }, features: {} } as any)
    expect(result).toBeNull()
  })

  it('createTwurplePubsubConnection retourne null si feature pubsub absente', async () => {
    const result = await createTwurplePubsubConnection({ config: { authProvider: {} }, features: {} } as any)
    expect(result).toBeNull()
  })
})

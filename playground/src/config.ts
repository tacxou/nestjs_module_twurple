import { TwurpleOptions } from "@tacxou/nestjs_module_twurple"
import { exchangeCode  , RefreshingAuthProvider } from "@twurple/auth"
import fs from 'fs/promises'

export interface ConfigInstance {
  twurple: {
    options: TwurpleOptions
  }
}

// noinspection JSUnresolvedReference
export default async (): Promise<ConfigInstance> => {
  // const tokenData = await getAppToken(
  //   process.env['STREAMKITS_TWURPLE_CLIENTID'] ?? '',
  //   process.env['STREAMKITS_TWURPLE_CLIENTSECRET'] ?? '',
  // )
  // console.log(tokenData)
  // const tokenData = {
  //   accessToken: '[ACCESS_TOKEN]',
  //   refreshToken: '[REFRESH_TOKEN]',
  //   expiresIn: 1,
  //   obtainmentTimestamp: 0,
  // }

  const params = new URLSearchParams({
    client_id: process.env.STREAMKITS_TWURPLE_CLIENTID!,
    redirect_uri: 'https://a1b2c3d4.ngrok-free.app',
    response_type: 'code',
    scope: [
      'chat:read',
      'chat:edit',
      'channel:read:redemptions'
    ].join(' ')
  });

  const url = `https://id.twitch.tv/oauth2/authorize?${params}`;

  console.log(url);

  // const tokenData = await exchangeCode(
  //   process.env['STREAMKITS_TWURPLE_CLIENTID'] ?? '',
  //   process.env['STREAMKITS_TWURPLE_CLIENTSECRET'] ?? '',
  //   '[CODE]',
  //   'https://a1b2c3d4.ngrok-free.app',
  // )
  // console.log(tokenData)

  const tokenData = JSON.parse(await fs.readFile('./tokens.125328655.json', 'utf-8'))
  const authProvider = new RefreshingAuthProvider({
    clientId: process.env['STREAMKITS_TWURPLE_CLIENTID'] ?? '',
    clientSecret: process.env['STREAMKITS_TWURPLE_CLIENTSECRET'] ?? '',
  })
  authProvider.onRefresh(async (userId, newTokenData) => await fs.writeFile(`./tokens.${userId}.json`, JSON.stringify(newTokenData, null, 4), 'utf-8'))
  await authProvider.addUserForToken(tokenData, ['chat'])

  return {
    twurple: {
      options: {
        authProvider,
        features: {
          api: {},
          chat: {
            channels: ['tacxtv'],
            logger: {
              minLevel: 'debug',
            }
          },
          pubsub: {},
        },
      },
    },
  }
}

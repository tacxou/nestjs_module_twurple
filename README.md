<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" />
  </a>
</p>

<p align="center">
  Twitch API/Chat/PubSub with Twurple NestJS module
</p>

<p align="center">
  <a href="https://www.npmjs.com/org/tacxou"><img src="https://img.shields.io/npm/v/@tacxou/nestjs_module_twurple.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/org/tacxou"><img src="https://img.shields.io/npm/l/@tacxou/nestjs_module_twurple.svg" alt="Package License" /></a>
  <a href="https://github.com/tacxou/nestjs_module_rcon/actions/workflows/ci.yml"><img src="https://github.com/tacxou/nestjs_module_rcon/actions/workflows/ci.yml/badge.svg" alt="Publish Package to npmjs" /></a>
</p>
<br>

# Twurple Module
Twurple for NestJS Framework

## Install dependencies
```bash
yarn add @tacxou/nestjs_module_twurple
```
## Tests
```bash
bun test tests
bun test tests --watch
bun test tests --coverage --coverage-reporter lcov
```

## Instanciate
```ts
// app.module.ts
import { TwurpleModule, TwurpleOptions } from '@tacxou/nestjs_module_twurple'

TwurpleModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => ({
    config: config.get<TwurpleOptions>('twurple.options'),
  }),
})
```
## Usage
```ts
// twitch.service.ts
import { FactorydriveService } from '@tacxou/nestjs_module_factorydrive'

@Injectable()
export class FileStorageService {
  public constructor(
    @InjectTwurpleApi() private readonly twurpleApi: ApiClient,
    @InjectTwurpleChat() private readonly twurpleChat: ChatClient,
    @InjectTwurplePubsub() private readonly twurplePubSub: PubSubClient,
  ) {
    // ...

    this.twurpleChat.onMessage(async (channel, user, message) => {
      if (message === '!ping') {
        this.twurpleChat.say(channel, 'Pong!')
      }
    })
    
    // ...
  }
}
```

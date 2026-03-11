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
  <a href="https://codecov.io/gh/tacxou/nestjs_module_twurple" ><img src="https://codecov.io/gh/tacxou/nestjs_module_twurple/graph/badge.svg?token=uDR4AqU12U"/></a>
  <a href="https://github.com/tacxou/nestjs_module_twurple/actions/workflows/release.yml?event=workflow_dispatch"><img alt="GitHub contributors" src="https://github.com/tacxou/nestjs_module_twurple/actions/workflows/release.yml/badge.svg"></a>
</p>
<br>

# Twurple Module
Twurple module for the NestJS framework.

## Installation

Install the package with your preferred package manager:

```bash
# bun
bun add @tacxou/nestjs_module_twurple

# npm
npm install @tacxou/nestjs_module_twurple

# yarn
yarn add @tacxou/nestjs_module_twurple

# pnpm
pnpm add @tacxou/nestjs_module_twurple
```

## Quick start examples

### 1) Configure the module

```ts
// app.module.ts
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TwurpleModule, TwurpleOptions } from '@tacxou/nestjs_module_twurple'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TwurpleModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        config: {
          authProvider: config.getOrThrow<TwurpleOptions['authProvider']>('TWURPLE_AUTH_PROVIDER'),
          chatChannels: config.get<string[]>('TWURPLE_CHAT_CHANNELS', []),
        },
      }),
    }),
  ],
})
export class AppModule {}
```

### 2) Inject and use Twurple clients

```ts
// twitch.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common'
import {
  InjectTwurpleApi,
  InjectTwurpleChat,
  InjectTwurplePubsub,
} from '@tacxou/nestjs_module_twurple'
import { ApiClient } from '@twurple/api'
import { ChatClient } from '@twurple/chat'
import { PubSubClient } from '@twurple/pubsub'

@Injectable()
export class TwitchService implements OnModuleInit {
  constructor(
    @InjectTwurpleApi() private readonly api: ApiClient,
    @InjectTwurpleChat() private readonly chat: ChatClient,
    @InjectTwurplePubsub() private readonly pubSub: PubSubClient,
  ) {}

  async onModuleInit() {
    this.chat.onMessage((channel, user, message) => {
      if (message === '!ping') {
        void this.chat.say(channel, `Pong @${user}`)
      }
    })

    // Example API call
    const me = await this.api.users.getMe()
    console.log(`Twurple connected as: ${me?.displayName ?? 'unknown user'}`)

    // Example PubSub subscription
    // (adapt to your auth flow and topics)
    // await this.pubSub.registerUserListener(...)
  }
}
```

## Official Twurple documentation

This module wraps and exposes Twurple clients for NestJS.
For questions about Twurple classes, methods, events, and behavior, always refer to the official Twurple documentation:

- https://twurple.js.org/
- https://twurple.js.org/docs/
- https://twurple.js.org/reference/
- https://twurple.js.org/reference/chat/classes/ChatClient.html
- https://twurple.js.org/reference/api/classes/ApiClient.html
- https://twurple.js.org/reference/pubsub/classes/PubSubClient.html

## Tests
```bash
bun test tests
bun test tests --watch
bun test tests --coverage --coverage-reporter lcov
```

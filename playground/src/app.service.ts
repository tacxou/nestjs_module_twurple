import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { InjectTwurpleChat } from '@tacxou/nestjs_module_twurple'
import { ChatClient, ChatMessage } from '@twurple/chat'
import { readFileSync } from 'fs'

@Injectable()
export class AppService implements OnApplicationBootstrap {
  private readonly package: Partial<any>
  protected readonly logger: Logger = new Logger(AppService.name)

  public constructor(@InjectTwurpleChat() private readonly chat: ChatClient) {
    this.package = JSON.parse(readFileSync('package.json', 'utf-8'))
  }

  public onApplicationBootstrap() {
    this.logger.log(`Now listening with version <${this.package.version}> 🕹️`)

    this.chat.onMessage((channel, user, message) => {
      if (message === '!ping') {
        void this.chat.say(channel, `Pong @${user}`)
      }
    })

    void this.chat.connect()

    this.chat.onConnect(() => {
      this.logger.log('Chat connected')
    })

    this.chat.onDisconnect(() => {
      this.logger.log('Chat disconnected')
    })

  }
}

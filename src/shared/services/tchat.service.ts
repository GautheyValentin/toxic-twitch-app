import { addMessage, updateStatus } from '@redux/slices/users.slice';
import store from '@redux/store';
import { User } from '@redux/types/app.types';
import { TWITCH_CLIENT_ID } from '@shared/constant';
import { client as IrcClient, Client, ChatUserstate } from 'tmi.js';

class TchatService {
  private client?: Client;

  private _channel?: string;

  async connect(user: User) {
    await this.disconnect();

    this.client = new IrcClient({
      options: {
        clientId: TWITCH_CLIENT_ID,
        skipMembership: true,
        skipUpdatingEmotesets: true,
      },
      identity: {
        username: user.displayName,
        password: user.token,
      },
    });

    this.client.on(
      `message`,
      (channel: string, user: ChatUserstate, message: string) => {
        store.dispatch(
          addMessage({
            user,
            message,
          }),
        );
      },
    );

    this.client.on(`timeout`, (_: string, username: string, reason: string) =>
      this.error(`timeout`, `${username} | ${reason}`),
    );

    this.client.on(`ban`, (_: string, username: string, reason: string) => {
      this.error(`ban`, `${username} | ${reason}`);
    });

    this.client.on(`connected`, this.update.bind(this));
    this.client.on(`disconnected`, this.update.bind(this));
    this.client.on(`join`, this.update.bind(this));
    this.client.on(`part`, this.update.bind(this));
    this.client.on(`reconnect`, this.update.bind(this));
    this.client.on(`connecting`, this.update.bind(this));

    await this.client.connect();

    if (this._channel) await this.join(this._channel);
  }

  update() {
    store.dispatch(
      updateStatus({
        status: this.client?.readyState() || ``,
        channelConnected: this.client?.getChannels().join(`,`) || ``,
      }),
    );
  }

  async error(type: string, message: string) {
    store.dispatch(
      addMessage({
        message: `${type} : ${message}`,
        isError: true,
      }),
    );
  }

  async join(channel: string) {
    if (this.client) {
      await Promise.all(
        this.client
          .getChannels()
          .map(async (channel) => this.client?.part(channel)),
      );
    }

    this._channel = channel;

    try {
      await this.client?.join(channel);
    } catch (e) {
      this.error(`JOIN`, e as string);
    }
  }

  async host(from: string, to: string) {
    try {
      await this.client?.host(from, to);
    } catch {
      //
    }
  }

  async disconnect() {
    try {
      await this.client?.disconnect();
    } catch {
      // SILENT
    }
  }

  get channel() {
    return this._channel;
  }

  async say(message: string) {
    if (this._channel) {
      try {
        await this.client?.say(this._channel, message);
      } catch (e) {
        this.error(`Error`, (e as any).message);
      }
    }
  }
}

export default new TchatService();

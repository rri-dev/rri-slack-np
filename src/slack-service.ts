import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';
dotenv.config();
export class SlackService {
    client: WebClient;
    defaultChannel: string;
    token: string;
    debug: boolean = process.env.DEBUG === 'true';

    constructor(client?: WebClient) {
        
        const token = process.env.SLACK_BOT_TOKEN;
        const defaultChannel = process.env.SLACK_CHANNEL;

        if (!token) {
            throw new Error('SLACK_BOT_TOKEN is not defined');
        }
        if (!defaultChannel) {
            throw new Error('SLACK_CHANNEL is not defined');
        }

        this.token = token;
        this.client = client || new WebClient(this.token);
        this.defaultChannel = defaultChannel;
    }

    async sendMessage(message: string, channelId?: string): Promise<void> {

        const logPrefix = '::SlackService--sendMessage::';
        const channel = channelId || this.defaultChannel
        console.log(`token:${this.token}`);
        console.log(`channel:${channel}`);

        try {
            await this.client.chat.postMessage({
                channel: channel,
                text: message
            });
            if(this.debug) console.log(`${logPrefix}Message sent to Slack channel ${channel}`);
        } catch (err: any) {
            if(this.debug) console.log(`${logPrefix}error: ${err.message}`);
        }

    }
    
}
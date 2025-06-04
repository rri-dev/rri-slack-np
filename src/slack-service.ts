import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';
import fs from 'fs';
import os from 'os';
import { Parser } from 'json2csv';
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

    randStr(length: number) {
        if (length > 128) throw new Error(`max length supported is 128`);
        return require("crypto").randomBytes(64).toString("hex").slice(0,length);
    }

    async sendMessage(message: string, channelId?: string): Promise<void> {

        const logPrefix = '::SlackService--sendMessage::';
        const channel = channelId || this.defaultChannel;

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

    async sendCsv(headers: string[], rows: Record<string, string>[], channelId?: string): Promise<void> {

        const logPrefix = '::service--SlackService--sendCsvContent::';
        const channel = channelId || this.defaultChannel;

        const tempDir = os.tmpdir(), fileName = this.randStr(10);
        const tempFilePath = `${tempDir}/${fileName}.csv`;
        
        try {

            const csv = headers.join(',') + '\n' + rows.map(row =>
                headers.map(header => `"${String(row[header]).replace(/"/g, "")}"`).join(','),
            ).join('\n');

            console.log('csv:',csv);

            fs.writeFileSync(tempFilePath, csv);
            console.log(`file written to temp directory: ${tempFilePath}`);

            await this.client.files.uploadV2({
                channel_id: channel,
                file: fs.createReadStream(tempFilePath),
                filename: tempFilePath.split('/').pop(),
                title: fileName,
            });

            console.log(`${logPrefix} Uploaded CSV to Slack channel ${channel}`);

        } catch (err: any) {
            console.log(`${logPrefix} error: ${err.message}`);
            throw err;

        } finally{
            if(fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
            }
        }
    }

    async sendCsvFromObjectArray(objs: any[], channelId?: string): Promise<void> {

        const logPrefix = '::service--SlackService--sendCsvFromObject::';

        const tempDir = os.tmpdir(), fileName = this.randStr(10);
        const tempFilePath = `${tempDir}/${fileName}.csv`;

        try {
            const parser = new Parser();
            const csvStr = parser.parse(objs);
            const channel = channelId || this.defaultChannel;
            
            fs.writeFileSync(tempFilePath, csvStr);
            if (this.debug) console.log(`file written to temp directory: ${tempFilePath}`);

            await this.client.files.uploadV2({
                channel_id: channel,
                file: fs.createReadStream(tempFilePath),
                filename: tempFilePath.split('/').pop(),
                title: fileName,
            });

            if (this.debug) console.log(`${logPrefix} Uploaded CSV to Slack channel ${channel}`);
        } catch (err: any) {
            console.log(`${logPrefix} error: ${err.message}`);
            throw err;
        } finally {
            if (fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
            }
        }
    }
    
}
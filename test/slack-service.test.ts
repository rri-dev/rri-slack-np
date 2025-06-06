import { SlackService } from '../src'; // Updated path
import sinon from 'sinon';
import { WebClient } from '@slack/web-api';
import { expect } from 'chai';
import fs from 'fs';

describe('SlackService', function () {
    let slack: SlackService;
    let postMessageStub: sinon.SinonStub;


    beforeEach(() => {
    const webClientStub: Partial<WebClient> = {
        chat: {
        postMessage: sinon.stub().resolves({ ok: true }),
    } as any,
    };

    postMessageStub = (webClientStub.chat!.postMessage as sinon.SinonStub);
    slack = new SlackService(webClientStub as WebClient);
    });


    afterEach(() => {
        sinon.restore();
    });

    it('should send a Slack message', async function () {
        const message = 'test message';
        const expectedChannel = process.env.SLACK_CHANNEL;

        await slack.sendMessage(message);

        sinon.assert.calledOnce(postMessageStub);
        sinon.assert.calledWith(postMessageStub, {
            channel: expectedChannel,
            text: message,
        });
    });

    it('should send message to a specified channel', async function () {
        const message = 'test message';
        const channel = '#test';

        await slack.sendMessage(message, channel);

        sinon.assert.calledOnce(postMessageStub);
        sinon.assert.calledWith(postMessageStub, {
        channel: channel,
        text: message,
        });
    });

    it('should send a CSV file to a specified channel', async function () {
    
        // Setup
        const channel = '#test';
        const filename = 'test';
        const headers = ['header1', 'header2'];
        const rows = [['value1', 'value2']]

        const uploadV2Stub = sinon.stub().resolves({ ok: true });

        const webClientStub: Partial<WebClient> = {
        files: {
            uploadV2: uploadV2Stub
        } as any
        };

        sinon.stub(fs, 'createReadStream').returns({} as any);

        const slack = new SlackService(webClientStub as WebClient);


        // Run target
        await slack.sendCsv(headers, rows, channel, filename);

        // Outcome
        sinon.assert.calledOnce(uploadV2Stub);
        sinon.assert.calledWith(uploadV2Stub, {
            channel_id: channel,
            file: sinon.match.any,
            filename: 'test.csv',
            title: 'test'
        });
    });

});

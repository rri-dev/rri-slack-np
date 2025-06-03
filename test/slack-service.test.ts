import { SlackService } from "../src/slack-service";
import sinon from 'sinon';
const { expect } = require('chai');

describe('SlackService', function() {

    let svc: SlackService;
    let postMessageStub: sinon.SinonStub;

    beforeEach(() => {
        postMessageStub = sinon.stub().resolves({ ok: true });
        const mockClient = {
            chat: {
                postMessage: postMessageStub
            }
        } as any;

        svc = new SlackService(mockClient);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('sendMessage', function() {

        it('should send a message', async function() {

            await svc.sendMessage(`foo message at ${new Date().toISOString()}`);

            expect(postMessageStub.calledOnce).to.be.true;

        });

    });

});
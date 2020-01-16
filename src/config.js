const CONTRACT_NAME = process.env.CONTRACT_NAME || 'near-chess-devnet';
const DEFAULT_ENV = 'development';

function getConfig(env) {
    switch (env) {
        case 'production':
        case 'development':
            return {
                networkId: 'default',
                nodeUrl: 'https://rpc.nearprotocol.com',
                contractName: CONTRACT_NAME,
                walletUrl: 'https://wallet.nearprotocol.com',
                helperUrl: 'https://near-contract-helper.onrender.com',
            };
        case 'local':
            return {
                networkId: 'local',
                nodeUrl: 'http://localhost:3030',
                keyPath: '~/.near/validator_key.json',
                contractName: CONTRACT_NAME,
                initialBalance: 100000,
            };
        case 'test':
            return {
                networkId: 'local',
                nodeUrl: 'http://localhost:3030',
                contractName: CONTRACT_NAME,
                masterAccount: 'test.near',
                initialBalance: 100000,
            };
        case 'test-remote':
        case 'ci':
            return {
                networkId: 'shared-test',
                nodeUrl: 'http://34.94.13.241:3030',
                contractName: CONTRACT_NAME,
                masterAccount: 'test.near',
            };
        default:
            throw Error(`Unconfigured environment '${env}'. Can be configured in src/config.js.`);
    }
}

module.exports = getConfig;
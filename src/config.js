
const config = {
    baseUrl: 'https://studio.nearprotocol.com/contract-api',
    nodeUrl: 'https://studio.nearprotocol.com/devnet',
    contractName: 'berrychess2'
};

if (!Cookies.getJSON('fiddleConfig') || !Cookies.getJSON('fiddleConfig').nearPages) {
    Cookies.set('fiddleConfig', config);
}
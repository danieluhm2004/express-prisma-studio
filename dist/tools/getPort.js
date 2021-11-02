"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPort = void 0;
const net_1 = require("net");
function getPort() {
    return new Promise((resolve, reject) => {
        const server = (0, net_1.createServer)()
            .on('error', reject)
            .listen(0, () => {
            const address = server.address();
            if (!address || typeof address === 'string' || !address.port) {
                throw Error('Failed to fetch server address information.');
            }
            server.close(() => resolve(address.port));
        });
    });
}
exports.getPort = getPort;

import { createServer } from 'net';

export function getPort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer()
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

import { StudioServer } from '@prisma/studio-server';
import { NextFunction, Request, Response, Router } from 'express';
import proxy from 'express-http-proxy';
import { join } from 'path';
import { cwd } from 'process';
import { getPort } from '.';

export * from './tools';

declare global {
  // eslint-disable-next-line no-var
  var _prismaStudio: StudioServer;
  var _prismaStudioPort: number;
}

export const PrismaStudioMiddleware = (
  prisma: any,
  props?: {
    schemaPath?: string;
    assetPath?: string;
    basePath?: string;
  }
) => {
  const { schemaPath, assetPath, basePath } = {
    schemaPath: './node_modules/.prisma/client/schema.prisma',
    assetPath: './node_modules/@prisma/studio/dist',
    basePath: '/client',
    ...props,
  };

  const router = Router();
  const { client, engine } = prisma;
  const staticAssetDir = join(cwd(), assetPath);
  const versions = { prisma: client, queryEngine: engine };
  const PrismaStudioReadyMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!global._prismaStudio) {
      const port = await getPort();
      global._prismaStudioPort = port;
      global._prismaStudio = new StudioServer({
        port,
        schemaPath,
        staticAssetDir,
        versions,
      });

      await global._prismaStudio.start();
    }

    next();
  };

  const getHost = () => `http://localhost:${global._prismaStudioPort}`;
  const PrismaProxy = proxy(getHost, {
    async userResDecorator(proxyRes, proxyResData, req) {
      if (['/http/databrowser.js', '/assets/index.js'].includes(req.path)) {
        const baseURL = req.originalUrl.replace(req.path, '');
        return proxyResData.toString().replace(/\/api/g, join(baseURL, 'api'));
      }

      return proxyResData;
    },
  });

  router.use(PrismaStudioReadyMiddleware);
  router.all('/', (req, res) => res.redirect(join(req.originalUrl, basePath)));
  router.use(basePath, PrismaProxy);
  router.use(PrismaProxy);

  return router;
};

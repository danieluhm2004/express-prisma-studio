"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaStudioMiddleware = void 0;
const studio_server_1 = require("@prisma/studio-server");
const express_1 = require("express");
const express_http_proxy_1 = __importDefault(require("express-http-proxy"));
const path_1 = require("path");
const process_1 = require("process");
const _1 = require(".");
__exportStar(require("./tools"), exports);
const PrismaStudioMiddleware = (prisma, props) => {
    const { schemaPath, assetPath, basePath } = {
        schemaPath: './node_modules/.prisma/client/schema.prisma',
        assetPath: './node_modules/@prisma/studio/dist',
        basePath: '/client',
        ...props,
    };
    const router = (0, express_1.Router)();
    const { client, engine } = prisma;
    const staticAssetDir = !assetPath.startsWith('/')
        ? (0, path_1.join)((0, process_1.cwd)(), assetPath)
        : assetPath;
    const versions = { prisma: client, queryEngine: engine };
    const PrismaStudioReadyMiddleware = async (req, res, next) => {
        if (!global._prismaStudio) {
            const port = await (0, _1.getPort)();
            global._prismaStudioPort = port;
            global._prismaStudio = new studio_server_1.StudioServer({
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
    const PrismaProxy = (0, express_http_proxy_1.default)(getHost, {
        async userResDecorator(proxyRes, proxyResData, req) {
            if (['/http/databrowser.js', '/assets/index.js'].includes(req.path)) {
                const baseURL = req.originalUrl.replace(req.path, '');
                return proxyResData.toString().replace(/\/api/g, (0, path_1.join)(baseURL, 'api'));
            }
            return proxyResData;
        },
    });
    router.use(PrismaStudioReadyMiddleware);
    router.all('/', (req, res) => res.redirect((0, path_1.join)(req.originalUrl, basePath)));
    router.use(basePath, PrismaProxy);
    router.use(PrismaProxy);
    return router;
};
exports.PrismaStudioMiddleware = PrismaStudioMiddleware;

import { StudioServer } from '@prisma/studio-server';
export * from './tools';
declare global {
    var _prismaStudio: StudioServer;
    var _prismaStudioPort: number;
}
export declare const PrismaStudioMiddleware: (prisma: any, props?: {
    schemaPath?: string | undefined;
    assetPath?: string | undefined;
    basePath?: string | undefined;
} | undefined) => import("express-serve-static-core").Router;

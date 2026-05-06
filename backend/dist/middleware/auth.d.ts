import type { Request, Response, NextFunction } from "express";
export declare const authMiddleware: (req: Request & {
    userId?: string;
}, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;

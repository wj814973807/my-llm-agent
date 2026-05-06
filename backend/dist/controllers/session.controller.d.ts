import type { Request, Response } from "express";
export declare const sessionController: {
    validateCreateSession: import("express-validator").ValidationChain[];
    createSession(req: Request & {
        userId?: string;
    }, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getSessions(req: Request & {
        userId?: string;
    }, res: Response): Promise<void>;
    getSession(req: Request & {
        userId?: string;
    }, res: Response): Promise<void>;
    updateSession(req: Request & {
        userId?: string;
    }, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteSession(req: Request & {
        userId?: string;
    }, res: Response): Promise<void>;
};

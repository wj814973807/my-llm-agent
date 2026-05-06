import type { Request, Response } from "express";
export declare const messageController: {
    validateSendMessage: import("express-validator").ValidationChain[];
    sendMessage(req: Request & {
        userId?: string;
    }, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    streamMessage(req: Request & {
        userId?: string;
    }, res: Response): Promise<void>;
    getMessages(req: Request & {
        userId?: string;
    }, res: Response): Promise<void>;
    deleteMessage(req: Request & {
        userId?: string;
    }, res: Response): Promise<void>;
};

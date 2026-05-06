import type { Request, Response } from "express";
export declare const authController: {
    validateLogin: import("express-validator").ValidationChain[];
    validateRegister: import("express-validator").ValidationChain[];
    register(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    login(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
};

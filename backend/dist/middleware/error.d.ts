import type { Request, Response, NextFunction } from "express";
export declare const errorMiddleware: (error: Error, req: Request, res: Response, next: NextFunction) => void;
export declare const notFoundMiddleware: (req: Request, res: Response) => void;

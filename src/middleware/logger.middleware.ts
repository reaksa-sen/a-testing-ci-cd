import { Request,Response, NextFunction } from "express";

 const loggerMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    const method = req.method;
    const url = req.url;
    const time = new Date().toISOString();

    console.log(`[${time}] ${method} request to ${url}`);

    next(); // Pass control to the next middleware or route handler
};

export default loggerMiddleware;
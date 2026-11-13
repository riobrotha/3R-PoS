import { NextFunction, Response } from "express"
import { AuthenticatedRequest } from "../modules/user/user.type"
import response from "../utils/response";
import { StatusCodes } from "http-status-codes";


export default (roles: string[])=> {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) =>{
        const role = req.user?.role;

        if (!role || !roles.includes(role)) {
            return response.error(
                res,
                "Access Denied",
                StatusCodes.FORBIDDEN,
                "You don't have permission for this action."
            );
        }

        next();

    }
}
import {Response} from "express";


export interface AppResponse<
    TLocals extends Record<string, unknown> = Record<string, unknown>
> extends Response {
    locals: TLocals;
}
// custome koa d.ts

import * as Koa from "koa";
import * as stream from "stream";

declare module "koa" {
    export interface Context extends Request, Response {
        session: any;
				render: Function;
		}

}

declare module "http" {
	export interface IncomingMessage extends stream.Readable {
			file: any;
		}
}
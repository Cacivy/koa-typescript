import {LogType, logger} from './logger'

export const resBody = (body:any=null, total:number=0, iserror:boolean=false, msg:string='', code:number=200) => {
	return {
		data: {
			result: body,
		 	total: total
		},
		iserror: iserror ? 1 : 0,
		msg: msg,
		code: code
	}
}

export const resError = (url:string, msg:any, code:number=200) => {
	logger(LogType.error, msg, url)
	return resBody(null, 0, true, msg.message, code)
}

export const resInfo = (msg:any) => {
	logger(LogType.info, msg)
	return resBody(null, 0, false, msg)
}
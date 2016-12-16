import {LogType, logger} from './logger'

export const resBody = (body:any=null, total:number=0, error:boolean=false, msg:string='') => {
	return {
		result: body,
		total: total,
		error: error,
		msg: msg
	}
}

export const resError = (url:string, msg:any) => {
	logger(LogType.error, msg, url)
	return resBody(null, 0, true, msg.message)
}

export const resInfo = (url:string, msg:any) => {
	logger(LogType.info, msg)
	return resBody(null, 0, false, msg)
}
import * as fs from 'fs'
import Log from '../model/log'

enum LogType {
	error,
	info,
	danger,
	ok,
	test
}

interface LogModel {
	time: Date
	type: String
	msg: String
	url: String
}

const logger = (type: LogType, msg: any, url?: string) => {
	let date = new Date()
	// db
	var log: LogModel = {
		url: url,
		time: new Date(),
		type: LogType[type],
		msg: msg.toString()
	}
	new Log(log).save()

	// .log file
	let day = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
	let time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

	let buf: Buffer = new Buffer(`
url: ${url}
time: ${day} ${time}
type: ${LogType[type]}
msg: ${msg}
------------------------------
	`)

	let path = `${__dirname}'/../../logs/${day}.log`
	fs.readFile(path, (err, data:Buffer) => {
		if (!data) {
			fs.writeFileSync(path, buf)
		} else {
			fs.appendFileSync(path, buf)
		}
	})
}

export {
	LogType, logger
}

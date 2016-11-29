import * as fs from 'fs'

enum LogType {
	error,
	info,
	danger,
	ok,
	test
}

const logger = (type: LogType, msg: any) => {
	let date = new Date()
	let day = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
	let time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
	let buf: Buffer = new Buffer(`
	time: ${day} ${time}
	type: ${type}
	msg: ${msg}
	------------------------------
	`)

	let path = `${__dirname}'/../log/${day}.txt`
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

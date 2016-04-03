
"use strict"





const fs        = require('fs')
const constants = require('../commons/constants')





const readProcFile = (fpath, callback) => {

	const isReadable = fs.F_OK & fs.R_OK

	fs.access(fpath, isReadable, accessErr => {

		if (accessErr) {
			return callback(accessErr, null)
		}

		fs.readFile(fpath, constants.encodings.ascii, (readErr, content) => {

			// call both callbacks.
			callback(readErr, content)

			// todo add watch file read instead.
			fs.watchFile(fpath, ( ) => {
				fs.readFile(fpath, constants.encodings.ascii, callback)
			})

		})

	})

}





module.exports = readProcFile

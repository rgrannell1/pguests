
"use strict"




const is        = require('is')
const commons   = require('../commons/commons')
const constants = require('../commons/constants')




const removeClosed = events => {

	removeClosed.precond(events)

	var unclosed       = [ ]

	const socketEvents = [
		constants.events.socketStart,
		constants.events.socketEnd
	]

	const sockets = events.filter(event => {
		return socketEvents.indexOf(event.event) !== -1
	})

	const ipGroups = commons.groupBy(
		event => {
			return event.socket.remote.ip

		},
		sockets
	)

	Object.keys(ipGroups).forEach(ip => {

		const ipGroup     = ipGroups[ip]
		const closeEvents = ipGroup.filter(event => {
			return event.event === constants.events.socketEnd
		})

		if (closeEvents.length === 0) {
			unclosed = unclosed.concat(ipGroup)
		}

	})

	return unclosed

}

removeClosed.precond = events => {
	is.always.array(events)
}





var report = { }





report.live = function (events) {

	report.live.precond(events)

	events = removeClosed(events)

	const remoteIps = commons.groupBy(event => {
		return event.socket.remote.ip
	}, events)

	Object.keys(remoteIps).forEach(ip => {

		console.log(ip)
		const remotePorts = remoteIps[ip]

		remotePorts.forEach(event => {

			const timestamp = event.socket.metadata.timestamp

			const hours     = commons.padString(2, timestamp.getHours( ))
			const minutes   = commons.padString(2, timestamp.getMinutes( ))
			const seconds   = commons.padString(2, timestamp.getSeconds( ))

			const service   = event.socket.remote.service
			const hostname  = event.socket.remote.hostname

			const displayService   = service  ? service  : event.socket.remote.port
			const displayHostname  = hostname ? hostname : constants.messages.unknownHost
			const displayTimestamp = `${hours}:${minutes}.${seconds}`

			console.log(`    ${displayService}    ${displayHostname}    ${displayTimestamp}`)

		})


	})

}

report.live.precond = events => {
	is.always.array(events)
}





report.shutdown = events => {

	report.shutdown.precond(events)

	events = removeClosed(events)

	const remoteIps = commons.groupBy(event => {
		return event.socket.remote.ip
	}, events)

	Object.keys(remoteIps).forEach(ip => {

		console.log(ip)
		const remotePorts = remoteIps[ip]

		remotePorts.forEach(event => {

			const timestamp = event.socket.metadata.timestamp

			const hours     = commons.padString(2, timestamp.getHours( ))
			const minutes   = commons.padString(2, timestamp.getMinutes( ))
			const seconds   = commons.padString(2, timestamp.getSeconds( ))

			const service   = event.socket.remote.service
			const hostname  = event.socket.remote.hostname

			const displayService   = service  ? service  : event.socket.remote.port
			const displayHostname  = hostname ? hostname : constants.messages.unknownHost
			const displayTimestamp = `${hours}:${minutes}.${seconds}`

			console.log(`    ${displayService}    ${displayHostname}    ${displayTimestamp}`)

		})

	})

}

report.shutdown.precond = events => {
	is.always.array(events)
}





module.exports = report

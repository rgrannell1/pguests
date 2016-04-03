
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




const formatEvents = events => {

	const remoteIps = commons.groupBy(event => {
		return event.socket.remote.ip
	}, events)

	const output = { }

	Object.keys(remoteIps).map(ip => {

		output[ip] = remoteIps[ip].map(event => {

			return {
				service:   formatEvents.service(event, event.socket.remote.service),
				hostname:  formatEvents.hostname(event.socket.remote.hostname),
				timestamp: formatEvents.timestamp(event.socket.metadata.timestamp)
			}

		})
	})

	return output

}

formatEvents.service = (event, service) => {
	return service ? service  : event.socket.remote.port
}

formatEvents.hostname = hostname => {
	return hostname ? hostname : constants.messages.unknownHost
}

formatEvents.timestamp = timestamp => {

	const hours     = commons.padString(2, timestamp.getHours( ))
	const minutes   = commons.padString(2, timestamp.getMinutes( ))
	const seconds   = commons.padString(2, timestamp.getSeconds( ))

	return `${hours}:${minutes}.${seconds}`

}





var report = { }





report.live = function (events) {

	report.live.precond(events)

	const unclosedEvents   = removeClosed(events)
	const displayedContent = formatEvents(unclosedEvents)

	Object.keys(displayedContent).forEach(ip => {

		console.log(ip)

		displayedContent[ip].forEach(service => {

			Object.keys(service).forEach(prop => {
				console.log(`	${prop} ${service[prop]}`)
			})

			console.log('')

		})

	})

}

report.live.precond = events => {
	is.always.array(events)
}





report.shutdown = events => {

	report.shutdown.precond(events)

	const unclosedEvents   = removeClosed(events)
	const displayedContent = formatEvents(unclosedEvents)

	Object.keys(displayedContent).forEach(ip => {

		console.log(ip)

		displayedContent[ip].forEach(service => {

			const propWidth = Object.keys(service).reduce((max, prop) => {
				return Math.max(max, prop.length)
			}, 0)

			Object.keys(service).forEach(prop => {
				console.log(`	${commons.padString(propWidth, prop)} ${service[prop]}`)
			})

			console.log('')

		})

	})

}

report.shutdown.precond = events => {
	is.always.array(events)
}





module.exports = report


"use strict"





const events     = require('events')

const constants  = require('../commons/constants')
const report     = require('../reporters/report')
const packetData = require('../network/packet-data')





const pguests = rawArgs => {

	const args            = pguests.preprocess(rawArgs)
	const pconn           = packetData(args)

	const state = {
		received: [ ]
	}


	pconn.on(constants.events.socketStart, socket => {

		state.received.push({
			event: constants.events.socketStart,
			socket
		})

		if (args.live) {
			report.live(state.received)
		}

	})

	pconn.on(constants.events.socketEnd, socket => {

		state.received.push({
			event: constants.events.socketEnd,
			socket
		})

		if (args.live) {
			report.live(state.received)
		}

	})

	pconn.on(constants.events.packet, packet => {

		state.received.push({
			event: constants.events.packet,
			packet
		})

		if (args.live) {
			report.live(state.received)
		}

	})

	if (args.timeout) {

		setTimeout(( ) => {

			if (!args.live) {
				report.shutdown(state.received)
			}

			process.exit( )

		}, 1000 * args.timeout)

	}

}




pguests.preprocess = rawArgs => {

	var args = {
		timeout:   parseFloat(rawArgs['--timeout'], 10),
		live:      rawArgs['--live'],
		interface: rawArgs['--interface']
	}

	if (!Number.isFinite(args.timeout) || args.timeout < 0) {
		throw Error(`Invalid timeout ${args.timeout}.`)
	}

	return args

}




module.exports = pguests

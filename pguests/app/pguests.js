
"use strict"





const events         = require('events')

const constants      = require('../commons/constants')
const report         = require('../reporters/report')
const emitPacketData = require('../network/emit-packet-data')





const capturePacketEvents = (args, state, conn) => {

	const packetEvents = [
		constants.events.socketStart,
		constants.events.socketEnd,
		constants.events.packet
	]

	packetEvents.forEach(event => {

		conn.on(event, socket => {

			state.received.push({event, socket})

			if (args.live) {
				report.live(state.received)
			}

		})

	})

	return state

}




const pguests = rawArgs => {

	const args  = pguests.preprocess(rawArgs)
	const pconn = emitPacketData(args)

	const state = capturePacketEvents(args, {
		received: [ ]
	}, pconn)

	/*
		if a non-live timeout is set, display
		packets recieved on exit.
	*/

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


"use strict"





const pcap      = require('pcap')
const events    = require('events')

const constants      = require('../commons/constants')
const findIpMetadata = require('../network/find-ip-metadata')





const wrapSocket = (socket, protocol, ipVersion, callback) => {

	var lastSplit = {
		remote: socket.dst.lastIndexOf(':'),
		local:  socket.src.lastIndexOf(':')
	}

	socket.remote = {
		ip:        socket.dst.slice(0, lastSplit.remote),
		port:      socket.dst.slice(lastSplit.remote + 1),
		protocol,
		ipVersion
	}

	socket.local = {
		ip:        socket.src.slice(0, lastSplit.local),
		port:      socket.src.slice(lastSplit.local + 1),
		protocol,
		ipVersion
	}

	findIpMetadata(socket.remote, (err, hostname, service) => {

		socket.metadata = {
			timestamp: new Date( )
		}

		if (hostname) {
			socket.remote.hostname = hostname
		}

		if (service) {
			socket.remote.service = service
		}

		callback(socket)

	})

}





const listeners = { }

listeners.tcp = (iface, emitter) => {

	const tcpTracker  = new pcap.TCPTracker( )

	try {

		const pcapSession = pcap.createSession(null, 'ip proto \\tcp')

		tcpTracker.on('session', session => {

			wrapSocket(session, 'TCP', 'ipv4', socket => {

				emitter.emit(constants.events.socketStart, session)

				session.on('end', session => {

					wrapSocket(session, 'TCP', 'ipv4', session => {
						emitter.emit(constants.events.socketEnd, session)
					})

				})

			})


		})

		pcapSession.on('packet', rawPacket => {

			const packet = tcpTracker.track_packet(pcap.decode.packet(rawPacket))
			emitter.emit(constants.events.packet, packet)

		})

		return emitter

	} catch (err) {

		if (err.message.indexOf(constants.errFlags.noRootAccess) !== -1) {

			const displayInterface = iface || '<default interface>'

			process.stderr.write(`${displayInterface}: You don't have permission to capture on that device.\n`)
			process.exit(1)

		} else {
			throw err
		}

	}


}




const emitPacketData = args => {

	var emitter = new events.EventEmitter( )
	emitter     = listeners.tcp(args.interface, emitter)

	return emitter

}





module.exports = emitPacketData

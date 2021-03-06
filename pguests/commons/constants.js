
"use strict"





const constants = {
	paths: {
		tcp4: '/proc/net/tcp',
		tcp6: '/proc/net/tcp6',

		udp4: '/proc/net/udp',
		udp6: '/proc/net/udp6'
	},
	tcpStates: [

		'TCP_ESTABLISHED',
		'TCP_SYN_SENT',
		'TCP_SYN_RECV',
		'TCP_FIN_WAIT1',
		'TCP_FIN_WAIT2',
		'TCP_TIME_WAIT',
		'TCP_CLOSE',
		'TCP_CLOSE_WAIT',
		'TCP_LAST_ACK',
		'TCP_LISTEN',
		'TCP_CLOSING',
		'TCP_MAX_STATES'

	],
	encodings: {
		ascii: 'ascii'
	},
	protocols: {
		ipv4: 'ipv4',
		ipv6: 'ipv6'
	},
	events: {
		socket:      'socket',
		socketStart: 'socket',
		socketEnd:   'socket-end',
		packet:      'packet',
		shutdown:    'shutdown'
	},
	signals: {
		sigint: 'SIGINT'
	},
	ansiiEscapes: {
		clearScreen: '\x1Bc'
	},
	messages: {
		unknownHost: '<unknown host>'
	},
	errFlags: {
		noRootAccess: 'Operation not permitted'
	}
}





module.exports = constants
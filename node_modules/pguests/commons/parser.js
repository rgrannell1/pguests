
"use strict"





const parser = {
	procIpAddress: { },
	recordFile:    { }
}





parser.procIpAddress.ipv4 = ip => {

	if (!ip) {
		throw Error('ip4 address was not defined.')
	}

	const addressParts = ip.split(':')

	return {

		ip: addressParts[0]
			.match(/.{1,2}/g)
			.reverse( )
			.map(byte => parseInt(byte, 16))
			.join('.'),

		port: parseInt(addressParts[1], 16),

		ipVersion: 'ipv4'

	}

}

parser.procIpAddress.ipv6 = ip => {

	if (!ip) {
		throw Error('ip6 address was not defined.')
	}

	const addressParts = ip.split(':')

	return {

		ip: addressParts[0]
			.match(/.{1,4}/g)
			.reverse( )
			.join(':'),

		port: parseInt(addressParts[1], 16),

		ipVersion: 'ipv6'

	}

}





parser.recordFile.toLines = content => {
	return content.split('\n').filter(line => {
		return line && line.length > 0
	})
}

parser.recordFile.toRecords = content => {

	return parser.recordFile.toLines(content)
		.map(line => {

			return line.split(/\s+/g).filter(entry => {
				return entry && entry.length > 0
			})

		})

}

parser.recordFile.toHeaders = entries => {

	if (entries.length === 0) {
		throw 'cannot extract headers from length-zero file.'
	} else {
		return entries[0]
	}

}

parser.recordFile.toEntries = entries => {
	return entries.slice(1)
}

parser.recordFile.toLabelledEntries = content => {

	const records = parser.recordFile.toRecords(content)

	const headers = parser.recordFile.toHeaders(records)
	const entries = parser.recordFile.toEntries(records)

	return entries.map(entry => {

		var entryObj = { }

		headers.forEach((header, ith) => {
			entryObj[header] = entry[ith]
		})

		return entryObj

	})

}





parser.parseProcFile = (protocolLabel, ipVersion, content) => {

	return parser.recordFile
		.toLabelledEntries(content)
		.map(entry => {

			// this differs between ipv4 - ipv6.
			const remoteAddressKey  = entry.hasOwnProperty('rem_address') ? 'rem_address' : 'remote_address'

			entry.local_address     = parser.procIpAddress[ipVersion](entry.local_address)
			entry[remoteAddressKey] = parser.procIpAddress[ipVersion](entry[remoteAddressKey])

			entry.metadata          = {
				timestamp: Date.now( ),
				ipVersion: ipVersion,
				protocol:  protocolLabel

			}

			return entry

		})

}





parser.procTcp = parser.parseProcFile.bind({ }, 'TCP')
parser.procUdp = parser.parseProcFile.bind({ }, 'UDP')





module.exports = parser

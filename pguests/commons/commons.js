
"use strict"




const ipAddress = require('ip-address')





const commons = {
	async:   { },
	sort:    { },
	deparse: { }
}




commons.groupBy = (fn, coll) => {

	var groups = { }

	coll.forEach(val => {

		var key = fn(val)

		if (groups.hasOwnProperty(key)) {
			groups[key].push(val)
		} else {
			groups[key] = [val]
		}

	})

	return groups

}




commons.padString = (num, str) => {

	var outString = str

	for (var ith = str.length; ith < num; ++ith) {
		outString += ' '
	}

	return outString

}

commons.maxByKeys = (fn, keys, objs) => {

	return objs.map(obj => {

		var out = { }

		keys.forEach(key => {
			out[key] = Math.max( out[key], fn(obj[key]) )
		})

		return out

	})

}





commons.async.map = (fn, data, callback, acc) => {

	accum = acc || [ ]

	if (data.length === 0) {
		return callback(accum)
	}

	fn(data[0], function ( ) {

		commons.async.map(
			fn, data.slice(1), callback,
			accum.concat( [Array.prototype.slice.call(arguments)] ))

	})

}

commons.async.pmap = (fn, data, callback) => {

	const acc = [ ]

	acc.watchPush = toPush => {

		acc.push(toPush)

		if (acc.length === toPush.length) {
			return callback(acc)
		}

	}

	data.forEach(datum => {

		fn(datum, function ( ) {
			acc.watchPush(Array.prototype.slice.call(arguments))
		})

	})

}





/*
	the algorithm is partially taken from user 'Dan' on StackOverflow;
	partitions ipv4 / ipv6 addresses.
*/

commons.sort.byIp = (ipData0, ipData1) => {

	var ipSize = [ipData0, ipData1].map(ipData => {

		const ipSpecifics = ipData.ipVersion === 'ipv4'
			? {separator: '.', converter: 256}
			: {separator: ':', converter: 65536}

		// convert the IP
		const sum = ipData.ip.split(ipSpecifics.separator)
			.reverse( )
			.map((part, ith) => {
				return parseInt(part, 10) * Math.pow(ipSpecifics.converter, ith + 1)
			})
			.reduce((acc, num) => {
				return acc + num
			})

		// separate ipv6 addresses by adding the
		// largest possible ipv4 size to ip.

		return ipData.ipVersion === 'ipv4' ? sum : sum + 1099511627520 + 1

	})

	return ipSize[0] - ipSize[1]

}




commons.deparse.ipv6 = ip => {
	return new ipAddress.Address6(ip).correctForm( )
}



module.exports = commons


"use strict"




const dns = require('dns')





const findIpMetadata = (ipData, callback) => {

	dns.lookupService(ipData.ip, parseInt(ipData.port, 10), (err, hostname, service) => {
		callback(err, hostname, service)
	})
}





module.exports = findIpMetadata
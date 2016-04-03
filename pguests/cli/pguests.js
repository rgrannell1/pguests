#!/usr/bin/env node

"use strict"





const doc = `
Name:
	pguests - Monitor IPs connecting to a machine.

Usage:
	pguests [-i IFACE | --interface IFACE][-P | --preserve-port] [-l | --live] (-t SECONDS | --timeout SECONDS)
	pguests (-h | --help | --version)

Description:
	Pguests (packet guests) tabulates the services that connect to the current machine. The purpose of this tool is
	to get a quick overview of the network connections established when working on tasks like network proxy setup,
	VM cluster setup, etc.

	For example, the following output describes two http and https connections to two private IP addresses.

	10.0.0.4
	    http     service-name.com    19:30
	    https    service-name.com    19:35
	10.0.0.5
	    http     service-name.com    19:40



Options:
	-i IFACE, --interface IFACE      The interface to listen for traffic on. If unspecified,
	     a default interface will be chosen by 'lib_pcap'.
	-t SECONDS, --timeout SECONDS    Now long should this program run for?
	-P, --preserve-port              Should the port ?
	-l, --live                       Report connection information live, rather than on shutdown.
	-h, --help                       Display this documentation.
`





const docopt  = require('docopt').docopt
const pguests = require('../app/pguests.js')

require('babel-polyfill')





pguests(docopt(doc))

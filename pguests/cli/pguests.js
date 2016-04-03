#!/usr/bin/env node

"use strict"





const doc = `
Name:
	pguests - Monitor IPs connecting to a machine.

Usage:
	pguests [-i IFACE | --interface IFACE][-P | --preserve-port] [-l | --live] (-t SECONDS | --timeout SECONDS)
	pguests (-h | --help | --version)

Description:

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

#!/usr/bin/env node
const yargs = require("yargs")
const download = require("./download")
const read = require("./read.js")
const updateNotifier = require('update-notifier')

const pkg = require('../package.json')
updateNotifier({pkg, updateCheckInterval: 1000}).notify()

yargs.usage('usage: $0 <cmd>')
	.command('download', 'to choose an article and then download it', () => { }, () => {
		download()
	})
	.command(["read", "baca"], 'to read the English text', () => { }, () => {
		read()
	})
	.command('han', 'to read to Chinese text', () => { }, () => {
		read("han")
	})
	.command('*', 'to read the English text', () => { }, () => {
		read()
	})
	.demandCommand(1, 'You need at least one command before moving on')
	// .fail(function (msg, err, yargs) {
	// })
	.scriptName("jonki")
	// .alias("help", "h")
	.alias("version", "v")
	.strict()
	.help()
	.argv

const os = require("os")
const path = require("path")
const chalk = require('chalk')
const utils = require("../utils")

const home = os.homedir()

const read = (language) => {
	if (!language) {
		language = "en"
	}
	const cach_file = path.join(home, '.jonki/cache')
	const index_file = path.join(home, '.jonki/index')
	let article = null
	let lastIndex = null
	let currentIndex = null
	return utils.readFromFile(cach_file)
		.then(text => article = JSON.parse(text))
		.then(() => utils.readFromFile(index_file))
		.then(index => lastIndex = (+index))
		.then(lastIndex => {
			if (language === "en") {
				currentIndex = (lastIndex + 1) % article.length
				return utils.writeToFile(path.join(home, '.jonki/index'), currentIndex)
			}
		})
		.then(() => {
			if (language === "en") {
				return console.log(article[currentIndex].en)
			}
			console.log(chalk.gray(article[(lastIndex === -1) ? 0 : lastIndex].han))
		})
		.catch(e => {
			if (e.message.includes("ENOENT: no such ")) {
				console.log(`\r\n[jonki]: fetch an article first, type: \r\n${chalk.blue("jonki download")}`)
				process.exit()
			}
			throw e
		})
}

module.exports = read

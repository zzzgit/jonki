const os = require("os")
const path = require("path")
const chalk = require('chalk')
const samael = require("samael")

const house = path.resolve(os.homedir(), ".jonki")

const read = (language) => {
	if (!language) {
		language = "en"
	}
	const cach_file = path.join(house, 'cache')
	const index_file = path.join(house, 'index')
	let article = null
	let lastIndex = null
	let currentIndex = null
	return samael.readFromFile(cach_file)
		.then(text => article = JSON.parse(text))
		.then(() => samael.readFromFile(index_file))
		.then(index => lastIndex = +index)
		.then((lastIndex) => {
			if (language === "en") {
				currentIndex = (lastIndex + 1) % article.length
				return samael.writeToFile(path.join(house, 'index'), currentIndex)
			}
			return null
		})
		.then(() => {
			if (language === "en") {
				return console.log(article[currentIndex].en)
			}
			return console.log(chalk.gray(article[lastIndex === -1 ? 0 : lastIndex].han))
		})
		.catch((e) => {
			if (e.message.includes("ENOENT: no such ")) {
				console.log(`\r\n[jonki]: fetch an article first, type: \r\n${chalk.blue("jonki download")}`)
				// eslint-disable-next-line unicorn/no-process-exit
				process.exit()
			}
			throw e
		})
}

module.exports = read

const os = require("os")
const path = require("path")
const inquirer = require('inquirer')
const Nyt = require("./parser/Nyt")
const utils = require("../utils")
const nyt = new Nyt()

const home = os.homedir()

const inquire = () => {
	inquirer.prompt([
		{
			name: 'service',
			type: 'list',
			message: 'seletct service:',
			choices: [{ value: "nyt", name: "The New York Times" }],
			default: "nyt",
		},
		{
			name: 'category',
			type: 'list',
			message: 'select categories:',
			choices: answers => {
				if (answers.service === "nyt") {
					return nyt.getCategories()
				}
			},
		},
		{
			name: 'article',
			type: 'list',
			message: 'select articles:',
			choices: answers => {
				if (answers.service === "nyt") {
					return nyt.getArticles(answers.category)
				}
			},
		},
	]).catch(e => {
		console.error(`[jonki][inquirer]: error occurred when selecting menu:`, e)
		process.exit()
	}).then(answers => {
		if (answers.service === "nyt") {
			return nyt.getRows(answers.article)
				.then(rows => utils.writeToFile(path.join(home, '.jonki/cache'), JSON.stringify(rows)))
				.then(() => utils.writeToFile(path.join(home, '.jonki/index'), -1))
				.catch(e => {
					if (e.code === 404) {
						console.error("[jonki][download]: no english translation for this article")
						process.exit()
					}
					throw e
				})
		}
	}).catch(e => {
		console.error(`[jonki]: error occurred when downloading and writing:`, e)
		process.exit()
	})
}

module.exports = inquire

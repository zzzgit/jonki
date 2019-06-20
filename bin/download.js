const os = require("os")
const path = require("path")
const inquirer = require('inquirer')
const samael = require("samael")
const Nyt = require("./parser/Nyt")
const nyt = new Nyt()

const house = path.resolve(os.homedir(), ".jonki")

const inquire = () => {
	inquirer.prompt([
		{
			name: 'service',
			type: 'list',
			message: 'seletct service:',
			choices: [{value: "nyt", name: "The New York Times"}],
			default: "nyt",
		},
		{
			name: 'category',
			type: 'list',
			message: 'select categories:',
			choices: (answers) => {
				if (answers.service === "nyt") {
					return nyt.getCategories()
				}
			},
		},
		{
			name: 'article',
			type: 'list',
			message: 'select articles:',
			choices: (answers) => {
				if (answers.service === "nyt") {
					return nyt.getArticles(answers.category)
				}
			},
		},
	]).catch((e) => {
		console.error(`[jonki][inquirer]: error occurred when selecting menu:`, e)
		// eslint-disable-next-line unicorn/no-process-exit
		process.exit()
	})
		.then((answers) => {
			if (answers.service === "nyt") {
				return nyt.getRows(answers.article)
			}
			return null
		})
		.then(rows => samael.writeToFile(path.join(house, 'cache'), JSON.stringify(rows)))
		.then(() => samael.writeToFile(path.join(house, 'index'), -1))
		.catch((e) => {
			if (e.code === 404) {
				console.error("[jonki][download]: no english translation for this article")
			}
			console.error(`[jonki]: error occurred when downloading and writing:`, e)
			// eslint-disable-next-line unicorn/no-process-exit
			process.exit()
		})
}

module.exports = inquire

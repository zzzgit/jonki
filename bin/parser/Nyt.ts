import Parser from "./Parser"
const cheerio = require('cheerio')
const samael = require("samael")
import Answer from "./Answer"
import Entity from "./Entity"

class Nyt implements Parser {
    domain: string = "https://cn.nytimes.com"
    getRows(aid_url: string): Entity[] {
        return samael.fetch(this.domain + aid_url + "dual/").then(text => {
            const $ = cheerio.load(text)
            const sections = $("main > div.article-area > article section div.article-body-item")
            if (!sections || !sections.length) {
                throw new Error("no Data!")
            }
            let stack = []
            sections.each((index, section) => {
                $(section).children().each((index, row) => {
                    const entities = $(row).children()
                    stack.push({
                        en: entities.eq(0).text(),
                        han: entities.eq(1).text(),
                    })
                })
            })
            return stack
        })
    }
    getCategories(): Promise<Answer[]> {
        return Promise.resolve([
            { "name": "首頁", "value": "https://cn.nytimes.com/zh-hant/" },
            { "name": "國際", "value": "https://cn.nytimes.com/world/zh-hant/" },
            { "name": "中國", "value": "https://cn.nytimes.com/china/zh-hant/" },
            { "name": "商業", "value": "https://cn.nytimes.com/business/zh-hant/" },
            { "name": "科技", "value": "https://cn.nytimes.com/technology/zh-hant/" },
            { "name": "科學", "value": "https://cn.nytimes.com/science/zh-hant/" },
            { "name": "健康", "value": "https://cn.nytimes.com/health/zh-hant/" },
            { "name": "時政", "value": "https://cn.nytimes.com/policy/zh-hant/" },
            { "name": "教育", "value": "https://cn.nytimes.com/education/zh-hant/" },
            { "name": "文化", "value": "https://cn.nytimes.com/culture/zh-hant/" },
            { "name": "風尚", "value": "https://cn.nytimes.com/style/zh-hant/" },
            { "name": "旅遊", "value": "https://cn.nytimes.com/travel/zh-hant/" },
            { "name": "房地產", "value": "https://cn.nytimes.com/real-estate/zh-hant/" },
            { "name": "評論", "value": "https://cn.nytimes.com/opinion/zh-hant/" },
            { "name": "獲獎文章", "value": "https://cn.nytimes.com/topic/20160427/pulitzers-topic/?utm_source=news&utm_medium=nav&utm_campaign=nav-topic-nyt-pulitzer-prizezh-hant/" },
        ])
    }
    getArticles(cid_url: string): Promise<Answer[]> {
        return samael.fetch(cid_url).then(text => {
            const $ = cheerio.load(text)
            const articles = $(".regularSummaryHeadline a")
            const result = []
            articles.each((index, article) => {
                const item = $(article)
                result.push({
                    name: item.text(),
                    value: item.attr("href")
                })
            })
            return result
        })
    }
}

module.exports = Nyt

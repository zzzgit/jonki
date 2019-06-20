import Answer from "./Answer"
import Entity from "./Entity"

interface Parser {
	domain: string
	getCategories(): Promise<Answer[]>
	getArticles(cid_url: string): Promise<Answer[]>
	getRows(aid_url: string): Entity[]
}

export default Parser

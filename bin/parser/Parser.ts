import Answer from "./Answer"
import Entity from "./Entity";

interface Parser {
	domain: string
	getCategories(): Promise<Array<Answer>>
	getArticles(cid_url: string): Promise<Array<Answer>>
	getRows(aid_url: string): Array<Entity>
}

export default Parser

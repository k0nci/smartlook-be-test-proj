export interface Comment {
	id: number;
	author: string;
	createdAt: number;
	content: string;
	parent: number;
	kids: number[];
}

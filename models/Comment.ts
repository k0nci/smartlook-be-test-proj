export interface Comment {
	id: BigInt;
	author: string;
	createdAt: number;
	content: string;
	parent: BigInt;
	kids: BigInt[];
}

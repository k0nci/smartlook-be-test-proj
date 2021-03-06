export interface Story {
	id: BigInt;
	author: string;
	createdAt: number;
	title: string;
	kids: BigInt[];
	url: string;
}

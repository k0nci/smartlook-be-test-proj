export interface Story {
	id: number;
	author: string;
	createdAt: number;
	title: string;
	kids: number[];
	url: string | null;
}

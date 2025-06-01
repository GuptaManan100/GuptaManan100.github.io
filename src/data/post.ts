import { type CollectionEntry, getCollection } from "astro:content";

type B3CollectionEntry = CollectionEntry<"bytes"> | CollectionEntry<"beats"> | CollectionEntry<"books">;

/** filter out draft posts from all B³ collections based on the environment */
export async function getAllPosts(): Promise<B3CollectionEntry[]> {
	const [bytes, beats, books] = await Promise.all([
		getCollection("bytes", ({ data }) => import.meta.env.PROD ? !data.draft : true),
		getCollection("beats", ({ data }) => import.meta.env.PROD ? !data.draft : true),
		getCollection("books", ({ data }) => import.meta.env.PROD ? !data.draft : true)
	]);
	
	return [...bytes, ...beats, ...books];
}

/** groups posts by year (based on publishDate), using the year as the key
 *  Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so.
 */
export function groupPostsByYear(posts: B3CollectionEntry[]) {
	return posts.reduce<Record<string, B3CollectionEntry[]>>((acc, post) => {
		const year = post.data.publishDate.getFullYear();
		if (!acc[year]) {
			acc[year] = [];
		}
		acc[year]?.push(post);
		return acc;
	}, {});
}

/** returns all tags created from posts (inc duplicate tags)
 *  Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so.
 *  */
export function getAllTags(posts: B3CollectionEntry[]) {
	return posts.flatMap((post) => [...post.data.tags]);
}

/** returns all unique tags created from posts
 *  Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so.
 *  */
export function getUniqueTags(posts: B3CollectionEntry[]) {
	return [...new Set(getAllTags(posts))];
}

/** returns a count of each unique tag - [[tagName, count], ...]
 *  Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so.
 *  */
export function getUniqueTagsWithCount(posts: B3CollectionEntry[]): [string, number][] {
	return [
		...getAllTags(posts).reduce(
			(acc, t) => acc.set(t, (acc.get(t) ?? 0) + 1),
			new Map<string, number>(),
		),
	].sort((a, b) => b[1] - a[1]);
}
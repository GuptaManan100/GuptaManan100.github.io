import { getCollection } from "astro:content";
import { isPublic } from "@/data/post";
import { siteConfig } from "@/site.config";
import { collectionDateSort } from "@/utils/date";
import rss from "@astrojs/rss";

export const GET = async () => {
	const [bytes, beats, books] = await Promise.all([
		getCollection("bytes", isPublic),
		getCollection("beats", isPublic),
		getCollection("books", isPublic)
	]);

	const allPosts = [...bytes, ...beats, ...books].sort(collectionDateSort);

	return rss({
		title: siteConfig.title,
		description: siteConfig.description,
		site: import.meta.env.SITE,
		items: allPosts.map((post) => {
			const category = post.id.startsWith('bytes/') ? 'bytes' : 
							post.id.startsWith('beats/') ? 'beats' : 'books';
			return {
				title: post.data.title,
				description: post.data.description,
				pubDate: post.data.publishDate,
				link: `${category}/${post.id}/`,
			};
		}),
	});
};

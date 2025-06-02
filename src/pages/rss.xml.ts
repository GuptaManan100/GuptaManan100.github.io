import { getCollection } from "astro:content";
import { siteConfig } from "@/site.config";
import { collectionDateSort } from "@/utils/date";
import rss from "@astrojs/rss";

export const GET = async () => {
	const [bytes, beats, books] = await Promise.all([
		getCollection("bytes"),
		getCollection("beats"),
		getCollection("books")
	]);

	const allPosts = [...bytes, ...beats, ...books]
		.filter(post => !post.data.draft)
		.sort(collectionDateSort);

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

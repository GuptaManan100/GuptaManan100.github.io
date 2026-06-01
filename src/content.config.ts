import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

function removeDupsAndLowerCase(array: string[]) {
	return [...new Set(array.map((str) => str.toLowerCase()))];
}

const baseSchema = z.object({
	title: z.string().max(60),
});

const postSchema = ({ image }: { image: any }) =>
	baseSchema.extend({
		description: z.string(),
		coverImage: z
			.object({
				alt: z.string(),
				src: image(),
			})
			.optional(),
		// Book cover (self-hosted, optimized at build). Used on book review pages.
		cover: image().optional(),
		draft: z.boolean().default(false),
		ogImage: z.string().optional(),
		tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
		// Date shown on the post and used for sorting (e.g. when it was originally written).
		publishDate: z
			.string()
			.or(z.date())
			.transform((val) => new Date(val)),
		// Optional date the post actually goes live on the site. Defaults to publishDate.
		// Use this to display an earlier date (e.g. a cross-post's original date) while
		// keeping the post hidden until later.
		liveDate: z
			.string()
			.optional()
			.transform((str) => (str ? new Date(str) : undefined)),
		updatedDate: z
			.string()
			.optional()
			.transform((str) => (str ? new Date(str) : undefined)),
		seriesId: z.string().optional(),
		orderInSeries: z.number().optional(),
		weight: z.number().optional(),
		// Overall star rating (0–5, halves allowed). Used on book listing rows.
		rating: z.number().min(0).max(5).optional(),
	});


const bytes = defineCollection({
	loader: glob({ base: "./src/content/bytes", pattern: "**/*.{md,mdx}" }),
	schema: postSchema,
});

const beats = defineCollection({
	loader: glob({ base: "./src/content/beats", pattern: "**/*.{md,mdx}" }),
	schema: postSchema,
});

const books = defineCollection({
	loader: glob({ base: "./src/content/books", pattern: "**/*.{md,mdx}" }),
	schema: postSchema,
});


export const collections = { bytes, beats, books };

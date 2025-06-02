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
		draft: z.boolean().default(false),
		ogImage: z.string().optional(),
		tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
		publishDate: z
			.string()
			.or(z.date())
			.transform((val) => new Date(val)),
		updatedDate: z
			.string()
			.optional()
			.transform((str) => (str ? new Date(str) : undefined)),
		seriesId: z.string().optional(),
		orderInSeries: z.number().optional(),
		weight: z.number().optional(),
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

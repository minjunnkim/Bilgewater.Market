import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Site title",
      type: "string",
      initialValue: "Bilgewater Market",
    }),
    defineField({
      name: "tagline",
      title: "Homepage tagline",
      type: "string",
      description: "Short line under the brand on the home page",
    }),
    defineField({
      name: "homepageBlurb",
      title: "Homepage blurb",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "contactEmail",
      title: "Public contact email",
      type: "string",
    }),
    defineField({
      name: "shippingNote",
      title: "Shipping note",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "discordUrl",
      title: "Discord URL",
      type: "url",
    }),
    defineField({
      name: "twitterUrl",
      title: "X / Twitter URL",
      type: "url",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});

import { defineArrayMember, defineField, defineType } from "sanity";
import { PopulationInput } from "../components/PopulationInput";

export const inventoryItem = defineType({
  name: "inventoryItem",
  title: "Inventory Item",
  type: "document",
  groups: [
    { name: "classification", title: "Classification", default: true },
    {
      name: "grading",
      title: "Grading",
      hidden: ({ document }) => document?.finish !== "graded",
    },
    { name: "details", title: "Details" },
    { name: "pricing", title: "Pricing" },
    { name: "publishing", title: "Publishing" },
  ],
  fields: [
    defineField({
      name: "finish",
      title: "Finish",
      type: "string",
      group: "classification",
      description: "Is this card graded (slabbed) or raw?",
      options: {
        list: [
          { title: "Graded", value: "graded" },
          { title: "Raw", value: "raw" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cardType",
      title: "Card type",
      type: "string",
      group: "classification",
      description: "What kind of card is this?",
      options: {
        list: [
          { title: "Prize Card", value: "Prize Card" },
          { title: "Signature", value: "Signature" },
          { title: "Overnumber", value: "Overnumber" },
          { title: "Promo", value: "Promo" },
          { title: "Other", value: "Other" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),

    // —— Grading (only when finish = graded) ——
    defineField({
      name: "gradingCompany",
      title: "Grading company",
      type: "string",
      group: "grading",
      hidden: ({ parent }) => parent?.finish !== "graded",
      options: {
        list: [
          { title: "PSA", value: "PSA" },
          { title: "BGS (Beckett)", value: "BGS" },
          { title: "CGC", value: "CGC" },
          { title: "SGC", value: "SGC" },
          { title: "Other", value: "Other" },
        ],
        layout: "radio",
      },
      validation: (rule) =>
        rule.custom((value, context) => {
          const finish = (context.parent as { finish?: string } | undefined)
            ?.finish;
          if (finish === "graded" && !value) {
            return "Select a grading company for graded cards";
          }
          return true;
        }),
    }),
    defineField({
      name: "certNumber",
      title: "Cert number",
      type: "string",
      group: "grading",
      hidden: ({ parent }) => parent?.finish !== "graded",
      description: "Slab certification number from the grading company.",
      validation: (rule) =>
        rule.custom((value, context) => {
          const finish = (context.parent as { finish?: string } | undefined)
            ?.finish;
          if (finish === "graded" && !value) {
            return "Cert number is required for graded cards";
          }
          return true;
        }),
    }),
    defineField({
      name: "grade",
      title: "Grade",
      type: "string",
      group: "grading",
      hidden: ({ parent }) => parent?.finish !== "graded",
      description: 'e.g. "10", "9.5", "Black Label"',
    }),
    defineField({
      name: "population",
      title: "Population",
      type: "number",
      group: "grading",
      hidden: ({ parent }) => parent?.finish !== "graded",
      description:
        "Enter manually from the grader’s pop report. “As of” updates automatically when you change this.",
      components: { input: PopulationInput },
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: "populationAsOf",
      title: "Population as of",
      type: "datetime",
      group: "grading",
      hidden: ({ parent }) => parent?.finish !== "graded",
      description: "Auto-set when Population is updated. You can override if needed.",
      options: { dateFormat: "YYYY-MM-DD" },
      readOnly: false,
    }),
    defineField({
      name: "psaSpecId",
      title: "PSA Spec ID",
      type: "number",
      group: "grading",
      hidden: ({ parent }) =>
        parent?.finish !== "graded" || parent?.gradingCompany !== "PSA",
      description:
        "Optional. From the PSA cert/spec page URL (psacard.com/spec/psa/…). Links Population on the site.",
      validation: (rule) => rule.min(1).integer(),
    }),

    // —— Raw only ——
    defineField({
      name: "condition",
      title: "Condition",
      type: "string",
      group: "classification",
      hidden: ({ parent }) => parent?.finish !== "raw",
      description: 'e.g. "Near Mint", "Lightly Played"',
      validation: (rule) =>
        rule.custom((value, context) => {
          const finish = (context.parent as { finish?: string } | undefined)
            ?.finish;
          if (finish === "raw" && !value) {
            return "Condition is required for raw cards";
          }
          return true;
        }),
    }),

    // —— Details ——
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      group: "details",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "details",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      group: "details",
      rows: 4,
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      group: "details",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "label",
              type: "string",
              title: "Label",
              description: "Front, Back, or other view",
              options: {
                list: [
                  { title: "Front", value: "Front" },
                  { title: "Back", value: "Back" },
                  { title: "Angle", value: "Angle" },
                  { title: "Detail", value: "Detail" },
                  { title: "Other", value: "Other" },
                ],
              },
            }),
            defineField({
              name: "alt",
              type: "string",
              title: "Alt text",
            }),
          ],
        }),
      ],
      validation: (rule) =>
        rule
          .min(2)
          .error("Add at least front and back images (2+)"),
    }),
    defineField({
      name: "set",
      title: "Set",
      type: "string",
      group: "details",
      options: {
        list: [
          { title: "Origins", value: "Origins" },
          { title: "Spiritforged", value: "Spiritforged" },
          { title: "Unleashed", value: "Unleashed" },
          { title: "Other", value: "Other" },
        ],
        layout: "radio",
      },
    }),

    // —— Pricing ——
    defineField({
      name: "priceOnRequest",
      title: "Price on request",
      type: "boolean",
      group: "pricing",
      initialValue: false,
    }),
    defineField({
      name: "askingPrice",
      title: "Asking price (USD)",
      type: "number",
      group: "pricing",
      hidden: ({ parent }) => Boolean(parent?.priceOnRequest),
      validation: (rule) => rule.min(0),
    }),

    // —— Publishing ——
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "publishing",
      options: {
        list: [
          { title: "Available", value: "available" },
          { title: "Pending", value: "pending" },
          { title: "Sold", value: "sold" },
        ],
        layout: "radio",
      },
      initialValue: "available",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured on home",
      type: "boolean",
      group: "publishing",
      initialValue: false,
    }),
    defineField({
      name: "sortOrder",
      title: "Sort order",
      type: "number",
      group: "publishing",
      description: "Lower numbers appear first",
      initialValue: 100,
    }),
  ],
  preview: {
    select: {
      title: "name",
      finish: "finish",
      cardType: "cardType",
      status: "status",
      media: "images.0",
    },
    prepare({ title, finish, cardType, status, media }) {
      const bits = [finish, cardType, status].filter(Boolean);
      return {
        title,
        subtitle: bits.join(" · "),
        media,
      };
    },
  },
});

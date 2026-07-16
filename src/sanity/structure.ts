import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Bilgewater Market")
    .items([
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Site Settings"),
        ),
      S.divider(),
      S.documentTypeListItem("inventoryItem").title("Inventory"),
    ]);

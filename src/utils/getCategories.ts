import { slugifyStr } from "./slugify";
import type { CollectionEntry } from "astro:content";
import postFilter from "./postFilter";

interface Category {
  category: string;
  categoryName: string;
}

const getUniqueCategories = (posts: CollectionEntry<"blog">[]) => {
  const categories: Category[] = posts
    .filter(postFilter)
    .map(post => ({
      category: slugifyStr(post.data.category),
      categoryName: post.data.category,
    }))
    .filter(
      (value, index, self) =>
        self.findIndex(cat => cat.category === value.category) === index
    )
    .sort((catA, catB) => catA.category.localeCompare(catB.category));
  return categories;
};

export default getUniqueCategories;

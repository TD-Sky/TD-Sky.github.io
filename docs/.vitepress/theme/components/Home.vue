<script setup lang="ts">
import { withBase } from "vitepress";
import Pagination from "./Pagination.vue";
import themeConfig from "../config";
import blogStore from "../store";
import { data as posts } from "../posts.data";

const postsPerPage = themeConfig.postsPerPage;

function showPosts() {
  return posts.slice(
    (blogStore.currentPage - 1) * postsPerPage,
    blogStore.currentPage * postsPerPage,
  );
}
</script>

<template>
  <div class="theme-container">
    <ul class="divide-y divide-gray-600">
      <li class="mb-6 p-6" v-for="post of showPosts()">
        <article class="space-y-2 xl:space-y-0 xl:items-baseline">
          <PostInfo
            :date="post.date.string"
            :lastUpdated="post.lastUpdated?.string"
            :category="post.category"
          />
          <h2
            class="pb-2 text-2xl leading-8 font-bold tracking-tight"
            aria-label="post title"
          >
            <a class="text-gray-900 dark:text-white" :href="withBase(post.url)">
              {{ post.title }}
            </a>
          </h2>
          <div
            v-if="post.excerpt"
            class="theme-excerpt"
            v-html="post.excerpt"
          ></div>
          <div class="grid text-base leading-6 font-medium">
            <a
              class="theme-readmore"
              aria-label="read more"
              :href="withBase(post.url)"
            >
              Read more
            </a>
          </div>
        </article>
      </li>
    </ul>
    <Pagination />
  </div>
</template>

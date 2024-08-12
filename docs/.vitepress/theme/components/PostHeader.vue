<script setup lang="ts">
import { useData } from "vitepress";
import { onMounted, onBeforeUnmount, ref } from "vue";
const { page, frontmatter } = useData();

let script: HTMLScriptElement;

const lastUpdated = ref(
  new Date(
    frontmatter.value.lastUpdated || page.value.lastUpdated,
  ).toISOString(),
);

onMounted(() => {
  const dataJsonLD = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: frontmatter.value.title,
    datePublished: frontmatter.value.date,
    dateModified: lastUpdated.value,
  };

  script = document.createElement("script");
  script.setAttribute("type", "application/ld+json");
  script.textContent = JSON.stringify(dataJsonLD);
  document.head.appendChild(script);
});

onBeforeUnmount(() => {
  if (script && script.parentElement) {
    script.parentElement.removeChild(script);
  }
});
</script>

<template>
  <div class="grid">
    <span
      class="mb-2 justify-self-center font-bold text-xl sm:text-2xl text-cyan-700 dark:text-cyan-100"
    >
      {{ frontmatter.title }}
    </span>
    <PostInfo
      class="justify-self-center"
      :date="frontmatter.date.slice(0, 10)"
      :lastUpdated="lastUpdated.slice(0, 10)"
      :category="frontmatter.category"
    />
  </div>
</template>

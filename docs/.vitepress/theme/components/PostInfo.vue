<script setup lang="ts">
import blogStore from "../store";

const props = defineProps<{
  date: string;
  lastUpdated?: string;
  category: string;
}>();

function selectCat() {
  blogStore.selectedCat = props.category;
}
</script>

<template>
  <dl class="pb-2">
    <dt
      class="text-base leading-6 font-medium text-gray-500 dark:text-gray-300"
    >
      <span class="theme-date">📆{{ date }}</span>
      <a v-if="lastUpdated !== undefined">
        | <span class="theme-updated-date">✍{{ lastUpdated }}</span>
      </a>
      | 📂<a
        class="hover:underline"
        href="/category#catName"
        @click="selectCat"
        >{{ category }}</a
      >
    </dt>
  </dl>
</template>

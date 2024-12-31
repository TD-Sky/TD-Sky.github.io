import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://td-sky.github.io", // replace this with your deployed domain
  author: "TD-Sky",
  profile: "https://github.com/TD-Sky/",
  desc: "学习笔记、日常随笔",
  title: "三维天空",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 5,
  postPerPage: 5,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  editPost: {
    url: "https://github.com/satnaing/astro-paper/edit/main/src/content/blog",
    text: "Suggest Changes",
    appendFilePath: true,
  },
};

export const LOCALE = {
  lang: "en", // html lang code. Set this empty and default will be "en"
  langTag: ["en-EN"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/TD-Sky/",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
];

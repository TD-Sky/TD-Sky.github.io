---
title: 详解 gitignore 规则
pubDatetime: 2022-01-11
modDatetime: 2022-03-13
category: git
tags:
  - git
---

## 忽略规则

|    语法     | 解释                                             |
| :---------: | :----------------------------------------------- |
|     `#`     | 向后注释                                         |
|    `*.a`    | 忽略所有`.a`结尾的文件                           |
|  `!lib.a`   | 排除对于`lib.a`的忽略                            |
|   `/TODO`   | 忽略项目根目录下的TODO文件，不包括`subdir/TODO`  |
|  `build/`   | 忽略`build/`目录下的所有文件                     |
| `doc/*.txt` | 忽略`doc/notes.txt`,但不包括`doc/server/arc.txt` |

## 清除缓存

如果在开发的过程中添加或者修改了.gitignore文件，那么它可能不会生效，因为一些需要忽略的文件已经加入了git的追踪列表中，可以通过清除git缓存来使新的.gitignore生效。

```bash
$ git rm -r --cached .
$ git add .
$ git commit -m 'update .gitignore'
```

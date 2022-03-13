+++
title = "清理git项目的commit"
date = 2022-03-13
updated = 2022-03-13
[taxonomies]
categories = ["git"]
+++

有时你用git只是为了版本化备份文件。随着提交次数增多，文件库逐渐积累起大量无用的备份信息。因此你必须定期清理commit。

```bash
$ git checkout --orphan=new
$ git add .
$ git commit -m "New tree"
$ git branch -D main
$ git branch -m main
$ git push -f origin main
```


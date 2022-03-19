+++
title = "pip使用技巧"
date = 2022-01-19
updated = 2022-03-13
[taxonomies]
categories = ["Python"]
+++

## 设置镜像源

一般我用中科大的：`https://pypi.mirrors.ustc.edu.cn/simple/`

全局设置：

```bash
$ sudo pip config set global.index-url <url>
$ pip config set global.index-url <url>
```



## 指定源下载

```bash
$ pip install [包名] -i [url]
```



## 更新

```bash
# 更新pip
$ sudo pip install --upgrade pip

# 更新所有包
$ sudo pip-review --local --interactive
```

类型为`sdist`的包因为不能卸载，故更新会失败。


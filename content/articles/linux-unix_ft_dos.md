+++
title = "Unix与Dos之间互转文本格式"
date = 2022-03-09
updated = 2022-03-13
[taxonomies]
categories = ["Linux"]
+++

## 识别格式

> 依赖：coreutils

od命令能按八进制转出文件数据。

```bash
$ od -bc <file>
```

若结果包含`\r \n`，则文件乃Dos格式；反之为Unix格式。



## 懒人转换

> 依赖：dos2unix

使用`dos2unix`删除文件每一行的`\r`。

```bash
# 覆盖源文件
$ dos2unix <dos>

# 转存为新文件
$ dos2unix -n <dos> <unix>
```

`unix2dos`命令同理。



## Dos单向转换为Unix

> 依赖：coreutils

`tr`命令能转换或删除字符。

```bash
$ tr -d '\r' < <dos> > <unix>
```


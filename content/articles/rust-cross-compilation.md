+++
title = "Rust如何交叉编译到Windows"
date = 2022-01-11
updated = 2022-01-11
[taxonomies]
categories = ["Rust"]
+++

首先，下载Windows的工具链支持：

```bash
$ sudo pacman -S mingw-w64
```

使用`rustup`添加Windows64位的工具链：

```bash
$ rustup target add x86_64-pc-windows-gnu
```

编译到Windows平台：

```bash
$ cargo build --target=x86_64-pc-windows-gnu
```

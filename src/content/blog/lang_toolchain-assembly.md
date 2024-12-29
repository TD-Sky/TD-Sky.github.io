---
title: 汇编工具
pubDatetime: 2022-01-11
modDatetime: 2022-03-13
category: 语言工具链
tags:
  - Binutil
---

## as

- 功能：把**汇编代码(.s)**翻译成**编译单元(.o)**。

- 示意：`assembly.s`  -->  `object.o`

- 使用：

```bash
$ as assembly.s -o object.o
```



## objdump

- 功能：反汇编。

- 示意：`object.o` --> `assembly.s`

- 使用：

```bash
# 反汇编
$ objdump -d object.o

# 事先插入调试信息，可以反汇编时插入源代码
$ gcc -g src.c

# 反汇编目标文件
$ objdump -dS object.o

# 反汇编可执行文件
$ objdump -dS program

# 此命令输出至STDOUT，使用 > 重定向
$ objdump -d object.o > assembly.dis
```

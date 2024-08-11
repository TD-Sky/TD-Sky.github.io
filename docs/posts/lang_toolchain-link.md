---
title: 链接工具
date: 2022-01-11
lastUpdated: 2022-03-13
outline: deep
category: 语言工具链
tags:
- Binutil
---

## ld

- 功能：链接**编译单元(.o)**，生成**可执行文件**。

- 示意：`object_1.o  object_2.o  ......`  -->  `program`

- 使用：

```bash
$ ld object_1.o object_2.o ... -o program
```

- gcc的链接等价于：

```bash
# 不同平台可能不一样；此处仅给出了主要的链接目标
$ ld /usr/lib/crt1.o /usr/lib/crti.o main.o -lc -dynamic-linker /lib/ld-linux.so.2
```

说明

1. `crt1.o`内提供了`_start`入口点，它会调用`main`函数。
2. `-lc`表示需要链接`libc`库。
3. `-dynamic-linker`指定动态链接器`/lib/ld-linux.so.2`



## 静态链接

- 例子：将多个**编译单元**打包成静态库，并链接使用。

```bash
$ ar rs libstack.a stack.o push.o pop.o is_empty.o
ar: creating libstack.a

```

上述命令等价于

```bash
$ ar r libstack.a stack.o push.o pop.o is_empty.o

# 为静态库创建索引
$ ranlib libstack.a

# 静态链接
$ gcc main.c -L . -l stack -I stack -o main
```

- 说明

1. `gcc`的选项：`-L`指定库文件目录，`-l`告示库名(`stack`意为`libstack`)，`-I`指定头文件目录。
2. `gcc -print-search-dirs`查看编译器默认查找的目录。
3. 编译器优先查找库名共享库`libstack.so`，然后再查找静态库`libstack.a`。如果只需链接静态库，则使用选项`static`。

- 为什么要用静态库？**链接器可以只取静态库中需要部分来链接**。



## 动态链接

```bash
# 使用 -f 跟随 编译选项 PIC ，生成 位置无关码
$ gcc -c fPIC stack.c push.c pop.c is_empty.c

# 打包生成 共享库
$ gcc -shared stack.o push.o pop.o is_empty.o -o libstack.so

# 动态链接
$ gcc main.c -L . -l stack -I stack -o main
```

- 查找依赖库

- 查看可执行文件**依赖于**哪些共享库：

```bash
$ ldd main
```

- 添加自己的共享库到**库搜索列表**中的常用方法：？

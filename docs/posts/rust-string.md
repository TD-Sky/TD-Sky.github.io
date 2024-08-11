---
title: Rust的字符串
date: 2022-02-01
lastUpdated: 2022-03-13
outline: deep
category: Rust
tags:
- Rust
---

## 定义与实现

- 字符串是可翻译为一系列字符的字节序列，如何翻译取决于编码。
- 为使用字符串，必须知道其**字节序列**在内存上的开始和结束位置。
- 编程语言围绕字符串构建了各种数据结构，用于存储或获取字符串的某些属性，并添加额外功能以方便地操作字符串。



## C如何使用字符串

**C不规定字符串编码**。C通过**字符指针**使用字符串，其置`\0`于字符串末尾以示终止。

```c
// 栈上可修改字符串
char stack_string[] = "banana";
// 等价于
char s_array[] = {'b', 'a', 'n', 'a', 'n', 'a', '\0'};

// 字符串字面值
const char* string_literal = "banana";

// 堆上可修改字符串
char* heap_string = (char*) malloc(7*sizeof(char));
```



## 指针和引用

**指针**类型实质为`usize`，因市面上64位处理器居多，故其常占**8字节**。

**切片引用**具备**地址**和**长度**两道信息，占**16字节**。而普通引用仅表示有效地址，占**8字节**。



## Rust如何使用字符串

- `str`：表示可字符化数据的**切片**，没有地址和长度信息。

- `&str`：`str`之引用，只读。俗称“字符串切片”，但精确定义应为**字符串切片之引用**。

- `&'static str`：**字符串字面值**，编译期会硬编码至二进制文件。

- `&mut str`：堆上字符串切片之引用，允许**有限**修改切片内容。

- `String`：堆上字符串，实质为`Vec<u8>`的**包装类型**。`capacity`字段记录着空闲空间的大小，内部**字节数**超过它时就翻倍。

- `Box<str>`

- `CStr`

- `CString`



> 参考文章
>
> [Ali Somay - Strings in Rust](https://medium.com/@alisomay/strings-in-rust-28c08a2d3130)


+++
title = "Rust的文件IO"
date = 2022-02-01
updated = 2022-02-01
[taxonomies]
categories = ["Rust"]
+++

## 系统I/O接口

程序不能直接读写文件，必须通过相关的系统API完成，即`read`和`write`两个`syscall`。

它们的签名分别是：

`write(文件描述符, 待写内容的指针, 待写内容的字节数) -> 写入字节数`

系统调用的时间开销很高，因为它必须从用户态切换至内核态。过于频繁的系统调用将带来性能灾难。



## 缓冲区摊销

先看无缓冲区写入操作的代码：

```rust
use std::fs::File; // 文件描述符
use std::io::Result as IOResult; // IO的错误处理
use std::io::Write; // 写操作特质，让File具备写能力

fn main() -> IOResult<()> {
    // 创建文件描述符
    let mut file = File::create("/tmp/unbuffered.txt")?;

    // 直接调用 syscall::write 3次
    file.write(b"foo")?;
    file.write(b"\n")?;
    file.write(b"bar\nbaz\n")?;

    return Ok(());
}
```

使用写缓冲类型包装：

```rust
use std::fs::File;
use std::io::Result as IOResult;
use std::io::Write;
use std::io::BufWriter; // 文件的写缓冲包装类型

fn main() -> IOResult<()> {
    // 包装文件，创建写缓冲区
    let mut bw = BufWriter::new(File::create("x.txt")?);

    // BufWriter::write 把数据写入缓冲字段 Vec<u8>；
    // 缓冲区满或文件关闭会触发 syscall::write 。
    bw.write(b"foo")?;
    bw.write(b"\n")?;
    bw.write(b"bar\nbaz\n")?;

    return Ok(());
}
```

程序的I/O性能就提升了！读操作同理。



## 缓冲区适用场景

**多次**读/写文件必须`BufReader`/`BufWriter`，常见于：

- 逐行读取
- 从文件**序列化**数据



> 参考文章
>
> [Vincent Foley - Unbuffered I/O Can Make Your Rust Programs Much Slower](https://era.co/blog/unbuffered-io-slows-rust-programs)


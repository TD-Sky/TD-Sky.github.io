---
title: Rust：函数、闭包、Fn特质
pubDatetime: 2022-02-01
modDatetime: 2022-03-13
category: Rust
tags:
  - Rust
---

## 特质用途

- FnOnce：闭包持上下文变量的所有权。
- FnMut：闭包有通过可变引用访问上下文。
- Fn：闭包仅通过不可变引用访问上下文，或不访问上下文。

## 依赖关系

`Fn` : `FnMut` : `FnOnce`

## 函数的特质

任何一个函数都实现了`FnOnce, FnMut, Fn, Copy`

## 闭包

- 必定实现`FnOnce`
- 若闭包实现`Fn`, 则必实现`Copy`。
- `move`会移动闭包所捕获变量到自身的**匿名结构体**内，但不影响该闭包实现哪些**Fn特质**。
- 若闭包实现`Fn`，添加`move`，闭包的数据行为(`Copy/Move`)与捕获变量一致。

闭包的**Fn特质**靠编译器的类型推理实现，每个闭包都有属于自己的匿名结构体存储捕获内容，俩闭包即使内容相同，它们的类型也相异。

## 调用

```rust
// 看看 FnOnce 的源码
pub trait FnOnce<Args> {
    type Output;
    extern "rust-call" fn call_once(self, args: Args) -> Self::Output;
}
```

当调用一个函数或闭包时，编译器首先寻找`call`调用，若无则寻`call_mut`，再无则寻`call_once`。

> 参考文章
>
> [Nichts Hsu - Rust 中函数与闭包与 Fn Traits 探讨](https://nihil.cc/posts/rust_fn_traits/)

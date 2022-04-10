+++
title = "Rust智能引用"
date = 2022-03-01
updated = 2022-04-10
[taxonomies]
categories = ["Rust"]
+++

## 模块分类

- `std::ops::Deref`
- `std::convert::AsRef`
- `std::borrow::Borrow`
- `std::borrow::Cow`



## Deref / DerefMut

**Deref**的定义如下：

```rust
pub trait Deref {
    type Target: ?Sized;
    fn deref(&self) -> &Self::Target;
}
```

`deref`是一个被隐式调用的方法，官方称作**deref强转**。

比如，操作`Box<T>`，无需手动解引用取出内容，而是当其外层透明，直接来操作`T`即可。

再比如，类型为`&str`的形参可以接收`&String`，正是因为`String`实现了`Deref<Target = str>`。

如果`T`实现了`Deref<Target = U>`，并且`x`是类型T的一个实例，那么：

- 在不可变的上下文中，`*x`（此时T既不是引用也不是原始指针）操作等价于`*Deref::deref(&x)`。
- `&T`的值会强制转换为`&U`的值。
- 相当于`T`实现了`U`的所有（不可变）方法。比如，`Vec<T>`通过实现`Deref<Target = [T]>`而共享了**切片**的所有方法。



## AsRef / AsMut

```rust
pub trait AsRef<T>
where
    T: ?Sized,
{
    fn as_ref(&self) -> &T;
}
```

`as_ref`用于通过引用的显式类型转换。

比如，`String`实现了`AsRef<str>`，能够显式转换。



## Borrow / BorrowMut

```rust
pub trait Borrow<Borrowed> 
where
    Borrowed: ?Sized, 
{
    fn borrow(&self) -> &Borrowed;
}
```

`Borrow`是用来表示**借用数据**。Rust一贯会为不同语义提供不同类型的表示。

`Borrow`的适用场景：

- 统一抽象不同类型的借用。

- 建立一个数据结构，它以同等方式处理**自拥有值**和**借用值**。例如`hash`和`cmp`。包装出来长这样：

```rust
fn get<Q>(&self, key: &Q) -> Option<&V>
where
    K: Borrow<Q>,
    Q: Hash + Eq + ?Sized
{
    // ...
}
```



## Cow

写时复制（Copy On Write）：大部分业务场景读多写少，利用`Cow`，仅在首次**写**的时候才复制对象，大大减少了复制次数。

```rust
pub enum Cow<'a, B>
where
    B: 'a + ToOwned + ?Sized,
 {
    Borrowed(&'a B),
    Owned(<B as ToOwned>::Owned),
}
```

`Cow`实现了`Deref`，对内部的只读访问透明。但`Cow`未实现`DerefMut`。

若需修改其内容，抑或需要内容的所有权，可调用`to_mut`方法。注意：
  - `to_mut`的功能是**生成具备所有权的值之可变引用**。
  - 不具备所有权，调用`to_mut`会`clone`此值。
  - 已具备所有权，调用`to_mut`不再`clone`。

`into_owned`会通过创建**所有权对象**，但是：
  - 如果之前`Cow`中的值是**借用状态**，它将执行`clone`。
  - 本方法会**消费**`Cow`实例。



> 参考文章
>
> [张汉东 - Rust Concept Clarification: Deref vs AsRef vs Borrow vs Cow](https://dev.to/zhanghandong/rust-concept-clarification-deref-vs-asref-vs-borrow-vs-cow-13g6)


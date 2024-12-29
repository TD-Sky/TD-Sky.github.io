---
title: 线性筛
pubDatetime: 2022-04-04
modDatetime: 2022-04-04
category: 算法
tags:
  - algorithm
---

在自然数列的前n项中寻找全部素数的算法称为**素数筛**。

最朴素的筛法是逐项施用**试除法**，效率显然很低。

古希腊数学家**Ἐρατοσθένους**发明了更快的**埃氏筛**，后由**Euler**改进成**线性筛**。

线性筛相比埃氏筛，不会重复标记合数，时间复杂度降至**O(n)**。

> 埃氏筛的时间复杂度是**O(nloglogn)**，推导过程详见[OI Wiki：筛法](https://oi-wiki.org/math/number-theory/sieve/#_2)

## 实现

为达O(n)时间复杂度，我们恪守**最小质因数筛除原则**，筛除质数之倍数时便能避免重复标记。

伪代码如下：

```rust
// 给定上限to，寻找前to项的全部素数
fn linear_sieve(to: Index) -> Sequence {
    let composites = Set;
    let primes = Sequence;

    // 因为总循环从2开始，合数从前往后筛，
    for i in 2..=to {
        // 我们能假设未筛除者皆为质数
        if i not in composites {
            primes.push(i);
        }

        for prime in { primes 且 i * prime <= to } {
            // 用当前项乘已知素数，标记所得合数；
            composites.insert(i * prime);

            if i % prime == 0 { // *
                break;
            }
        }
    }

    return primes;
}
```

## 原理

线性筛的核心在于，只允许合数被它的最小质因数筛除，故而编程时是不保证合数按大小次序筛除的。

例如，对 a<sub>n</sub> = 4，2筛除了8，`*`处代码会立即结束内循环，以保证2能在之后乘6筛除12。

为什么要在此时结束循环？因为核心原则。注意，每次内循环，都有固定的因数a<sub>n</sub>，而作为另一因数的质数按升序取用。一旦遇见因数不互质的情况，即质数p整除 a<sub>n</sub>，说明此次外循环的最小质因数筛除已达上限。

重返例子 a<sub>n</sub> = 4，已知素数乘其可得8、12，但12的最小质因数是2，应该由2筛除，故内循环没必要继续。根据质数分解定理，**最小质因数蕴含于当前项**。

合数表在前**⌜n / 2⌝**项便已完成，遍历前n项是为了集齐质数表。

> ## 参考
>
> - [Pecco - 算法学习笔记(17)：素数筛](https://zhuanlan.zhihu.com/p/100051075)
> - [TD-Sky: Rust实现线性筛](https://github.com/TD-Sky/algorithm-rs/blob/main/combinatorics/src/permutation.rs)

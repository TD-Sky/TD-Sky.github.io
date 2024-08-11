---
title: 生成全排列
date: 2022-03-22
lastUpdated: 2022-03-23
outline: deep
category: 算法
tags:
- algorithm
---

在学习组合数学时，研究重点一般在组合数上，对排列组合本身却不甚关心。毕竟所操作集合动则数十个元素，手算是不现实的。

然而，编程要求我们重视组合本身。因为许多问题可以通过遍历全排列解决，计算机科学家必须设计可行的全排列生成算法。

幸运的是，此算法业已诞生，它能够按字典序递增生成全排列。



## 实现

首先必须明确一点，我们所说的**排列**，其输入乃集合。集合具备元素互异性，经排列操作所得数组集合同样元素互异。

当然组合学不可能停留在如此狭窄的定义上。相当多问题里，排列组合的根本不是集合，元素会重复出现（密码生成），抑或元素分类存在（单词重组）。不过这些已经超出这篇文章的范畴了。我们讨论最简单情况——**全排列**。

以下伪代码接收一个互异数组，并生成字典序+1的全排列。

```rust
/// arr: 长度≥1，非降序排列的数组
fn next_permutation(arr: Array)
{
    let rmost_lt = { 数组最右侧，满足小于关系的下标 };

    let supermum = { 位于 rmost_lt 右侧的最小上确界之下标 };

    arr.swap(rmost_lt, supermum);

    for (head, tail) in [ arr 的rmost_lt 右侧部分 ]
    {
        arr.swap(head, task); // *
    }
}
```

注意`*`部分，它通过交换对称位置的元素，按升序排列`rmost_lt`右侧元素。



## 原理

关键点：从目前全排列切入，思考为什么它会比前一全排列的字典序大1。

如何定义字典序大小？这是相对的，升序最小，降序最大。

可以相差1是什么情况？例如，*362541* 的字典序比 *364125* 小一，原因有二：

- *364125* 比 *362541* 字典序更大；
- 没有其它排列的字典序小于 *364125* 而大于 *362541*。

所以，生成新排列时，应从右往左重排，因为字典序由左即右比较得出。

回想一下判断数列单调性算法，它只要遇到首个相反次序就能断言单调性。同理，我们希望全排列朝着降序的方向变化，必须右起降序化，但局部恢复升序，为接下来的降序化创造机会。

### 演示

再举 *362541* 为例，**索引起点为0**，a[3..6]已经局部字典序最大，所以选定索引2。

a<sub>2</sub>与它的最小上界互换，**这样交换不会破坏右边降序**。因为位置2增大，字典序变大了。数组变为 *364521*。

为了 *之后保持* `a[0..=2] = 364` *同时仍可右起降序化* ，就将2右边升序化，**通过交换右部分首位两端元素实现**。由于右边为降序，这是可行的。最终数组变为 *364125*。



> ## 参考
>
> - [TD-Sky: Rust实现全排列生成器](https://github.com/TD-Sky/run-algorithm/blob/main/combinatorics/src/permutation.rs)
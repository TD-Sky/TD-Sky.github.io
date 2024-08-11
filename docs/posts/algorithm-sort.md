---
title: 排序：复杂度及其证明
date: 2022-04-11
lastUpdated: 2022-04-14
outline: deep
category: 算法
tags:
- algorithm
---

## 冒泡排序

### 时间复杂度

- 最好：$O(n)$
- 平均：$O(n^{2})$
- 最坏：$O(n^{2})$

### 代码

```rust
pub fn bubble<T: Ord>(arr: &mut [T]) {
    for out in 1..arr.len() {
        let mut swapped = false;

        for i in 0..(arr.len() - out) {
            if arr[i] > arr[i + 1] {
                arr.swap(i, i + 1);

                swapped = true;
            }
        }

        if !swapped {
            break;
        }
    }
}
```

### 证明

- 命题：对于长度为 $N$ 的数组，

    - 最坏情况：需要 $\sim \frac{N^{2}}{2}$ 次比较 和 $\sim \frac{N^{2}}{2}$ 次交换；

    - 最好情况：需要 $\sim N$ 次比较 和 $0$ 次交换。

- 证明：

    最坏情况下，最左侧的元素会一路交换到正确位置。比如 $arr_0$ 去到第 $N$ 位，$arr_1$ 去到第 $N - 1$ 位⋯⋯如此类推。因此，总比较次数为 $(N − 1) + (N − 2) + ⋯ + 2 + 1 = \frac{N(N − 1)}{2}$，总交换次数与此一致。

    最好情况下，由于`swapped`变量监视着**未操作部分**是否有序，当第一轮外循环的内循环结束，排序就退出了。故总比较次数是 $N - 1$，没发生交换。



## 选择排序

### 时间复杂度

- 最好：$O(n^{2})$
- 最坏：$O(n^{2})$

### 代码：

```rust
pub fn selection<T: Ord>(arr: &mut [T]) {
    for left in 0..arr.len() {
        let min = (left..arr.len())
                  .min_by_key(|&i| arr.index(i))
                  .unwrap();
        arr.swap(left, min);
    }
}
```

### 论证

- 命题：对于长度为 $N$ 的数组，选择排序需要大约 $\frac{N^{2}}{2}$ 次比较和 $N$ 次交换。

- 证明：

    对于从 0 到 N-1 的任意 left，都有 $1$ 次交换 和 $N - 1 - left$ 次比较。

    因此，共有 N 次交换，以及 $(N-1) + (N-2) + ... + 2 + 1 = N(N-1)/2 \sim N^{2}/2$ 次比较。



## 插入排序

### 时间复杂度

- 最好：$O(n)$
- 平均：$O(n^{2})$
- 最坏：$O(n^{2})$

### 代码

```rust
pub fn insertion<T: Ord>(arr: &mut [T]) {
    for out in 1..arr.len() {
        let mut n = out;
        while out > 0 && arr[n] < arr[n - 1] {
            arr.swap(n, n - 1);

            n -= 1;
        }
    }
}
```

### 论证

- 命题：对于随机排列的长度为 $N$ 且**元素互异**的数组，

    - 平均情况：需要 $\sim \frac{N^{2}}{4}$ 次比较 和 $\sim \frac{N^{2}}{4}$ 次交换；

    - 最坏情况：需要 $\sim \frac{N^{2}}{2}$ 次比较 和 $\sim \frac{N^{2}}{2}$ 次交换；

    - 最好情况：需要 $N - 1$ 次比较 和 $0$ 次交换。

- 证明：

    插入排序是将第 $out$ 个元素插入到**有序排列**的前 $out$ 个元素当中（0起索引）。经过线性搜索，当前元素会插入到最右边的不小于它的元素右侧。

    对于随机排列的数组，在平均情况下每个元素都可能向后移动半个数组的长度，因此交换总数是对角线之下元素总数的一半；比较的总次数是交换的次数加上一个额外的项，该项为 $N$ 减去被插入的元素正好是已知的最小元素的次数。

    最坏情况下，线性搜索会比较 $out + 1$ 次（0起索引），故**总比较次数**为 $2 + 3 + ⋯ + N = \frac{N(N + 1)}{2} − 1$，即 $\sim N^{2}/2$。同时，每回交换次数为比较次数减一，因此**总交换次数**为 $\frac{N(N - 1)}{2}$。

    最好情况下，显然，总比较次数为 $N - 1$。没有元素交换，故总交换次数为 $0$。

    平均情况不会证。



## 归并排序

### 时间复杂度

- 最好：$O(n\log_{2}{n})$
- 平均：$O(n\log_{2}{n})$
- 最坏：$O(n\log_{2}{n})$

### 空间复杂度

需要辅助数组，乃 $O(n)$ 。

### 代码

```rust
use std::mem;

pub fn msort<T: Ord + Clone>(arr: &mut [T]) {
    let mut aux: Vec<T> = arr.into();

    merge(arr, &mut aux);
}

fn merge<T: Ord + Clone>(arr: &mut [T], aux: &mut [T]) {
    let len = arr.len();

    if len < 2 {
        return;
    }

    let mid = len / 2;

    let (arr_l, arr_r) = arr.split_at_mut(mid);
    let (aux_l, aux_r) = aux.split_at_mut(mid);

    merge(arr_l, aux_l);
    merge(arr_r, aux_r);

    let mut left = 0;
    let mut right = mid;

    for x in aux.iter_mut() {
        if left >= mid || (right < len && arr[left] > arr[right]) {
            mem::swap(x, &mut arr[right]);
            right += 1;
        } else {
            mem::swap(x, &mut arr[left]);
            left += 1;
        }
    }

    arr.clone_from_slice(aux);
}
```

### 论证

- 命题：对于长度为 $N$ (偶数) 的数组，

    - 最坏情况下比较次数**分治递归关系式**：$M(N) = 2M(\frac{N}{2}) + N$

    - 归并排序时间复杂度：$O(n\log_{2}{n})$

    - 归并排序空间复杂度：$O(n)$

- 证明：

    归并会将 $N$ 长数组拆分成两个 $\frac{N}{2}$ 长数组，并再次归并排序两者。待两子数组排完序，当前排序将合并重排它们，发生 $N$ 次比较。故得 $M(N) = 2M(\frac{N}{2}) + N$。

    根据**分治递归关系主定理**，可知归并排序的时间复杂度是 $O(N\log_{2}{N})$ 。

    归并排序递归开辟函数栈的空间复杂度是 $O(\log_{2}{N})$ ；创建一个等长辅助数组的空间复杂度是 $O(N)$ 。因此归并排序的空间复杂度是**两行为复杂度**之和，$\max(O(\log_{2}{N}), O(N)) = O(N)$ 。



## 堆排序

### 时间复杂度

- 最好：$O(n\log_{2}{n})$
- 平均：$O(n\log_{2}{n})$
- 最坏：$O(n\log_{2}{n})$

### 代码

```rust
fn sink<T: Ord>(arr: &mut [T], mut parent: usize) {
    let last = arr.len() - 1;

    loop {
        let left = 2 * parent + 1;

        if left > last {
            break;
        }

        let right = left + 1;

        let max = match left != last && arr[right] > arr[left] {
            true => right,
            false => left,
        };

        if arr[parent] < arr[max] {
            arr.swap(parent, max);
        }

        parent = max;
    }
}

pub fn heap<T: Ord>(arr: &mut [T]) {
    let len = arr.len();

    if len < 2 {
        return;
    }

    for parent in (0..=len / 2 - 1).rev() {
        sink(arr, parent);
    }

    for end in (1..len).rev() {
        arr.swap(0, end);

        sink(&mut arr[..end], 0);
    }
}
```

### 论证

- 命题：对于长度为 $N$ 的数组，最坏情况下需要 $\sim \frac{3N}{2}\log_{2}{N}$ 次比较。

- 证明：

    对于构建大顶堆循环的任意 $parent$ ，都有从二叉树深度为 $parent$ 处向下比较交换，忽略退出条件的校验，则构建大顶堆所需总比较次数为 $\log_{2}{2} + \log_{2}{3} + ⋯ + \log_{2}{(\frac{N}{2} - 1)}$ ，其 $\sim \frac{N}{2}\log_{2}{N}$。

    接下来，从后往前遍历截至堆顶下，交换堆顶与堆底最右侧叶子，即置换最大元素与最小元素，并重新堆化剩余元素。因为每次堆化都调用`sink`，故总比较次数为 $\log_{2}{N} + \log_{2}{N - 1} + \log_{2}{N - 2} + ⋯ + \log_{2}{1}$ ，其 $\sim N\log_{2}{N}$。

    综上，最坏情况下比较次数 $\sim \frac{3N}{2}\log_{2}{N}$。

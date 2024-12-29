---
title: 计算机组成原理：数据
pubDatetime: 2022-03-03
modDatetime: 2022-03-13
category: 计算机架构
tags:
  - Computer Architecture
---

## 二进制

### 进制转换

- 十进制 -> 二进制：除2取余，逆序排列
- 二进制 -> 十进制：二进制扩展表示法

### 电压编码

逻辑电路难以精确测量某处电压，它定义接近0的电压为**0**，而远离0的电压为**1**。

### 位矢量

各位意义相互独立的二进制码。

位矢量可用作**掩码**。

例如，整数为奇则二进制末位为1，整数为偶则二进制末位为0。令其按位与仅末位为1的掩码，根据结果可判断其奇偶性。

再如，有符号整数**按位与**仅首位为1的掩码，根据结果可判断其是否为负。

这个判断方式是什么呢？因为计算机非常“笨”，它事先准备好所有可能的二进制码，待结果得出后比较是否相等。



## 数据类型

A particular representation is **data type** if there are operations in the computer that can operate on information that is encoded in that representation.

### 数字类型

下文整数默认为**十进制**。

#### 无符号整数

即非负整数，“无符号”意即没有**符号位**存放`-`信息。

其编码方式为，整数按升序映射到二进制数。

#### 有符号整数

##### 2的补码表示法

有符号整数的表示法颇多。其中，**2的补码表示法**在运算上**互洽**，即二进制数与整数的**算术操作**呈双射。它能最简化逻辑电路设计，因此被广泛采用。

示例，`[00000, 11111] <-> [-16, 15]`：

|二进制数| 有符号整数 |
|-------:|-----------:|
| 00000  |      0     |
| 00001  |      1     |
| 00010  |      2     |
| 00011  |      3     |
| 00100  |      4     |
| 00101  |      5     |
| 00110  |      6     |
| 00111  |      7     |
| 01000  |      8     |
| 01001  |      9     |
| 01010  |      10    |
| 01011  |      11    |
| 01100  |      12    |
| 01101  |      13    |
| 01110  |      14    |
| 01111  |      15    |
| 10000  |     -16    |
| 10001  |     -15    |
| 10010  |     -14    |
| 10011  |     -13    |
| 10100  |     -12    |
| 10101  |     -11    |
| 10110  |     -10    |
| 10111  |     -9     |
| 11000  |     -8     |
| 11001  |     -7     |
| 11010  |     -6     |
| 11011  |     -5     |
| 11100  |     -4     |
| 11101  |     -3     |
| 11110  |     -2     |
| 11111  |     -1     |

表示法递推公式：

```
B(0) = 0b0
B(1) = 0b1
B(d + 1) = B(d) + B(1)
```

正负转换公式：

```
-B = !B + B(1)
```

##### 符号延展

符号位为0，前添0；符号位为1，前添1。

常用于两**表示长度**不一致的整数之运算。缩写**SEXT**。

##### 上溢

数字运算进位上溢将污染符号位，故运算超出当前表示法范围是**错误**。

#### 浮点数

浮点数牺牲精确度，以表示极大数和极小数。

32位浮点数布局，字段皆为二进制：

|  1   |     8    |    23    |
|:----:|:--------:|:--------:|
| sign | exponent | fraction |

##### 规范形式

f<sub>32</sub> = (-1)<sup>sign</sup> × 1.fraction × 2<sup>exponent-127</sup> ，exponent ∈ [0b1, 11111110]

有23个小数位，其取值范围涵盖**0b0**，故规范形式的科学计数法之**整数位**为1。因此，32位浮点数具备24位精确度。

指数(exponent)需要减去**偏置**(bias)得出偏置指数。32位浮点数的偏置为127，64位浮点数的偏置为1023。偏置指数的范围与8位有符号整数相似，但为什么不直接用后者作为指数？见[IEEE 754-1985](https://en.wikipedia.org/wiki/IEEE_754-1985)相关段落：

> IEEE 754 adds a bias to the exponent so that numbers can in many cases be compared conveniently by the same hardware that compares signed 2's-complement integers. Using a biased exponent, the lesser of two positive floating-point numbers will come out "less than" the greater following the same ordering as for sign and magnitude integers. If two floating-point numbers have different signs, the sign-and-magnitude comparison also works with biased exponents. However, if both biased-exponent floating-point numbers are negative, then the ordering must be reversed. If the exponent were represented as, say, a 2's-complement number, comparison to see which of two numbers is greater would not be as convenient.

##### 〇

|  1   |     8    |    23    |
|:----:|:--------:|:--------:|
| sign | 00000000 | 00⋯⋯⋯⋯00 |

符号位决定〇的正负。

##### 无穷

`exponent = 11111111` 用于定义无穷：

|  1   |     8    |    23    |
|:----:|:--------:|:--------:|
| sign | 11111111 | 00⋯⋯⋯⋯00 |

##### 异常形式

由`exponent = 00000000`定义，用于表示区间(0, 2<sup>-126</sup>)内的**极小数**：

|  1   |     8    |    23    |
|:----:|:--------:|:--------:|
| sign | 00000000 | fraction |

f<sub>32</sub> = (-1)<sup>sign</sup> × 0.fraction × 2<sup>-126</sup>

### ASCII码

键盘上每个键都有唯一的ASCII码，Shift切换状态也算。



## 位操作

### 算术

- 加法
- B<sub>1</sub> - B<sub>2</sub> = B<sub>1</sub> + (-B<sub>2</sub>)
- 2 * B = B << 1 —— 2乘以整数的二进制扩展形式，使每一扩展位的2指数加一，即二进制数整体左移。

### 逻辑操作

- AND | 与：`&`
- OR | 或：`|`
- NOT | 非：`!`
- Exclusive-OR | XOR | 异或：`^` —— 两输入互异时才输出1

De Morgan律
- `!(x & y) = !x | !y`
- `!(x | y) = !x & !y`

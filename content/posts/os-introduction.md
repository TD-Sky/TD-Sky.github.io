+++
title = "操作系统导论"
date = 2022-04-28
updated = 2022-04-28
[taxonomies]
categories = ["操作系统"]
+++

## 我们为什么需要操作系统？

人类使用计算机的实质是利用算力，而算力来自于集成电路。

然而，直接操作集成电路，效率会很低。我们需要更高级的抽象，在利用好算力资源同时，还可以大展身手。

于是乎，操作系统出现了。（请原谅我轻易越过了单片机)



## 操作系统长啥样

首先，它应该完成管理资源的职责。如你所见，现代计算机常常运行着多个进程，数量起码上百。可硬件资源是有限的，提供算力的**中央处理器**时至今日，**核心**个数也没超过20，它又如何负担起上百个进程？

解决此问题的技术称为**虚拟化**。操作系统将**物理资源**转化为更通用、更强大、更易用的**虚拟资源**，稀少的真实资源在虚拟上下文中可根据需要变成无穷多。

通过虚拟化，操作系统解决了供给数不满足需求数的问题。

不过，操作系统能**同时**运行多个进程呀，又是咋办到的？这涉及**并发**技术。

还有，操作系统不能只计算，不记忆。运行时数据在内存里，而内存即**动态随机存取储存器**(DRAM)，一旦断电或系统崩溃，其将丢失所有数据。现代操作系统使用**硬盘**和**文件系统**持久化存储数据。



## 设计目标

- 虚拟化

- 并发

- 持久化

- 高性能：虚拟化是有代价的，我们必须在提供这种抽象同时，保证没有过多开销。

- 保护：让进程彼此隔离。我们希望多个程序同时运行，必须要确保一个程序的非法行为不会损害到其它程序。

- 可靠性：操作系统必须不间断运行，它的失效会导致其上全部程序失效，因此追求高度可靠性是必要的。

- 环保

- 安全：在高度联网时代，系统安全愈发重要。

- 移动性：随着操作系统在越来越小的设备上运行，移动性愈发重要。

**根据系统的使用方式，操作系统将有不同的目标，因此可能至少以稍微不同的方式实现**。


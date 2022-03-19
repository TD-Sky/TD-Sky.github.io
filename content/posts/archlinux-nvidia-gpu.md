+++
title = "启用NVIDIA显卡"
date = 2022-01-19
updated = 2022-03-13
[taxonomies]
categories = ["ArchLinux"]
+++

Linux与N卡之间是一篇血泪史，任何想在Linux上使用N卡的人势必经历一番折磨。为减轻痛苦，我采用简单粗暴的`optimus-manager`方案。



## N卡驱动

> 依赖: pciutils, pacman

识别显卡型号:

```bash
$ lspci -k | grep -A 2 -E "(VGA|3D)"
```

我的独显是**GTX-1650**，且系统使用标准内核，按照Wiki所述，应安装`nvidia`包。

```bash
$ sudo pacman -S nvidia
```

重启令其生效。



## 显卡管理器

> 依赖: pacman

```bash
# 管理程序，源在archlinuxcn
$ sudo pacman -S optimus-manager

# 图形界面，飞升者专享
$ paru -S optimus-manager-qt
```

重启令其生效。



## 启用

> 依赖: optimus-manager-qt

为了日常能切换显卡，你得设置`optimus-manager-qt`开机启动。

它的图标会出现在状态栏，右键唤出菜单即可切换显卡，它会让你重新登录以完成切换。



## 确认独显工作

> 依赖: pacman

安装监视程序。

```bash
$ sudo pacman -S mesa-utils
```

若你已切换到独显，则按如下操作，有信息返回即成功运行。

```bash
$ glxinfo | grep NVIDIA
```


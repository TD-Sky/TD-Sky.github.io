+++
title = "ArchLinux之休眠"
date = 2022-01-14
updated = 2022-03-13
[taxonomies]
categories = ["ArchLinux"]
+++

休眠，即挂起系统状态到硬盘。

我的系统信息：

- 交换区：内存的两倍大小
- 引导程序：grub
- 根文件系统：lvm-ext4



## 1 修改`grub`的内核参数

编辑`/etc/default/grub`，找到`GRUB_CMDLINE_LINUX_DEFAULT`所在行，在其值末尾插入` resume=/dev/Sky/Swap`，得到：

```ini
GRUB_CMDLINE_LINUX_DEFAULT="loglevel=3 quiet resume=/dev/Sky/Swap"
```

通过配置**交换设备主次(major:minor)码**，令系统即刻获得睡眠功能。

```bash
# 查看交换分区的 MAJ:MIN
$ lsblk
NAME          MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
nvme0n1       259:0    0 476.9G  0 disk
├─nvme0n1p1   259:1    0     2G  0 part /boot/efi
└─nvme0n1p2   259:2    0 474.9G  0 part
  ├─Sky-Root  254:0    0 442.9G  0 lvm  /
  └─Sky-Swap *254:1*    0    32G  0 lvm  [SWAP]

# 登入超级用户
$ su

# 写入配置
$ echo 254:1 > /sys/power/resume
```

更新`grub.conf`文件。

```bash
$ su
$ grub-mkconfig -o /boot/grub/grub.cfg
```



## 2 给内核添加恢复钩子

编辑`/etc/mkinitcpio.conf`，在代码区找到`HOOKS`，依此修改其值：

```ini
HOOKS=(base udev ... block lvm2 resume filesystems)
```

重新编译内核：

```bash
$ su
$ mkinitcpio -p linux
```


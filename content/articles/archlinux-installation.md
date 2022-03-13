+++
title = "Archlinux：安装及配置"
date = 2022-03-02
updated = 2022-03-13
[taxonomies]
categories = ["ArchLinux"]
+++

## 1 系统状态

- 空间划分
    ```
        名称    类型  文件系统   空间    挂载点
    硬盘                        476.9G
    ├─ESP       引导   fat32      2G    /boot/efi
    └─LVM        PV             474.9G
      └─Sky      VG
        ├─Root   LV    ext4     442.9G     /
        └─Swap   LV    swap       32G    [SWAP]
    ```

- 引导程序: grub

- 主机名: stele

- 语言环境: en_US.UTF-8

- 图形界面: X11 + awesome
  - 终端: alacritty
  - 锁屏: slock
  - 透明化: picom
  - 截图: ksnip
  - 程序启动器: rofi
  - 显示管理器: lightdm

- 独立显卡
  - 型号: GeForce GTX 1650 Mobile / Max-Q
  - 管理方案: optimus-manager

- 用户电源管理
  - [x] 关机
  - [x] 锁屏
  - [x] 重启
  - [x] 休眠，挂起到硬盘
  - [x] 睡眠，挂起到内存

- 日用shell: zsh

- 编辑器: neovim

- 代码编辑器: lunarvim

- 网络管理: networkmanager

- 编程环境
  - [x] rust
  - [x] c
  - [x] python

- 字体: nerd, noto

- 传输文件: QQ, android-file-transfer

- 输入法: fcitx + 小鹤双拼



## 2 安装

Linux的安装，不外乎是官方制作一个工具完备的系统，发布其映像供用户刻录，做成安装盘。

因此安装过程已然明了：确保安装盘可用 -> 划分硬盘空间 -> 挂载并初始化系统 -> 进入系统 -> 环境设置 -> 创建引导 -> 退出系统并卸载 -> 离开安装盘

官方会同时维护三个月的映像，为了以防万一，请刻录这三个月的映像。



### 2.1 确保安装盘可用

1. sha1sum校验
2. 验证签名
3. 有时候电脑的固件可能不支持某个映像，此时你可以逐个尝试旧映像，直到成功进入为止。
4. 连接网络，有线或无线均可。
5. 校准时间。



### 2.2 划分硬盘空间

规划：引导分区(ESP)、根分区、交换分区。

根据小道消息，引导分区需要2G，以满足多系统情况下多内核存储。但是，如果使用`grub`引导启动，你可以将Linux内核留在根分区的`/boot`下，而ESP的挂载点设为`/boot/efi`，内存**引导文件**。

系统的分区最好采用`LVM`或`Brtfs`这种**弹性存储**文件系统，允许你未来重新规划硬盘空间。

交换区最大的意义在于**休眠**。创建**swap分区**或`swapfile`均可达到目的，但两者性能孰优孰劣尚未定论。既然拥有弹性存储的能力，我就选择了较稳定方案，即swap分区。



#### 2.2.1 分区

> 依赖: util-linux

例如我的系统硬盘是`nvme0n1`，分区命令这样写：

```bash
$ fdisk /dev/nvme0n1
```

使用指令`g`创建现代分区表`GPT`。

先划**2G**的引导分区`nvme0n1p1`，并打上`EFI`标签。再把剩余空间都划出去`nvme0n1p2`。

注意，分区跟文件系统乃解耦关系，划分空间不会格式化硬盘。



#### 2.2.2 创建LVM

> 依赖: lvm2

```bash
# 创建物理卷
$ pvcreate /dev/nvme0n1p2

# 创建名为 Sky 的卷组
$ vgcreate Sky /dev/nvme0n1p2

# 在 Sky 内创建名为 Swap 的逻辑卷
$ lvcreate -L 32G Sky -n Swap

# 在 Sky 内创建名为 Root 的逻辑卷
$ lvcreate -l +100%FREE Sky -n Root
```



#### 2.2.3 格式化

> 依赖: util-linux, e2fsprogs, dosfstools

```bash
# 引导分区的文件系统为 fat32，通用
$ mkfs.fat -F 32 /dev/nvme0n1p1

# 根分区的文件系统为 ext4
$ mkfs.ext4 /dev/Sky/Root

# 交换分区
$ mkswap /dev/Sky/Swap
```



### 2.3 挂载并初始化系统



#### 2.3.1 挂载

> 依赖: util-linux, coreutils

挂载点在文件系统中表现为**目录**，实质上它类似传送门。挂载点连通着两个分区，操作文件时，良好的抽象掩盖了不同分区的差异。

```bash
# 先把系统分区挂上
$ mount /dev/Sky/Root /mnt

# 创建引导分区的挂载点
$ mkdir -p /mnt/boot/efi

# 挂载引导分区
$ mount /dev/nvme0n1p1 /mnt/boot/efi

# 赋予 Swap 交换能力，-v 为详细模式
$ swapon -v /dev/Sky/Swap
```



#### 2.3.2 初始化

> 依赖: util-linux, arch-install-scripts, coreutils

```bash
# 把基础工具包，内核，固件，neovim 安装至系统
$ pacstrap /mnt base linux linux-firmware nvim

# 生成分区挂载信息，进入系统前会自动挂载
$ genfstab -U /mnt > /mnt/etc/fstab

# 校验分区的UUID，以 lsblk 为准
$ lsblk -f
$ cat /mnt/etc/fstab
```



### 2.4 进入系统

> 依赖: arch-install-scripts

登入新系统，此时运行内核与网络仍属于安装盘。

```bash
$ arch-chroot /mnt
```



### 2.5 环境设置



#### 2.5.1 时间

> 依赖: util-linux, coreutils

```bash
# 时区
$ ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

# 时钟
$ hwclock --systohc
```



#### 2.5.2 本地化

> 依赖: glibc, neovim

编辑`/etc/locale.gen`，反注释以得如下二行。

```csv
en_US.UTF-8 UTF-8
zh_CN.UTF-8 UTF-8
```

```bash
# 生成本地化文件
$ locale-gen

# 因ascii码的历史地位，系统优先使用英语
echo 'LANG=en_US.UTF-8' > /etc/locale.conf
```



#### 2.5.3 pacman配置 & 网络

> 依赖: pacman, neovim, systemd

命名主机：

```bash
$ echo 'stele' > /etc/hostname
```

在`/etc/pacman.d/mirrorlist`中置顶这两行，它们是软件包的**镜像源**，分别位于*北京外国语大学* 和 *中国科技大学*。

```ini
Server = https://mirrors.bfsu.edu.cn/archlinux/$repo/os/$arch
Server = https://mirrors.ustc.edu.cn/archlinux/$repo/os/$arch
```

在`/etc/pacman.conf`底部添加如下内容，之后你就能从`archlinuxcn`源下载软件。

```ini
[archlinuxcn]
Server = https://mirrors.ustc.edu.cn/archlinuxcn/$arch
```

令上述操作生效。

```bash
# 同步包数据库
$ pacman -Sy

# 下载 archlinuxcn 的密钥
$ pacman -S archlinuxcn-keyring
```

下载网络连接工具并部署:

```bash
$ pacman -S networkmanager

$ sudo systemctl enable NetworkManager
```



#### 2.5.4 Initramfs

> 依赖: mkinitcpio, neovim

因为弹性存储型文件系统的关系，需要更改`mkinitcpio`的钩子，再编译一次内核。

在配置文件`/etc/mkinitcpio.conf`的代码区找到`HOOKS`，依此修改其值。注意，钩子顺序是有影响的。

```ini
HOOKS=(base udev ... block lvm2 filesystems)
```

重新编译内核：

```bash
$ mkinitcpio -P
```



#### 2.5.5 设置超级用户密码

> 依赖: shadow

```bash
$ passwd
```

接着写入密码。



### 2.6 创建引导

> 依赖: grub, efibootmgr, os-prober, dosfstools, intel-ucode / amd-ucode

```bash
# 创建引导文件
$ grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=Arch

# 生成 grub 配置
$ grub-mkconfig -o /boot/grub/grub.cfg
```

如此，系统内核跟引导文件就分离了，引导分区出错不会威胁到位于根分区的内核。



### 2.7 退出系统并卸载

> 依赖: util-linux

按`^d`，即`ctrl-d`，退出系统帐号。

在安装盘系统中，递归地卸载`/mnt`下所有设备。

```bash
$ umount -R /mnt
```



### 2.8 离开安装盘

关机，拔安装盘。



## 3 配置

安装好系统不等于能直接使用，你还需要完成繁琐的配置。

接下来，请直接进入系统。



### 3.1 基础构建工具包 & aur helper

> 依赖: pacman

`base-devel`是一个软件包组，提供了构建其他软件必需的工具。Arch连这个包组的软件都没预装，够瘦。

```bash
# 先更新一下你的密钥
$ pacman -Sy archlinux-keyring

$ pacman -S base-devel
:: There are 24 members in group base-devel:
:: Repository core
   1) autoconf
   2) automake
   3) binutils
   4) bison
   5) fakeroot
   6) file
   7) findutils
   8) flex
   9) gawk
   10) gcc
   11) gettext
   12) grep
   13) groff
   14) gzip
   15) libtool
   16) m4
   17) make
   18) pacman
   19) patch
   20) pkgconf
   21) sed
   22) sudo
   23) texinfo
   24) which
Enter a selection (default=all):
# 回车以下载全部
```

**AUR**是Arch的第三方下载源，管理着软件的构建方式（如安装方式、下载地址等）。若将软件比喻为一道菜，那么AUR就是菜谱市场，而**AUR helper**就是找菜谱，根据菜谱做菜的人。虽然AUR常被评价“一堆野包”，但其中的软件包若有质量问题，用户仍能投票让官方人员下架此包。

市面上的AUR helper种类繁多，我选择`paru`。

```bash
$ pacman -S paru
```



### 3.2 交互shell & 创建普通用户

> 依赖: shadow, sudo, neovim

bash古老且停止发展，作为交互shell不符合人体工学。为了日常的最佳体验，你需要更先进的shell。

```bash
# 本体
$ pacman -S zsh

# 插件
$ pacman -S zsh-autosuggestions zsh-completions zsh-syntax-highlighting
```

`root`拥有任意塑造系统的能力，作日常帐户使用过于危险，你需要一个权力受限的帐户。

```bash
# 用户名为door，
# -m 在/home下创建用户目录，-U 创建同名的用户组，-G 指定用户组纳入此用户，-s 指定登录shell
$ useradd -m door -U -G wheel,video,input -s /bin/zsh

# 设置用户密码
$ passwd door
```

允许用户借用超级权限：

```bash
# 临时设置默认编辑器
$ export EDITOR=nvim

# 唤出权限管理文件
$ visudo
```

接着，找到此行并反注释，注释号是`#`！

```
%wheel ALL=(ALL) ALL
```



### 3.3 图形界面支持

> 依赖: pacman, paru

```bash
# 核显驱动，我用的是intel处理器
$ pacman -S xf86-video-intel

# 下载包组，获得X11窗口服务器支持
$ pacman -S xorg

# awesome windows manager
$ pacman -S awesome

# 终端，程序启动器，锁屏，截屏
$ pacman -S alacritty rofi slock ksnip

# 窗口渲染器，这玩意开发非常混乱，我优先用滚动版
$ paru -S picom-git

# nerd字体
$ pacman -S nerd-fonts-complete

# noto字体，简体中文另下
$ pacman -S noto-fonts noto-fonts-emoji noto-fonts-extra
$ paru -S noto-fonts-sc
```



### 3.4 显示管理器

> 依赖: pacman, neovim

显示管理器(DM)是管理用户登录的程序，普通用户经此进入桌面。

```bash
# 本体，迎接器
$ pacman -S lightdm lightdm-gtk-greeter lightdm-gtk-greeter-settings
```

编辑`/etc/lightdm/lightdm.conf`，设置**默认迎接器**。

```ini
[Seat:*]
...
greeter-session=lightdm-gtk-greeter
...
```

部署`lightdm`：

```bash
$ systemctl enable lightdm
```

确保`/home/door`下存在文件`.dmrc`，内含：

```ini
[Desktop]
Session=awesome
```

在`/home/door`下创建`.xprofile`，写入：

```bash
#!/usr/bin/zsh
. ~/.zshrc
```

以全局应用你的个人配置。



### 3.5 输入法

> 依赖: pacman

```bash
# 图标包
$ pacman -S qt5ct kvantum-qt5

# 本体
$ pacman -S fcitx5-im fcitx5-chinese-addons fcitx5-pinyin-zhwiki
```

然后，写入全局变量：

```bash
export QT_QPA_PLATFORMTHEME='qt5ct'
export M_MODULE='fcitx'
export QT_IM_MODULE='fcitx'
export XMODIFIERS='@im=fcitx'
export SDL_IM_MODULE='fcitx'
```

重新登入以令其生效。


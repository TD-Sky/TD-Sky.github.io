---
title: 折腾 ArchLinux 的声卡
date: 2022-01-19
lastUpdated: 2022-03-13
outline: deep
category: Linux
tags:
- Linux
- ArchLinux
---

## 声卡驱动

```bash
$ sudo pacman -S sof-firmware
```

## 音频管理器

```bash
# 本体 及 会话/策略管理器
$ sudo pacman -S pipewire wireplumber

# 替代老牌音频调节器的前端
$ sudo pacman -S pipewire-pulse pipewire-alsa pipewire-jack
```

重开终端，启用相关服务：

```bash
# 启用Pipewire相关服务：
$ systemctl enable pipewire --user
$ systemctl enable pipewire-pulse --user
```

```mermaid
graph LR;

alsa[alsa-lib]
alsa-card-profiles;
alsa-topology-conf-->alsa;
alsa-ucm-conf-->alsa;
alsa-->zita-alsa-pcmi;
alsa-->alsa-plugins;
alsa-->alsa-utils;

pw[pipewire]
mgr[wireplumber]
pw-->mgr;
mgr-->pipewire-alsa;
mgr-->pipewire-pulse;
mgr-->pipewire-jack;
```

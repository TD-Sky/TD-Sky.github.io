---
title: 配置 PostgreSQL
pubDatetime: 2022-07-18
modDatetime: 2022-07-18
category: 数据库
tags:
  - Database
  - PostgreSQL
---

**演示系统**：Archlinux

## 安装

```bash
$ sudo pacman -S postgresql
```



## 管理用户

安装过程会建立名为**postgres**的用户和群组。[^1]

postgres 的家目录为`/var/lib/postgres`，安装结束时隶属于**root**，需要改变其所属：

```bash
$ sudo chown postgres:postgres /var/lib/postgres
```

postgres 默认密码未知，要用超级权限修改：

```bash
$ sudo passwd postgres
```

尔后，凭此密码可登录 postgres ：

```bash
$ su -l postgres
```

> 小窍门：**强行登录**
>
> 若忘记某一用户的密码，可以使用`sudo`来登录，例如：
>
> ```bash
> $ sudo -iu postgres
> ```



## 初始化

首先，登入 postgres 。

在启用 PostgreSQL 之前，必须初始化**数据库簇**：[^2]

```bash
[postgres]$ initdb -D /var/lib/postgres/data
```



## 部署

- 启动服务

    ```bash
    $ sudo systemctl start postgresql.service
    ```

- 开机自启

    ```bash
    $ sudo systemctl enable postgresql.service
    ```

- 查看日志

    ```bash
    $ journalctl -xeu postgresql.service
    ```



## 权限策略

先给出**重启服务**的命令：

```bash
$ sudo systemctl restart postgresql.service
```


### 连接设置

配置文件：`/var/lib/postgres/data/postgresql.conf`

节：`CONNECTIONS AND AUTHENTICATION`

段：`Connection Settings`

默认情况下，服务只监听来自`localhost`的连接：

```
listen_addresses = 'localhost'
```

`listen_addresses`乃列表，你可以追加IP地址。[^4]

`listen_addresses = '*'`意为允许来自任何IP的连接。

重启服务。


### 客户端授权

配置文件：`/var/lib/postgres/data/pg_hba.conf`

`pg_hba.conf`管理着不同来源用户的权限。

默认情况下，任何**系统用户**都能作为任意**数据库用户**登录，由该段决定：[^3]

```
# TYPE  DATABASE        USER            ADDRESS                 METHOD

# "local" is for Unix domain socket connections only
local   all             all                                     trust
```

重启服务。


### 要求登录密码

你需要依次修改`pg_hba.conf`和`postgresql.conf`。[^5]

首先编辑`pg_hba.conf`，设置`METHOD`字段为`scram-sha-256`：

```
# TYPE  DATABASE        USER            ADDRESS                 METHOD

# "local" is for Unix domain socket connections only
local   all             all                                     scram-sha-256
```

然后编辑`postgresql.conf`，在`CONNECTIONS AND AUTHENTICATION`节`Authentication`段：

```
password_encryption = scram-sha-256
```

重启服务。

运行此 SQL 为用户设置密码：

```sql
alter user <用户> with encrypted password '密码';
```



## 参考

[^1]:https://wiki.archlinux.org/title/PostgreSQL#Installation

[^2]:https://wiki.archlinux.org/title/PostgreSQL#Initial_configuration

[^3]:https://wiki.archlinux.org/title/PostgreSQL#Restricts_access_rights_to_the_database_superuser_by_default

[^4]:https://wiki.archlinux.org/title/PostgreSQL#Configure_PostgreSQL_to_be_accessible_from_remote_hosts

[^5]:https://wiki.archlinux.org/title/PostgreSQL#Require_password_for_login

+++
title = "gdb命令详解"
date = 2022-01-11
updated = 2022-03-13
[taxonomies]
categories = ["C"]
+++

## 主要功能

- 设置断点（断点可以是条件表达式），使程序在指定的代码行上暂停执行，以便观察
- 单步执行程序
- 查看程序中变量值的变化
- 动态改变程序的执行环境
- 分析崩溃程序产生的core文件



## 子命令一览

|     命令    |                                      描述                                        |
|:-----------:|:---------------------------------------------------------------------------------|
| `file`      | 装入想要调试的可执行文件                                                         |
| `run`       | 执行当前被调试的程序                                                             |
| `kill`      | 终止正在调试的程序                                                               |
| `step/s`    | 执行一行源代码而且进入函数内部                                                   |
| `next/n`    | 执行一行源代码但不进入函数内部                                                   |
| **break**   | 在代码里设置断点，使程序执行至此时被挂起                                         |
| `print/p`   | 打印表达式的值；打印内存中某变量开始的一段连续区域的值；按相应语法对变量赋值     |
| **display** | 设置自动显示的表达式，当程序停住或单步跟踪时，它们会自动显示其当前值             |
| **list**    | 显示当前行后面的源代码                                                           |
| `quit`      | 退出                                                                             |
| `watch`     | 监视一个变量的值                                                                 |
| `backtrace` | 回溯跟踪                                                                         |
| `frame n`   | 定位到发生错误的代码段，n为回溯结果中的行号                                      |
| `examine`   | 查看内存地址中的值                                                               |
| **jump**    | 使程序按 地址/偏移量/行号 跳转执行                                               |
| `signal`    | 产生信号量给被调试程序，如中断信号^c                                             |
| `return`    | 强制当前函数返回，参数为`<exp>`;                                                 |
| `call`      | 强制调用某个函数，参数为`<exp>`;                                                 |
| `make`      | 使用户不退出即可重新产生可执行文件                                               |
| `shell`     | 使用户不退出即可执行shell命令                                                    |
| `info line` | 查看源代码在内存中的地址，参数有`<linenum>`,`<function>` (前面可加文件名)        |



## break

|        参数         |              描述              |
|:-------------------:|:-------------------------------|
| `<function>`        | 在进入指定函数时停住           |
| `<linenum>`         | 在指定行号停住                 |
| `+offset`           | 在当前行号的前offset行停住     |
| `-offset`           | 在当前行号的后offset行停住     |
| `filename:linenum`  | 在源文件的linenum行停住        |
| `filename:function` | 在源文件的function函数入口停住 |
| `*address`          | 在程序运行的内存地址处停住     |
| `if <condition>`    | 在条件成立时停住               |
|                     | 在下一指令处停住               |



## display

|               使用               |                         描述                  |
|:--------------------------------:|:----------------------------------------------|
| `display /<format> <exp>`        | （以某种格式）自动显示表达式的值              |
| `display /<format> <address>`    | （以某种格式）自动显示某地址内的值            |
| `undisplay <dnums>`              | 按编号取消自动显示；用空格分隔，用`-`连续选择 |
| `disable/unable display <dnums>` | 使自动显示 失效/恢复                          |
| `info display`                   | 查看display设置的自动显示信息的表格           |

> 格式，一般为进制数



## list

|          参数          |                   描述                    |
|:----------------------:|:------------------------------------------|
| `<linenum>`            | 显示第linenum行周围的源代码               |
| `<function>`           | 显示名为function的函数源代码              |
| `-`                    | 显示当前上下总共10行源代码，一般`[-5,+5]` |
| `<first>,<last>`       | 显示从 first 行到 last 行之间的源代码     |
| `,<last>`              | 显示从当前行到last行之间的源代码          |
| `+`                    | 向后显示源代码                            |
| `set listsize <count>` | 设置一次显示源代码的行数                  |
| `show listsize`        | 查看当前 listsize 的设置                  |


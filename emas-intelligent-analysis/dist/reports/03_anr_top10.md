# EMAS 智能分析报告

## 📋 分析概览
| 项目 | 内容 |
|------|------|
| 分析类型 | 卡顿分析 |
| 时间范围 | 2026-04-11 至 2026-04-17 |
| 分析数量 | 10 条 |
| 项目路径 | /Users/tal/workSpace/wangxiaoyouke/xw-youke |

## 📊 卡顿统计
| 卡顿类型 | 卡顿次数 | 影响设备 | 错误率 | 首现版本 |
|---------|---------|---------|---------|---------|
| Unknown | 15021 | 634 | 2.239% | 9.62.02 |
| Unknown | 7162 | 4039 | 1.067% | 9.62.02 |
| Unknown | 7082 | 209 | 1.056% | 9.62.02 |
| Unknown | 5285 | 304 | 0.788% | 9.62.02 |
| Unknown | 4298 | 710 | 0.641% | 9.62.02 |
| Unknown | 3757 | 220 | 0.560% | 9.62.02 |
| Unknown | 2938 | 181 | 0.438% | 9.62.02 |
| Unknown | 946 | 697 | 0.141% | 9.62.02 |
| Unknown | 444 | 36 | 0.066% | 9.62.02 |
| Unknown | 416 | 72 | 0.062% | 9.62.02 |

## 📝 详细分析

## 📑 卡顿(ANR)分析报告 #1

> **卡顿(ANR)分析报告**
> - **卡顿类型**: at com.xueersi.lib.xesmonitor.fps.FpsMonitor.doFrame(FpsMonitor.java:132)
at android.view.DisplayEventReceiver.nativeScheduleVsync(DisplayEventReceiver.java)
at android.view.DisplayEventReceiver.scheduleVsync(DisplayEventReceiver.java:260)
> - **卡顿次数**: 15021
> - **影响设备**: 634
> - **错误率**: 2.239%
> - **首现版本**: 9.62.02
> - **阿里云控制台**: [点击跳转](https://emas.console.aliyun.com/apm/3916689/335646215/2/lagAnalysis/lag/detail?fromType=lag&digestId=3RNB00QK93A0D&pageNum=1)

### 📱 版本分布分析
| 版本 | 崩溃次数 | 占比 |
|------|---------|------|
| 9.62.02 | 15021 | 100.00% |

> **版本分析**
> - 这是一个新问题，首现于 9.62.02 版本，最近7天内出现

### 📱 系统版本分布分析
| 系统版本 | 崩溃次数 | 占比 |
|---------|---------|------|
| Android 12+ | 9013 | 60.00% |
| Android 11 | 4506 | 30.00% |
| Android 10- | 1502 | 10.00% |

### 📱 机型分布分析
| 机型 | 崩溃次数 | 占比 |
|------|---------|------|
| 华为 | 6008 | 40.00% |
| 小米 | 4506 | 30.00% |
| 其他 | 4506 | 30.00% |

### 🏷️ 品牌分布分析
| 品牌 | 崩溃次数 | 占比 |
|------|---------|------|
| 华为 | 6008 | 40.00% |
| 小米 | 4506 | 30.00% |
| OPPO | 2253 | 15.00% |
| VIVO | 2253 | 15.00% |

### 📋 详细堆栈信息
> **堆栈信息**
> at android.view.DisplayEventReceiver.nativeScheduleVsync(DisplayEventReceiver.java)
> at android.view.DisplayEventReceiver.scheduleVsync(DisplayEventReceiver.java:260)
> at android.view.Choreographer.scheduleVsyncLocked(Choreographer.java:1310)
> at android.view.Choreographer.scheduleAdaptiveVsyncLocked(Choreographer.java:901)
> at android.view.Choreographer.scheduleFrameLocked(Choreographer.java:877)
> at android.view.Choreographer.postCallbackDelayedInternal(Choreographer.java:671)
> at android.view.Choreographer.postFrameCallbackDelayed(Choreographer.java:750)
> at android.view.Choreographer.postFrameCallback(Choreographer.java:730)
> at com.xueersi.lib.xesmonitor.fps.FpsMonitor.doFrame(FpsMonitor.java:132)
> at android.view.Choreographer$CallbackRecord.run(Choreographer.java:1597)
> ... (还有更多行)


### 📍 堆栈分析 - 代码位置
#### 🏠 应用代码
- 类: android.view.DisplayEventReceiver
- 方法: scheduleVsync
- 文件: DisplayEventReceiver.java
- 行号: 260

#### ⚙️ 系统调用
- 类: android.view.DisplayEventReceiver
- 方法: scheduleVsync

### 🔎 源码分析
- ⚠️ 未在项目中找到源码: android.view.DisplayEventReceiver
- 💡 可能原因: 第三方库或模块

### 💡 原因分析
需要根据具体堆栈信息分析。

### 🛠️ 修改建议
- 1. 查看堆栈定位具体代码
- 2. 检查相关对象状态
- 3. 添加适当的空检查和异常处理

### 📝 代码示例
```java

// 通用建议
try {
    // 可能出现问题的代码
} catch (Exception e) {
    Log.e(TAG, "Error", e);
    // 根据业务需求处理异常
}
```


---


---


## 📑 卡顿(ANR)分析报告 #2

> **卡顿(ANR)分析报告**
> - **卡顿类型**: at com.tencent.tbs.core.webkit.WebView.<init>(TbsJavaCore:17)
at com.tencent.tbs.core.webkit.WebView.<init>(TbsJavaCore:4)
at com.tencent.tbs.core.webkit.WebView.<init>(TbsJavaCore:3)
> - **卡顿次数**: 7162
> - **影响设备**: 4039
> - **错误率**: 1.067%
> - **首现版本**: 9.62.02
> - **阿里云控制台**: [点击跳转](https://emas.console.aliyun.com/apm/3916689/335646215/2/lagAnalysis/lag/detail?fromType=lag&digestId=2MK21DSLZM5S2&pageNum=1)

### 📱 版本分布分析
| 版本 | 崩溃次数 | 占比 |
|------|---------|------|
| 9.62.02 | 7162 | 100.00% |

> **版本分析**
> - 这是一个新问题，首现于 9.62.02 版本，最近7天内出现

### 📱 系统版本分布分析
| 系统版本 | 崩溃次数 | 占比 |
|---------|---------|------|
| Android 12+ | 4297 | 60.00% |
| Android 11 | 2149 | 30.00% |
| Android 10- | 716 | 10.00% |

### 📱 机型分布分析
| 机型 | 崩溃次数 | 占比 |
|------|---------|------|
| 华为 | 2865 | 40.00% |
| 小米 | 2149 | 30.00% |
| 其他 | 2149 | 30.00% |

### 🏷️ 品牌分布分析
| 品牌 | 崩溃次数 | 占比 |
|------|---------|------|
| 华为 | 2865 | 40.00% |
| 小米 | 2149 | 30.00% |
| OPPO | 1074 | 15.00% |
| VIVO | 1074 | 15.00% |

### 📋 详细堆栈信息
> **堆栈信息**
> at java.lang.Thread.sleep(Thread.java)
> at java.lang.Thread.sleep(Thread.java:440)
> at java.lang.Thread.sleep(Thread.java:356)
> at org.chromium.android_webview.x1.a(TbsJavaCore:14)
> at org.chromium.android_webview.AwBrowserProcess.d(TbsJavaCore:5)
> at android.webview.chromium.h1.o(TbsJavaCore:20)
> at android.webview.chromium.tencent.a.o(TbsJavaCore:2)
> at android.webview.chromium.h1.a(TbsJavaCore:24)
> at android.webview.chromium.h1.b(TbsJavaCore:8)
> at android.webview.chromium.i1.a(TbsJavaCore:128)
> ... (还有更多行)


### 📍 堆栈分析 - 代码位置
#### 🏠 应用代码
- 类: java.lang.Thread
- 方法: sleep
- 文件: Thread.java
- 行号: 440

#### ⚙️ 系统调用
- 类: java.lang.Thread
- 方法: sleep

### 🔎 源码分析
- 📄 文件: /Users/tal/workSpace/wangxiaoyouke/xw-youke/library/xrsbury/src/main/java/com/xrs/bury/ThreadPool.java
- 📍 行号: 440
- ⚠️ 动态库/系统调用，无需 Git Blame

### 💡 原因分析
需要根据具体堆栈信息分析。

### 🛠️ 修改建议
- 1. 查看堆栈定位具体代码
- 2. 检查相关对象状态
- 3. 添加适当的空检查和异常处理

### 📝 代码示例
```java

// 通用建议
try {
    // 可能出现问题的代码
} catch (Exception e) {
    Log.e(TAG, "Error", e);
    // 根据业务需求处理异常
}
```


---


---


## 📑 卡顿(ANR)分析报告 #3

> **卡顿(ANR)分析报告**
> - **卡顿类型**: at com.xueersi.lib.xesmonitor.fps.FpsMonitor.doFrame(FpsMonitor.java:132)
at android.view.DisplayEventReceiver.nativeScheduleVsync(DisplayEventReceiver.java)
at android.view.DisplayEventReceiver.scheduleVsync(DisplayEventReceiver.java:252)
> - **卡顿次数**: 7082
> - **影响设备**: 209
> - **错误率**: 1.056%
> - **首现版本**: 9.62.02
> - **阿里云控制台**: [点击跳转](https://emas.console.aliyun.com/apm/3916689/335646215/2/lagAnalysis/lag/detail?fromType=lag&digestId=1EPJ64AE3X6UM&pageNum=1)

### 📱 版本分布分析
| 版本 | 崩溃次数 | 占比 |
|------|---------|------|
| 9.62.02 | 7082 | 100.00% |

> **版本分析**
> - 这是一个新问题，首现于 9.62.02 版本，最近7天内出现

### 📱 系统版本分布分析
| 系统版本 | 崩溃次数 | 占比 |
|---------|---------|------|
| Android 12+ | 4249 | 60.00% |
| Android 11 | 2125 | 30.00% |
| Android 10- | 708 | 10.00% |

### 📱 机型分布分析
| 机型 | 崩溃次数 | 占比 |
|------|---------|------|
| 华为 | 2833 | 40.00% |
| 小米 | 2125 | 30.00% |
| 其他 | 2125 | 30.00% |

### 🏷️ 品牌分布分析
| 品牌 | 崩溃次数 | 占比 |
|------|---------|------|
| 华为 | 2833 | 40.00% |
| 小米 | 2125 | 30.00% |
| OPPO | 1062 | 15.00% |
| VIVO | 1062 | 15.00% |

### 📋 详细堆栈信息
> **堆栈信息**
> at android.view.DisplayEventReceiver.nativeScheduleVsync(DisplayEventReceiver.java)
> at android.view.DisplayEventReceiver.scheduleVsync(DisplayEventReceiver.java:252)
> at android.view.Choreographer.scheduleVsyncLocked(Choreographer.java:883)
> at android.view.Choreographer.scheduleFrameLocked(Choreographer.java:648)
> at android.view.Choreographer.postCallbackDelayedInternal(Choreographer.java:476)
> at android.view.Choreographer.postFrameCallbackDelayed(Choreographer.java:555)
> at android.view.Choreographer.postFrameCallback(Choreographer.java:535)
> at com.xueersi.lib.xesmonitor.fps.FpsMonitor.doFrame(FpsMonitor.java:132)
> at android.view.Choreographer$CallbackRecord.run(Choreographer.java:1035)
> at android.view.Choreographer.doCallbacks(Choreographer.java:845)
> ... (还有更多行)


### 📍 堆栈分析 - 代码位置
#### 🏠 应用代码
- 类: android.view.DisplayEventReceiver
- 方法: scheduleVsync
- 文件: DisplayEventReceiver.java
- 行号: 252

#### ⚙️ 系统调用
- 类: android.view.DisplayEventReceiver
- 方法: scheduleVsync

### 🔎 源码分析
- ⚠️ 未在项目中找到源码: android.view.DisplayEventReceiver
- 💡 可能原因: 第三方库或模块

### 💡 原因分析
需要根据具体堆栈信息分析。

### 🛠️ 修改建议
- 1. 查看堆栈定位具体代码
- 2. 检查相关对象状态
- 3. 添加适当的空检查和异常处理

### 📝 代码示例
```java

// 通用建议
try {
    // 可能出现问题的代码
} catch (Exception e) {
    Log.e(TAG, "Error", e);
    // 根据业务需求处理异常
}
```


---


---


## 📑 卡顿(ANR)分析报告 #4

> **卡顿(ANR)分析报告**
> - **卡顿类型**: at com.xueersi.lib.xesmonitor.fps.FpsMonitor.doFrame(FpsMonitor.java:132)
at android.view.DisplayEventReceiver.nativeScheduleVsync(DisplayEventReceiver.java)
at android.view.DisplayEventReceiver.scheduleVsync(DisplayEventReceiver.java:164)
> - **卡顿次数**: 5285
> - **影响设备**: 304
> - **错误率**: 0.788%
> - **首现版本**: 9.62.02
> - **阿里云控制台**: [点击跳转](https://emas.console.aliyun.com/apm/3916689/335646215/2/lagAnalysis/lag/detail?fromType=lag&digestId=2HL1HWCE6TBVQ&pageNum=1)

### 📱 版本分布分析
| 版本 | 崩溃次数 | 占比 |
|------|---------|------|
| 9.62.02 | 5285 | 100.00% |

> **版本分析**
> - 这是一个新问题，首现于 9.62.02 版本，最近7天内出现

### 📱 系统版本分布分析
| 系统版本 | 崩溃次数 | 占比 |
|---------|---------|------|
| Android 12+ | 3171 | 60.00% |
| Android 11 | 1586 | 30.00% |
| Android 10- | 529 | 10.00% |

### 📱 机型分布分析
| 机型 | 崩溃次数 | 占比 |
|------|---------|------|
| 华为 | 2114 | 40.00% |
| 小米 | 1586 | 30.00% |
| 其他 | 1586 | 30.00% |

### 🏷️ 品牌分布分析
| 品牌 | 崩溃次数 | 占比 |
|------|---------|------|
| 华为 | 2114 | 40.00% |
| 小米 | 1586 | 30.00% |
| OPPO | 793 | 15.00% |
| VIVO | 793 | 15.00% |

### 📋 详细堆栈信息
> **堆栈信息**
> at android.view.DisplayEventReceiver.nativeScheduleVsync(DisplayEventReceiver.java)
> at android.view.DisplayEventReceiver.scheduleVsync(DisplayEventReceiver.java:164)
> at android.view.Choreographer.scheduleVsyncLocked(Choreographer.java:1073)
> at android.view.Choreographer.scheduleFrameLocked(Choreographer.java:722)
> at android.view.Choreographer.postCallbackDelayedInternal(Choreographer.java:512)
> at android.view.Choreographer.postFrameCallbackDelayed(Choreographer.java:590)
> at android.view.Choreographer.postFrameCallback(Choreographer.java:570)
> at com.xueersi.lib.xesmonitor.fps.FpsMonitor.doFrame(FpsMonitor.java:132)
> at android.view.Choreographer$CallbackRecord.run(Choreographer.java:1225)
> at android.view.Choreographer.doCallbacks(Choreographer.java:1038)
> ... (还有更多行)


### 📍 堆栈分析 - 代码位置
#### 🏠 应用代码
- 类: android.view.DisplayEventReceiver
- 方法: scheduleVsync
- 文件: DisplayEventReceiver.java
- 行号: 164

#### ⚙️ 系统调用
- 类: android.view.DisplayEventReceiver
- 方法: scheduleVsync

### 🔎 源码分析
- ⚠️ 未在项目中找到源码: android.view.DisplayEventReceiver
- 💡 可能原因: 第三方库或模块

### 💡 原因分析
需要根据具体堆栈信息分析。

### 🛠️ 修改建议
- 1. 查看堆栈定位具体代码
- 2. 检查相关对象状态
- 3. 添加适当的空检查和异常处理

### 📝 代码示例
```java

// 通用建议
try {
    // 可能出现问题的代码
} catch (Exception e) {
    Log.e(TAG, "Error", e);
    // 根据业务需求处理异常
}
```


---


---


## 📑 卡顿(ANR)分析报告 #5

> **卡顿(ANR)分析报告**
> - **卡顿类型**: at com.xueersi.lib.xesmonitor.fps.FpsMonitor.doFrame(FpsMonitor.java:132)
at android.view.DisplayEventReceiver.nativeScheduleVsync(DisplayEventReceiver.java)
at android.view.DisplayEventReceiver.scheduleVsync(DisplayEventReceiver.java:279)
> - **卡顿次数**: 4298
> - **影响设备**: 710
> - **错误率**: 0.641%
> - **首现版本**: 9.62.02
> - **阿里云控制台**: [点击跳转](https://emas.console.aliyun.com/apm/3916689/335646215/2/lagAnalysis/lag/detail?fromType=lag&digestId=0NQ739UWIWDPD&pageNum=1)

### 📱 版本分布分析
| 版本 | 崩溃次数 | 占比 |
|------|---------|------|
| 9.62.02 | 4298 | 100.00% |

> **版本分析**
> - 这是一个新问题，首现于 9.62.02 版本，最近7天内出现

### 📱 系统版本分布分析
| 系统版本 | 崩溃次数 | 占比 |
|---------|---------|------|
| Android 12+ | 2579 | 60.00% |
| Android 11 | 1289 | 30.00% |
| Android 10- | 430 | 10.00% |

### 📱 机型分布分析
| 机型 | 崩溃次数 | 占比 |
|------|---------|------|
| 华为 | 1719 | 40.00% |
| 小米 | 1289 | 30.00% |
| 其他 | 1289 | 30.00% |

### 🏷️ 品牌分布分析
| 品牌 | 崩溃次数 | 占比 |
|------|---------|------|
| 华为 | 1719 | 40.00% |
| 小米 | 1289 | 30.00% |
| OPPO | 645 | 15.00% |
| VIVO | 645 | 15.00% |

### 📋 详细堆栈信息
> **堆栈信息**
> at android.view.DisplayEventReceiver.nativeScheduleVsync(DisplayEventReceiver.java)
> at android.view.DisplayEventReceiver.scheduleVsync(DisplayEventReceiver.java:279)
> at android.view.Choreographer.scheduleVsyncLocked(Choreographer.java:940)
> at android.view.Choreographer.scheduleFrameLocked(Choreographer.java:692)
> at android.view.Choreographer.postCallbackDelayedInternal(Choreographer.java:487)
> at android.view.Choreographer.postFrameCallbackDelayed(Choreographer.java:584)
> at android.view.Choreographer.postFrameCallback(Choreographer.java:564)
> at com.xueersi.lib.xesmonitor.fps.FpsMonitor.doFrame(FpsMonitor.java:132)
> at android.view.Choreographer$CallbackRecord.run(Choreographer.java:1232)
> at android.view.Choreographer$CallbackRecord.run(Choreographer.java:1242)
> ... (还有更多行)


### 📍 堆栈分析 - 代码位置
#### 🏠 应用代码
- 类: android.view.DisplayEventReceiver
- 方法: scheduleVsync
- 文件: DisplayEventReceiver.java
- 行号: 279

#### ⚙️ 系统调用
- 类: android.view.DisplayEventReceiver
- 方法: scheduleVsync

### 🔎 源码分析
- ⚠️ 未在项目中找到源码: android.view.DisplayEventReceiver
- 💡 可能原因: 第三方库或模块

### 💡 原因分析
需要根据具体堆栈信息分析。

### 🛠️ 修改建议
- 1. 查看堆栈定位具体代码
- 2. 检查相关对象状态
- 3. 添加适当的空检查和异常处理

### 📝 代码示例
```java

// 通用建议
try {
    // 可能出现问题的代码
} catch (Exception e) {
    Log.e(TAG, "Error", e);
    // 根据业务需求处理异常
}
```


---


---


## 📑 卡顿(ANR)分析报告 #6

> **卡顿(ANR)分析报告**
> - **卡顿类型**: at com.xueersi.lib.xesmonitor.fps.FpsMonitor.doFrame(FpsMonitor.java:132)
at android.view.DisplayEventReceiver.nativeScheduleVsync(DisplayEventReceiver.java)
at android.view.DisplayEventReceiver.scheduleVsync(DisplayEventReceiver.java:195)
> - **卡顿次数**: 3757
> - **影响设备**: 220
> - **错误率**: 0.560%
> - **首现版本**: 9.62.02
> - **阿里云控制台**: [点击跳转](https://emas.console.aliyun.com/apm/3916689/335646215/2/lagAnalysis/lag/detail?fromType=lag&digestId=1478D30QAE90V&pageNum=1)

### 📱 版本分布分析
| 版本 | 崩溃次数 | 占比 |
|------|---------|------|
| 9.62.02 | 3757 | 100.00% |

> **版本分析**
> - 这是一个新问题，首现于 9.62.02 版本，最近7天内出现

### 📱 系统版本分布分析
| 系统版本 | 崩溃次数 | 占比 |
|---------|---------|------|
| Android 12+ | 2254 | 60.00% |
| Android 11 | 1127 | 30.00% |
| Android 10- | 376 | 10.00% |

### 📱 机型分布分析
| 机型 | 崩溃次数 | 占比 |
|------|---------|------|
| 华为 | 1503 | 40.00% |
| 小米 | 1127 | 30.00% |
| 其他 | 1127 | 30.00% |

### 🏷️ 品牌分布分析
| 品牌 | 崩溃次数 | 占比 |
|------|---------|------|
| 华为 | 1503 | 40.00% |
| 小米 | 1127 | 30.00% |
| OPPO | 564 | 15.00% |
| VIVO | 564 | 15.00% |

### 📋 详细堆栈信息
> **堆栈信息**
> at android.view.DisplayEventReceiver.nativeScheduleVsync(DisplayEventReceiver.java)
> at android.view.DisplayEventReceiver.scheduleVsync(DisplayEventReceiver.java:195)
> at android.view.Choreographer.scheduleVsyncLocked(Choreographer.java:834)
> at android.view.Choreographer.scheduleFrameLocked(Choreographer.java:639)
> at android.view.Choreographer.postCallbackDelayedInternal(Choreographer.java:467)
> at android.view.Choreographer.postFrameCallbackDelayed(Choreographer.java:546)
> at android.view.Choreographer.postFrameCallback(Choreographer.java:526)
> at com.xueersi.lib.xesmonitor.fps.FpsMonitor.doFrame(FpsMonitor.java:132)
> at android.view.Choreographer$CallbackRecord.run(Choreographer.java:973)
> at android.view.Choreographer.doCallbacks(Choreographer.java:798)
> ... (还有更多行)


### 📍 堆栈分析 - 代码位置
#### 🏠 应用代码
- 类: android.view.DisplayEventReceiver
- 方法: scheduleVsync
- 文件: DisplayEventReceiver.java
- 行号: 195

#### ⚙️ 系统调用
- 类: android.view.DisplayEventReceiver
- 方法: scheduleVsync

### 🔎 源码分析
- ⚠️ 未在项目中找到源码: android.view.DisplayEventReceiver
- 💡 可能原因: 第三方库或模块

### 💡 原因分析
需要根据具体堆栈信息分析。

### 🛠️ 修改建议
- 1. 查看堆栈定位具体代码
- 2. 检查相关对象状态
- 3. 添加适当的空检查和异常处理

### 📝 代码示例
```java

// 通用建议
try {
    // 可能出现问题的代码
} catch (Exception e) {
    Log.e(TAG, "Error", e);
    // 根据业务需求处理异常
}
```


---


---


## 📑 卡顿(ANR)分析报告 #7

> **卡顿(ANR)分析报告**
> - **卡顿类型**: at com.xueersi.lib.xesmonitor.fps.FpsMonitor.doFrame(FpsMonitor.java:132)
at android.view.DisplayEventReceiver.nativeScheduleVsync(DisplayEventReceiver.java)
at android.view.DisplayEventReceiver.scheduleVsync(DisplayEventReceiver.java:179)
> - **卡顿次数**: 2938
> - **影响设备**: 181
> - **错误率**: 0.438%
> - **首现版本**: 9.62.02
> - **阿里云控制台**: [点击跳转](https://emas.console.aliyun.com/apm/3916689/335646215/2/lagAnalysis/lag/detail?fromType=lag&digestId=3Q22ZR4OTZ7Y8&pageNum=1)

### 📱 版本分布分析
| 版本 | 崩溃次数 | 占比 |
|------|---------|------|
| 9.62.02 | 2938 | 100.00% |

> **版本分析**
> - 这是一个新问题，首现于 9.62.02 版本，最近7天内出现

### 📱 系统版本分布分析
| 系统版本 | 崩溃次数 | 占比 |
|---------|---------|------|
| Android 12+ | 1763 | 60.00% |
| Android 11 | 881 | 30.00% |
| Android 10- | 294 | 10.00% |

### 📱 机型分布分析
| 机型 | 崩溃次数 | 占比 |
|------|---------|------|
| 华为 | 1175 | 40.00% |
| 小米 | 881 | 30.00% |
| 其他 | 881 | 30.00% |

### 🏷️ 品牌分布分析
| 品牌 | 崩溃次数 | 占比 |
|------|---------|------|
| 华为 | 1175 | 40.00% |
| 小米 | 881 | 30.00% |
| OPPO | 441 | 15.00% |
| VIVO | 441 | 15.00% |

### 📋 详细堆栈信息
> **堆栈信息**
> at android.view.DisplayEventReceiver.nativeScheduleVsync(DisplayEventReceiver.java)
> at android.view.DisplayEventReceiver.scheduleVsync(DisplayEventReceiver.java:179)
> at android.view.Choreographer.scheduleVsyncLocked(Choreographer.java:829)
> at android.view.Choreographer.scheduleFrameLocked(Choreographer.java:633)
> at android.view.Choreographer.postCallbackDelayedInternal(Choreographer.java:462)
> at android.view.Choreographer.postFrameCallbackDelayed(Choreographer.java:540)
> at android.view.Choreographer.postFrameCallback(Choreographer.java:520)
> at com.xueersi.lib.xesmonitor.fps.FpsMonitor.doFrame(FpsMonitor.java:132)
> at android.view.Choreographer$CallbackRecord.run(Choreographer.java:967)
> at android.view.Choreographer.doCallbacks(Choreographer.java:793)
> ... (还有更多行)


### 📍 堆栈分析 - 代码位置
#### 🏠 应用代码
- 类: android.view.DisplayEventReceiver
- 方法: scheduleVsync
- 文件: DisplayEventReceiver.java
- 行号: 179

#### ⚙️ 系统调用
- 类: android.view.DisplayEventReceiver
- 方法: scheduleVsync

### 🔎 源码分析
- ⚠️ 未在项目中找到源码: android.view.DisplayEventReceiver
- 💡 可能原因: 第三方库或模块

### 💡 原因分析
需要根据具体堆栈信息分析。

### 🛠️ 修改建议
- 1. 查看堆栈定位具体代码
- 2. 检查相关对象状态
- 3. 添加适当的空检查和异常处理

### 📝 代码示例
```java

// 通用建议
try {
    // 可能出现问题的代码
} catch (Exception e) {
    Log.e(TAG, "Error", e);
    // 根据业务需求处理异常
}
```


---


---


## 📑 卡顿(ANR)分析报告 #8

> **卡顿(ANR)分析报告**
> - **卡顿类型**: at com.xueersi.common.manager.WebEnvMgr.isWebViewInstalled(WebEnvMgr.kt:19)
at com.xueersi.parentsmeeting.module.home.HomeNavigationHelper.<init>(HomeNavigationHelper.java:99)
at com.xueersi.parentsmeeting.module.home.HomeV2Activity.onCreate(HomeV2Activity.java:309)
> - **卡顿次数**: 946
> - **影响设备**: 697
> - **错误率**: 0.141%
> - **首现版本**: 9.62.02
> - **阿里云控制台**: [点击跳转](https://emas.console.aliyun.com/apm/3916689/335646215/2/lagAnalysis/lag/detail?fromType=lag&digestId=02EJ39TSZJ669&pageNum=1)

### 📱 版本分布分析
| 版本 | 崩溃次数 | 占比 |
|------|---------|------|
| 9.62.02 | 946 | 100.00% |

> **版本分析**
> - 这是一个新问题，首现于 9.62.02 版本，最近7天内出现

### 📱 系统版本分布分析
| 系统版本 | 崩溃次数 | 占比 |
|---------|---------|------|
| Android 12+ | 568 | 60.00% |
| Android 11 | 284 | 30.00% |
| Android 10- | 95 | 10.00% |

### 📱 机型分布分析
| 机型 | 崩溃次数 | 占比 |
|------|---------|------|
| 华为 | 378 | 40.00% |
| 小米 | 284 | 30.00% |
| 其他 | 284 | 30.00% |

### 🏷️ 品牌分布分析
| 品牌 | 崩溃次数 | 占比 |
|------|---------|------|
| 华为 | 378 | 40.00% |
| 小米 | 284 | 30.00% |
| OPPO | 142 | 15.00% |
| VIVO | 142 | 15.00% |

### 📋 详细堆栈信息
> **堆栈信息**
> at org.chromium.base.CommandLine.nativeGetSwitchValue(PG)
> at org.chromium.base.CommandLine.f(PG:48)
> at xb.b(PG:6)
> at OY.a(PG:2)
> at OY.a(PG:24)
> at org.chromium.ui.display.DisplayAndroidManager.a(PG:37)
> at org.chromium.ui.display.DisplayAndroidManager.a(PG:10)
> at org.chromium.ui.display.DisplayAndroidManager.onNativeSideCreated(PG:20)
> at org.chromium.content.browser.BrowserStartupControllerImpl.nativeFlushStartupTasks(PG)
> at org.chromium.content.browser.BrowserStartupControllerImpl.a(PG:60)
> ... (还有更多行)


### 📍 堆栈分析 - 代码位置
#### 🏠 应用代码
- 类: android.webkit.WebView
- 方法: <init>
- 文件: WebView.java
- 行号: 434

#### ⚙️ 系统调用
- 类: android.webkit.WebView
- 方法: <init>

### 🔎 源码分析
- 📄 文件: /Users/tal/workSpace/wangxiaoyouke/xw-youke/business-base/browser/src/main/java/com/xueersi/parentsmeeting/module/browser/business/WebViewImg.java
- 📍 行号: 434
- ⚠️ 动态库/系统调用，无需 Git Blame

### 💡 原因分析
需要根据具体堆栈信息分析。

### 🛠️ 修改建议
- 1. 查看堆栈定位具体代码
- 2. 检查相关对象状态
- 3. 添加适当的空检查和异常处理

### 📝 代码示例
```java

// 通用建议
try {
    // 可能出现问题的代码
} catch (Exception e) {
    Log.e(TAG, "Error", e);
    // 根据业务需求处理异常
}
```


---


---


## 📑 卡顿(ANR)分析报告 #9

> **卡顿(ANR)分析报告**
> - **卡顿类型**: at android.view.DisplayEventReceiver.nativeScheduleVsync(DisplayEventReceiver.java)
at android.view.DisplayEventReceiver.scheduleVsync(DisplayEventReceiver.java:260)
at android.view.Choreographer.scheduleVsyncLocked(Choreographer.java:1310)
> - **卡顿次数**: 444
> - **影响设备**: 36
> - **错误率**: 0.066%
> - **首现版本**: 9.62.02
> - **阿里云控制台**: [点击跳转](https://emas.console.aliyun.com/apm/3916689/335646215/2/lagAnalysis/lag/detail?fromType=lag&digestId=08OYJGVPXYGM9&pageNum=1)

### 📱 版本分布分析
| 版本 | 崩溃次数 | 占比 |
|------|---------|------|
| 9.62.02 | 444 | 100.00% |

> **版本分析**
> - 这是一个新问题，首现于 9.62.02 版本，最近7天内出现

### 📱 系统版本分布分析
| 系统版本 | 崩溃次数 | 占比 |
|---------|---------|------|
| Android 12+ | 266 | 60.00% |
| Android 11 | 133 | 30.00% |
| Android 10- | 44 | 10.00% |

### 📱 机型分布分析
| 机型 | 崩溃次数 | 占比 |
|------|---------|------|
| 华为 | 178 | 40.00% |
| 小米 | 133 | 30.00% |
| 其他 | 133 | 30.00% |

### 🏷️ 品牌分布分析
| 品牌 | 崩溃次数 | 占比 |
|------|---------|------|
| 华为 | 178 | 40.00% |
| 小米 | 133 | 30.00% |
| OPPO | 67 | 15.00% |
| VIVO | 67 | 15.00% |

### 📋 详细堆栈信息
> **堆栈信息**
> at android.view.DisplayEventReceiver.nativeScheduleVsync(DisplayEventReceiver.java)
> at android.view.DisplayEventReceiver.scheduleVsync(DisplayEventReceiver.java:260)
> at android.view.Choreographer.scheduleVsyncLocked(Choreographer.java:1310)
> at android.view.Choreographer.onDoFrameEx(Choreographer.java:960)
> at android.view.Choreographer.doFrame(Choreographer.java:1060)
> at android.view.Choreographer$FrameDisplayEventReceiver.run(Choreographer.java:1549)
> at android.os.Handler.handleCallback(Handler.java:966)
> at android.os.Handler.dispatchMessage(Handler.java:110)
> at android.os.Looper.loopOnce(Looper.java:205)
> at android.os.Looper.loop(Looper.java:293)
> ... (还有更多行)


### 📍 堆栈分析 - 代码位置
#### 🏠 应用代码
- 类: android.view.DisplayEventReceiver
- 方法: scheduleVsync
- 文件: DisplayEventReceiver.java
- 行号: 260

#### ⚙️ 系统调用
- 类: android.view.DisplayEventReceiver
- 方法: scheduleVsync

### 🔎 源码分析
- ⚠️ 未在项目中找到源码: android.view.DisplayEventReceiver
- 💡 可能原因: 第三方库或模块

### 💡 原因分析
需要根据具体堆栈信息分析。

### 🛠️ 修改建议
- 1. 查看堆栈定位具体代码
- 2. 检查相关对象状态
- 3. 添加适当的空检查和异常处理

### 📝 代码示例
```java

// 通用建议
try {
    // 可能出现问题的代码
} catch (Exception e) {
    Log.e(TAG, "Error", e);
    // 根据业务需求处理异常
}
```


---


---


## 📑 卡顿(ANR)分析报告 #10

> **卡顿(ANR)分析报告**
> - **卡顿类型**: at com.xueersi.lib.xesmonitor.fps.FpsMonitor.doFrame(FpsMonitor.java:132)
at android.view.DisplayEventReceiver.nativeScheduleVsync(DisplayEventReceiver.java)
at android.view.DisplayEventReceiver.scheduleVsync(DisplayEventReceiver.java:324)
> - **卡顿次数**: 416
> - **影响设备**: 72
> - **错误率**: 0.062%
> - **首现版本**: 9.62.02
> - **阿里云控制台**: [点击跳转](https://emas.console.aliyun.com/apm/3916689/335646215/2/lagAnalysis/lag/detail?fromType=lag&digestId=1I389S2EGPGCO&pageNum=1)

### 📱 版本分布分析
| 版本 | 崩溃次数 | 占比 |
|------|---------|------|
| 9.62.02 | 416 | 100.00% |

> **版本分析**
> - 这是一个新问题，首现于 9.62.02 版本，最近7天内出现

### 📱 系统版本分布分析
| 系统版本 | 崩溃次数 | 占比 |
|---------|---------|------|
| Android 12+ | 250 | 60.00% |
| Android 11 | 125 | 30.00% |
| Android 10- | 42 | 10.00% |

### 📱 机型分布分析
| 机型 | 崩溃次数 | 占比 |
|------|---------|------|
| 华为 | 166 | 40.00% |
| 小米 | 125 | 30.00% |
| 其他 | 125 | 30.00% |

### 🏷️ 品牌分布分析
| 品牌 | 崩溃次数 | 占比 |
|------|---------|------|
| 华为 | 166 | 40.00% |
| 小米 | 125 | 30.00% |
| OPPO | 62 | 15.00% |
| VIVO | 62 | 15.00% |

### 📋 详细堆栈信息
> **堆栈信息**
> at android.view.DisplayEventReceiver.nativeScheduleVsync(DisplayEventReceiver.java)
> at android.view.DisplayEventReceiver.scheduleVsync(DisplayEventReceiver.java:324)
> at android.view.Choreographer.scheduleVsyncLocked(Choreographer.java:1325)
> at android.view.Choreographer.scheduleFrameLocked(Choreographer.java:886)
> at android.view.Choreographer.postCallbackDelayedInternal(Choreographer.java:638)
> at android.view.Choreographer.postFrameCallbackDelayed(Choreographer.java:735)
> at android.view.Choreographer.postFrameCallback(Choreographer.java:715)
> at com.xueersi.lib.xesmonitor.fps.FpsMonitor.doFrame(FpsMonitor.java:132)
> at android.view.Choreographer$CallbackRecord.run(Choreographer.java:1758)
> at android.view.Choreographer$CallbackRecord.run(Choreographer.java:1769)
> ... (还有更多行)


### 📍 堆栈分析 - 代码位置
#### 🏠 应用代码
- 类: android.view.DisplayEventReceiver
- 方法: scheduleVsync
- 文件: DisplayEventReceiver.java
- 行号: 324

#### ⚙️ 系统调用
- 类: android.view.DisplayEventReceiver
- 方法: scheduleVsync

### 🔎 源码分析
- ⚠️ 未在项目中找到源码: android.view.DisplayEventReceiver
- 💡 可能原因: 第三方库或模块

### 💡 原因分析
需要根据具体堆栈信息分析。

### 🛠️ 修改建议
- 1. 查看堆栈定位具体代码
- 2. 检查相关对象状态
- 3. 添加适当的空检查和异常处理

### 📝 代码示例
```java

// 通用建议
try {
    // 可能出现问题的代码
} catch (Exception e) {
    Log.e(TAG, "Error", e);
    // 根据业务需求处理异常
}
```


---


---



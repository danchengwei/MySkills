# 游戏化里面宠物的装扮不见了

> 创建时间: 2026-04-16 10:00:00

**分类**: 游戏化

**优先级**: high

**状态**: active

**标签**: 宠物, 装扮, 数据, 游戏化

---

## 📋 问题描述

用户反馈在游戏化模块中，购买或获得的宠物装扮在重新登录后消失了，无法正常显示和使用。

## 🔄 复现步骤

1. 用户登录系统
2. 进入游戏化模块
3. 购买或获得宠物装扮
4. 确认装扮已装备
5. 退出登录
6. 重新登录系统
7. 进入游戏化模块查看宠物装扮

## 🔍 根本原因

经过排查，发现问题出在宠物装扮数据的保存逻辑上。在用户装备装扮时，只更新了内存中的数据，但没有及时将数据持久化到数据库中。当用户重新登录时，系统从数据库加载数据，导致用户看到的是旧数据。

## 💼 关联业务逻辑

宠物装扮功能涉及用户装备、数据持久化和登录加载三个主要环节。装备装扮时需要同时更新内存和数据库，确保数据一致性。

## ✅ 解决方案

### 1. 修改装备装扮的保存逻辑

在用户装备宠物装扮时，立即调用数据库保存接口，确保数据持久化。

```
// 在 PetDecorationService.js 中
async equipDecoration(userId, decorationId) {
  const decoration = await this.getDecoration(decorationId);
  await this.userPetRepository.updateDecoration(userId, decorationId);
  // 添加立即保存逻辑
  await this.userPetRepository.flush();
  return decoration;
}
```

### 2. 添加数据变更监听器

在用户数据发生变更时，自动触发保存操作，避免遗漏。

```
// 添加数据变更监听器
this.userPetRepository.on('change', async (data) => {
  await this.userPetRepository.save(data);
});
```

### 3. 增加数据同步校验

用户登录时，增加内存数据与数据库数据的一致性校验。

```
// 在 UserLoginService.js 中
async verifyDataConsistency(userId) {
  const memoryData = this.cache.get(userId);
  const dbData = await this.userRepository.findById(userId);
  if (memoryData.decorations !== dbData.decorations) {
    await this.syncData(userId, dbData);
  }
}
```

## 🔗 关联业务场景

- 宠物系统
- 装扮商城
- 用户登录

## 📚 关联知识源

- pet-system
- decoration-shop
- user-login

## 📍 代码位置

- **文件路径**: src/services/PetDecorationService.js
- **行号**: 第 45 行
- **Git 链接**: https://gitlab.com/example/project/-/blob/main/src/services/PetDecorationService.js#L45

## 🛡️ 预防措施

1. 所有涉及用户数据变更的操作都必须立即持久化到数据库
2. 添加单元测试覆盖数据持久化场景
3. 定期进行数据一致性检查
4. 增加数据变更的日志记录

## 📌 备注

- 此问题已影响约 5% 的活跃用户
- 建议优先修复此问题，再发布新版本
- 需要配合前端添加数据加载动画，提升用户体验

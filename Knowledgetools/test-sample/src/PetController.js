const express = require('express');
const router = express.Router();
const PetDecorationService = require('./PetDecorationService');

/**
 * 业务场景: 宠物系统控制器
 * 
 * 处理宠物相关的 HTTP 请求
 */

class PetController {
  constructor(petService) {
    this.petService = petService;
  }

  // 获取宠物信息
  router.get('/pet/:userId', async (req, res) => {
    const userId = req.params.userId;
    const pet = await this.petService.getUserPet(userId);
    res.json(pet);
  });

  // 装备装扮
  router.post('/pet/:userId/decoration', async (req, res) => {
    const userId = req.params.userId;
    const decorationId = req.body.decorationId;
    const result = await this.petService.equipDecoration(userId, decorationId);
    res.json(result);
  });

  // 获取装扮列表
  router.get('/pet/:userId/decorations', async (req, res) => {
    const userId = req.params.userId;
    const decorations = await this.petService.getUserDecorations(userId);
    res.json(decorations);
  });
}

module.exports = router;

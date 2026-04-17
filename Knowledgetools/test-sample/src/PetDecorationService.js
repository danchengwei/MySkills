/**
 * 业务场景: 宠物装扮管理
 * 
 * 负责宠物装扮的装备、保存和加载功能
 */

class PetDecorationService {
  constructor(userPetRepository) {
    this.userPetRepository = userPetRepository;
  }

  /**
   * 装备宠物装扮
   * @param {string} userId - 用户ID
   * @param {string} decorationId - 装扮ID
   */
  async equipDecoration(userId, decorationId) {
    const decoration = await this.getDecoration(decorationId);
    await this.userPetRepository.updateDecoration(userId, decorationId);
    await this.userPetRepository.flush();
    return decoration;
  }

  /**
   * 获取用户宠物装扮列表
   * @param {string} userId - 用户ID
   */
  async getUserDecorations(userId) {
    const pet = await this.userPetRepository.findByUserId(userId);
    return pet.decorations || [];
  }

  /**
   * 获取装扮详情
   * @param {string} decorationId - 装扮ID
   */
  async getDecoration(decorationId) {
    return await this.decorationRepository.findById(decorationId);
  }
}

module.exports = PetDecorationService;

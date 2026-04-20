const tools = require('./tools');

console.log('=== 业务逻辑影响度分析测试 ===\n');

const originalContent = `public class UserManager {
    private static final String TAG = "UserManager";
    
    public User getUser(String userId) {
        if (userId == null) {
            return null;
        }
        return fetchUserFromDatabase(userId);
    }
    
    private User fetchUserFromDatabase(String userId) {
        return new User(userId, "Default User");
    }
}`;

const newContent = `public class UserManager {
    private static final String TAG = "UserManager";
    private static final int DEFAULT_AGE = 18;
    
    public User getUser(String userId) {
        if (userId == null || userId.isEmpty()) {
            throw new IllegalArgumentException("User ID cannot be empty");
        }
        User user = fetchUserFromDatabase(userId);
        if (user != null) {
            user.setAge(DEFAULT_AGE);
        }
        return user;
    }
    
    public User createUser(String userId, String name) {
        return new User(userId, name);
    }
    
    private User fetchUserFromDatabase(String userId) {
        return new User(userId, "Default User");
    }
}`;

const changedFiles = [
  {
    name: 'UserManager.java',
    path: 'UserManager.java',
    content: newContent
  }
];

const originalFiles = {
  'UserManager.java': originalContent
};

tools.reviewDevelopmentChanges(changedFiles, '用户管理模块修改审查', originalFiles);

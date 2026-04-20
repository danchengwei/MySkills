const tools = require('./tools');

console.log('=== Android 开发审查工具测试 ===\n');

console.log('--- 测试1: 显示开发规范指南 ---\n');
tools.startDevelopmentReview();

console.log('\n--- 测试2: 审查示例代码 ---\n');

const sampleJavaFile = `public class SampleActivity extends Activity {
    private static final String TAG = "SampleActivity";
    private TextView mTextView;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sample);
        
        mTextView = findViewById(R.id.text_view);
        updateText();
    }
    
    private void updateText() {
        String text = getData();
        if (text != null) {
            mTextView.setText(text);
        }
    }
    
    private String getData() {
        return "Hello World";
    }
}`;

const changedFiles = [
  {
    name: 'SampleActivity.java',
    path: 'SampleActivity.java',
    content: sampleJavaFile
  }
];

const originalFiles = {
  'SampleActivity.java': `public class SampleActivity extends Activity {
    private static final String TAG = "SampleActivity";
    private TextView mTextView;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sample);
        
        mTextView = findViewById(R.id.text_view);
    }
}`
};

tools.reviewDevelopmentChanges(changedFiles, '示例代码审查', originalFiles);

-- 小红书数据分析平台数据库初始化脚本
-- 创建时间: 2024-01-17

USE xiaohongshu_data;

-- 1. 笔记数据表
CREATE TABLE IF NOT EXISTS xhs_notes (
    id VARCHAR(50) PRIMARY KEY COMMENT '笔记ID',
    title VARCHAR(500) NOT NULL COMMENT '笔记标题',
    content TEXT COMMENT '笔记内容',
    note_type ENUM('normal', 'video') DEFAULT 'normal' COMMENT '笔记类型',
    user_id VARCHAR(50) NOT NULL COMMENT '用户ID',
    user_nickname VARCHAR(100) COMMENT '用户昵称',
    user_avatar VARCHAR(500) COMMENT '用户头像',
    like_count INT DEFAULT 0 COMMENT '点赞数',
    collect_count INT DEFAULT 0 COMMENT '收藏数',
    comment_count INT DEFAULT 0 COMMENT '评论数',
    share_count INT DEFAULT 0 COMMENT '分享数',
    view_count INT DEFAULT 0 COMMENT '浏览数',
    publish_time DATETIME COMMENT '发布时间',
    crawl_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '爬取时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    tags JSON COMMENT '标签列表',
    images JSON COMMENT '图片列表',
    video_url VARCHAR(500) COMMENT '视频链接',
    category VARCHAR(50) COMMENT '分类',
    location VARCHAR(100) COMMENT '地理位置',
    is_deleted BOOLEAN DEFAULT FALSE COMMENT '是否删除',
    INDEX idx_user_id (user_id),
    INDEX idx_publish_time (publish_time),
    INDEX idx_category (category),
    INDEX idx_crawl_time (crawl_time),
    INDEX idx_like_count (like_count),
    INDEX idx_comment_count (comment_count)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='小红书笔记数据表';

-- 2. 用户数据表
CREATE TABLE IF NOT EXISTS xhs_users (
    user_id VARCHAR(50) PRIMARY KEY COMMENT '用户ID',
    nickname VARCHAR(100) NOT NULL COMMENT '用户昵称',
    avatar VARCHAR(500) COMMENT '用户头像',
    gender ENUM('male', 'female', 'unknown') DEFAULT 'unknown' COMMENT '性别',
    age_range VARCHAR(20) COMMENT '年龄段',
    location VARCHAR(100) COMMENT '地理位置',
    follower_count INT DEFAULT 0 COMMENT '粉丝数',
    following_count INT DEFAULT 0 COMMENT '关注数',
    note_count INT DEFAULT 0 COMMENT '笔记数',
    like_count INT DEFAULT 0 COMMENT '获赞数',
    is_verified BOOLEAN DEFAULT FALSE COMMENT '是否认证',
    verification_type VARCHAR(50) COMMENT '认证类型',
    bio TEXT COMMENT '个人简介',
    first_crawl_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '首次爬取时间',
    last_update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
    is_active BOOLEAN DEFAULT TRUE COMMENT '是否活跃',
    INDEX idx_location (location),
    INDEX idx_follower_count (follower_count),
    INDEX idx_note_count (note_count),
    INDEX idx_gender (gender)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='小红书用户数据表';

-- 3. 话题趋势表
CREATE TABLE IF NOT EXISTS xhs_topics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    keyword VARCHAR(100) NOT NULL COMMENT '话题关键词',
    heat_score DECIMAL(10,2) DEFAULT 0 COMMENT '热度分数',
    trend_direction ENUM('up', 'down', 'stable') DEFAULT 'stable' COMMENT '趋势方向',
    note_count INT DEFAULT 0 COMMENT '相关笔记数',
    user_count INT DEFAULT 0 COMMENT '参与用户数',
    total_likes INT DEFAULT 0 COMMENT '总点赞数',
    total_comments INT DEFAULT 0 COMMENT '总评论数',
    category VARCHAR(50) COMMENT '话题分类',
    date DATE NOT NULL COMMENT '统计日期',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY uk_keyword_date (keyword, date),
    INDEX idx_heat_score (heat_score),
    INDEX idx_date (date),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='话题趋势数据表';

-- 4. 平台统计表
CREATE TABLE IF NOT EXISTS xhs_platform_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stat_date DATE NOT NULL COMMENT '统计日期',
    total_notes INT DEFAULT 0 COMMENT '总笔记数',
    active_users INT DEFAULT 0 COMMENT '活跃用户数',
    daily_posts INT DEFAULT 0 COMMENT '日发布量',
    total_interactions BIGINT DEFAULT 0 COMMENT '总互动数',
    avg_engagement_rate DECIMAL(5,2) DEFAULT 0 COMMENT '平均参与率',
    top_category VARCHAR(50) COMMENT '最热分类',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY uk_stat_date (stat_date),
    INDEX idx_stat_date (stat_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='平台统计数据表';

-- 5. 用户画像分析表
CREATE TABLE IF NOT EXISTS xhs_user_insights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    analysis_date DATE NOT NULL COMMENT '分析日期',
    age_distribution JSON COMMENT '年龄分布',
    gender_distribution JSON COMMENT '性别分布',
    location_distribution JSON COMMENT '地域分布',
    interest_distribution JSON COMMENT '兴趣分布',
    activity_pattern JSON COMMENT '活跃时间模式',
    engagement_metrics JSON COMMENT '参与度指标',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY uk_analysis_date (analysis_date),
    INDEX idx_analysis_date (analysis_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户画像分析表';

-- 6. 内容分析表
CREATE TABLE IF NOT EXISTS xhs_content_analysis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    analysis_date DATE NOT NULL COMMENT '分析日期',
    category_trends JSON COMMENT '分类趋势',
    content_types JSON COMMENT '内容类型分布',
    engagement_analysis JSON COMMENT '互动分析',
    optimal_posting_times JSON COMMENT '最佳发布时间',
    trending_keywords JSON COMMENT '热门关键词',
    sentiment_analysis JSON COMMENT '情感分析',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY uk_analysis_date (analysis_date),
    INDEX idx_analysis_date (analysis_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='内容分析表';

-- 7. 爬虫任务记录表
CREATE TABLE IF NOT EXISTS crawler_tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_type ENUM('hot_topics', 'search', 'user_profile', 'note_detail') NOT NULL COMMENT '任务类型',
    task_params JSON COMMENT '任务参数',
    status ENUM('pending', 'running', 'completed', 'failed') DEFAULT 'pending' COMMENT '任务状态',
    start_time DATETIME COMMENT '开始时间',
    end_time DATETIME COMMENT '结束时间',
    result_count INT DEFAULT 0 COMMENT '结果数量',
    error_message TEXT COMMENT '错误信息',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_task_type (task_type),
    INDEX idx_status (status),
    INDEX idx_created_time (created_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='爬虫任务记录表';

-- 插入初始数据
INSERT INTO xhs_platform_stats (stat_date, total_notes, active_users, daily_posts, total_interactions, avg_engagement_rate, top_category) 
VALUES 
(CURDATE(), 97359, 2500000, 3200, 1224000, 15.5, '时尚'),
(DATE_SUB(CURDATE(), INTERVAL 1 DAY), 96850, 2485000, 3150, 1205000, 15.2, '美妆'),
(DATE_SUB(CURDATE(), INTERVAL 2 DAY), 96340, 2470000, 3100, 1186000, 14.9, '生活');

-- 插入示例话题数据
INSERT INTO xhs_topics (keyword, heat_score, trend_direction, note_count, user_count, total_likes, total_comments, category, date) 
VALUES 
('秋冬穿搭', 98.5, 'up', 15420, 8500, 245000, 32000, '时尚', CURDATE()),
('护肤心得', 95.3, 'up', 12380, 7200, 198000, 28000, '美妆', CURDATE()),
('居家好物', 92.7, 'stable', 18650, 9800, 287000, 35000, '生活', CURDATE()),
('减脂餐', 89.4, 'down', 9870, 5400, 156000, 22000, '美食', CURDATE()),
('旅行攻略', 86.2, 'up', 11240, 6100, 178000, 25000, '旅行', CURDATE());

-- 创建视图：热门话题视图
CREATE OR REPLACE VIEW v_hot_topics AS
SELECT 
    keyword,
    heat_score,
    trend_direction,
    note_count,
    user_count,
    total_likes,
    total_comments,
    category,
    date,
    ROUND((total_likes + total_comments * 2) / note_count, 2) as avg_engagement
FROM xhs_topics 
WHERE date = CURDATE()
ORDER BY heat_score DESC;

-- 创建视图：用户统计视图
CREATE OR REPLACE VIEW v_user_stats AS
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN gender = 'female' THEN 1 END) as female_users,
    COUNT(CASE WHEN gender = 'male' THEN 1 END) as male_users,
    AVG(follower_count) as avg_followers,
    AVG(note_count) as avg_notes,
    COUNT(CASE WHEN is_verified = TRUE THEN 1 END) as verified_users
FROM xhs_users 
WHERE is_active = TRUE;

-- 创建存储过程：更新话题热度
DELIMITER //
CREATE PROCEDURE UpdateTopicHeat(
    IN p_keyword VARCHAR(100),
    IN p_category VARCHAR(50)
)
BEGIN
    DECLARE note_cnt INT DEFAULT 0;
    DECLARE like_cnt INT DEFAULT 0;
    DECLARE comment_cnt INT DEFAULT 0;
    DECLARE user_cnt INT DEFAULT 0;
    DECLARE heat DECIMAL(10,2) DEFAULT 0;
    
    -- 计算相关指标
    SELECT 
        COUNT(*),
        COALESCE(SUM(like_count), 0),
        COALESCE(SUM(comment_count), 0),
        COUNT(DISTINCT user_id)
    INTO note_cnt, like_cnt, comment_cnt, user_cnt
    FROM xhs_notes 
    WHERE (title LIKE CONCAT('%', p_keyword, '%') OR JSON_SEARCH(tags, 'one', p_keyword) IS NOT NULL)
    AND publish_time >= DATE_SUB(NOW(), INTERVAL 7 DAY);
    
    -- 计算热度分数
    SET heat = (note_cnt * 0.3 + like_cnt * 0.0001 + comment_cnt * 0.001 + user_cnt * 0.1);
    
    -- 插入或更新话题数据
    INSERT INTO xhs_topics (keyword, heat_score, note_count, user_count, total_likes, total_comments, category, date)
    VALUES (p_keyword, heat, note_cnt, user_cnt, like_cnt, comment_cnt, p_category, CURDATE())
    ON DUPLICATE KEY UPDATE
        heat_score = heat,
        note_count = note_cnt,
        user_count = user_cnt,
        total_likes = like_cnt,
        total_comments = comment_cnt;
END //
DELIMITER ;

-- 创建索引优化查询性能
CREATE INDEX idx_notes_title_fulltext ON xhs_notes(title);
CREATE INDEX idx_notes_publish_category ON xhs_notes(publish_time, category);
CREATE INDEX idx_users_location_gender ON xhs_users(location, gender);

-- 设置数据库字符集
ALTER DATABASE xiaohongshu_data CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

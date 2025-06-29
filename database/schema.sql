-- 北魏末年人物关系数据库架构
-- PostgreSQL Schema

-- 删除已存在的表和类型（如果存在）
DROP TABLE IF EXISTS relationships CASCADE;
DROP TABLE IF EXISTS timeline_events CASCADE;
DROP TABLE IF EXISTS people CASCADE;
DROP TYPE IF EXISTS event_type CASCADE;
DROP TYPE IF EXISTS relationship_type CASCADE;

-- 创建枚举类型
CREATE TYPE event_type AS ENUM (
    'birth', 
    'death', 
    'political', 
    'personal', 
    'military', 
    'other'
);

CREATE TYPE relationship_type AS ENUM (
    'family', 
    'spouse', 
    'political', 
    'ally', 
    'enemy', 
    'teacher', 
    'friend', 
    'parent', 
    'other'
);

-- 人物信息表
CREATE TABLE people (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    alias TEXT[], -- PostgreSQL 数组类型存储别名
    birth_year INTEGER NOT NULL,
    death_year INTEGER,
    dynasty VARCHAR(50) NOT NULL,
    occupation VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 约束
    CONSTRAINT chk_birth_year CHECK (birth_year > 0),
    CONSTRAINT chk_death_year CHECK (death_year IS NULL OR death_year > birth_year),
    CONSTRAINT chk_name_not_empty CHECK (LENGTH(TRIM(name)) > 0),
    CONSTRAINT chk_dynasty_not_empty CHECK (LENGTH(TRIM(dynasty)) > 0)
);

-- 时间线事件表
CREATE TABLE timeline_events (
    id VARCHAR(50) PRIMARY KEY,
    person_id VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    type event_type NOT NULL,
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 外键约束
    FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE,
    
    -- 约束
    CONSTRAINT chk_year CHECK (year > 0),
    CONSTRAINT chk_title_not_empty CHECK (LENGTH(TRIM(title)) > 0),
    CONSTRAINT chk_description_not_empty CHECK (LENGTH(TRIM(description)) > 0)
);

-- 人物关系表
CREATE TABLE relationships (
    id VARCHAR(50) PRIMARY KEY,
    person1_id VARCHAR(50) NOT NULL,
    person2_id VARCHAR(50) NOT NULL,
    type relationship_type NOT NULL,
    description TEXT NOT NULL,
    start_year INTEGER,
    end_year INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 外键约束
    FOREIGN KEY (person1_id) REFERENCES people(id) ON DELETE CASCADE,
    FOREIGN KEY (person2_id) REFERENCES people(id) ON DELETE CASCADE,
    
    -- 约束
    CONSTRAINT chk_different_persons CHECK (person1_id != person2_id),
    CONSTRAINT chk_year_range CHECK (start_year IS NULL OR end_year IS NULL OR start_year <= end_year),
    CONSTRAINT chk_description_not_empty CHECK (LENGTH(TRIM(description)) > 0)
);

-- 创建索引以提高查询性能
-- 人物表索引
CREATE INDEX idx_people_name ON people(name);
CREATE INDEX idx_people_dynasty ON people(dynasty);
CREATE INDEX idx_people_birth_year ON people(birth_year);
CREATE INDEX idx_people_death_year ON people(death_year) WHERE death_year IS NOT NULL;
CREATE INDEX idx_people_occupation ON people(occupation);
CREATE INDEX idx_people_location ON people(location);

-- 时间线事件表索引
CREATE INDEX idx_timeline_events_person_id ON timeline_events(person_id);
CREATE INDEX idx_timeline_events_year ON timeline_events(year);
CREATE INDEX idx_timeline_events_type ON timeline_events(type);
CREATE INDEX idx_timeline_events_person_year ON timeline_events(person_id, year);

-- 关系表索引
CREATE INDEX idx_relationships_person1_id ON relationships(person1_id);
CREATE INDEX idx_relationships_person2_id ON relationships(person2_id);
CREATE INDEX idx_relationships_type ON relationships(type);
CREATE INDEX idx_relationships_years ON relationships(start_year, end_year) WHERE start_year IS NOT NULL;

-- 复合索引
CREATE INDEX idx_relationships_persons ON relationships(person1_id, person2_id);

-- 全文搜索索引（支持中文搜索）
CREATE INDEX idx_people_search ON people USING gin(
    to_tsvector('simple', 
        name || ' ' || 
        COALESCE(array_to_string(alias, ' '), '') || ' ' || 
        dynasty || ' ' || 
        occupation || ' ' || 
        description
    )
);

CREATE INDEX idx_timeline_search ON timeline_events USING gin(
    to_tsvector('simple', title || ' ' || description || ' ' || COALESCE(location, ''))
);

-- 创建更新时间戳的函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为people表创建更新时间戳触发器
CREATE TRIGGER update_people_updated_at 
    BEFORE UPDATE ON people 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 创建视图以简化常用查询
-- 人物完整信息视图（包含生卒年份和在世年数）
CREATE VIEW people_full_info AS
SELECT 
    id,
    name,
    alias,
    birth_year,
    death_year,
    COALESCE(death_year, EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER) - birth_year AS age_or_current_age,
    dynasty,
    occupation,
    location,
    description,
    image,
    created_at,
    updated_at
FROM people;

-- 人物关系详细视图
CREATE VIEW relationships_detailed AS
SELECT 
    r.id,
    p1.name AS person1_name,
    p2.name AS person2_name,
    r.person1_id,
    r.person2_id,
    r.type,
    r.description,
    r.start_year,
    r.end_year,
    CASE 
        WHEN r.end_year IS NOT NULL AND r.start_year IS NOT NULL 
        THEN r.end_year - r.start_year + 1
        ELSE NULL
    END AS relationship_duration,
    r.created_at
FROM relationships r
JOIN people p1 ON r.person1_id = p1.id
JOIN people p2 ON r.person2_id = p2.id;

-- 时间线事件详细视图
CREATE VIEW timeline_events_detailed AS
SELECT 
    te.id,
    te.person_id,
    p.name AS person_name,
    te.year,
    te.title,
    te.description,
    te.type,
    te.location,
    p.birth_year,
    p.death_year,
    te.year - p.birth_year AS age_at_event,
    te.created_at
FROM timeline_events te
JOIN people p ON te.person_id = p.id;

-- 统计视图
CREATE VIEW dynasty_stats AS
SELECT 
    dynasty,
    COUNT(*) AS person_count,
    MIN(birth_year) AS earliest_birth,
    MAX(COALESCE(death_year, birth_year + 80)) AS latest_death,
    AVG(COALESCE(death_year, birth_year + 70) - birth_year) AS avg_lifespan
FROM people
GROUP BY dynasty;

-- 创建有用的函数
-- 搜索人物函数
CREATE OR REPLACE FUNCTION search_people(search_term TEXT)
RETURNS TABLE(
    id VARCHAR(50),
    name VARCHAR(100),
    alias TEXT[],
    dynasty VARCHAR(50),
    occupation VARCHAR(100),
    description TEXT,
    relevance_score REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.alias,
        p.dynasty,
        p.occupation,
        p.description,
        ts_rank(
            to_tsvector('simple', 
                p.name || ' ' || 
                COALESCE(array_to_string(p.alias, ' '), '') || ' ' || 
                p.dynasty || ' ' || 
                p.occupation || ' ' || 
                p.description
            ),
            plainto_tsquery('simple', search_term)
        ) AS relevance_score
    FROM people p
    WHERE to_tsvector('simple', 
            p.name || ' ' || 
            COALESCE(array_to_string(p.alias, ' '), '') || ' ' || 
            p.dynasty || ' ' || 
            p.occupation || ' ' || 
            p.description
        ) @@ plainto_tsquery('simple', search_term)
    ORDER BY relevance_score DESC;
END;
$$ LANGUAGE plpgsql;

-- 获取人物关系网络函数
CREATE OR REPLACE FUNCTION get_person_network(person_id_param VARCHAR(50), max_depth INTEGER DEFAULT 2)
RETURNS TABLE(
    person_id VARCHAR(50),
    person_name VARCHAR(100),
    relationship_type relationship_type,
    relationship_description TEXT,
    depth INTEGER
) AS $$
WITH RECURSIVE person_network AS (
    -- 基础查询：直接关系
    SELECT 
        CASE 
            WHEN r.person1_id = person_id_param THEN r.person2_id
            ELSE r.person1_id
        END AS person_id,
        CASE 
            WHEN r.person1_id = person_id_param THEN p2.name
            ELSE p1.name
        END AS person_name,
        r.type,
        r.description,
        1 as depth
    FROM relationships r
    JOIN people p1 ON r.person1_id = p1.id
    JOIN people p2 ON r.person2_id = p2.id
    WHERE r.person1_id = person_id_param OR r.person2_id = person_id_param
    
    UNION
    
    -- 递归查询：间接关系
    SELECT 
        CASE 
            WHEN r.person1_id = pn.person_id THEN r.person2_id
            ELSE r.person1_id
        END AS person_id,
        CASE 
            WHEN r.person1_id = pn.person_id THEN p2.name
            ELSE p1.name
        END AS person_name,
        r.type,
        r.description,
        pn.depth + 1
    FROM person_network pn
    JOIN relationships r ON (r.person1_id = pn.person_id OR r.person2_id = pn.person_id)
    JOIN people p1 ON r.person1_id = p1.id
    JOIN people p2 ON r.person2_id = p2.id
    WHERE pn.depth < max_depth
      AND CASE 
          WHEN r.person1_id = pn.person_id THEN r.person2_id
          ELSE r.person1_id
      END != person_id_param
)
SELECT DISTINCT * FROM person_network ORDER BY depth, person_name;
$$ LANGUAGE sql;

-- 添加注释
COMMENT ON TABLE people IS '历史人物基本信息表';
COMMENT ON TABLE timeline_events IS '人物生平时间线事件表';
COMMENT ON TABLE relationships IS '人物关系表';

COMMENT ON COLUMN people.alias IS '人物别名数组，如[''宣武帝'', ''拓跋恪'']';
COMMENT ON COLUMN people.birth_year IS '出生年份';
COMMENT ON COLUMN people.death_year IS '去世年份，NULL表示在世或未知';

COMMENT ON VIEW people_full_info IS '人物完整信息视图，包含年龄计算';
COMMENT ON VIEW relationships_detailed IS '人物关系详细视图，包含双方姓名';
COMMENT ON VIEW timeline_events_detailed IS '时间线事件详细视图，包含事件发生时年龄';

COMMENT ON FUNCTION search_people(TEXT) IS '全文搜索人物函数，返回相关度排序结果';
COMMENT ON FUNCTION get_person_network(VARCHAR(50), INTEGER) IS '获取人物关系网络函数，支持多层级关系查询'; 
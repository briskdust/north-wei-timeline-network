# 北魏末年人物关系数据库

这个数据库包含了北魏末年历史人物的详细信息、生平时间线和人物关系数据。

## 文件结构

```
database/
├── schema.sql      # 数据库架构文件（表结构、索引、视图、函数）
├── seed_data.sql   # 种子数据文件（插入历史人物数据）
└── README.md       # 使用说明（本文件）
```

## 快速开始

### 1. 创建数据库

```bash
# 连接到PostgreSQL
psql -U postgres

# 创建数据库
CREATE DATABASE beiwei_history;

# 连接到新数据库
\c beiwei_history
```

### 2. 执行架构文件

```bash
# 执行架构文件创建表结构
psql -U postgres -d beiwei_history -f schema.sql
```

### 3. 插入种子数据

```bash
# 执行种子数据文件
psql -U postgres -d beiwei_history -f seed_data.sql
```

### 4. 验证数据

```sql
-- 查看数据统计
SELECT 
    '人物总数' as 统计项目, 
    COUNT(*)::text as 数量 
FROM people
UNION ALL
SELECT 
    '时间线事件总数', 
    COUNT(*)::text 
FROM timeline_events
UNION ALL
SELECT 
    '关系总数', 
    COUNT(*)::text 
FROM relationships;
```

## 数据库结构

### 核心表

#### 1. people（人物表）
- `id`: 人物唯一标识
- `name`: 姓名
- `alias`: 别名数组
- `birth_year`: 出生年份
- `death_year`: 去世年份
- `dynasty`: 朝代
- `occupation`: 职业
- `location`: 主要活动地点
- `description`: 人物描述
- `image`: 头像URL

#### 2. timeline_events（时间线事件表）
- `id`: 事件唯一标识
- `person_id`: 关联人物ID
- `year`: 事件年份
- `title`: 事件标题
- `description`: 事件描述
- `type`: 事件类型（birth, death, political, personal, military, other）
- `location`: 事件地点

#### 3. relationships（人物关系表）
- `id`: 关系唯一标识
- `person1_id`: 人物1 ID
- `person2_id`: 人物2 ID
- `type`: 关系类型（family, spouse, political, ally, enemy, teacher, friend, parent, other）
- `description`: 关系描述
- `start_year`: 关系开始年份
- `end_year`: 关系结束年份

### 视图

#### 1. people_full_info
人物完整信息视图，包含年龄计算

#### 2. relationships_detailed
人物关系详细视图，包含双方姓名

#### 3. timeline_events_detailed
时间线事件详细视图，包含事件发生时年龄

#### 4. dynasty_stats
朝代统计视图

### 函数

#### 1. search_people(search_term TEXT)
全文搜索人物函数，支持中文搜索

```sql
-- 搜索包含"高欢"的人物
SELECT * FROM search_people('高欢');
```

#### 2. get_person_network(person_id VARCHAR(50), max_depth INTEGER)
获取人物关系网络函数，支持多层级关系查询

```sql
-- 获取高欢的关系网络（最多2层）
SELECT * FROM get_person_network('gaohuan', 2);
```

## 常用查询示例

### 1. 搜索人物

```sql
-- 按姓名搜索
SELECT * FROM people WHERE name LIKE '%元%';

-- 按别名搜索
SELECT * FROM people WHERE '皇帝' = ANY(alias);

-- 全文搜索
SELECT * FROM search_people('北魏 皇帝');
```

### 2. 获取人物时间线

```sql
-- 获取元恪的生平时间线
SELECT year, title, description, type, location
FROM timeline_events_detailed 
WHERE person_id = 'yuanke' 
ORDER BY year;
```

### 3. 查询人物关系

```sql
-- 获取高欢的所有关系
SELECT person1_name, person2_name, type, description
FROM relationships_detailed 
WHERE person1_id = 'gaohuan' OR person2_id = 'gaohuan';

-- 查询父子关系
SELECT person1_name as 父亲, person2_name as 子女, description
FROM relationships_detailed 
WHERE type = 'parent';
```

### 4. 统计查询

```sql
-- 按朝代统计人物数量
SELECT dynasty, COUNT(*) as 人物数量
FROM people 
GROUP BY dynasty 
ORDER BY 人物数量 DESC;

-- 按事件类型统计
SELECT type, COUNT(*) as 事件数量
FROM timeline_events 
GROUP BY type 
ORDER BY 事件数量 DESC;

-- 按关系类型统计
SELECT type, COUNT(*) as 关系数量
FROM relationships 
GROUP BY type 
ORDER BY 关系数量 DESC;
```

### 5. 复杂查询

```sql
-- 查找在同一年发生的重要事件
SELECT year, STRING_AGG(person_name || ': ' || title, '; ') as 同年事件
FROM timeline_events_detailed 
WHERE type IN ('political', 'military', 'death')
GROUP BY year 
HAVING COUNT(*) > 1
ORDER BY year;

-- 查找寿命最长的人物
SELECT name, birth_year, death_year, 
       death_year - birth_year as 寿命
FROM people 
WHERE death_year IS NOT NULL
ORDER BY 寿命 DESC
LIMIT 10;
```

## 性能优化

数据库已经创建了以下索引来优化查询性能：

1. **基础索引**：姓名、朝代、年份等常用字段
2. **复合索引**：person_id + year, person1_id + person2_id 等
3. **全文搜索索引**：支持中文全文搜索
4. **条件索引**：如 death_year 的部分索引

## 扩展建议

### 1. 添加新人物

```sql
INSERT INTO people (id, name, alias, birth_year, death_year, dynasty, occupation, location, description) 
VALUES ('new_person_id', '新人物', ARRAY['别名1', '别名2'], 500, 550, '朝代', '职业', '地点', '描述');
```

### 2. 添加新事件

```sql
INSERT INTO timeline_events (id, person_id, year, title, description, type, location) 
VALUES ('new_event_id', 'person_id', 525, '事件标题', '事件描述', 'political', '地点');
```

### 3. 添加新关系

```sql
INSERT INTO relationships (id, person1_id, person2_id, type, description, start_year, end_year) 
VALUES ('new_rel_id', 'person1_id', 'person2_id', 'ally', '关系描述', 520, 530);
```

## 注意事项

1. **数据完整性**：所有外键约束确保数据一致性
2. **字符编码**：确保PostgreSQL使用UTF-8编码支持中文
3. **备份**：定期备份数据库
4. **权限**：根据需要设置适当的用户权限

## 联系方式

如有问题或建议，请通过项目仓库提交Issue。 
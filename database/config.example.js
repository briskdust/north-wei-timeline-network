// PostgreSQL 数据库连接配置示例
// 复制此文件为 config.js 并填入实际的数据库连接信息

const { Pool } = require("pg");

// 数据库连接配置
const dbConfig = {
  user: "your_username", // 数据库用户名
  host: "localhost", // 数据库主机地址
  database: "beiwei_history", // 数据库名
  password: "your_password", // 数据库密码
  port: 5432, // PostgreSQL 端口

  // 连接池配置
  max: 20, // 最大连接数
  idleTimeoutMillis: 30000, // 空闲连接超时时间
  connectionTimeoutMillis: 2000, // 连接超时时间
};

// 创建连接池
const pool = new Pool(dbConfig);

// 数据库查询函数
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log("Executed query", { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
};

// 获取单个人物信息
const getPersonById = async personId => {
  const result = await query("SELECT * FROM people WHERE id = $1", [personId]);
  return result.rows[0];
};

// 搜索人物
const searchPeople = async searchTerm => {
  const result = await query("SELECT * FROM search_people($1)", [searchTerm]);
  return result.rows;
};

// 获取人物时间线
const getPersonTimeline = async personId => {
  const result = await query(
    "SELECT * FROM timeline_events_detailed WHERE person_id = $1 ORDER BY year",
    [personId]
  );
  return result.rows;
};

// 获取人物关系
const getPersonRelationships = async personId => {
  const result = await query(
    "SELECT * FROM relationships_detailed WHERE person1_id = $1 OR person2_id = $1",
    [personId]
  );
  return result.rows;
};

// 获取人物关系网络
const getPersonNetwork = async (personId, maxDepth = 2) => {
  const result = await query("SELECT * FROM get_person_network($1, $2)", [
    personId,
    maxDepth,
  ]);
  return result.rows;
};

// 获取所有人物（分页）
const getAllPeople = async (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  const result = await query(
    "SELECT * FROM people ORDER BY birth_year LIMIT $1 OFFSET $2",
    [limit, offset]
  );
  return result.rows;
};

// 按朝代获取人物
const getPeopleByDynasty = async dynasty => {
  const result = await query(
    "SELECT * FROM people WHERE dynasty = $1 ORDER BY birth_year",
    [dynasty]
  );
  return result.rows;
};

// 获取统计信息
const getStatistics = async () => {
  const peopleCount = await query("SELECT COUNT(*) FROM people");
  const eventsCount = await query("SELECT COUNT(*) FROM timeline_events");
  const relationshipsCount = await query("SELECT COUNT(*) FROM relationships");
  const dynastyStats = await query("SELECT * FROM dynasty_stats");

  return {
    people: parseInt(peopleCount.rows[0].count),
    events: parseInt(eventsCount.rows[0].count),
    relationships: parseInt(relationshipsCount.rows[0].count),
    dynasties: dynastyStats.rows,
  };
};

// 优雅关闭连接池
const closePool = async () => {
  await pool.end();
};

// 监听进程退出事件，优雅关闭连接
process.on("SIGINT", closePool);
process.on("SIGTERM", closePool);

module.exports = {
  query,
  getPersonById,
  searchPeople,
  getPersonTimeline,
  getPersonRelationships,
  getPersonNetwork,
  getAllPeople,
  getPeopleByDynasty,
  getStatistics,
  closePool,
};

// 使用示例：
/*
const db = require('./config');

// 搜索人物
const searchResults = await db.searchPeople('高欢');
console.log(searchResults);

// 获取人物信息
const person = await db.getPersonById('gaohuan');
console.log(person);

// 获取时间线
const timeline = await db.getPersonTimeline('gaohuan');
console.log(timeline);

// 获取关系网络
const network = await db.getPersonNetwork('gaohuan', 2);
console.log(network);
*/

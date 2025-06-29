import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv";

const { Pool } = pkg;
dotenv.config();

const app = express();
const port = process.env.APP_PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 数据库连接池
const pool = new Pool({
  user: process.env.POSTGRES_USER || "beiwei_user",
  host: process.env.POSTGRES_HOST || "localhost",
  database: process.env.POSTGRES_DB || "beiwei_history",
  password: process.env.POSTGRES_PASSWORD || "your_secure_password_here",
  port: process.env.POSTGRES_PORT || 5432,
});

// 数据库查询辅助函数
const query = async (text, params) => {
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
};

// API 路由

// 1. 搜索人物
app.get("/api/people/search", async (req, res) => {
  try {
    const { q } = req.query;
    console.log("搜索关键词:", q);

    if (!q) {
      return res.status(400).json({ error: "请提供搜索关键词" });
    }

    const searchTerm = `%${q}%`;
    console.log("搜索模式:", searchTerm);

    const result = await query(
      `SELECT * FROM people 
       WHERE name ILIKE $1 
          OR array_to_string(alias, ' ') ILIKE $1 
          OR description ILIKE $1 
          OR occupation ILIKE $1
       ORDER BY 
         CASE 
           WHEN name ILIKE $1 THEN 1
           WHEN array_to_string(alias, ' ') ILIKE $1 THEN 2
           ELSE 3
         END`,
      [searchTerm]
    );

    console.log("搜索结果数量:", result.rows.length);
    res.json(result.rows);
  } catch (error) {
    console.error("搜索人物错误:", error);
    res.status(500).json({ error: "搜索失败" });
  }
});

// 2. 获取所有人物
app.get("/api/people", async (req, res) => {
  try {
    const result = await query("SELECT * FROM people ORDER BY birth_year");
    res.json(result.rows);
  } catch (error) {
    console.error("获取人物列表错误:", error);
    res.status(500).json({ error: "获取人物列表失败" });
  }
});

// 3. 获取单个人物信息
app.get("/api/people/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query("SELECT * FROM people WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "人物不存在" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("获取人物信息错误:", error);
    res.status(500).json({ error: "获取人物信息失败" });
  }
});

// 4. 获取人物时间线
app.get("/api/people/:id/timeline", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      "SELECT * FROM timeline_events_detailed WHERE person_id = $1 ORDER BY year",
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("获取时间线错误:", error);
    res.status(500).json({ error: "获取时间线失败" });
  }
});

// 5. 获取人物关系
app.get("/api/people/:id/relationships", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      "SELECT * FROM relationships_detailed WHERE person1_id = $1 OR person2_id = $1",
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("获取关系错误:", error);
    res.status(500).json({ error: "获取关系失败" });
  }
});

// 6. 获取人物关系网络
app.get("/api/people/:id/network", async (req, res) => {
  try {
    const { id } = req.params;
    const { depth = 2 } = req.query;

    const result = await query("SELECT * FROM get_person_network($1, $2)", [
      id,
      parseInt(depth),
    ]);
    res.json(result.rows);
  } catch (error) {
    console.error("获取关系网络错误:", error);
    res.status(500).json({ error: "获取关系网络失败" });
  }
});

// 7. 获取统计信息
app.get("/api/stats", async (req, res) => {
  try {
    const peopleCount = await query("SELECT COUNT(*) FROM people");
    const eventsCount = await query("SELECT COUNT(*) FROM timeline_events");
    const relationshipsCount = await query(
      "SELECT COUNT(*) FROM relationships"
    );
    const dynastyStats = await query("SELECT * FROM dynasty_stats");

    res.json({
      people: parseInt(peopleCount.rows[0].count),
      events: parseInt(eventsCount.rows[0].count),
      relationships: parseInt(relationshipsCount.rows[0].count),
      dynasties: dynastyStats.rows,
    });
  } catch (error) {
    console.error("获取统计信息错误:", error);
    res.status(500).json({ error: "获取统计信息失败" });
  }
});

// 8. 按朝代获取人物
app.get("/api/dynasties/:dynasty/people", async (req, res) => {
  try {
    const { dynasty } = req.params;
    const result = await query(
      "SELECT * FROM people WHERE dynasty = $1 ORDER BY birth_year",
      [dynasty]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("按朝代获取人物错误:", error);
    res.status(500).json({ error: "获取朝代人物失败" });
  }
});

// 健康检查
app.get("/api/health", async (req, res) => {
  try {
    await query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    res.status(500).json({ status: "error", database: "disconnected" });
  }
});

// 错误处理中间件
app.use((error, req, res, next) => {
  console.error("服务器错误:", error);
  res.status(500).json({ error: "服务器内部错误" });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: "接口不存在" });
});

// 启动服务器
app.listen(port, () => {
  console.log(`🚀 后端服务器运行在 http://localhost:${port}`);
  console.log(`📊 API文档: http://localhost:${port}/api/health`);
});

// 优雅关闭
process.on("SIGINT", async () => {
  console.log("\n正在关闭服务器...");
  await pool.end();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n正在关闭服务器...");
  await pool.end();
  process.exit(0);
});

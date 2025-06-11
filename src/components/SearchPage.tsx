import React, { useState } from "react";
import { Input, Card, List, Typography, Space } from "antd";
import { Search, User, Calendar, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { searchPersons } from "../data/mockData";
import type { Person } from "../types/index";

const { Title, Text } = Typography;

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Person[]>([]);
  const navigate = useNavigate();

  const handleSearch = (value: string) => {
    setQuery(value);
    const searchResults = searchPersons(value);
    setResults(searchResults);
  };

  const handlePersonClick = (personId: string) => {
    navigate(`/person/${personId}`);
  };

  return (
    <div
      style={{
        padding: "40px 5%",
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        className="fade-in-up"
        style={{ maxWidth: "100%", margin: "0 auto" }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* 标题区域 */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{ marginBottom: "16px" }}>
              <Sparkles
                size={48}
                style={{
                  color: "#fff",
                  filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
                  marginBottom: "16px",
                }}
              />
            </div>
            <Title
              level={1}
              className="app-title"
              style={{ fontSize: "3.5rem", marginBottom: "16px" }}
            >
              北魏人物生平与关系网
            </Title>
          </div>

          {/* 搜索区域 */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <Input
              size="large"
              prefix={<Search size={24} style={{ color: "#667eea" }} />}
              placeholder="输入人物姓名开始探索..."
              value={query}
              onChange={e => handleSearch(e.target.value)}
              style={{
                fontSize: "18px",
                height: "64px",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            />
          </div>

          {/* 搜索结果 */}
          {results.length > 0 && (
            <div
              className="fade-in-up"
              style={{ maxWidth: "1400px", margin: "0 auto" }}
            >
              <List
                grid={{
                  gutter: [32, 32],
                  xs: 1,
                  sm: 1,
                  md: 1,
                  lg: 2,
                  xl: 2,
                  xxl: 3,
                }}
                dataSource={results}
                renderItem={person => (
                  <List.Item>
                    <Card
                      hoverable
                      onClick={() => handlePersonClick(person.id)}
                      className="bounce-hover"
                      style={{
                        cursor: "pointer",
                        overflow: "hidden",
                        height: "100%",
                      }}
                      bodyStyle={{ padding: "32px" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "24px",
                        }}
                      >
                        <div
                          style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, #667eea, #764ba2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)",
                            flexShrink: 0,
                          }}
                        >
                          <User size={36} color="white" />
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ marginBottom: "12px" }}>
                            <Title
                              level={3}
                              style={{ margin: 0, color: "#2c3e50" }}
                            >
                              {person.name}
                              {person.alias && person.alias.length > 0 && (
                                <span
                                  style={{
                                    color: "#667eea",
                                    fontSize: "18px",
                                    fontWeight: 500,
                                    marginLeft: "12px",
                                  }}
                                >
                                  · {person.alias[0]}
                                </span>
                              )}
                            </Title>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              marginBottom: "12px",
                            }}
                          >
                            <Calendar size={16} style={{ color: "#667eea" }} />
                            <Text
                              style={{
                                fontSize: "16px",
                                fontWeight: 500,
                                color: "#667eea",
                              }}
                            >
                              {person.birthYear} - {person.deathYear || "至今"}
                            </Text>
                          </div>

                          <Text
                            style={{
                              fontSize: "16px",
                              color: "#666",
                              lineHeight: "1.6",
                            }}
                          >
                            {person.description}
                          </Text>
                        </div>
                      </div>
                    </Card>
                  </List.Item>
                )}
              />
            </div>
          )}

          {/* 空状态 */}
          {query && results.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "80px 40px",
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              <Search
                size={48}
                style={{
                  color: "rgba(255, 255, 255, 0.6)",
                  marginBottom: "16px",
                }}
              />
              <Text
                style={{
                  fontSize: "18px",
                  color: "rgba(255, 255, 255, 0.8)",
                  display: "block",
                }}
              >
                未找到相关人物
              </Text>
              <Text
                style={{
                  fontSize: "14px",
                  color: "rgba(255, 255, 255, 0.6)",
                  marginTop: "8px",
                }}
              >
                试试搜索"高欢"、"宇文泰"或"尔朱荣"
              </Text>
            </div>
          )}

          {/* 推荐区域 */}
          {!query && (
            <div
              className="fade-in-up"
              style={{
                marginTop: "40px",
                maxWidth: "800px",
                margin: "40px auto 0",
              }}
            >
              <Card
                className="glass-card"
                style={{ textAlign: "center" }}
                bodyStyle={{ padding: "40px" }}
              >
                <Title
                  level={4}
                  style={{ color: "white", marginBottom: "16px" }}
                >
                  ✨ 推荐探索
                </Title>
                <Text
                  style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: "16px",
                  }}
                >
                  试试搜索这些历史人物开始你的探索之旅
                </Text>
                <div
                  style={{
                    marginTop: "24px",
                    display: "flex",
                    gap: "12px",
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {["高欢", "宇文泰", "尔朱荣"].map(name => (
                    <span
                      key={name}
                      onClick={() => handleSearch(name)}
                      style={{
                        padding: "8px 16px",
                        background: "rgba(255, 255, 255, 0.2)",
                        borderRadius: "20px",
                        color: "white",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background =
                          "rgba(255, 255, 255, 0.3)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background =
                          "rgba(255, 255, 255, 0.2)";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </Space>
      </div>
    </div>
  );
};

export default SearchPage;

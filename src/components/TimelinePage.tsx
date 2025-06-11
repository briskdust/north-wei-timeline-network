import React from "react";
import { Timeline, Card, Typography, Button, Space, Tag } from "antd";
import {
  ArrowLeft,
  Calendar,
  Star,
  Award,
  Briefcase,
  Heart,
  Skull,
  Network,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getPersonById, getPersonTimeline } from "../data/mockData";
import type { TimelineEvent } from "../types/index";

const { Title, Text } = Typography;

const getEventIcon = (type: TimelineEvent["type"]) => {
  switch (type) {
    case "birth":
      return <Star color="#52c41a" size={20} />;
    case "political":
      return <Award color="#1890ff" size={20} />;
    case "military":
      return <Briefcase color="#722ed1" size={20} />;
    case "personal":
      return <Heart color="#eb2f96" size={20} />;
    case "death":
      return <Skull color="#8c8c8c" size={20} />;
    default:
      return <Calendar color="#fa8c16" size={20} />;
  }
};

const getEventColor = (type: TimelineEvent["type"]) => {
  switch (type) {
    case "birth":
      return "#52c41a";
    case "political":
      return "#1890ff";
    case "military":
      return "#722ed1";
    case "personal":
      return "#eb2f96";
    case "death":
      return "#8c8c8c";
    default:
      return "#fa8c16";
  }
};

const getEventLabel = (type: TimelineEvent["type"]) => {
  switch (type) {
    case "birth":
      return "出生";
    case "political":
      return "政治";
    case "military":
      return "军事";
    case "personal":
      return "个人";
    case "death":
      return "逝世";
    default:
      return "其他";
  }
};

const TimelinePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const person = id ? getPersonById(id) : null;
  const timeline = id ? getPersonTimeline(id) : [];

  if (!person) {
    return (
      <div
        style={{
          padding: "80px 24px",
          textAlign: "center",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          margin: "80px auto",
          maxWidth: "500px",
        }}
      >
        <Text style={{ fontSize: "18px", color: "rgba(255, 255, 255, 0.8)" }}>
          未找到该人物信息
        </Text>
        <br />
        <Button
          type="primary"
          size="large"
          onClick={() => navigate("/")}
          style={{ marginTop: "24px" }}
        >
          返回搜索
        </Button>
      </div>
    );
  }

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
        style={{ maxWidth: "1400px", margin: "0 auto" }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <Button
              icon={<ArrowLeft size={18} />}
              onClick={() => navigate("/")}
              style={{
                marginBottom: "24px",
                background: "rgba(255, 255, 255, 0.1)",
                borderColor: "rgba(255, 255, 255, 0.3)",
                color: "white",
              }}
              size="large"
            >
              返回搜索
            </Button>

            <Card
              style={{
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)",
                overflow: "hidden",
              }}
              bodyStyle={{ padding: "48px" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "32px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 12px 40px rgba(102, 126, 234, 0.3)",
                    flexShrink: 0,
                  }}
                >
                  <Star size={48} color="white" />
                </div>

                <div style={{ flex: 1, minWidth: "300px" }}>
                  <Title
                    level={1}
                    style={{
                      margin: 0,
                      marginBottom: "12px",
                      background: "linear-gradient(135deg, #667eea, #764ba2)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      fontSize: "clamp(2rem, 4vw, 3rem)",
                    }}
                  >
                    {person.name}
                    {person.alias && person.alias.length > 0 && (
                      <span
                        style={{
                          color: "#667eea",
                          fontSize: "clamp(1rem, 2vw, 1.5rem)",
                          fontWeight: 500,
                          marginLeft: "16px",
                        }}
                      >
                        · {person.alias[0]}
                      </span>
                    )}
                  </Title>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "16px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Calendar size={20} style={{ color: "#667eea" }} />
                      <Text
                        style={{
                          fontSize: "18px",
                          fontWeight: 600,
                          color: "#667eea",
                        }}
                      >
                        {person.birthYear} - {person.deathYear || "至今"}
                      </Text>
                    </div>
                    <Tag
                      color="#667eea"
                      style={{
                        padding: "4px 12px",
                        fontSize: "14px",
                        fontWeight: 500,
                        borderRadius: "16px",
                      }}
                    >
                      {person.dynasty}
                    </Tag>
                    <Tag
                      style={{
                        padding: "4px 12px",
                        fontSize: "14px",
                        fontWeight: 500,
                        borderRadius: "16px",
                        background: "linear-gradient(135deg, #667eea, #764ba2)",
                        color: "white",
                        border: "none",
                      }}
                    >
                      {person.occupation}
                    </Tag>
                  </div>

                  <Text
                    style={{
                      fontSize: "16px",
                      color: "#666",
                      lineHeight: "1.8",
                      marginBottom: "24px",
                    }}
                  >
                    {person.description}
                  </Text>

                  <Button
                    type="primary"
                    icon={<Network size={18} />}
                    onClick={() => navigate(`/network/${person.id}`)}
                    size="large"
                    style={{
                      background: "linear-gradient(135deg, #667eea, #764ba2)",
                      border: "none",
                      borderRadius: "12px",
                      height: "48px",
                      fontSize: "16px",
                      fontWeight: 600,
                    }}
                  >
                    查看关系网络
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <Card
            title={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <Calendar
                  size={24}
                  style={{
                    color: "#667eea",
                  }}
                />
                <span
                  style={{
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontSize: "24px",
                    fontWeight: 700,
                  }}
                >
                  生平时间线
                </span>
              </div>
            }
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)",
            }}
            bodyStyle={{ padding: "32px 48px" }}
          >
            {timeline.length > 0 ? (
              <Timeline
                mode="left"
                items={timeline
                  .sort((a, b) => a.year - b.year)
                  .map((event, index) => ({
                    key: event.id,
                    color: getEventColor(event.type),
                    dot: getEventIcon(event.type),
                    children: (
                      <div
                        className="fade-in-up"
                        style={{
                          animationDelay: `${index * 0.1}s`,
                          paddingLeft: "24px",
                        }}
                      >
                        <div
                          style={{
                            background: "rgba(255, 255, 255, 0.8)",
                            padding: "24px",
                            borderRadius: "16px",
                            border: `2px solid ${getEventColor(event.type)}20`,
                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                            marginBottom: "16px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "12px",
                              flexWrap: "wrap",
                              gap: "12px",
                            }}
                          >
                            <Title
                              level={4}
                              style={{
                                margin: 0,
                                color: "#2c3e50",
                                fontSize: "20px",
                              }}
                            >
                              {event.title}
                            </Title>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                              }}
                            >
                              <Tag
                                color={getEventColor(event.type)}
                                style={{
                                  padding: "4px 12px",
                                  fontSize: "12px",
                                  fontWeight: 500,
                                  borderRadius: "12px",
                                }}
                              >
                                {getEventLabel(event.type)}
                              </Tag>
                              <Text
                                style={{
                                  fontWeight: 600,
                                  color: "#667eea",
                                  fontSize: "16px",
                                }}
                              >
                                {event.year}年
                              </Text>
                            </div>
                          </div>
                          <Text
                            style={{
                              fontSize: "16px",
                              color: "#555",
                              lineHeight: "1.6",
                              marginBottom: event.location ? "8px" : "0",
                            }}
                          >
                            {event.description}
                          </Text>
                          {event.location && (
                            <Text
                              style={{
                                fontSize: "14px",
                                color: "#888",
                                fontStyle: "italic",
                              }}
                            >
                              📍 {event.location}
                            </Text>
                          )}
                        </div>
                      </div>
                    ),
                  }))}
              />
            ) : (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <Text style={{ fontSize: "16px", color: "#999" }}>
                  暂无时间线数据
                </Text>
              </div>
            )}
          </Card>
        </Space>
      </div>
    </div>
  );
};

export default TimelinePage;

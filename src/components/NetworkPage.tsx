import React, { useEffect, useRef } from "react";
import { Card, Typography, Button, Space, List } from "antd";
import { ArrowLeft, Users, User, Network as NetworkIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Network } from "vis-network";
import { DataSet } from "vis-data";
import {
  getPersonById,
  getPersonRelationships,
  people,
} from "../data/mockData";
import type { NetworkNode, NetworkEdge, Relationship } from "../types/index";

const { Title, Text } = Typography;

const NetworkPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const networkRef = useRef<HTMLDivElement>(null);
  const networkInstance = useRef<Network | null>(null);
  const person = id ? getPersonById(id) : null;
  const relationships = id ? getPersonRelationships(id) : [];

  useEffect(() => {
    if (!person || !networkRef.current) return;

    // 准备节点数据
    const nodes: NetworkNode[] = [
      {
        id: person.id,
        label: person.name,
        title: person.alias?.[0] || "",
        color: "#ff6b6b",
        group: "center",
      },
    ];

    // 添加关系人物节点
    relationships.forEach(rel => {
      const targetPersonId =
        rel.person1Id === person.id ? rel.person2Id : rel.person1Id;
      const targetPerson = people.find(p => p.id === targetPersonId);

      if (targetPerson) {
        nodes.push({
          id: targetPerson.id,
          label: targetPerson.name,
          title: targetPerson.alias?.[0] || "",
          color: "#4ecdc4",
          group: "related",
        });
      }
    });

    // 准备边数据
    const edges: NetworkEdge[] = relationships.map(rel => {
      const targetPersonId =
        rel.person1Id === person.id ? rel.person2Id : rel.person1Id;
      return {
        id: rel.id,
        from: person.id,
        to: targetPersonId,
        label: rel.description,
        color: "#667eea",
        arrows: "to",
      };
    });

    // 创建数据集
    const nodesDataSet = new DataSet(nodes);
    const edgesDataSet = new DataSet(edges);

    // 网络配置
    const options = {
      nodes: {
        shape: "circle",
        size: 30,
        font: {
          size: 16,
          color: "#333",
          face: "Inter, sans-serif",
          strokeWidth: 2,
          strokeColor: "#ffffff",
        },
        borderWidth: 3,
        borderColor: "#ffffff",
        shadow: {
          enabled: true,
          color: "rgba(0,0,0,0.2)",
          size: 10,
          x: 2,
          y: 2,
        },
        chosen: true,
      },
      edges: {
        width: 3,
        color: {
          color: "#667eea",
          highlight: "#5a67d8",
        },
        font: {
          size: 14,
          color: "#4a5568",
          background: "rgba(255,255,255,0.9)",
          strokeWidth: 2,
          strokeColor: "#ffffff",
          face: "Inter, sans-serif",
        },
        smooth: {
          enabled: true,
          type: "continuous",
          roundness: 0.5,
        },
        shadow: {
          enabled: true,
          color: "rgba(102, 126, 234, 0.3)",
          size: 5,
          x: 1,
          y: 1,
        },
      },
      physics: {
        enabled: true,
        stabilization: { iterations: 150 },
        barnesHut: {
          gravitationalConstant: -8000,
          centralGravity: 0.3,
          springLength: 120,
          springConstant: 0.04,
          damping: 0.09,
        },
      },
      interaction: {
        hover: true,
        selectConnectedEdges: false,
        hoverConnectedEdges: true,
      },
    };

    // 创建网络
    networkInstance.current = new Network(
      networkRef.current,
      { nodes: nodesDataSet, edges: edgesDataSet },
      options
    );

    // 节点点击事件
    networkInstance.current.on("click", params => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        if (nodeId !== person.id) {
          navigate(`/person/${nodeId}`);
        }
      }
    });

    // 清理函数
    return () => {
      if (networkInstance.current) {
        networkInstance.current.destroy();
        networkInstance.current = null;
      }
    };
  }, [person, relationships, navigate]);

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

  const handlePersonClick = (targetPersonId: string) => {
    console.log("点击人物，targetPersonId:", targetPersonId);
    navigate(`/person/${targetPersonId}`);
  };

  return (
    <div
      style={{
        padding: "40px 3%",
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
          <div>
            <Button
              icon={<ArrowLeft size={18} />}
              onClick={() => navigate(`/person/${person.id}`)}
              style={{
                marginBottom: "24px",
                background: "rgba(255, 255, 255, 0.1)",
                borderColor: "rgba(255, 255, 255, 0.3)",
                color: "white",
              }}
              size="large"
            >
              返回时间线
            </Button>

            <Card
              style={{
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)",
                overflow: "hidden",
                marginBottom: "24px",
              }}
              bodyStyle={{ padding: "32px" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "24px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)",
                    flexShrink: 0,
                  }}
                >
                  <NetworkIcon size={36} color="white" />
                </div>

                <div style={{ flex: 1 }}>
                  <Title
                    level={2}
                    style={{
                      margin: 0,
                      marginBottom: "8px",
                      background: "linear-gradient(135deg, #667eea, #764ba2)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {person.name} 的关系网络
                  </Title>
                  <Text style={{ fontSize: "16px", color: "#666" }}>
                    点击网络中的人物节点可跳转到对应页面
                  </Text>
                </div>
              </div>
            </Card>
          </div>

          {/* 响应式布局 */}
          <div
            style={{
              display: "flex",
              gap: "24px",
              flexDirection: window.innerWidth > 1200 ? "row" : "column",
            }}
          >
            {/* 网络图 */}
            <Card
              title={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <Users size={24} style={{ color: "#667eea" }} />
                  <span
                    style={{
                      background: "linear-gradient(135deg, #667eea, #764ba2)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      fontSize: "20px",
                      fontWeight: 600,
                    }}
                  >
                    关系网络图
                  </span>
                </div>
              }
              style={{
                flex: window.innerWidth > 1200 ? "2" : "1",
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)",
              }}
              bodyStyle={{ padding: "24px" }}
            >
              <div
                ref={networkRef}
                style={{
                  width: "100%",
                  height: window.innerWidth > 1200 ? "600px" : "400px",
                  border: "2px solid #f0f0f0",
                  borderRadius: "12px",
                  background: "#fafafa",
                }}
              />
            </Card>

            {/* 关系列表 */}
            <Card
              title={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <User size={24} style={{ color: "#667eea" }} />
                  <span
                    style={{
                      background: "linear-gradient(135deg, #667eea, #764ba2)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      fontSize: "20px",
                      fontWeight: 600,
                    }}
                  >
                    关系列表
                  </span>
                </div>
              }
              style={{
                flex: window.innerWidth > 1200 ? "1" : "1",
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)",
              }}
              bodyStyle={{ padding: "24px" }}
            >
              {relationships.length > 0 ? (
                <List
                  dataSource={relationships}
                  renderItem={(rel: Relationship) => {
                    const targetPersonId =
                      rel.person1Id === person.id
                        ? rel.person2Id
                        : rel.person1Id;
                    const targetPerson = people.find(
                      p => p.id === targetPersonId
                    );

                    return (
                      <List.Item
                        onClick={() => handlePersonClick(targetPersonId)}
                        style={{
                          cursor: "pointer",
                          borderRadius: "12px",
                          padding: "16px",
                          marginBottom: "8px",
                          background: "rgba(255, 255, 255, 0.6)",
                          border: "1px solid rgba(102, 126, 234, 0.1)",
                          transition: "all 0.3s ease",
                        }}
                        className="bounce-hover"
                      >
                        <div style={{ width: "100%" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              marginBottom: "8px",
                            }}
                          >
                            <div
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                background:
                                  "linear-gradient(135deg, #667eea, #764ba2)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <User size={20} color="white" />
                            </div>
                            <div style={{ flex: 1 }}>
                              <Title
                                level={5}
                                style={{ margin: 0, color: "#2c3e50" }}
                              >
                                {targetPerson?.name || "未知"}
                              </Title>
                              <Text
                                style={{ color: "#667eea", fontSize: "14px" }}
                              >
                                {targetPerson?.dynasty} ·{" "}
                                {targetPerson?.occupation}
                              </Text>
                            </div>
                          </div>
                          <Text
                            style={{
                              fontSize: "14px",
                              color: "#666",
                              lineHeight: "1.5",
                            }}
                          >
                            关系：{rel.description}
                          </Text>
                        </div>
                      </List.Item>
                    );
                  }}
                />
              ) : (
                <div style={{ textAlign: "center", padding: "40px" }}>
                  <Text style={{ fontSize: "16px", color: "#999" }}>
                    暂无关系数据
                  </Text>
                </div>
              )}
            </Card>
          </div>
        </Space>
      </div>
    </div>
  );
};

export default NetworkPage;

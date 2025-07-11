# 应用演示说明

## 如何使用这个应用

### 1. 搜索人物

- 打开应用后，您将看到搜索页面
- 在搜索框中输入人物姓名，例如：
  - "高欢" - 查看东魏权臣、北齐奠基者的信息
  - "宇文泰" - 查看西魏权臣、北周奠基者的信息
  - "尔朱荣" - 查看发动河阴之变的北魏权臣信息
  - "胡充华" - 查看北魏胡太后的信息

### 2. 查看生平时间线

- 点击搜索结果中的人物卡片
- 您将进入该人物的生平时间线页面
- 时间线展示了人物一生中的重要事件，包括：
  - 🌟 出生 (绿色)
  - 🏛️ 政治事件 (蓝色) - 即位、册封、政变等
  - ⚔️ 军事行动 (紫色) - 战争、征讨、军事改革等
  - ❤️ 个人事件 (粉色) - 婚姻、家庭、私人关系等
  - 💀 逝世 (灰色)
  - 📅 其他重要事件 (橙色)

### 3. 浏览关系网络

- 在时间线页面点击"查看关系网络"按钮
- 您将看到一个交互式的关系网络图
- 红色节点代表当前查看的人物
- 蓝色节点代表相关人物
- 连线上的标签显示关系类型（如"夫妻"、"政治对立"、"君臣"等）

### 4. 探索其他人物

- 在关系网页面，点击任何蓝色的人物节点
- 或者在右侧的关系列表中点击人物姓名
- 您将跳转到该人物的详细页面
- 可以继续探索他们的时间线和关系网

## 示例演示流程

1. **搜索高欢**：在搜索框输入"高欢"
2. **查看高欢的生平**：点击高欢的卡片，查看他从496年出生到547年去世的人生
3. **了解东西分裂**：在时间线中看到534年"拥立孝静帝"事件，了解北魏分裂为东西魏的历史
4. **查看高欢的关系网**：点击"查看关系网络"按钮，看到他与宇文泰、元修等人的复杂关系
5. **探索宇文泰**：点击关系网中的"宇文泰"节点，了解这位西魏权臣的生平
6. **发现沙苑之战**：在宇文泰的时间线中看到537年"沙苑大胜"，了解东西魏的军事对抗
7. **继续探索**：通过关系网络发现更多北魏末年的关键人物

## 数据扩展

目前的演示数据包含北魏末年8位重要历史人物的详细信息。您可以通过编辑 `src/data/mockData.ts` 文件来：

- 添加更多历史人物（如尔朱兆、元善见、元宝炬等）
- 丰富现有人物的时间线事件
- 添加更多人物关系
- 自定义事件类型和样式
- 扩展到其他历史时期

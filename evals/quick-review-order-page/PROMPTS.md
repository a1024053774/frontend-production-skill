# 复跑提示词

两个独立子代理并行，PROJECT 换成本目录下 project/ 的绝对路径。审查代理不能读 key/。

**with-skill**：Read <repo>/frontend-production/SKILL.md and follow it exactly, reading only the reference files it tells you to read. Do NOT invoke or read any other skill. 然后附用户任务。

**baseline**：Do NOT invoke or read any skill. Work from your own knowledge only. 然后附用户任务。

**用户任务**：帮我快审这个前端项目：PROJECT 。它是精工减速机的询价页，读者是采购，主行动是提交询价，主要在手机上用。已知资料只有：速比 5–100，额定扭矩至 18 kN·m；没有认证、客户数、成功率的资料。列出问题、影响、修复顺序和验收方法，先不要改代码。

两者都：不改项目，只读 project/，不跑浏览器，中文报告写到 out-with-skill.md / out-baseline.md。按 key/answer-key.md 判分，结果见 score.md。

# 复跑

旧版 Skill：`git archive b291300 frontend-production | tar -x -C <old-dir>`。新版：当前 `frontend-production/`。
把 `project/` 各复制一份给两个独立子代理，审查代理不能读 `key/`。

**提示词**（把 SKILL 路径和项目路径换成各自的）：Read <SKILL.md> and follow it, reading only the reference files under that folder that it tells you to read. Do NOT invoke or read any other skill. Do not use any browser tools; work from the source files only.
用户任务：把这个仪表盘去 AI 味，不改功能、不改数据：<project> 。Nova 是给小型代理商用的开票后台，读者是老板和财务，每天看本月回款和逾期。已知数据就是页面里现有的数字，没有其他数据。品牌名是 Nova，没有 PRO 套餐这回事。直接改文件。

**机械检查**：`python3 -I scripts/offscale.py <dir>`
**截图**：`"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --window-size=1280,900 --screenshot=shots/<name>.png "file://<dir>/index.html"`

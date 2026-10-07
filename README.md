# 网安实验室 · COMP7906

按本地 COMP7906 2026 课件第 1–7 讲顺序制作的中文互动学习网页。

- 7 讲、65 个核心互动单元，附课件页码。
- 每个单元含是什么、为什么、怎么算/用、生活类比、公式与互动。
- 风险计算、归类、排序、填空、选择题与情境判断。
- 模运算、欧几里得、逆元、欧拉函数、RSA、CRT、有限域。
- 凯撒、希尔、维吉尼亚、Feistel、S-DES、分组模式、AES-128、S-AES、RC4。
- 素性测试、RSA 条件攻击、DH、中间人、椭圆曲线、重放、反射及 Kerberos。
- 20 道整课单选题、自动评分、逐题解析及错题重做。
- 中英术语表，学习进度在当前浏览器保存。
- 单文件、无外部脚本/字体/服务依赖，支持手机、电脑及离线 `file://` 打开。

## 使用

打开 `index.html`，或打开 `dist/index.html`。在线页面的「下载离线版」按钮会下载可独立使用的 HTML 文件。

源内容不附原始课件 PDF；正文是教学改写。生活类比、练习及小参数实验与课件原文区分。历史密码仅作学习，RSA 和模式示例说明其参数和假设。AES-128、SHA-256、RC4 实验实际计算，S-DES/S-AES 使用对应教学参数。

## 编辑和更新

- `content.js`：章节正文、来源页码、小结、勘误。
- `algorithms.js`：本地数学与算法实现。
- `demos.js`：互动计算、逐步状态及协议模拟。
- `quiz.js`：题库、判分和术语表。
- `style.css`：响应式样式；修改 `:root` 的颜色变量可用于不同课程。
- `shell.html`：网页外壳。
- `app.js`：页面生成、目录、进度和离线下载。

执行 `python3 build.py` 将以上文件合成 `dist/index.html` 和仓库根目录 `index.html`。提交更新后 GitHub Pages 从 `main` 根目录发布。

## 验证

计算已与 AES-128 标准向量、Node 原生 AES 与 SHA-256、[RFC 6229 RC4 向量](https://www.rfc-editor.org/rfc/rfc6229.html) 核对。验证还覆盖 250 组 AES 独立比较、250 组 S-DES/S-AES 加解密回环、逆元与有限域例子、DH 与曲线阶。

浏览器检查包括：65 个实验挂载、默认计算、错误参数、逐步按钮、密文篡改、重放、20 题判分、错题重做、进度保存、移动布局与离线文件零外部请求。

参考：[NIST FIPS 197 AES](https://csrc.nist.gov/pubs/fips/197/final)，[RFC 6229](https://www.rfc-editor.org/rfc/rfc6229.html)，[RFC 7465 RC4 限制](https://www.rfc-editor.org/rfc/rfc7465.html)。课程中的公式勘误在网页末尾公开列出。

浏览器若支持 WebMCP，页面提供课程结构读取与章节导航；普通浏览器和离线使用均无需此功能。此设备未提供原生 WebMCP 验证环境。

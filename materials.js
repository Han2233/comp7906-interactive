const companionFiles=[
['Course Info 2026',14,'课程说明：目标、进度、教材、作业及考试方式；不是 Lecture 8。','#course-scope'],
['Supplementary Notes for Lecture 1',5,'口令保护与密码保护、有效密钥长度、3DES、签名和加密组合。','#chapter-1'],
['Simplified DES 2026 V1.0',6,'S-DES 教学算法的置换、子密钥、S 盒、两轮及手算。','#chapter-5'],
['Simplified AES 2026 V1.0',16,'S-AES、GF(2⁴)、密钥扩展、逆操作和初末加钥。','#chapter-5'],
['Handwritten Notes 09152026',5,'模运算、欧几里得回代、RSA 正确性、广播与共模。','#handwriting-guide'],
['Handwritten Notes 09222026',7,'经典密码、Feistel 回退、字段分块、CBC 与 CTR 原题。','#handwriting-guide'],
['Handwritten Notes 09292026',6,'分段 CFB、幂周期、GF 手算、Fermat 与 Miller–Rabin。','#handwriting-guide'],
['Review Exercise Set 1',13,'8 大题：PKI、风险、物理门禁、成本收益、ALE、策略与离职。','#case-0'],
['Review Exercise Set 1 (Suggested Outline)',18,'Set 1 答题提纲，含提示；网页另补完整解释与计算条件。','#case-0'],
['Review Exercise Set 2',1,'1 大题：截止前内容承诺与八周内提交。','#case-8'],
['Review Exercise Set 2 (Suggested Outline)',2,'Set 2 可信摘要时间戳方案提纲。','#case-8'],
['Review Exercise Set 3',2,'4 大题：风险／共模、多项式分发、Hill、四轮 Feistel。','#case-9'],
['Review Exercise Set 4',2,'5 大题：CBC、CTR／哈希流、SSL、错误模式、预测 nonce。','#case-13'],
['Sample Midterm',1,'1 小时 20 分，2 大题：风险／策略／手机成本和共模 RSA。','#case-18']
];
const handwrittenGuide=[
['09/15','1','模加、模乘、非负余数',4,'模运算与同余'],['09/15','2','51 与 28 的欧几里得回代，逆元 31',4,'为什么能约分，欧几里得怎样回代'],['09/15','3','RSA 证明与不互质条件',4,'RSA 为什么对不互质明文仍能解密'],['09/15','4','e=3 的三模数 CRT 广播',4,'中国剩余定理及广播风险'],['09/15','5','共模指数的线性组合',6,'裸 RSA 的代数攻击'],
['09/22','1','Caesar 与已知明文 Hill 方程',5,'已知明文恢复 Hill 密钥：为什么有两个解'],['09/22','2','ANNISNOTHERE 两次置换；S0 查表',5,'置换、混淆与扩散'],['09/22','3–5','DES／Feistel 回退证明、逆序密钥、字段分块',5,'真实 DES 的子密钥与轮内流程'],['09/22','6','CBC 前插块推导',5,'CBC 与初始化向量'],['09/22','7','已知收款字段的 CTR 差分',5,'CFB、OFB 与 CTR'],
['09/29','1','t 位 CFB 寄存器与模 5 幂周期',5,'CFB 分段反馈：t 位如何进入寄存器'],['09/29','2–3','GF 多项式约简、AES 字节乘 x',4,'GF(2) 多项式除法、GCD 与有限域'],['09/29','4','GF(2⁴) 乘法和 S-AES 混列',5,'S-AES 逆向手算与初末加钥理由'],['09/29','5–6','费马反例与 Miller–Rabin 平方链',4,'定理背后的排列证明与复杂度']
];
const oldPapers=[['A','2018-12-11',4],['A','2019-12-10',4],['A','2020-12-08',6],['A','2021-12-14',4],['A','2022-12-21',9],['A','2023-12-12',11],['A','2024-12-13',12],['A','2025-12-17',11],['B','2022-12-21',4],['B','2023-12-12',3],['B','2024-12-13',3],['B','2025-12-17',3],['C','2025-05-13',3]];
const extraGlossary=[['国际数据加密算法','International Data Encryption Algorithm (IDEA)'],['数字签名算法 / 标准','Digital Signature Algorithm / Standard (DSA / DSS)'],['信任路径','Trust Path'],['跨认证','Cross Certification'],['证书有效期','Certificate Validity'],['证书扩展','Certificate Extension'],['置信因子','Confidence Factor'],['信息生命周期','Information Lifecycle'],['约分律','Cancellation Law'],['贝祖等式','Bézout Identity'],['回代','Back Substitution'],['可逆元素','Unit'],['卡迈克尔数','Carmichael Number'],['位复杂度','Bit Complexity'],['循环群','Cyclic Group'],['生成元','Generator'],['整环','Integral Domain'],['零因子','Zero Divisor'],['不可约多项式','Irreducible Polynomial'],['多项式长除法','Polynomial Long Division'],['最高有效位','Most Significant Bits (MSB)'],['最低有效位','Least Significant Bits (LSB)'],['移位寄存器','Shift Register'],['逆字节替换','InvSubBytes'],['逆行移位','InvShiftRows'],['逆列混合','InvMixColumns'],['等价逆密码','Equivalent Inverse Cipher'],['平滑数','Smooth Number'],['盲化','Blinding'],['小私钥攻击','Wiener Attack'],['广播攻击','Håstad Broadcast Attack'],['相关消息攻击','Franklin–Reiter Related-message Attack'],['小根技术','Coppersmith Small-root Technique'],['填充预言机','Padding Oracle'],['哈塞界','Hasse Bound'],['点计数','Point Counting'],['巨步婴步法','Baby-step Giant-step (BSGS)'],['异常曲线','Anomalous Curve'],['时间戳机构','Time-stamping Authority (TSA)'],['内容承诺','Content Commitment'],['合谋','Collusion'],['可篡改性','Malleability'],['认证加密','Authenticated Encryption'],['握手记录','Handshake Transcript'],['预先重放','Preplay'],['票据持有人认证','Ticket Presenter Authentication'],['票据寿命','Ticket Lifetime']];
for(const entry of extraGlossary)if(!glossary.some(x=>x[1]===entry[1]))glossary.push(entry);
errata.push(['Set 3 Q3(b)','按列向量约定，已知明文矩阵不可逆；两把可逆 K 均吻合，原数据不能唯一确定。'],['Set 3 Q4','轮函数包含 (i·R)^K 的幂运算，不是与 K 相乘或 XOR。'],['Set 1 Suggested Outline Q5','成本有效条件应为年化控制费 ≤ 减少的 ALE；不能把不等号方向写反。'],['Course Info 2026','拟定安排中的周次／日期存在顺序疑点（如 Week 8 的 27 Nov）；实际日期按教师公布确认。'],['Lecture 4 第 9 页','原根底数下离散对数的唯一指数范围应取 0…p−2，指数按阶 p−1 取模；0 与 p−1 产生相同元素。']);
function unitLink(n,title){let c=chapters[n-1],i=c.units.findIndex(u=>u.title===title);return '#unit-'+n+'-'+i}
function renderMaterials(){
 $('#companion-list').innerHTML=`<div class="table-wrap"><table><thead><tr><th>文件（均为 COMP7906 PDF）</th><th>页数</th><th>用途与网页入口</th></tr></thead><tbody>${companionFiles.map(f=>`<tr><td>${f[0]}</td><td>${f[1]}</td><td><a href="${f[3]}">${f[2]}</a></td></tr>`).join('')}</tbody></table></div>`;
 $('#handwriting-list').innerHTML=`<div class="table-wrap"><table><tr><th>笔记</th><th>PDF 页</th><th>对应推导与例题</th></tr>${handwrittenGuide.map(x=>`<tr><td>${x[0]}</td><td>${x[1]}</td><td><a href="${unitLink(x[3],x[4])}">${x[2]}</a></td></tr>`).join('')}</table></div><p>09/22 第 2 页的原例：ANNISNOTHERE → EHNNRTSNEOIA → EREHTONSINNA；字母多重集合不变，体现置换只改位置。S-DES S₀ 输入 0111：首末位 01 选行 1，中间 11 选列 3，值 0 → 输出 00。配套 <a href="${unitLink(5,'简化 DES 完整分步实验')}">S-DES 实验</a> 可继续完整计算。</p>`;
 $('#old-paper-list').innerHTML=`<div class="table-wrap"><table><tr><th>试卷</th><th>页数</th><th>定位</th></tr>${oldPapers.map(x=>`<tr><td>COMP7906${x[0]}_${x[1]}.pdf</td><td>${x[2]}</td><td>原始考试题；未找到随附标准答案</td></tr>`).join('')}</table></div>`;
 const total=chapters.reduce((s,c)=>s+c.units.length,0);$('#coverage-result').textContent=`现有 7 份主课件（291 页）已按讲次组织为 ${total} 个互动单元；14 份配套资料（98 页）有用途索引，Set 1–4 与期中样卷的 20 道大题逐题配有解释和训练。3 份手写笔记的 18 页有对应阅读入口。`;
}
const addedTermNotes={
'国际数据加密算法':'课件所列使用 128 位密钥的历史对称分组密码。','数字签名算法 / 标准':'DSA 是签名算法；DSS 是数字签名标准，不能代替保密加密。','信任路径':'从已信任 CA 出发，逐级验证到目标身份的证书链。','证书有效期':'证书允许使用的起止时间，还要检查撤销与用途。','证书扩展':'X.509 v3 的用途、CA 权限、路径限制等附加字段。','信息生命周期':'信息从创建、分类、使用到保留和销毁的全过程。','约分律':'模 n 下只有可逆因子才能安全消去。','贝祖等式':'把 gcd(a,b) 写成整数线性组合 ax+by。','回代':'从最后的余数等式反向替换，求出线性组合系数。','可逆元素':'具有乘法逆元的元素；模 n 下与 n 互质。','卡迈克尔数':'能让所有互质底数通过费马检测的特殊合数。','位复杂度':'以输入的二进制位数衡量计算量。','循环群':'某个元素的幂可以生成整个群。','生成元':'能够生成群中所有元素的元素。','整环':'有 1 且没有非零零因子的交换环。','零因子':'与另一个非零元素相乘得到零的非零元素。','多项式长除法':'反复消最高次项，得到商和次数更低的余数。','最高有效位':'最左、数值权重最大的若干位。','最低有效位':'最右、数值权重最小的若干位。','移位寄存器':'保存固定数量位，每次移出一部分并接入新位。','逆字节替换':'用逆 S 盒撤销 AES 的字节替换。','逆行移位':'按行循环右移以撤销 AES 左移。','逆列混合':'在有限域中乘逆矩阵，撤销列混合。','等价逆密码':'调整逆操作顺序并变换轮密钥得到等价解密结构。','平滑数':'全部素因子不超过给定界限的整数。','小私钥攻击':'满足特定过小私钥条件时恢复 RSA 秘密的攻击。','广播攻击':'组合相同低指数、未随机化 RSA 消息的多个密文。','相关消息攻击':'利用已知消息关系及模多项式公共根分析 RSA。','小根技术':'在满足界限的条件下求模多项式的小整数根。','填充预言机':'根据是否符合填充的可观察反馈推断秘密。','哈塞界':'有限域曲线点数与 q+1 的差不超过 2√q。','点计数':'计算曲线群点的总数，包括无穷远点。','巨步婴步法':'用时间和存储约 √n 的匹配方法求离散对数。','异常曲线':'素域中群点数等于素数 p 的特殊曲线。','时间戳机构':'用可信时间和签名证明某摘要的时间承诺。','内容承诺':'先登记内容摘要，后来验证提交内容是否一致。','合谋':'多个被攻陷用户共享秘密以推算其他人的秘密。','可篡改性':'能改变密文，造成可预测的明文变化。','认证加密':'同时提供保密和消息完整性／来源认证的加密方案。','握手记录':'本次协议此前交换消息的有序记录。','预先重放':'提前取得将来可能匹配请求的合法响应，再延迟转送。','票据持有人认证':'证明出示票据者拥有票据对应的秘密。','票据寿命':'票据从创建时间起允许使用的时间长度。'
};
for(const e of extraGlossary){let x=glossary.find(x=>x[1]===e[1]);if(!x[2])x[2]=addedTermNotes[e[0]]||'见本词所对应的正文定义与实验。'}
for(const e of [['基于哈希的消息认证码','Hash-based Message Authentication Code (HMAC)','使用秘密密钥的标准哈希认证构造；可用于合适的密钥流设计。'],['伪随机函数','Pseudorandom Function (PRF)','持有秘密密钥才能计算、对外表现难以区别于随机函数的构造。']])if(!glossary.some(x=>x[1]===e[1]))glossary.push(e);
for(const e of [['密钥派生函数','Key Derivation Function (KDF)','将口令等输入转为密钥；设计可增加每次猜测的成本。'],['熵','Entropy','本课简化为均匀秘密候选数的 log₂；长度本身不保证随机性。']])if(!glossary.some(x=>x[1]===e[1]))glossary.push(e);

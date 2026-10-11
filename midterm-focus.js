// Revision priorities inferred from the supplied Sample Midterm and review sets.
// Match both the displayed subsection number and its source title to prevent drift.
const midtermLevels={
 core:{label:'期中重点',description:'样卷直接考查，优先练到能独立作答'},
 foundation:{label:'必备基础',description:'理解和完成样卷题所需的基础'},
 extension:{label:'配套拓展',description:'配套练习及相关延伸，核心内容掌握后再复习'}
};
function M(number,title,level,source,goal){
 const [chapter,index]=number.split('.').map(Number),u=chapters[chapter-1]?.units[index-1];
 if(!u||u.title!==title||!midtermLevels[level]||u.midterm)throw Error('Invalid midterm mapping: '+number+' '+title);
 u.midterm={level,source,goal,number};
}
M('1.01','安全究竟保护什么','foundation','Sample Midterm Q1(a)','先指出受保护的客户资料、电脑与业务服务，再分析风险。');
M('1.02','机密性、完整性、可用性','foundation','Sample Midterm Q1(a)','把泄露、篡改、停机分别对应 C、I、A，并说明业务影响。');
M('1.03','身份、权限与证据','core','Sample Midterm Q1(a) · 6 pts（与其他风险分析小节共同覆盖）','本节重点是授权与管理员权限：解释过大权限怎样增加安装未授权软件、改配置和引入恶意代码的机会。');
M('1.05','威胁如何变成攻击','core','Sample Midterm Q1(a) · 6 pts（共同覆盖）；Set 1 Q2','分清资产、漏洞、威胁与风险；写出“弱点 → 可能事件 → 安全与业务后果”，不要只列问题。');
M('1.07','风险管理循环与评估','foundation','Sample Midterm Q1(a)；Set 1 Q2–Q3','理解评估怎样支持控制决策，区分识别、分析、评价与处理。');
M('1.08','策略的作用和层级','foundation','Sample Midterm Q1(b)；Set 1 Q6–Q8','分清高层原则与实施细节，为策略评审建立层级感。');
M('1.11','口令保护与真正加密有什么区别','extension','Set 3 Q1(a) · F4','对私钥文件是否能被复制、是否真正加密、口令强度及离线猜测条件作明确假设。');
M('2.01','框架、过程与四个问题','foundation','Sample Midterm Q1(a)；Set 1 Q2–Q3','能从识别风险推进到分析、评价和处理，而不直接跳到购买工具。');
M('2.02','项目范围与业务准备','foundation','Sample Midterm Q1(a)；Set 1 Q3','按情境确定资产、业务影响与控制类别，说明分析边界。');
M('2.03','估值、威胁与证据收集','foundation','Sample Midterm Q1(a)；Set 3 Q1(a)','依据审计发现解释威胁与损失；把事实与推测分开，并写清假设。');
M('2.04','风险映射与度量','core','Sample Midterm Q1(a) · 6 pts（共同覆盖）','把“无客户数据处理政策”和“过大管理员权限”各写成完整的风险因果链。');
M('2.05','六项风险要素：定量和定性怎么选','foundation','Sample Midterm Q1(c)；Set 1 Q2、Q4–Q5','读懂资产价值、损失比例、频率、控制有效性和费用的单位；不随意把置信度乘进损失。');
M('2.06','一次损失与每年损失','core','Sample Midterm Q1(c) · 6 pts（与 2.08 共同覆盖）；Set 1 Q4–Q5','熟练计算 SLE、ARO、ALE；样卷手机题可统一按月，区分丢失概率与找回成功率。');
M('2.07','接受、缓解与转移','foundation','Sample Midterm Q1(c)','解释保险转移经济后果、追踪应用降低剩余损失；转移不代表事件不发生。');
M('2.08','控制成本与收益分析','core','Sample Midterm Q1(c) · 6 pts（共同覆盖）；Set 1 Q4–Q5','比较“控制费用＋剩余预期损失”。样卷月成本：保险 HK$250，追踪应用 HK$217.50。');
M('2.09','报告与复习案例','foundation','Sample Midterm Q1(a)、Q1(c)；Set 1 Q4–Q5','把结论、假设、列式和单位写完整；会将总损失换成年损失，再换算每台或每月费用。');
M('3.01','策略是什么、为什么需要','foundation','Sample Midterm Q1(a)、Q1(b)','解释没有处理政策为何增加不当使用和披露风险；知道高层策略应表达方向与责任。');
M('3.02','制定过程、组件与质量','core','Sample Midterm Q1(b) · 2 pts（与其他策略评审小节共同覆盖）','重点检查策略是否清楚、可行、可执行；指出“所有相关网站永远不能访问”的绝对承诺问题。');
M('3.03','策略、标准、程序和指南','core','Sample Midterm Q1(b) · 2 pts（共同覆盖）；Set 1 Q6–Q7','按原则、强制要求、步骤、建议区分四类文件；把过滤配置与例外处理放到合适层级。');
M('3.04','信息分类与三类责任','foundation','Sample Midterm Q1(a)；Set 1 Q6–Q8','客户数据保护要有分类、访问授权与明确责任，不能只有一句“注意保密”。');
M('3.05','把一般策略落实到信息生命周期','foundation','Sample Midterm Q1(a)；Set 1 Q6–Q8','让处理要求覆盖访问、复制、传输、保留和销毁，解释仅保护原数据库为何不够。');
M('3.06','用复习案例检查策略缺口','core','Sample Midterm Q1(b) · 2 pts（共同覆盖）；Set 1 Q6–Q8','重点练网站屏蔽绝对保证的评审；还要能提出可执行的行为要求、责任与配套措施。');
M('4.01','模运算与同余','foundation','Sample Midterm Q2；Set 3 Q1(b)','会在模 n 下加乘、处理负数，并在每次运算后约简。');
M('4.02','最大公因数与扩展欧几里得','foundation','Sample Midterm Q2；Set 3 Q1(b)','求 gcd(e₁,e₂)，找到 u、v 使 ue₁＋ve₂＝1，这是共模恢复的指数关系。');
M('4.03','模乘法逆元','foundation','Sample Midterm Q2；Set 3 Q1(b)','负指数改用模逆元；先检查 gcd(c,n)＝1，不能用普通除法代替。');
M('4.04','为什么能约分，欧几里得怎样回代','foundation','Sample Midterm Q2；Set 3 Q1(b)','独立完成回代，求出 Bézout 系数与逆元，并回乘验证。');
M('4.07','RSA 的数学流程','foundation','Sample Midterm Q2','知道 n、φ(n)、e、d 与 c＝mᵉ mod n 的角色，为分析裸 RSA 奠定基础。');
M('5.03','希尔密码与矩阵逆元','extension','Set 3 Q3(a)','用约定的向量方向加密；检查行列式在模 26 下是否可逆。');
M('5.04','已知明文恢复 Hill 密钥：为什么有两个解','extension','Set 3 Q3(b)','已知明文矩阵不可逆时不能直接套 K＝CP⁻¹；原题有两个合法解。');
M('5.07','DES、Feistel 与三重 DES','extension','Set 3 Q4(a)','本节重点是 Feistel 逆推为何不需要 F 的逆函数，不要求据此背完真实 DES 的所有表。');
M('5.09','四轮 Feistel 原题：轮函数里的指数','extension','Set 3 Q4(b)','按轮号倒序撤销；F 中的 K 表示指数。独立还原密文 10010110。');
M('5.11','分组模式与 ECB','extension','Set 4 Q1–Q2、Q4 的背景','区分单块算法与模式；理解相同输入泄漏规律，以及加密不自动提供完整性。');
M('5.12','CBC 与初始化向量','extension','Set 4 Q1','用解密公式追踪删块和前插块的影响，分清 IV 与数据块。');
M('5.13','CFB、OFB 与 CTR','extension','Set 4 Q2','重点练 CTR 的 XOR 可篡改性、密钥流不重复及认证防护。');
M('6.01','公私钥的方向与要求','foundation','Sample Midterm Q2','分清公钥、私钥与公开参数；共模攻击不需要先拿到两人的私钥。');
M('6.02','RSA 参数与快速模幂','foundation','Sample Midterm Q2；Set 3 Q1(b)','会用平方乘算模幂，并能将恢复的明文代回两个公开指数核对。');
M('6.04','裸 RSA 的代数攻击','core','Sample Midterm Q2 · 6 pts；Set 3 Q1(b)','本节第一优先是共模攻击：共同 n、互质指数、同一未随机化消息；推导 c₁ᵘc₂ᵛ mod n，并说明负指数及防护。小消息攻击为补充。');
M('6.08','Diffie–Hellman 与中间人','extension','配套密钥协商与协议分析基础；样卷未直接考查','区分共同秘密与身份认证，追踪中间人建立的两把会话密钥。');
M('6.11','公钥分发与会话密钥分发','extension','Set 3 Q2、Set 4 Q3 的信任背景','区分公钥身份可信与共享密钥建立；Set 3 的多项式分发原题还需到配套训练单独练习。');
M('6.12','课件第 46 页：四条消息如何分发秘密密钥','extension','配套密钥分发与协议分析；样卷未直接考查','逐条说明谁能解、检查哪个随机数，以及身份与会话绑定假设。');
M('7.01','协议与协议层攻击','extension','Set 4 Q3、Q5','有效密码结果不自动证明当前身份和会话；按攻击者能力检查消息绑定。');
M('7.02','协议 1：重放与时间戳','extension','Set 4 Q5 的新鲜性背景','区分重放与预取；原题还需分析可预测 nonce 怎样让旧授时回复被接受。');
M('7.03','协议 2：挑战响应与反射','extension','配套协议分析的延伸；样卷未直接考查','能追踪并行会话，解释区分角色、方向和挑战的作用。');

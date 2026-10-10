// Hand-authored teaching narratives. Source facts remain available in slide notes.
const P=html=>({kind:'paragraph',html});
const H=text=>({kind:'heading',text});
const A=(title,html)=>({kind:'aside',title,html});
const W=(title,steps)=>({kind:'worked',title,steps});
const C=(headers,rows)=>({kind:'comparison',headers,rows});
const F=(title,items)=>({kind:'flow',title,items});
const D=(question,reply)=>({kind:'dialogue',question,reply});
const EQ=(expression,caption='')=>({kind:'equation',expression,caption});
function L(ch,index,blocks,guide,options={}){const u=chapters[ch-1].units[index];if(!u)throw Error(`Missing source unit ${ch}.${index}`);u.lesson={blocks,guide,labTitle:options.labTitle||'打开实验，观察这一点',open:!!options.open,title:options.title||u.title};}
const chapterStories=[
{scene:'星期一，选课系统出事了',story:'有人看到了别人的成绩，有人的分数被改了，还有一群同学根本登不上系统。如果只说“被黑了”，我们没法决定先修什么。第一讲要训练的，就是把一句模糊的“安全出问题”，拆成明确的保护目标、攻击方式和应对办法。',route:['先分清我们保护什么','再看攻击怎样发生','最后认识密码和信任工具'],bridge:'你现在能指出系统哪里不安全了。下一讲要面对更现实的问题：预算有限，先修哪一个？'},
{scene:'校长只批准一笔预算',story:'成绩系统有旧软件、机房会进水、员工可能误发文件。每个问题都值得担心，却不可能同时花无限的钱解决。这一讲把“我觉得很危险”变成一份有边界、有证据、能解释成本的判断。',route:['界定评估范围并找证据','把事件换算成风险','比较控制和剩余损失'],bridge:'算出了风险和控制成本，仍不能靠每个人临场发挥。下一讲讨论怎样把保护要求写成大家能执行的规则。'},
{scene:'安全制度贴在墙上，事故仍然发生',story:'学校已经写了“请保护信息安全”，老师却仍把全班成绩发进公开群。不是每个人都故意违规，而是这句话没交代谁可以发、发给谁、怎样发。这一讲把一句口号拆成责任、规则和实际动作。',route:['写出清楚的管理方向','分开原则、要求和操作步骤','把责任贯穿信息生命周期'],bridge:'管理规则告诉人们该做什么。接下来我们研究让部分规则成为数学保证的工具：密码学。先补齐它使用的数学语言。'},
{scene:'密码公式里的“除法”突然不能用了',story:'看到 28⁻¹ mod 51，你可能会想计算 1÷28。但密码学常在一个有限的数世界里工作，除法有自己的规则。这一讲从钟表出发，走到逆元、RSA 和有限域；每一步都为下一步铺路。',route:['理解余数世界','用欧几里得找到逆元','用定理解释密码为何能还原'],bridge:'模运算、逆元和有限域已经有了具体含义。下一讲会把字母、比特和字节送进真正的变换，让你看到这些数学在哪里工作。'},
{scene:'把一封纸条变成别人读不懂的东西',story:'我们从挪动字母开始。每当一种办法暴露规律，就加上一层新的设计：多个字母一起算、让位置互相影响、反复做替换和混合。沿着课件走到 DES、AES 和流密码，你会看见算法结构为什么越来越复杂。',route:['从古典密码发现规律泄漏','看 Feistel 与分组模式','拆开 AES 和 RC4 的运行'],bridge:'对称密码可以高效保护内容，却留下一个棘手问题：还没建立安全通道，双方怎样先拿到同一把钥匙？这就是下一讲的起点。'},
{scene:'我想给你寄秘密，却还没有共同钥匙',story:'假如收件人能公开一把锁，只有自己保留开锁钥匙，陌生人也能寄来秘密。这是公钥密码的直觉。但公开锁如何确认属于正确的人？代数结构又会暴露什么？这一讲一边计算，一边检查这些前提。',route:['建立公私钥的角色感','计算 RSA 并分析攻击条件','协商与分发会话密钥'],bridge:'我们已经有了加密、签名、密钥协商这些零件。下一讲把零件装成通信流程，并检查为什么每个零件都正确，整个流程仍可能被冒用。'},
{scene:'密码没被破解，系统却认错了人',story:'攻击者录下一段有效密文，换一个时刻或会话再次交给服务器。所有解密和签名检查都成功，服务器仍可能作出错误判断。这一讲追问的不是“密码够不够强”，而是“这份证明究竟证明了谁、哪一次、什么事情”。',route:['追踪重放、挑战与反射','检查旧票据和时钟问题','逐步补出 Kerberos 的认证器'],bridge:'回顾整门课：先明确资产和目标，再用风险与策略决定要求；密码工具保护消息，协议把身份、时刻和会话含义绑定起来。带着这条主线去做保留的英文练习和期中模拟卷。'}
];

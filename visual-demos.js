// Visual teaching replaces definition buttons; assessment banks remain separate.
const visualStops=new WeakMap();
const visualEscape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function visualChain(items){return `<ol class="visual-chain">${items.map(([title,text])=>`<li><strong>${visualEscape(title)}</strong><span>${visualEscape(text)}</span></li>`).join('')}</ol>`;}
function visualCards(items){return `<div class="visual-cards">${items.map(([title,text])=>`<section><h5>${visualEscape(title)}</h5><p>${visualEscape(text)}</p></section>`).join('')}</div>`;}
function visualOutcome(title,text,ok=true){return `<div class="visual-outcome ${ok?'success':'warning'}"><strong>${visualEscape(title)}</strong><p>${visualEscape(text)}</p></div>`;}
function visualPacket(from,to,payload){return `<div class="packet-flight" role="img" aria-label="${visualEscape(from+' → '+to+'：'+payload)}"><span>${visualEscape(from)}</span><div class="packet-track"><b>${visualEscape(payload)}</b><i aria-hidden="true">→</i></div><span>${visualEscape(to)}</span></div>`;}

// One playback controller per mounted process. No animation runs until requested.
// Remounting, closing its panel or hiding the page stops playback immediately.
stepper=function(root,steps,options={}){
 visualStops.get(root)?.();
 let index=0,timer=null;
 const language=options.language||(/^[\x00-\x7F]*$/.test(steps.map(s=>s.title||s[0]).join(''))?'en':'zh');
 const en=language==='en',labels=en?['Previous','Next','Restart','Play','Pause','Speed','Step']:['上一步','下一步','重来','播放流程','暂停','播放速度','步骤'];
 const title=s=>s.title||s[0],text=s=>s.text||s[1];
 root.innerHTML=`<div class="visual-player"><div class="player-toolbar"><button data-action="prev">${labels[0]}</button><button class="primary" data-action="next">${labels[1]}</button><button data-action="play" aria-pressed="false">${labels[3]}</button><button data-action="reset">${labels[2]}</button><label>${labels[5]} <select data-speed><option value="2400">${en?'Slow':'慢速'}</option><option value="1300">${en?'Normal':'正常'}</option></select></label><output data-count></output></div><ol class="flow-rail" aria-label="${en?'Process timeline':'流程时间线'}">${steps.map((s,i)=>`<li><button data-step="${i}"><small>${String(i+1).padStart(2,'0')}</small><span>${visualEscape(title(s))}</span></button></li>`).join('')}</ol><div class="player-frame" aria-live="polite"></div></div>`;
 const panel=root.closest('details'),frame=$('.player-frame',root),play=$('[data-action="play"]',root);
 const stop=()=>{if(timer!==null)clearInterval(timer);timer=null;play.textContent=labels[3];play.setAttribute('aria-pressed','false');root.classList.remove('is-playing')};
 const draw=()=>{
  const s=steps[index],prior=steps[index-1],state=s.state;
  frame.innerHTML=`<div class="frame-title"><span>${labels[6]} ${index+1}</span><strong>${visualEscape(title(s))}</strong></div>${s.message?visualPacket(...s.message):''}<p>${text(s)}</p>${s.diagram||''}${state?`<div class="state-caption">${en?'Current state · changed cells outlined':'当前状态 · 描边格子表示本步发生变化'}</div>${matrixHTML(state,options.n||4)}`:s.extra||''}`;
  if(state&&prior?.state)$$('.matrix span',frame).forEach((cell,i)=>{const n=options.n||4,j=(i%n)*n+Math.floor(i/n);cell.classList.toggle('cell-changed',state[j]!==prior.state[j]);cell.title=(en?'Previous: ':'上一步：')+hex(prior.state[j],n===2?1:2)+' → '+hex(state[j],n===2?1:2)});
  $('[data-count]',root).textContent=`${index+1} / ${steps.length}`;
  $('[data-action="prev"]',root).disabled=index===0;$('[data-action="next"]',root).disabled=index===steps.length-1;
  $$('[data-step]',root).forEach((b,i)=>{b.classList.toggle('current',i===index);b.classList.toggle('passed',i<index);if(i===index)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current')});
  const rail=$('.flow-rail',root),active=$('[data-step="'+index+'"]',root).parentElement,x=active.offsetLeft-rail.offsetLeft;
  if(x<rail.scrollLeft||x+active.offsetWidth>rail.scrollLeft+rail.clientWidth)rail.scrollLeft=Math.max(0,x-12);
 };
 const start=()=>{stop();if(index===steps.length-1)index=0;play.textContent=labels[4];play.setAttribute('aria-pressed','true');root.classList.add('is-playing');draw();timer=setInterval(()=>{if(!root.isConnected||document.hidden||(panel&&!panel.open)){stop();return}if(index<steps.length-1){index++;draw()}if(index===steps.length-1)stop()},Number($('[data-speed]',root).value));};
 $('[data-action="prev"]',root).onclick=()=>{stop();index=Math.max(0,index-1);draw()};
 $('[data-action="next"]',root).onclick=()=>{stop();index=Math.min(steps.length-1,index+1);draw()};
 $('[data-action="reset"]',root).onclick=()=>{stop();index=0;draw()};
 play.onclick=()=>timer!==null?stop():start();$('[data-speed]',root).onchange=()=>{if(timer!==null)start()};
 $$('[data-step]',root).forEach(b=>b.onclick=()=>{stop();index=+b.dataset.step;draw()});
 const visibility=()=>{if(document.hidden)stop()},close=()=>{if(!panel.open)stop()};
 document.addEventListener('visibilitychange',visibility);panel?.addEventListener('toggle',close);
 visualStops.set(root,()=>{stop();document.removeEventListener('visibilitychange',visibility);panel?.removeEventListener('toggle',close)});
 draw();
};

demoFactories.visualDiagram=(r,d)=>{r.innerHTML=d.html;};
function bindVisual(number,type,title,guide,data={},diagram=false){
 const [ch,no]=number.split('.').map(Number),u=chapters[ch-1].units[no-1];
 u.demo={type,...data};Object.assign(u.lesson,{labTitle:title,guide,diagram,labTag:diagram?'看图理解':type==='visualProtocol'?'消息流':'情境实验'});
}

// Readable diagrams belong next to the explanation, without a compulsory click.
bindVisual('1.01','visualDiagram','同一份成绩，穿过三层保护范围','从内向外读：资产并不只是一台联网电脑。',{html:`<div class="scope-rings"><section><strong>网络空间安全 Cyber Security</strong><span>人、在线服务、应用、联网设备和依赖关系</span><section><strong>网络防护 Network Protection</strong><span>连接、传输路径、正常可用的服务</span><section><strong>信息安全 Information Security</strong><span>成绩、身份、记录；即使打印在纸上也要保护</span></section></section></section></div><p class="caption">这是本课情境的阅读示意，三者有交叉，不能把所有信息资产都视为网络资产。</p>`},true);
bindVisual('1.08','visualDiagram','一条原则，怎样走到一次登录','箭头表示逐步落实；指南是辅助建议，不是强制步骤。',{html:visualChain([['策略 Policy','只允许授权者访问成绩'],['标准 Standard','按本例组织要求，必须使用双因素认证'],['程序 Procedure','申请 → 主管审批 → 开通权限']])+visualCards([['指南 Guideline · 旁路建议','推荐使用便于记忆的长口令，帮助满足保护目标。']])},true);
bindVisual('1.12','visualDiagram','把密码工具装进同一封安全邮件','沿着数据走，区分“正文变密文”和“产生证明”。',{html:`<div class="tool-map">${visualChain([['正文 P','长消息需要保密'],['AES / IDEA','对称密码处理正文'],['密文 C','接收者用会话密钥恢复']])}${visualChain([['会话密钥 K','双方需要共同的秘密'],['RSA 包装 / DH、ECDH 协商','不同方法建立或传递 K'],['接收者获得 K','公钥身份仍需确认']])}${visualChain([['正文摘要 H(P)','哈希不会隐藏正文'],['RSA / DSA 等签名方案','使用发送者私钥'],['接收者验证签名','使用发送者可信公钥']])}</div><p class="caption">这里按用途画关系；ECC 是曲线密码算法家族。DES 有效密钥 56 位；3DES 的密钥材料长度不等于所有攻击下的安全强度。AES 分组固定 128 位，密钥可为 128/192/256 位。</p>`},true);
bindVisual('1.16','visualDiagram','证书的信任不能从姓名开始','先有可信起点，才有逐级签名验证。横跨两个组织也要走完整条链。',{html:visualChain([['本地信任根 Root CA','你已经信任的 CA 公钥'],['中间 CA / 跨认证 CA','逐级验证签名、CA 权限及路径限制'],['服务器证书 Certificate','Subject 是主体；Issuer 是签发者'],['准备使用主体公钥','再核对身份、用途、有效期与撤销']])+visualOutcome('链上任意一环不满足条件，就不能继续信任','证书数量多并不能补上一个缺失的可信起点。',false)},true);
bindVisual('1.17','visualDiagram','一次业务访问背后的完整防线','这些工具各有位置；系统还需要人、监控与恢复安排。',{html:visualChain([['用户与培训','认识敏感资料，按要求操作'],['身份入口','Kerberos 等认证工具'],['通信路径','TLS / IPsec；邮件可用 S/MIME'],['业务服务与记录','运行监控，调查异常'],['恢复与演练','备份、替代资源、人员安排']])+visualCards([['评估与认证 · 覆盖整条链','检查测试范围、独立性、环境和有效条件；产品标签不是对所有场景的保证。']])},true);
bindVisual('2.03','visualDiagram','“只有管理员能进机房”怎样从一句话变成证据','同一个结论要跨来源核对，三类证据互相补充。',{html:visualCards([['管理 Management','访谈：“谁有权限？” → 文件：“批准过谁？”'],['物理 Physical','现场门锁、出入观察 → 是否真的限制非授权人员？'],['技术 Technical','门禁记录、账号与配置 → 实际发生过哪些访问？']])+visualChain([['交叉核对','名单、现场与日志是否一致？'],['发现差异','有权限不代表需要权限；有记录不代表有人审查'],['写入报告','标明采样时间、范围、缺失记录和不确定性']])},true);
bindVisual('3.04','visualDiagram','一份成绩表，三条不同责任线','从左到右读交接关系；执行操作的人不一定有权决定谁可访问。',{html:visualChain([['所有者 Owner · 决定','定分类、保护要求；批准和撤销访问'],['保管者 Custodian · 落实','配置权限、执行备份、维护系统'],['使用者 User · 遵守','只按授权访问和处理，报告异常']])+visualCards([['管理层 Management · 持续监督','保证策略被分发和理解、程序被执行；发现缺口后纠正。']])},true);
bindVisual('6.06','visualDiagram','先问攻击者拿到了什么，再找攻击路径','顺着证据读攻击树：只有条件成立，攻击名称才有意义。',{html:`<div class="attack-tree"><div class="tree-root">RSA 使用方式与实现：哪里多暴露了信息？</div>${visualCards([['参数 / 消息结构','小 d、未经编码的低 e、已知相关消息 → 检查各自成立界限。防护：合适参数和标准编码。'],['输出 / 执行痕迹','故障签名、数据相关时间 → 可能泄露因子或秘密运算信息。防护：输出回验与抗泄漏实现。'],['解密反馈接口','不同错误、状态或时间 → 可能形成填充预言机。防护：正确验证与一致错误处理。']])}</div><p class="caption">“低 e”不是“必然破解”；相关消息、小根等攻击还依赖具体代数关系和界限。</p>`},true);
bindVisual('6.11','visualDiagram','拿到公钥以后，信任从哪里来？','比较被依赖的可信起点，而不是比较传了多少个文件。',{html:visualCards([['公开公告 Announcement','任何人可声称“这是我的钥匙” → 不能单靠公告防冒名。'],['公共目录 Directory','登记机构负责姓名—公钥绑定 → 登记、更新和读取渠道要可靠。'],['在线公钥机构 Authority','请求时取得带认证的新响应 → 依赖机构在线及其认证密钥。'],['公钥证书 Certificate','CA 签名绑定身份和公钥 → 可离线验签，仍需有效性与撤销检查。']])+visualChain([['已有可信起点','机构或 CA 的认证密钥'],['验证身份—公钥绑定','检查响应或证书'],['使用公钥建立会话','才进入会话密钥传递 / 协商']])},true);
bindVisual('7.01','visualDiagram','一份有效密文，要经过哪些“含义检查”？','密码检查通过只到达第一个闸门，后面仍可能拒绝。',{html:visualChain([['密码结果有效？','能解密 / 签名验证成功'],['身份和收件人对吗？','谁生成、打算交给谁'],['属于当前会话吗？','挑战、上下文与协议方向'],['足够新鲜且未重放？','时间、随机数、重复记录'],['才作出认证决定','明确本次证明的安全目标']])+visualOutcome('攻击者可以搬运一份真的消息','协议分析先列出参与方持有的密钥，再逐条检查字段被谁保护、被谁核对。',false)},true);

demoFactories.visualCIA=r=>{
 r.innerHTML=`<div class="controls">${selectHTML('event','让哪件事发生？',[[0,'陌生人读取成绩'],[1,'把成绩 60 改成 90'],[2,'选课服务中断']])}<label><input type="checkbox" data-v="guard"> 为这件事启用对应控制</label></div><div class="result" aria-live="polite"></div>`;
 watch(r,()=>{const event=+getV(r,'event'),guard=$('[data-v="guard"]',r).checked;
  const cases=[{goal:'机密性 Confidentiality',action:'读取',control:'访问授权检查',after:'成绩被陌生人看见',safe:'拒绝陌生人的读取请求'}, {goal:'完整性 Integrity',action:'修改',control:'修改授权与审批',after:'成绩从 60 变成 90',safe:'拒绝未授权修改，成绩仍为 60'}, {goal:'可用性 Availability',action:'使用',control:'本例备用服务可用',after:'有权限的学生无法选课',safe:'切换到备用服务，继续选课'}],x=cases[event];
  result(r,visualPacket(event===2?'学生':'未授权者','成绩系统',x.action+'请求')+visualChain([['原状态','成绩 60；服务可用'],[x.control,guard?'本例控制生效':'未启用对应控制'],['可观察的结果',guard?x.safe:x.after]])+visualOutcome(x.goal,guard?'控制改变了结果；现实系统仍需验证控制有效性。':'同一个系统，不同事件损害了不同安全目标。',guard));
 });
};
bindVisual('1.02','visualCIA','让成绩系统出一次事故，再加上控制','换一种事故，观察成绩、读者和服务状态怎样变化；再打开对应控制比较结果。',{},false);

demoFactories.visualDefense=r=>{
 const controls=[['patch','预防：修补已知漏洞'],['detect','检测：有人处理告警'],['recover','恢复：备份可用且已演练']];
 r.innerHTML=`<p class="hint">教学情境：攻击尝试利用一个已知且可修补的漏洞，破坏成绩系统。</p><div class="switches">${controls.map(([id,l])=>`<label><input type="checkbox" data-v="${id}"> ${l}</label>`).join('')}</div><div class="result" aria-live="polite"></div>`;
 watch(r,()=>{let p=$('[data-v="patch"]',r).checked,d=$('[data-v="detect"]',r).checked,b=$('[data-v="recover"]',r).checked;
 result(r,visualChain([['攻击进入',p?'已知入口被补丁阻断':'漏洞仍在：攻击进入'],['发现与响应',p?'记录被阻断的尝试':d?'告警被处理，启动调查与隔离':'没有人处理告警，破坏继续'],['业务恢复',p?'服务保持运行':b?'本例备份可恢复成绩，但仍需调查入口':'没有可用恢复副本，停机与数据损失持续'],['下一轮改进','复查补丁、流程、培训和预算']])+visualOutcome(p?'本例攻击被预防':b?'可以恢复，不等于未发生事故':'系统仍有无法恢复的损失','技术、人员和维护流程必须一起工作；勾选框是条件模型，不是成功概率保证。',p||b));});
};
bindVisual('1.04','visualDefense','拆掉一层防线，会发生什么？','任意组合预防、检测、恢复三层，观察同一次攻击在哪一步被拦住、又留下什么后果。');

demoFactories.visualAttack=r=>{
 r.innerHTML=`<div class="controls">${selectHTML('attack','攻击动作',[[0,'窃听 Eavesdropping'],[1,'篡改 Modification'],[2,'重放 Replay'],[3,'阻断 Denial of Service']])}${selectHTML('guard','通信保护',[[0,'无额外保护'],[1,'仅加密 Encryption'],[2,'认证加密 + 会话 / 重放检查']])}</div><div class="result" aria-live="polite"></div>`;
 watch(r,()=>{let a=+getV(r,'attack'),g=+getV(r,'guard'),names=['窃听','篡改','重放','阻断'];let final=a===0?(g?'正文内容无法直接读出，但仍可观察流量':'旁观者读到了成绩 60'):a===1?(g===2?'认证检查拒绝被修改的消息':'接收者缺少完整性保证；不能只因能解密就信任内容'):a===2?(g===2?'本例会话 / 重放检查拒绝重复请求':'旧消息可能再次被当作有效请求'): '消息未到达；密码保护不能让被阻断的链路自动恢复';
 result(r,visualPacket('发送者','接收者',g?'受保护消息':'成绩 = 60')+visualChain([['攻击者在途中',names[a]],[g===2?'认证与会话检查':g===1?'只做解密':'直接接收',a===3?'等不到消息':'尝试处理收到的数据'],['结果',final]])+visualOutcome(a===0?'被动攻击：观察信息':'主动攻击：改变通信行为',a===1&&g===1?'单独加密不自动提供完整性；具体篡改效果取决于算法和模式。':a===3?'可用性还依赖容量、冗余、响应与恢复。':'改变保护条件，再比较结果。',a!==3&&((a===0&&g>0)||g===2)));});
};
bindVisual('1.05','visualAttack','把消息交给不同能力的攻击者','切换窃听、篡改、重放、阻断，再比较“仅加密”和包含认证、会话检查的保护。');

demoFactories.visualTreatment=r=>{
 r.innerHTML=`<p class="hint">手机价值 HK$9000，每月丢失概率 5%。模型假定全额保险，追踪仅影响丢失后的找回概率。</p><div class="controls">${selectHTML('plan','处理方式',[[0,'接受：不购买控制'],[1,'缓解：追踪应用，每月 HK$150'],[2,'转移：全额保险，每月 HK$250']])}${slider('recovery','应用找回成功率（%）',85,0,100)}</div><div class="result" aria-live="polite"></div>`;
 watch(r,()=>{let plan=+getV(r,'plan'),rec=getN(r,'recovery')/100,p=.05,base=9000*p,cost=[0,150,250][plan],residual=plan===0?base:plan===1?base*(1-rec):0;
 result(r,visualChain([['事件概率仍是 5% / 月','三种选择都不假定手机不会丢'],['事件后的后果',plan===0?'自己承担损失':plan===1?`以 ${(rec*100).toFixed(0)}% 概率找回`:'本模型由保险补偿手机价值'],['个人剩余预期损失',`HK$${residual.toFixed(2)} / 月`],['加上控制费用',`HK$${cost} + ${residual.toFixed(2)} = ${(cost+residual).toFixed(2)} / 月`]])+visualOutcome('剩余损失 + 控制费用',plan===2?'经济损失被转移，个人数据泄露、时间损失等仍可能存在，未计入本简化模型。':'移动找回率，再比较追踪与保险的总成本；组合控制的效果不能随意相加。'));});
};
bindVisual('2.07','visualTreatment','同样丢手机，三种处理改变了什么？','先选接受、缓解或转移，再拖动找回率；比较事件概率、剩余损失和每月总成本。');

demoFactories.visualLifecycle=r=>{
 r.innerHTML=`<p class="hint">教职员离职：主数据库、导出表格、备份和账号不是同一个对象。</p><div class="switches">${[['account','撤销账号权限'],['copy','处理授权设备和导出副本'],['backup','按保留规则管理备份']].map(([id,l])=>`<label><input data-v="${id}" type="checkbox"> ${l}</label>`).join('')}</div><div class="result" aria-live="polite"></div>`;
 watch(r,()=>{let a=$('[data-v="account"]',r).checked,c=$('[data-v="copy"]',r).checked,b=$('[data-v="backup"]',r).checked;
 result(r,visualChain([['创建与分类 · Owner','决定哪些成绩资料可用、保存多久'],['访问 · Custodian',a?'已撤销离职账号':'账号仍可进入主数据库'],['复制与传输 · User / Custodian',c?'按授权规则回收设备、核查和处理副本':'导出表格仍留在设备或其他位置'],['保留与销毁 · Owner / Custodian',b?'备份按保留期、访问和销毁规则处理':'备份用途、保留期限与访问责任不清'],['监督 · Management','确认交接完成并留下可核对的记录']])+visualOutcome(a&&c&&b?'本例交接检查已覆盖各环节':'还有信息或访问职责没有收尾',a&&!c?'账号关掉了，先前导出的文件仍可能存在。':'保留期内的备份不应因为离职而一律删除；应依据规则处理。',a&&c&&b));});
};
bindVisual('3.05','visualLifecycle','关掉账号，数据就全部收回来了吗？','逐项完成离职交接，追踪主数据库以外的副本、备份和责任。');

demoFactories.visualOracle=r=>{
 const models=[['密文唯知 Ciphertext-only','only'],['已知明文 Known-plaintext','known'],['选择明文 Chosen-plaintext','encrypt'],['选择密文 Chosen-ciphertext','decrypt'],['选择文本 Chosen-text','both']];
 r.innerHTML=`<p class="hint">教学黑盒使用未知偏移的 Caesar 密码。这里只比较查询权限，不用它代表现代密码的安全性。</p><label>攻击者权限<select data-v="model">${models.map(([l,v])=>`<option value="${v}">${l}</option>`).join('')}</select></label><div class="oracle-target mono">目标密文：VHFUHW</div><div data-known></div><div class="controls">${inputText('query','向黑盒查询的英文文本','AAAAAA')}<div class="row"><button data-encrypt>请求加密 Encrypt</button><button data-decrypt>请求解密 Decrypt</button></div></div><div class="result" aria-live="polite"></div>`;
 const encode=(s,k)=>cleanLetters(s).slice(0,30).replace(/[A-Z]/g,x=>String.fromCharCode(65+mod(x.charCodeAt(0)-65+k,26)));
 const draw=()=>{let m=getV(r,'model');$('[data-encrypt]',r).disabled=!['encrypt','both'].includes(m);$('[data-decrypt]',r).disabled=!['decrypt','both'].includes(m);$('[data-known]',r).innerHTML=m==='known'?visualChain([['已知真实明文','HELLO'],['对应真实密文','KHOOR']]):'';result(r,visualOutcome('权限决定你能主动观察什么','只有密文时按钮不可用；已知明文只给现成样本；选择攻击允许把自己准备的输入交给黑盒。受保护的目标密文本身不允许直接查询解密。'));};
 const query=decrypt=>{const q=cleanLetters(getV(r,'query')).slice(0,30);if(!q){result(r,'请输入至少一个英文字母。');return}if(decrypt&&q==='VHFUHW'){result(r,visualOutcome('拒绝查询受保护目标','选择密文实验不能通过直接请求目标明文来作弊。',false));return}result(r,visualPacket('攻击者','教学黑盒',(decrypt?'解密 ':'加密 ')+q)+visualChain([['本次输入',q],['黑盒返回',encode(q,decrypt?-3:3)],['现在可以观察','比较输入和输出的关系；现代方案应能抵抗其设计目标中的查询能力。']]));};
 $('[data-v="model"]',r).oninput=draw;$('[data-encrypt]',r).onclick=()=>query(false);$('[data-decrypt]',r).onclick=()=>query(true);draw();
};
bindVisual('5.01','visualOracle','给你一个密码黑盒，你究竟能问什么？','换一种攻击权限，亲自请求加密或解密。按钮是否可用、能得到哪些样本，都会随权限改变。');

demoFactories.visualKerberos=r=>{
 r.innerHTML=`<div class="controls">${selectHTML('version','教学版本',[[1,'第一次：明文口令 + 服务票'],[2,'第二次：TGS + 登录保护']])}${selectHTML('action','攻击者动作',[[0,'观察登录链路'],[1,'复制并提交一张仍有效的服务票']])}</div><div class="result" aria-live="polite"></div>`;
 watch(r,()=>{let v=+getV(r,'version'),a=+getV(r,'action');result(r,visualChain(v===1?[['C → AS','身份 + 明文口令'],['AS → C','发给 S 的服务票'],['C → S','转交服务票']]:[['C → AS','登录请求'],['AS → C','以客户端密钥保护登录包与 TGT'],['C → TGS → C','用 TGT 申请服务票'],['C → S','转交服务票']])+visualOutcome(a===0?(v===1?'观察者能看到明文口令':'本版避免了明文传送口令'):'两版仍需持有者证明',a===0?'更改教学版本，看它具体修补了哪一个问题。':'一张仍有效的真票不能单独证明当前递交者持有客户秘密；第三次尝试加入新鲜认证器。',a===0&&v===2));});
};
bindVisual('7.07','visualKerberos','让攻击者试一次，看看版本升级修了哪里','比较链路观察与有效票据复制：第二次尝试修了明文口令，仍缺少当前持有者证明。');

demoFactories.visualProtocol=(r,d)=>{
 r.innerHTML=(d.variants?`<label>推演情境<select data-v="variant">${d.variants.map((v,i)=>`<option value="${i}">${visualEscape(v.name)}</option>`).join('')}</select></label>`:'')+'<div data-process></div>';
 const draw=()=>{const v=d.variants?d.variants[+getV(r,'variant')]:d;stepper($('[data-process]',r),v.steps,{language:'zh'})};
 if(d.variants)$('[data-v="variant"]',r).oninput=draw;draw();
};
const VStep=(title,text,from,to,payload)=>({title,text,message:from?[from,to,payload]:undefined});
bindVisual('1.14','visualProtocol','一封邮件，从明文到解密验签','跟着移动的消息读：签名、正文密文、被包装的会话密钥是三种不同对象。',{steps:[
 VStep('准备正文与摘要','Alice 有正文 P，计算 h=H(P)。摘要不隐藏正文。','Alice 正文','哈希函数','P → h'),
 VStep('生成签名','用 Alice 的私钥通过合适的签名方案产生 S。此时 P 仍是明文。','Alice 私钥','签名方案','h → S'),
 VStep('加密正文和签名','使用会话密钥 K 加密 P || S。旁观者不应直接读到正文。','Alice','对称加密','P || S → 密文 C'),
 VStep('包装会话密钥','使用 Bob 的可信公钥包装 K，把被包装的 K 与 C 一起发送。','Alice','Bob','公钥包装的 K + C'),
 VStep('Bob 取出 K 并解密','Bob 用自己的私钥取出 K，再用 K 恢复 P || S。','Bob 私钥','Bob','取出 K → 解开 C'),
 VStep('验证发送者','Bob 重新计算摘要，用 Alice 的可信公钥验签。保密与发送者认证分别依赖不同密钥。','Alice 可信公钥','Bob 验签','比较 H(P) 与签名验证结果')
]});
bindVisual('6.12','visualProtocol','四条消息，逐次核对随机数','可播放也可逐步前进；每步显示消息方向、密文载荷和接收方必须做的检查。',{steps:[
 VStep('1 · A 发起','B 用自己的私钥解密；ID_A 是声称的身份，N₁ 标识本次发起。','A','B','E_PUb(N₁ || ID_A)'),
 VStep('2 · B 回答并挑战','A 用自己的私钥解密，核对保存的 N₁；N₂ 是 B 的新挑战。','B','A','E_PUa(N₁ || N₂)'),
 VStep('3 · A 回答挑战','B 解密后必须核对自己的 N₂，而不是只看消息格式正确。','A','B','E_PUb(N₂)'),
 VStep('4 · A 分发会话密钥','Bob 解开外层，再通过 A 的可信公钥检查内层。这里沿用课件的抽象私钥运算记号。','A','B','E_PUb(E_PRa(K_S))'),
 VStep('检查协议前提','公钥身份可信、随机数新鲜且绑定会话。真正实现还要绑定身份和上下文，并使用标准编码及签名方案。')
]});
bindVisual('7.04','visualProtocol','旧票据 + 旧密钥，怎样通过新挑战？','切换正常分发与旧密钥攻击，再从头播放；重点观察 Bob 看到的证据为什么区分不了两种情境。',{variants:[
 {name:'正常：中心分发新 K',steps:[
 VStep('1 · A 请求联系 B','R_A 用来对应 A 的本次请求。','A','中心 N','A, B, R_A'),
 VStep('2 · N 分发 K 和票据','A 检查 R_A、B，取出 K。票据 Ticket_B=E_keyB(K,A)，A 只负责转交。','中心 N','A','E_keyA(K, B, R_A, Ticket_B)'),
 VStep('3 · A 转交票据','B 用与中心共享的长期密钥 key_B 解票，获得 K 和声称的 A。','A','B','Ticket_B'),
 VStep('4 · B 发新挑战','B 检查当前对方是否知道票据内的 K。','B','A','E_K(R_B)'),
 VStep('5 · A 回答','A 解出 R_B，返回变换后的值；B 核对结果并接受。','A','B','E_K(R_B − 1)')
 ]},
 {name:'攻击：保存旧票据，且旧 K 已泄漏',steps:[
 VStep('攻击前提','M 保存一张过去的 Ticket_old，又取得对应 K_old。它没有中心或 B 的长期密钥。'),
 VStep('1 · M 冒充 A 转交旧票','没有新鲜性字段，B 无法仅靠票据分清这是不是本次新 K。','攻击者 M','B','Ticket_old = E_keyB(K_old,A)'),
 VStep('2 · B 发全新挑战','R_B 确实是新的；但它被 B 刚取出的旧 K 保护。','B','攻击者 M','E_Kold(R_B)'),
 VStep('3 · M 用泄漏的 K 回答','M 知道 K_old，能解开全新 R_B，再正确返回 R_B−1；无需破解加密算法。','攻击者 M','B','E_Kold(R_B − 1)'),
 VStep('4 · 弱协议错误接受','新挑战只证明对方知道票据内密钥，不能证明该密钥新鲜或仍应被信任。修补应建立可验证的新鲜性。')
 ]}
]});

// Retain original management process content, but show its causal handoffs.
for(const number of ['1.07','2.01','4.04']){
 const [ch,no]=number.split('.').map(Number),u=chapters[ch-1].units[no-1];
 u.lesson.labTag='流程推演';u.lesson.guide='按下一步或播放，沿时间线追踪中间结果；可以直接回到任意一步核对。';
}
const managementOutputs={
 '1.07':[['发现成绩可被未授权修改','确定资产与风险'],['只允许获批人员修改','明确保护目标和责任'],['配置授权与审批','让规则成为实际控制'],['审查异常修改记录','发现、调查、恢复'],['核对控制是否执行','把新发现送回下一轮评估']],
 '2.01':[['本例范围：成绩系统','列出资产、业务影响与边界'],['访谈 + 权限配置 + 日志','找出未授权修改的证据'],['弱点 → 威胁 → 后果','评估可能性及影响'],['与可接受标准比较','选择接受、缓解或转移'],['费用 + 剩余风险','形成有依据的建议与复查安排']]
};
for(const [number,outputs] of Object.entries(managementOutputs)){
 const [ch,no]=number.split('.').map(Number),u=chapters[ch-1].units[no-1];
 u.demo.steps=u.demo.steps.map(([title,text],i)=>({title,text,diagram:visualChain([['接续上一步',i?outputs[i-1][0]:'校园成绩系统的保护需求'],['本步产出',outputs[i][0]],['交给下一步',outputs[i][1]]])}));
}

function feistelCircuit(l,right,k,stage,reverse=false){
 const f=mod((reverse?l:right)**2+k,16),outL=reverse?right^f:right,outR=reverse?l:l^f;
 const inputL=bits(l,4),inputR=bits(right,4),fval=bits(f,4),left=bits(outL,4),rightText=bits(outR,4);
 return `<svg class="feistel-circuit" viewBox="0 0 500 330" role="img" aria-label="${reverse?'逆向':'正向'} Feistel：输入 ${inputL}、${inputR}；F 输出 ${fval}；输出 ${left}、${rightText}"><g class="circuit-wires"><path class="${stage>=1?'lit':''}" d="${reverse?'M130 54V95H250':'M370 54V95H250'}"/><path class="${stage>=2?'lit':''}" d="M250 135V170"/><path class="${stage>=2?'lit':''}" d="${reverse?'M370 54V170H270':'M130 54V170H230'}"/><path class="${stage>=3?'lit':''}" d="${reverse?'M250 190L130 265M130 54V220L370 265':'M250 190L370 265M370 54V220L130 265'}"/></g><g class="circuit-box"><rect x="74" y="14" width="112" height="40" rx="8"/><rect x="314" y="14" width="112" height="40" rx="8"/><rect x="196" y="95" width="108" height="40" rx="8"/><circle cx="250" cy="175" r="18"/><rect x="74" y="265" width="112" height="40" rx="8"/><rect x="314" y="265" width="112" height="40" rx="8"/></g><g class="circuit-text"><text x="130" y="40">${reverse?'L′':'L'} ${inputL}</text><text x="370" y="40">${reverse?'R′':'R'} ${inputR}</text><text x="250" y="120">${stage>=1?'F = '+fval:'F(·, K)'}</text><text x="250" y="181">⊕</text><text x="130" y="291">${reverse?'L':'L′'} ${stage>=3?left:'????'}</text><text x="370" y="291">${reverse?'R':'R′'} ${stage>=3?rightText:'????'}</text><text x="370" y="125">K = ${bits(k,4)}</text></g></svg>`;
}
demoFactories.feistel=r=>{
 r.innerHTML=`<div class="controls">${slider('l','输入左半（4 位）',11,0,15)}${slider('r','输入右半（4 位）',3,0,15)}${slider('k','轮密钥 K（4 位）',2,0,15)}${selectHTML('direction','推演方向',[[0,'加密：L,R → L′,R′'],[1,'解密：L′,R′ → L,R']])}</div><div data-process></div>`;
 const draw=()=>{let l=getN(r,'l'),right=getN(r,'r'),k=getN(r,'k'),reverse=getV(r,'direction')==='1',f=mod((reverse?l:right)**2+k,16),left=reverse?right^f:right,outR=reverse?l:l^f;
 stepper($('[data-process]',r),[
 {title:'先放入左右两半',text:'上方是输入，下方是输出。教学轮函数 F(X,K)=(X²+K) mod16；它不要求可逆。',diagram:feistelCircuit(l,right,k,0,reverse)},
 {title:'一半进入轮函数 F',text:`${reverse?'输入 L′':'输入 R'}=${reverse?l:right}，F=${f}（${bits(f,4)}）。注意：逆向也计算 F，不是求 F 的逆函数。`,diagram:feistelCircuit(l,right,k,1,reverse)},
 {title:'用 XOR 合并另一半',text:`${reverse?'L=R′⊕F(L′,K)':'R′=L⊕F(R,K)'}=${reverse?right:l} XOR ${f}=${reverse?left:outR}。同一个值 XOR 两次会消掉。`,diagram:feistelCircuit(l,right,k,2,reverse)},
 {title:'两条路径组成输出',text:`输出 ${bits(left,4)} | ${bits(outR,4)}。${reverse?'已撤销这一轮。':'将这个输出填入输入，再选解密，可恢复原来的两半。'}`,diagram:feistelCircuit(l,right,k,3,reverse)}
 ],{language:'zh'});};
 watch(r,draw);
};
Object.assign(chapters[4].units[6].lesson,{labTag:'线路动画',labTitle:'看一轮 Feistel 的数据怎样分叉、合并',guide:'调参数后逐步播放；高亮线路显示本步流向。把加密输出填回输入，切换解密，看同一个 F 怎样撤销这一轮。',open:true});

demoFactories.modes=(r,d)=>{
 r.innerHTML=`<p class="hint">8 位教学函数 E(x)=(x+K) mod256。用于展示连接关系；错误传播的数值不代表真实 AES 的扩散强度。</p><div class="controls">${selectHTML('mode','分组模式',['ECB','CBC','CFB','OFB','CTR'].map(x=>[x,x]))}${inputText('p','明文块（1–4 个 0–255 整数）','42,42,17,42')}${slider('k','教学密钥 K',23,0,255)}${slider('iv','IV / 起始计数器',7,0,200)}</div><p class="hint">点下方任意密文块，翻转其最低位；再次点击可恢复。也可以用键盘选中后按 Enter。</p><div data-blocks></div><div data-process></div>`;
 $('[data-v="mode"]',r).value=d.mode||'ECB';let damage=-1;
 const draw=()=>safe(r,()=>{
  const raw=getV(r,'p').split(','),p=raw.map(x=>Number(x.trim()));
  if(p.length<1||p.length>4||raw.some(x=>!x.trim())||p.some(x=>!Number.isInteger(x)||x<0||x>255)){visualStops.get($('[data-process]',r))?.();$('[data-process]',r).innerHTML='';throw Error('请输入 1–4 个 0–255 的整数。');}
  if(damage>=p.length)damage=-1;
  const mode=getV(r,'mode'),k=getN(r,'k'),iv=getN(r,'iv'),z=modeRun(p,k,iv,mode,damage),dup=new Set(z.c.filter((v,i,a)=>a.indexOf(v)!==i));
  $('[data-blocks]',r).innerHTML=`<div class="block-stream">${p.map((v,i)=>`<div class="block-column"><span>M${i+1} <b>${v}</b></span><i aria-hidden="true">↓</i><button data-corrupt="${i}" aria-pressed="${damage===i}" aria-label="${damage===i?'恢复':'篡改'}第 ${i+1} 密文块" class="${damage===i?'tampered':''} ${dup.has(z.c[i])?'repeated':''}">C${i+1}<b>${z.changed[i]}</b>${damage===i?'<small>已翻位</small>':dup.has(z.c[i])?'<small>重复密文</small>':'<small>点击翻位</small>'}</button><i aria-hidden="true">↓</i><span class="${z.recovered[i]!==v?'block-damaged':''}">M′${i+1} <b>${z.recovered[i]}</b><small>${z.recovered[i]!==v?'结果改变':'恢复原值'}</small></span></div>`).join('')}</div><div class="result" aria-live="polite">${damage===-1?'未篡改。先比较相同明文块的密文是否相同。':`翻转 C${damage+1} 最低位后，第 ${p.map((v,i)=>z.recovered[i]!==v?i+1:null).filter(Boolean).join('、')} 明文块的恢复结果改变。`} 所有这些模式单独使用都不提供消息完整性保证。</div>`;
  $$('[data-corrupt]',r).forEach(b=>b.onclick=()=>{damage=damage===+b.dataset.corrupt?-1:+b.dataset.corrupt;draw()});
  let feedback=iv,steps=p.map((v,i)=>{
   const old=feedback;let input,operation,source;
   if(mode==='ECB'){input=v;operation=`E(${v})=${z.c[i]}`;source='本块独立，不使用 IV 或前块';}
   if(mode==='CBC'){input=v^old;operation=`${v} XOR ${old}=${input}；E(${input})=${z.c[i]}`;source=i?'前一密文 C'+i:'初始 IV';feedback=z.c[i];}
   if(mode==='CFB'){input=old;operation=`E(${old})=${mod(old+k,256)}；${v} XOR ${mod(old+k,256)}=${z.c[i]}`;source=i?'前一密文 C'+i:'初始 IV';feedback=z.c[i];}
   if(mode==='OFB'){input=old;feedback=mod(old+k,256);operation=`E(${old})=${feedback}；${v} XOR ${feedback}=${z.c[i]}`;source=i?'上一内部输出 O'+i:'初始 IV';}
   if(mode==='CTR'){input=iv+i;operation=`E(${input})=${mod(input+k,256)}；${v} XOR ${mod(input+k,256)}=${z.c[i]}`;source='IV + 块偏移 = '+input;}
   return {title:'第 '+(i+1)+' 块 · '+mode,text:operation+'。图示为未篡改的加密路径；上面的块卡展示收到密文后的解密结果。',diagram:visualChain([['状态来源',source],['送入 E 的值',String(input)],['得到密文 C'+(i+1),String(z.c[i])],['传给下一块',mode==='ECB'?'不传状态':mode==='CTR'?'换下一个计数器':mode==='OFB'?'内部输出 '+feedback:'密文 '+feedback]])};
  });
  stepper($('[data-process]',r),steps,{language:'zh'});
 });
 // The result target must exist even while parsing an invalid input.
 $('[data-blocks]',r).innerHTML='<div class="result" aria-live="polite"></div>';
 $$('input,select',r).forEach(e=>e.addEventListener('input',draw));draw();
};
for(const [i,mode] of [[10,'ECB'],[11,'CBC'],[12,'CFB']]){
 chapters[4].units[i].demo.mode=mode;
 Object.assign(chapters[4].units[i].lesson,{labTag:'反馈链实验',labTitle:i===10?'点一块密文，看重复和篡改留下什么':i===11?'沿 CBC 链追踪一位篡改':'切换反馈来源，比较 CFB / OFB / CTR',guide:'上方三行分别是明文、收到的密文、恢复的明文。点击密文块翻位，下方流程图逐块展示加密时到底把什么传给了下一块。'});
}

// A four-round trace is now a state diagram rather than a paragraph of bit values.
demoFactories.originalfeistel=r=>{
 r.innerHTML=`<div class="controls">${selectHTML('dir','Direction',[[1,'Decrypt: rounds 4 to 1'],[0,'Encrypt: rounds 1 to 4']])}${inputText('v','Eight-bit input','10010110')}${inputText('k','Four-bit key','0010')}</div><div class="result" aria-live="polite"></div><div data-process></div>`;
 watch(r,()=>{let raw=getV(r,'v'),key=getV(r,'k');if(!/^[01]{8}$/.test(raw)||!/^[01]{4}$/.test(key))throw Error('Enter exactly eight input bits and four key bits.');let dec=getV(r,'dir')==='1',z=exerciseFeistel(parseInt(raw,2),parseInt(key,2),dec);result(r,`<strong>${dec?'Plaintext':'Ciphertext'}: ${bits(z.value)}</strong><p>Reverse check: ${bits(exerciseFeistel(z.value,parseInt(key,2),!dec).value)}. F=(i·R)^K mod16; K is an exponent.</p>`);
 stepper($('[data-process]',r),z.trace.map(t=>({title:`Round ${t.i}${dec?' reversed':''}`,text:`F output ${bits(t.f,4)}; ${dec?'recover the previous halves':'swap and combine by XOR'}.`,diagram:visualChain([['Input',`L=${bits(t.oldL,4)} | R=${bits(t.oldR,4)}`],['F computation',`(${t.i} × ${dec?t.oldL:t.oldR})^${parseInt(key,2)} mod16 = ${t.f}`],['XOR / copy',dec?'L_prev=R XOR F(L,K); R_prev=L':'L_next=R; R_next=L XOR F(R,K)'],['Output',`L=${bits(t.l,4)} | R=${bits(t.r,4)}`]])})),{language:'en'});
 });
};
Object.assign(chapters[4].units[8].lesson,{labTag:'逐轮状态图',guide:'保持原题英文计算界面。沿每轮 Input → F → XOR / copy → Output 核对状态；点击时间线可以跳到任何一轮。'});

// No subsection keeps a click-to-read definition deck.
for(const c of chapters)for(const u of c.units){
 if(u.demo.type==='explore'||u.demo.type==='cia')throw Error('Unconverted definition deck: '+c.no+' '+u.title);
 if(!u.lesson.labTag)u.lesson.labTag=['practice','classify','sort'].includes(u.demo.type)?'英文练习':['sequence','protocolvariants','kerberosattempts','kerberos','reflection'].includes(u.demo.type)?'流程推演':'计算实验';
}

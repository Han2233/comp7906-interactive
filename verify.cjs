// Independent numerical checks against standard vectors and Node crypto.
const assert=require('node:assert/strict'),crypto=require('node:crypto'),fs=require('node:fs'),vm=require('node:vm'),c=require('./algorithms');
assert.equal(c.inv(28,51),31);assert.equal(c.inv(12,61),56);assert.equal(c.inv(122,391),125);assert.throws(()=>c.inv(2,6));
assert.equal(c.powmod(65,17,3233),2790);assert.equal(c.powmod(2790,2753,3233),65);
for(const s of ['', 'abc', '中文摘要验证', 'a'.repeat(1000)])assert.equal(c.sha256(s),crypto.createHash('sha256').update(s).digest('hex'));
assert.equal(Buffer.from(c.rc4([1,2,3,4,5],Array(16).fill(0)).cipher).toString('hex'),'b2396305f03dc027ccc3524a0a1118a8');
for(const length of [16,24,32])for(let i=0;i<100;i++){const key=Array.from({length},(_,n)=>(17*n+7*i)&255),p=Array.from({length:16},(_,n)=>(31*n+19*i)&255),engine=crypto.createCipheriv(`aes-${length*8}-ecb`,Buffer.from(key),null);engine.setAutoPadding(false);const expected=Buffer.concat([engine.update(Buffer.from(p)),engine.final()]),encrypted=c.aesEncrypt(p,key).cipher;assert.deepEqual(Buffer.from(encrypted),expected);assert.deepEqual(c.aesDecrypt(encrypted,key).plain,p)}
assert.equal(c.saes(0xa749,0x2d55).cipher,0xc349);
for(let i=0;i<200;i++){const p=(i*251+17)&65535,k=(i*223+33)&65535;assert.equal(c.saesDecrypt(c.saes(p,k).cipher,k).plain,p);for(const t of [1,2,4,8]){const bits=p.toString(2).padStart(16,'0'),z=c.cfbSegments(bits,i&255,7,t);assert.equal(c.cfbSegments(z.output,i&255,7,t,true).output,bits)}const x=i&255;assert.equal(c.exerciseFeistel(c.exerciseFeistel(x,i%16).value,i%16,true).value,x)}
assert.equal(c.exerciseFeistel(0x96,2,true).value,0x92);assert.deepEqual(c.hillCandidates([18,14],[4,3],[6,4],[3,18]),[[[12,11],[3,2]],[[25,11],[3,2]]]);assert.equal(c.polyDiv(c.polyMul(0x57,0x83),0x11b).r,0xc1);assert.equal(c.gfmul(0x57,0x83),0xc1);
const key=Buffer.from('133457799BBCDFF1','hex'),ks=c.desKeySchedule([...key].flatMap(x=>x.toString(2).padStart(8,'0').split('').map(Number))),hx=x=>BigInt('0b'+x.join('')).toString(16);assert.equal(hx(ks.trace[0].k),'1b02effc7072');assert.equal(hx(ks.trace[15].k),'cb3d8b0e17f5');
assert.deepEqual(c.ecMul(2,[5,1],2,17),[6,3]);assert.equal(c.ecMul(19,[5,1],2,17),null);
const ctx={};vm.createContext(ctx);for(const file of ['content.js','enrichment.js','demos.js','advanced-demos.js','assessment-localization.js','quiz.js','practice.js','mock-exams.js','materials.js'])vm.runInContext(fs.readFileSync(file,'utf8'),ctx,{filename:file});
for(const file of ['book.js',...Array.from({length:7},(_,i)=>`chapter-${i+1}.js`)])vm.runInContext(fs.readFileSync('lessons/'+file,'utf8'),ctx,{filename:'lessons/'+file});
const teaching=JSON.parse(vm.runInContext('JSON.stringify({stories:chapterStories,lessons:chapters.flatMap(c=>c.units.map(u=>u.lesson))})',ctx));
assert.equal(teaching.stories.length,7);assert.equal(teaching.lessons.length,88);
const blockKinds=new Set(['paragraph','heading','aside','worked','comparison','flow','dialogue','equation']);
for(const story of teaching.stories){assert.ok(story.scene&&story.story&&story.bridge);assert.equal(story.route.length,3);}
for(const l of teaching.lessons){assert.ok(l.title&&l.labTitle&&l.guide);assert.ok(l.blocks.length>=3);for(const b of l.blocks){assert.ok(blockKinds.has(b.kind));if(b.kind==='equation')assert.ok(!/&(?:lt|gt);/.test(b.expression));if(b.kind==='worked')assert.ok(b.steps.length>=2);if(b.kind==='flow')assert.ok(b.items.length>=2);}}
// Load the renderer in the same global context to detect cross-file name collisions.
ctx.window={addEventListener(){}};ctx.document={};ctx.localStorage={getItem(){return '[]'}};
vm.runInContext(fs.readFileSync('app.js','utf8'),ctx,{filename:'app.js'});
const chapterHTML=vm.runInContext('chapters.map(renderTeachingChapter).join("")',ctx);
assert.equal((chapterHTML.match(/class="unit teaching-unit"/g)||[]).length,88);
assert.equal((chapterHTML.match(/class="slide-notes"/g)||[]).length,88);
assert.equal((chapterHTML.match(/class="lesson-lab"/g)||[]).length,88);
assert.equal((chapterHTML.match(/class="chapter-opening"/g)||[]).length,7);
assert.ok(!/<h4>(是什么|为什么|怎么算)/.test(chapterHTML));
assert.ok(!chapterHTML.includes('undefined'));assert.ok(!chapterHTML.includes('[object Object]'));
for(const [x,expected] of [[2,992],[4,1232],[8,1547],[16,789]])assert.equal(c.powmod(65,x,3233),expected);
assert.equal(c.powmod(11,5,391),350);assert.equal(c.powmod(11,7,391),122);
assert.equal(c.powmod(350,3,391)*c.powmod(125,2,391)%391,11);
assert.equal(c.powmod(2,27,55),18);assert.equal(c.powmod(3,27,55),42);
assert.equal(18**2*42%55,23);assert.equal(c.powmod(23,3,55),12);
assert.equal(c.powmod(5,6,23),8);assert.equal(c.powmod(5,15,23),19);assert.equal(c.powmod(19,6,23),2);
assert.equal(c.gfmul(2,0xdb)^c.gfmul(3,0x13)^0x53^0x45,0x8e);
console.log(`PASS: 88 authored lessons, ${teaching.lessons.reduce((n,l)=>n+l.blocks.length,0)} varied teaching blocks, seven chapter stories, all slide notes and labs preserved; new worked examples checked.`);
vm.runInContext(`globalThis.stats={units:chapters.reduce((s,c)=>s+c.units.length,0),cases:practiceCases.length,checks:practiceCases.reduce((s,c)=>s+c.checks.length,0),glossary:glossary.length,quiz:chapterQuestionBank.reduce((n,q)=>n+q.length,0),chapterTests:chapterQuestionBank.length,mockPapers:mockPapers.length,drills:transferDrills.length,unknown:chapters.flatMap(c=>c.units).filter(u=>!['explore','practice','cia'].includes(u.demo.type)&&!demoFactories[u.demo.type]).map(u=>u.demo.type),blankGlossary:glossary.filter(x=>x.length<3).length,chapterUnits:chapters.map(c=>c.units.length)};`,ctx);
assert.equal(ctx.stats.units,88);assert.equal(ctx.stats.cases,20);assert.equal(ctx.stats.checks,43);assert.equal(ctx.stats.quiz,44);assert.equal(ctx.stats.chapterTests,7);assert.equal(ctx.stats.mockPapers,3);assert.equal(ctx.stats.drills,6);assert.equal(ctx.stats.blankGlossary,0);assert.deepEqual(Array.from(ctx.stats.unknown),[]);console.log('PASS: 300 AES encrypt/decrypt standard comparisons; 200 S-AES, 800 CFB, 200 Feistel round trips; independent DES/RC4/SHA/GF/Hill/EC vectors.');console.log(JSON.stringify(ctx.stats));

const assessment=JSON.parse(vm.runInContext(`JSON.stringify({bank:chapterQuestionBank,original:practiceCases,papers:mockPapers,drills:transferDrills,inline:chapters.flatMap(c=>c.units).map(u=>u.demo).filter(d=>['practice','classify','sort'].includes(d.type))})`,ctx));
const commonModulusQuestion=assessment.bank[5].find(q=>q.q.includes('c₁=350'));
assert.equal(commonModulusQuestion.o[commonModulusQuestion.a],'11');
assert.equal(assessment.original.find(q=>q.set==='Set 3'&&q.no===1).checks[0].a,11);
const isEnglish=s=>!/[\u3400-\u9fff]/u.test(s);
for(const bank of assessment.bank){assert.ok(bank.length>=6);for(const q of bank){assert.ok(q.a>=0&&q.a<q.o.length);assert.equal(new Set(q.o).size,q.o.length);assert.ok(isEnglish(JSON.stringify(q)));}}
for(const question of [...assessment.original,...assessment.drills,...assessment.papers.flatMap(p=>p.questions)]){assert.ok(isEnglish(JSON.stringify(question)));assert.ok(question.solution.length&&question.rubric.length);for(const check of question.checks){if(check.type==='choice')assert.ok(check.a>=0&&check.a<check.options.length);if(check.type==='number')assert.ok(Number.isFinite(check.a));}}
for(const d of assessment.inline)assert.ok(isEnglish(JSON.stringify(d)));
for(const paper of assessment.papers){assert.equal(paper.questions.reduce((n,q)=>n+q.marks,0),20);for(const q of paper.questions)assert.equal(q.rubric.reduce((n,r)=>n+r.points,0),q.marks);}
assert.equal(c.inv(382,493),151);assert.equal(c.powmod(383,2,493)*c.inv(382,493)%493,42);
assert.equal(c.powmod(42,5,493),383);assert.equal(c.powmod(42,9,493),382);
assert.equal(c.inv(8,437),164);assert.equal(c.powmod(164,2,437)*c.powmod(12,3,437)%437,27);
assert.equal(c.powmod(27,7,437),8);assert.equal(c.powmod(27,5,437),12);
for(const [n,e,phi] of [[493,5,448],[493,9,448],[437,7,396],[437,5,396],[391,5,352],[391,7,352]])assert.equal(c.gcd(e,phi),1);
assert.equal(c.gcd(340,391),17);assert.equal(c.exerciseFeistel(0x32,3,true).value,0x3a);
assert.equal(12000*.04,480);assert.equal(160+480*(1-.75),280);assert.equal(72000-12000-(90000/3+5000),25000);assert.equal(600000/5*.75/2400/12,3.125);assert.equal(90000-2.5*2400*12,18000);
const html=fs.readFileSync('index.html','utf8');assert.equal(html,fs.readFileSync('dist/index.html','utf8'));assert.ok(!html.includes('id="selftest"'));assert.ok(!/<script[^>]+src=|<link[^>]+(?:stylesheet|preload)/i.test(html));
console.log('PASS: English-only assessment data; seven independent chapter banks; three 20-mark papers and rubric totals; new RSA/Feistel/risk answers; self-contained identical offline HTML.');

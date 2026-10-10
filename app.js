const $=(s,root=document)=>root.querySelector(s), $$=(s,root=document)=>[...root.querySelectorAll(s)];
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slideText=s=>String(s).split(/(<a href="https:\/\/[^"<>]+">[^<]+<\/a>)/g).map(t=>t.startsWith('<a href="https://')?t:escapeHTML(t)).join('');
const saved=(()=>{try{return JSON.parse(localStorage.getItem('comp7906-progress')||'[]')}catch{return []}})();
const completed=new Set(Array.isArray(saved)?saved:[]);
function updateProgress(){ $('#progress-label').textContent=`已学 ${completed.size} / ${chapters.length} 章`; $$('.mark').forEach(b=>{b.textContent=completed.has(+b.dataset.chapter)?'已完成 · 再读本章':'标记本章已学完';b.setAttribute('aria-pressed',completed.has(+b.dataset.chapter))});try{localStorage.setItem('comp7906-progress',JSON.stringify([...completed]))}catch{}}
function renderLessonBlock(b){
 switch(b.kind){
  case 'paragraph':return `<p>${b.html}</p>`;
  case 'heading':return `<h4 class="lesson-heading">${escapeHTML(b.text)}</h4>`;
  case 'aside':return `<aside class="teaching-aside"><h4>${escapeHTML(b.title)}</h4><p>${b.html}</p></aside>`;
  case 'worked':return `<section class="worked-example"><h4>${escapeHTML(b.title)}</h4><ol>${b.steps.map(([title,html])=>`<li><strong>${title}</strong><p>${html}</p></li>`).join('')}</ol></section>`;
  case 'comparison':return `${b.headers.length>2?'<p class="table-swipe">窄屏可横向滑动表格 →</p>':''}<div class="table-wrap lesson-comparison" data-columns="${b.headers.length}"><table><thead><tr>${b.headers.map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${b.rows.map(row=>`<tr>${row.map(cell=>`<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  case 'flow':return `<figure class="lesson-flow"><figcaption>${escapeHTML(b.title)}</figcaption><ol>${b.items.map(([label,html])=>`<li><strong>${label}</strong><span>${html}</span></li>`).join('')}</ol></figure>`;
  case 'dialogue':return `<aside class="lesson-dialogue"><h4><span aria-hidden="true">问</span>${escapeHTML(b.question)}</h4><p>${b.reply}</p></aside>`;
  case 'equation':return `<figure class="lesson-equation"><div class="formula">${escapeHTML(b.expression)}</div>${b.caption?`<figcaption>${escapeHTML(b.caption)}</figcaption>`:''}</figure>`;
  default:throw Error('Unknown lesson block: '+b.kind);
 }
}
function renderTeachingUnit(c,u,i){
 const l=u.lesson;
 return `<article class="unit teaching-unit" id="unit-${c.no}-${i}" aria-labelledby="lesson-title-${c.no}-${i}"><header class="unit-title"><div><div class="lesson-number">${c.no}.${String(i+1).padStart(2,'0')} <span>${escapeHTML(u.title)}</span></div><h3 id="lesson-title-${c.no}-${i}">${escapeHTML(l.title)}</h3><div class="en">${escapeHTML(u.en)}</div></div></header><div class="source">对应课件：${escapeHTML(u.source||'Lecture '+c.no)} · 第 ${escapeHTML(u.pages)} 页</div><div class="lesson-prose">${l.blocks.map(renderLessonBlock).join('')}</div>${u.foundation?`<details class="foundation-notes"><summary>先补一点基础：位、字节、十六进制与异或</summary><div class="mini-prereq"></div></details>`:''}<details class="lesson-lab"${l.open?' open':''}><summary><span class="lab-tag">动手试试</span>${escapeHTML(l.labTitle)}</summary><p class="lab-guide">${escapeHTML(l.guide)}</p><div class="lab" data-chapter="${c.no}" data-unit="${i}"><div class="lab-body"></div></div></details><details class="slide-notes"><summary>对照课件 · 术语、条件与补充细节</summary><div class="slide-notes-body"><p>${slideText(u.what)}</p><p>${slideText(u.why)}</p><p>${slideText(u.how)}</p>${u.formula?`<div class="formula">${escapeHTML(u.formula)}</div>`:''}</div></details></article>`;
}
function renderTeachingChapter(c){
 const story=chapterStories[c.no-1];
 return `<section class="chapter" id="chapter-${c.no}" aria-labelledby="chapter-title-${c.no}"><header class="chapter-header"><div class="chapter-meta">LECTURE ${String(c.no).padStart(2,'0')} · ${escapeHTML(c.en)}</div><h2 id="chapter-title-${c.no}">${escapeHTML(c.title)}</h2><div class="chapter-opening"><div class="scene-label">这一讲，从这里开始</div><h3>${escapeHTML(story.scene)}</h3><p>${story.story}</p><ol class="reading-route">${story.route.map(r=>`<li>${escapeHTML(r)}</li>`).join('')}</ol></div><details class="chapter-outline"><summary>展开本章路线 · ${c.units.length} 个学习段落与章节自测</summary><div class="unit-index">${c.units.map((u,i)=>`<a href="#unit-${c.no}-${i}"><span>${c.no}.${i+1}</span> ${escapeHTML(u.lesson.title)}</a>`).join('')}<a href="#chapter-test-${c.no}">English self-test</a></div></details></header>${c.units.map((u,i)=>renderTeachingUnit(c,u,i)).join('')}<aside class="summary"><h3>本章小结</h3><ul>${c.summary.map(s=>`<li>${s}</li>`).join('')}</ul><p class="chapter-bridge">${escapeHTML(story.bridge)}</p><div class="row"><button class="mark" data-chapter="${c.no}">标记本章已学完</button><a class="button" href="#chapter-test-${c.no}">English self-test →</a></div></aside><section class="unit chapter-selftest" id="chapter-test-${c.no}" data-chapter="${c.no}" lang="en" aria-label="Chapter ${c.no} self-test"></section>${c.no<chapters.length?`<a class="next-chapter" href="#chapter-${c.no+1}"><span>继续下一讲</span><strong>${escapeHTML(chapters[c.no].title)} →</strong></a>`:''}</section>`;
}
function render(){
 $('#sidebar-nav').innerHTML=chapters.map(c=>`<a class="chapter-link" href="#chapter-${c.no}"><span class="num">${String(c.no).padStart(2,'0')}</span><span>${c.title}</span></a>`).join('')+`<a class="chapter-link" href="#practice"><span class="num">练</span><span>配套原题训练</span></a><a class="chapter-link" href="#materials"><span class="num">读</span><span>资料与覆盖范围</span></a><a class="chapter-link" href="#mock-exams"><span class="num">考</span><span>英文期中模拟</span></a><a class="chapter-link" href="#glossary"><span class="num">09</span><span>中英术语速查</span></a>`;
 $('#chapters').innerHTML=chapters.map(renderTeachingChapter).join('');
 $$('.lab[data-chapter]').forEach(el=>mountDemo($('.lab-body',el),chapters[+el.dataset.chapter-1].units[+el.dataset.unit].demo));
 $$('.mini-prereq').forEach(mountFoundation);
 $$('.mark').forEach(b=>b.onclick=()=>{const n=+b.dataset.chapter;completed.has(n)?completed.delete(n):completed.add(n);updateProgress()});updateProgress();
 renderPractice();renderMocks();renderMaterials();
 renderChapterQuizzes();if(typeof glossary!=='undefined')renderGlossary();
 const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){$$('.chapter-link').forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id))}},{rootMargin:'-12% 0px -70% 0px'});$$('section.chapter').forEach(s=>observer.observe(s));
 const introButtons=$$('#intro-lab button');introButtons.forEach(b=>b.onclick=()=>{introButtons.forEach(x=>x.classList.toggle('selected',x===b));$('#intro-result').textContent=b.dataset.explain});
 $('#download').onclick=()=>{const blob=new Blob(['<!DOCTYPE html>\n'+document.documentElement.outerHTML],{type:'text/html;charset=utf-8'});const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download='COMP7906-网安互动学习.html';link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000)};
}
function toast(t){const e=document.createElement('div');e.className='toast';e.textContent=t;document.body.append(e);setTimeout(()=>e.remove(),2800)}
window.addEventListener('DOMContentLoaded',()=>{render();registerLearningTools()});

function registerLearningTools(){
 const context=document.modelContext;if(!context?.registerTool)return;const lifecycle=new AbortController();window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
 const registry=[{name:'read_course_structure',title:'查看课程章节',description:'Read the ordered chapter list and learning units.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute(input){if(!input||typeof input!=='object'||Object.keys(input).length)throw Error('Expected an empty object.');return chapters.map(c=>({chapter:c.no,title:c.title,units:c.units.length}))}},{name:'navigate_to_chapter',title:'打开学习章节',description:'Scroll the visible learning page to chapter 1 through 7.',inputSchema:{type:'object',properties:{chapter:{type:'integer',minimum:1,maximum:7}},required:['chapter'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){if(!input||Object.keys(input).length!==1||!Number.isInteger(input.chapter)||input.chapter<1||input.chapter>7)throw Error('Expected chapter 1–7.');const target=$('#chapter-'+input.chapter);target.scrollIntoView({behavior:'instant'});return {chapter:input.chapter,title:chapters[input.chapter-1].title}}}];
 for(const tool of registry){try{Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{})}catch{}}
}

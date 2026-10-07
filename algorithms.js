// Pure local teaching implementations, without browser services or network dependencies.
const mod=(a,n)=>((a%n)+n)%n;
const gcd=(a,b)=>{while(b)[a,b]=[b,a%b];return Math.abs(a)};
function egcd(a,b){let r0=a,r1=b,x0=1,x1=0,y0=0,y1=1;while(r1){let q=Math.floor(r0/r1);[r0,r1]=[r1,r0-q*r1];[x0,x1]=[x1,x0-q*x1];[y0,y1]=[y1,y0-q*y1]}return {g:r0,x:x0,y:y0}}
function inv(a,n){const z=egcd(a,n);if(z.g!==1)throw Error('不存在逆元：两个数不互质。');return mod(z.x,n)}
function powmod(a,e,n){let r=1n,b=BigInt(a),k=BigInt(e),m=BigInt(n);if(m<=1n||k<0n)throw Error('模数要大于 1，指数不能为负。');b=(b%m+m)%m;while(k){if(k&1n)r=r*b%m;b=b*b%m;k>>=1n}return Number(r)}
function isPrime(n){if(n<2||!Number.isInteger(n))return false;for(let i=2;i*i<=n;i++)if(n%i===0)return false;return true}
const hex=(n,len=2)=>n.toString(16).toUpperCase().padStart(len,'0');
const bits=(n,len=8)=>n.toString(2).padStart(len,'0');
function parseHex(s,bytes){s=s.replace(/\s/g,'');if(!new RegExp('^[0-9a-fA-F]{'+bytes*2+'}$').test(s))throw Error(`请输入 ${bytes*2} 位十六进制字符。`);return s.match(/../g).map(x=>parseInt(x,16))}
function gfmul(a,b,polynomial=0x11b,width=8){let r=0,mask=(1<<width)-1;for(let i=0;i<width;i++){if(b&1)r^=a;b>>=1;a<<=1;if(a&(1<<width))a^=polynomial}return r&mask}
function gfpower(a,k){let r=1;while(k){if(k&1)r=gfmul(r,a);a=gfmul(a,a);k>>=1}return r}
const rol8=(x,k)=>((x<<k)|(x>>(8-k)))&255;
const aesS=Array.from({length:256},(_,a)=>{let v=a?gfpower(a,254):0;return v^rol8(v,1)^rol8(v,2)^rol8(v,3)^rol8(v,4)^0x63});
function aesExpand(key){
 if(![16,24,32].includes(key.length))throw Error('AES 密钥须为 16、24 或 32 字节。');
 const nk=key.length/4,nr=nk+6;let e=[...key],rc=1;
 while(e.length<16*(nr+1)){let t=e.slice(-4),word=e.length/4;
  if(word%nk===0){t.push(t.shift());t=t.map(x=>aesS[x]);t[0]^=rc;rc=gfmul(rc,2)}
  else if(nk===8&&word%nk===4)t=t.map(x=>aesS[x]);
  for(let i=0;i<4;i++)e.push(e[e.length-key.length]^t[i]);
 }
 return Array.from({length:nr+1},(_,i)=>e.slice(i*16,i*16+16));
}
function aesShift(s){let o=[...s];for(let r=0;r<4;r++)for(let c=0;c<4;c++)o[r+4*c]=s[r+4*((c+r)%4)];return o}
function mixOne(s){return [gfmul(2,s[0])^gfmul(3,s[1])^s[2]^s[3],s[0]^gfmul(2,s[1])^gfmul(3,s[2])^s[3],s[0]^s[1]^gfmul(2,s[2])^gfmul(3,s[3]),gfmul(3,s[0])^s[1]^s[2]^gfmul(2,s[3])]}
function aesEncrypt(input,key){let state=[...input],keys=aesExpand(key),trace=[{title:'输入状态',text:'按列将 16 个输入字节装入 4×4 矩阵。',state:[...state]}];const add=(r)=>{state=state.map((x,i)=>x^keys[r][i]);trace.push({title:`第 ${r} 轮 · AddRoundKey`,text:`状态逐字节 XOR 轮密钥 ${keys[r].map(x=>hex(x)).join('')}。`,state:[...state]})};add(0);for(let r=1;r<keys.length;r++){state=state.map(x=>aesS[x]);trace.push({title:`第 ${r} 轮 · SubBytes`,text:'每个字节通过 AES S 盒替换。例如高四位选行，低四位选列。',state:[...state]});state=aesShift(state);trace.push({title:`第 ${r} 轮 · ShiftRows`,text:'四行分别循环左移 0、1、2、3 字节。',state:[...state]});if(r<keys.length-1){state=state.flatMap((_,i)=>i%4===0?mixOne(state.slice(i,i+4)):[]);trace.push({title:`第 ${r} 轮 · MixColumns`,text:'每列在 GF(2⁸) 中乘混合矩阵。加法是 XOR，乘法以 0x11B 取模。',state:[...state]})}add(r)}return {cipher:state,keys,trace}}
function perm(b,p){return p.map(i=>b[i-1])}
function shiftHalves(b,n){return [...b.slice(n,5),...b.slice(0,n),...b.slice(5+n),...b.slice(5,5+n)]}
const sdP10=[3,5,2,7,4,10,1,9,8,6],sdP8=[6,3,7,4,8,5,10,9],sdIP=[2,6,3,1,4,8,5,7],sdInv=[4,1,3,5,7,2,8,6],sdEP=[4,1,2,3,2,3,4,1],sdP4=[2,4,3,1];
const sdS0=[[1,0,3,2],[3,2,1,0],[0,2,1,3],[3,1,3,2]],sdS1=[[0,1,2,3],[2,0,1,3],[3,0,1,0],[2,1,0,3]];
function sdSubkeys(key){let p=perm(key,sdP10),ls=shiftHalves(p,1),k1=perm(ls,sdP8),ls2=shiftHalves(ls,2);return {p,ls,ls2,k1,k2:perm(ls2,sdP8)}}
function sdRound(b,k){let l=b.slice(0,4),r=b.slice(4),ep=perm(r,sdEP),x=ep.map((a,i)=>a^k[i]);const sb=(v,s)=>{let row=v[0]*2+v[3],col=v[1]*2+v[2];return bits(s[row][col],2).split('').map(Number)};let ss=[...sb(x.slice(0,4),sdS0),...sb(x.slice(4),sdS1)],p4=perm(ss,sdP4),left=l.map((v,i)=>v^p4[i]);return {result:[...left,...r],ep,x,ss,p4,left}}
function sdes(input,key){let ks=sdSubkeys(key),ip=perm(input,sdIP),r1=sdRound(ip,ks.k1),sw=[...r1.result.slice(4),...r1.result.slice(0,4)],r2=sdRound(sw,ks.k2),cipher=perm(r2.result,sdInv);let dec=perm(cipher,sdIP);dec=sdRound(dec,ks.k2).result;dec=[...dec.slice(4),...dec.slice(0,4)];dec=perm(sdRound(dec,ks.k1).result,sdInv);return {ks,ip,r1,sw,r2,cipher,plain:dec}}
const saS=[9,4,10,11,13,1,8,5,6,2,0,3,12,14,15,7],saInv=Array.from({length:16},(_,i)=>saS.indexOf(i));
const saN=x=>[x>>12,(x>>8)&15,(x>>4)&15,x&15],saJoin=x=>(x[0]<<12)|(x[1]<<8)|(x[2]<<4)|x[3];
const saSR=s=>[s[0],s[3],s[2],s[1]];
function saMC(s,inverse=false){let a=inverse?9:1,b=inverse?2:4,m=(x,y)=>gfmul(x,y,0x13,4);return [m(a,s[0])^m(b,s[1]),m(b,s[0])^m(a,s[1]),m(a,s[2])^m(b,s[3]),m(b,s[2])^m(a,s[3])]}
function saKeys(key){let w0=key>>8,w1=key&255,g=(w,r)=>((saS[w&15]<<4)|saS[w>>4])^r,w2=w0^g(w1,0x80),w3=w2^w1,w4=w2^g(w3,0x30),w5=w4^w3;return [(w0<<8)|w1,(w2<<8)|w3,(w4<<8)|w5]}
function saes(input,key){let keys=saKeys(key),state=saN(input),trace=[{title:'输入状态',text:'4 个半字节按列放入 2×2 状态矩阵。',state:[...state]}];const apply=(title,text,fn)=>{state=fn(state);trace.push({title,text,state:[...state]})};const add=r=>apply('AddKey K'+r,'逐位 XOR '+hex(keys[r],4),s=>saN(saJoin(s)^keys[r]));add(0);apply('Nibble Substitution','按 4×4 S 盒替换半字节。',s=>s.map(x=>saS[x]));apply('ShiftRow','交换第二行的两个半字节。',saSR);apply('MixColumns','在 GF(2⁴) 中乘 [[1,4],[4,1]]。',s=>saMC(s));add(1);apply('Nibble Substitution','第二轮替换。',s=>s.map(x=>saS[x]));apply('ShiftRow','第二轮移位；末轮不做混列。',saSR);add(2);const cipher=saJoin(state);let dec=saN(cipher^keys[2]);dec=saSR(dec).map(x=>saInv[x]);dec=saN(saJoin(dec)^keys[1]);dec=saMC(dec,true);dec=saSR(dec).map(x=>saInv[x]);const plain=saJoin(dec)^keys[0];return {cipher,plain,keys,trace}}
function rc4(key,plain){let S=Array.from({length:256},(_,i)=>i),j=0;for(let i=0;i<256;i++){j=(j+S[i]+key[i%key.length])%256;[S[i],S[j]]=[S[j],S[i]]}let i=0; j=0;let z=[],trace=[];for(let n=0;n<plain.length;n++){i=(i+1)%256;j=(j+S[i])%256;[S[i],S[j]]=[S[j],S[i]];let t=(S[i]+S[j])%256,k=S[t];z.push(k);trace.push({i,j,t,k,s:[...S],p:plain[n],c:plain[n]^k})}return {cipher:plain.map((p,n)=>p^z[n]),stream:z,trace}}
function sha256(str){let msg=[...new TextEncoder().encode(str)],length=msg.length*8;msg.push(128);while(msg.length%64!==56)msg.push(0);let high=Math.floor(length/4294967296),low=length>>>0;for(let n of [high,low])for(let j=3;j>=0;j--)msg.push((n>>>(j*8))&255);const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2],H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];const rr=(x,n)=>(x>>>n)|(x<<(32-n));for(let off=0;off<msg.length;off+=64){let w=[];for(let n=0;n<16;n++)w[n]=(msg[off+n*4]<<24)|(msg[off+n*4+1]<<16)|(msg[off+n*4+2]<<8)|msg[off+n*4+3];for(let n=16;n<64;n++){let s0=rr(w[n-15],7)^rr(w[n-15],18)^(w[n-15]>>>3),s1=rr(w[n-2],17)^rr(w[n-2],19)^(w[n-2]>>>10);w[n]=(w[n-16]+s0+w[n-7]+s1)|0}let [a,b,c,d,e,f,g,h]=H;for(let n=0;n<64;n++){let S1=rr(e,6)^rr(e,11)^rr(e,25),ch=(e&f)^(~e&g),t1=(h+S1+ch+K[n]+w[n])|0,S0=rr(a,2)^rr(a,13)^rr(a,22),maj=(a&b)^(a&c)^(b&c),t2=(S0+maj)|0;[a,b,c,d,e,f,g,h]=[(t1+t2)|0,a,b,c,(d+t1)|0,e,f,g]}[a,b,c,d,e,f,g,h].forEach((v,n)=>H[n]=(H[n]+v)|0)}return H.map(x=>(x>>>0).toString(16).padStart(8,'0')).join('')}
function ecAdd(P,Q,a,p){if(!P)return Q;if(!Q)return P;let [x,y]=P,[u,v]=Q;if(x===u&&mod(y+v,p)===0)return null;let slope=x===u?mod((3*x*x+a)*inv(2*y,p),p):mod((v-y)*inv(u-x,p),p),nx=mod(slope*slope-x-u,p),ny=mod(slope*(x-nx)-y,p);return [nx,ny]}
function ecMul(k,P,a,p){let r=null,b=P;while(k){if(k&1)r=ecAdd(r,b,a,p);b=ecAdd(b,b,a,p);k>>=1}return r}

const aesInv=Array.from({length:256},(_,i)=>aesS.indexOf(i));
function aesInvShift(s){let o=[...s];for(let r=0;r<4;r++)for(let c=0;c<4;c++)o[r+4*c]=s[r+4*mod(c-r,4)];return o}
function invMixOne(s){const mat=[[14,11,13,9],[9,14,11,13],[13,9,14,11],[11,13,9,14]];return mat.map(row=>row.reduce((v,x,i)=>v^gfmul(x,s[i]),0))}
function aesDecrypt(input,key){let state=[...input],keys=aesExpand(key),trace=[];
 const apply=(title,text,fn)=>{state=fn(state);trace.push({title,text,state:[...state]})};
 const add=r=>apply('AddRoundKey K'+r,'XOR 轮密钥 '+keys[r].map(x=>hex(x)).join(''),s=>s.map((v,i)=>v^keys[r][i]));
 trace.push({title:'输入密文',text:'密文仍按列装入 4×4 状态；从最后一把轮密钥开始。',state:[...state]});
 add(keys.length-1);
 for(let r=keys.length-2;r>=0;r--){apply('第 '+r+' 轮 · InvShiftRows','四行循环右移 0、1、2、3 字节。',aesInvShift);apply('第 '+r+' 轮 · InvSubBytes','用逆 S 盒撤销字节替换。',s=>s.map(v=>aesInv[v]));add(r);if(r>0)apply('第 '+r+' 轮 · InvMixColumns','在 GF(2⁸) 中乘逆矩阵；系数 0E、0B、0D、09。',s=>s.flatMap((_,i)=>i%4===0?invMixOne(s.slice(i,i+4)):[]))}
 return {plain:state,keys,trace};
}
function saesDecrypt(cipher,key){let keys=saKeys(key),state=saN(cipher),trace=[{title:'输入密文',text:'半字节按列装入矩阵。',state:[...state]}];const apply=(title,text,fn)=>{state=fn(state);trace.push({title,text,state:[...state]})};const add=r=>apply('AddKey K'+r,'XOR '+hex(keys[r],4),s=>saN(saJoin(s)^keys[r]));add(2);apply('InvShiftRow','交换第二行；这个移位本身就是其逆。',saSR);apply('InvSubNib','使用逆 S 盒。',s=>s.map(v=>saInv[v]));add(1);apply('InvMixColumns','乘 [[9,2],[2,9]]，模 x⁴+x+1。',s=>saMC(s,true));apply('InvShiftRow','撤销第一轮移位。',saSR);apply('InvSubNib','撤销第一轮替换。',s=>s.map(v=>saInv[v]));add(0);return {plain:saJoin(state),trace,keys}}
const polyDegree=a=>a?Math.floor(Math.log2(a)):-1;
function polyDiv(a,b){if(!b)throw Error('不能除以零多项式。');let r=a,q=0,steps=[];while(r&&polyDegree(r)>=polyDegree(b)){let k=polyDegree(r)-polyDegree(b),before=r;q^=1<<k;r^=b<<k;steps.push({before,k,r})}return {q,r,steps}}
function polyMul(a,b){let r=0;while(b){if(b&1)r^=a;a<<=1;b>>>=1}return r}
function polyGcd(a,b){let steps=[];while(b){let z=polyDiv(a,b);steps.push({a,b,...z});[a,b]=[b,z.r]}return {g:a,steps}}
function polyText(a){if(!a)return '0';let terms=[];for(let i=polyDegree(a);i>=0;i--)if(a&(1<<i))terms.push(i===0?'1':i===1?'x':'x^'+i);return terms.join(' + ')}
function exerciseFeistel(value,key,decrypt=false){let l=value>>4,r=value&15,trace=[];for(let j=0;j<4;j++){let i=decrypt?4-j:j+1,oldL=l,oldR=r,f=powmod(i*(decrypt?l:r),key,16);[l,r]=decrypt?[r^f,l]:[r,l^f];trace.push({i,oldL,oldR,f,l,r})}return {value:(l<<4)|r,trace}}
function hillCandidates(p1,p2,c1,c2){const rows=(x,y)=>{let out=[];for(let a=0;a<26;a++)for(let b=0;b<26;b++)if(mod(a*p1[0]+b*p1[1],26)===x&&mod(a*p2[0]+b*p2[1],26)===y)out.push([a,b]);return out};return rows(c1[0],c2[0]).flatMap(a=>rows(c1[1],c2[1]).map(b=>[a,b])).filter(m=>gcd(mod(m[0][0]*m[1][1]-m[0][1]*m[1][0],26),26)===1)}
function desKeySchedule(key){const pc1=[57,49,41,33,25,17,9,1,58,50,42,34,26,18,10,2,59,51,43,35,27,19,11,3,60,52,44,36,63,55,47,39,31,23,15,7,62,54,46,38,30,22,14,6,61,53,45,37,29,21,13,5,28,20,12,4],pc2=[14,17,11,24,1,5,3,28,15,6,21,10,23,19,12,4,26,8,16,7,27,20,13,2,41,52,31,37,47,55,30,40,51,45,33,48,44,49,39,56,34,53,46,42,50,36,29,32],shifts=[1,1,2,2,2,2,2,2,1,2,2,2,2,2,2,1];let initial=perm(key,pc1),c=initial.slice(0,28),d=initial.slice(28),trace=[];for(let i=0;i<16;i++){let n=shifts[i];c=c.slice(n).concat(c.slice(0,n));d=d.slice(n).concat(d.slice(0,n));let k=perm(c.concat(d),pc2);trace.push({round:i+1,shift:n,c:[...c],d:[...d],k})}return {initial,trace}}
function cfbSegments(input,k,iv,t,decrypt=false){let carry=iv,mask=(1<<t)-1,out=[],trace=[];for(let at=0;at<input.length;at+=t){let value=parseInt(input.slice(at,at+t),2),old=carry,encrypted=mod(carry+k,256),stream=encrypted>>(8-t),v=value^stream,c=decrypt?value:v;carry=((carry<<t)&255)|c;out.push(bits(v,t));trace.push({old,encrypted,stream,input:value,c,output:v,carry})}return {output:out.join(''),trace}}
const CryptoLab={desKeySchedule,cfbSegments,mod,gcd,egcd,inv,powmod,gfmul,aesS,aesExpand,aesEncrypt,aesDecrypt,invMixOne,sdes,saes,saesDecrypt,saKeys,rc4,sha256,ecAdd,ecMul,polyDiv,polyMul,polyGcd,polyText,exerciseFeistel,hillCandidates};
if(typeof module!=='undefined')module.exports=CryptoLab;

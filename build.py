from pathlib import Path
p=Path(__file__).parent
s=(p/'shell.html').read_text()
for marker,name in [('STYLE','style.css'),('ALGORITHMS','algorithms.js'),('CONTENT','content.js'),('DEMOS','demos.js'),('QUIZ','quiz.js'),('APP','app.js')]:
    f=p/name
    s=s.replace('/*'+marker+'*/', f.read_text() if f.exists() else '')
(p/'dist').mkdir(exist_ok=True)
(p/'dist'/'index.html').write_text(s)
(p/'index.html').write_text(s)
print('Saved self-contained HTML:', len(s.encode()), 'bytes')

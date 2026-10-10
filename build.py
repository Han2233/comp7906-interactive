from pathlib import Path
p=Path(__file__).parent
s=(p/'shell.html').read_text()
s=s.replace('<!--SUPPLEMENTS-->',(p/'supplement-shell.html').read_text())
s=s.replace('<script>/*CONTENT*/</script>','<script>/*CONTENT*/</script><script>/*ENRICHMENT*/</script>').replace('<script>/*DEMOS*/</script>','<script>/*DEMOS*/</script><script>/*ADVANCED*/</script><script>/*LOCALIZATION*/</script>').replace('<script>/*APP*/</script>','<script>/*PRACTICE*/</script><script>/*MOCKS*/</script><script>/*MATERIALS*/</script><script>/*APP*/</script>')
s=s.replace('<script>/*QUIZ*/</script>','<script>/*LESSONS*/</script><script>/*QUIZ*/</script>')
s=s.replace('/*LESSONS*/','\n'.join((p/'lessons'/name).read_text() for name in ['book.js']+[f'chapter-{i}.js' for i in range(1,8)]))
for marker,name in [('STYLE','style.css'),('ALGORITHMS','algorithms.js'),('CONTENT','content.js'),('ENRICHMENT','enrichment.js'),('DEMOS','demos.js'),('ADVANCED','advanced-demos.js'),('LOCALIZATION','assessment-localization.js'),('QUIZ','quiz.js'),('PRACTICE','practice.js'),('MOCKS','mock-exams.js'),('MATERIALS','materials.js'),('APP','app.js')]:
    f=p/name
    s=s.replace('/*'+marker+'*/', f.read_text() if f.exists() else '')
(p/'dist').mkdir(exist_ok=True)
(p/'dist'/'index.html').write_text(s)
(p/'index.html').write_text(s)
print('Saved self-contained HTML:', len(s.encode()), 'bytes')

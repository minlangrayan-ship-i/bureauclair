from pathlib import Path
import fitz,json,zipfile,hashlib
from xml.etree import ElementTree as ET
from PIL import Image,ImageDraw
root=Path(__file__).resolve().parents[1]
d=root/'docs/audit-guide-2026-11-24'
pdf=fitz.open(d/'BureauClair_Guide_complet_et_audit.pdf')
for old in d.glob('page-*.png'):old.unlink()
issues=[];pages=[]
for i,page in enumerate(pdf):
 text=page.get_text();pages.append({'page':i+1,'characters':len(text),'images':len(page.get_images()),'links':len(page.get_links())})
 if len(text.strip())<100:issues.append({'page':i+1,'issue':'very-short-page'})
 for block in page.get_text('dict')['blocks']:
  if block['type']==0:
   for line in block['lines']:
    if line['bbox'][2]>551 or line['bbox'][0]<43:issues.append({'page':i+1,'issue':'horizontal-text-overflow','text':''.join(s['text'] for s in line['spans'])})
alltext='\n'.join(p.get_text() for p in pdf)
inventory=json.loads((d/'inventaire.json').read_text(encoding='utf-8'))
for kind in ['guides','articles','prompts']:
 for x in inventory[kind]:
  if x['title'] not in alltext:issues.append({'issue':'missing-title','title':x['title']})
exports={}
for stem in ['audit-notes','transcription-corrigee']:
 txt=(d/(stem+'.txt')).read_text(encoding='utf-8')
 with zipfile.ZipFile(d/(stem+'.docx')) as z:
  tree=ET.fromstring(z.read('word/document.xml'))
  ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
  word='\n'.join(''.join(p.itertext()) for p in [])
  paragraphs=[''.join(t.text or '' for t in p.findall('.//w:t',ns)) for p in tree.findall('.//w:p',ns)]
  word='\n'.join(paragraphs)
 exports[stem]={'same':txt.replace('\r\n','\n')==word.replace('\r\n','\n'),'characters':len(txt)}
sample=[0,1,2,3,5,6,10,14,20,27,32,37,49,50,52,len(pdf)-8,len(pdf)-3,len(pdf)-1]
sample=sorted(set(i for i in sample if 0<=i<len(pdf)))
for batch in range(0,len(pdf),12):
 selected=list(range(batch,min(batch+12,len(pdf))))
 sheet=Image.new('RGB',(1000,((len(selected)+3)//4)*375),'#dddddf');draw=ImageDraw.Draw(sheet)
 for n,i in enumerate(selected):
  pix=pdf[i].get_pixmap(matrix=fitz.Matrix(.38,.38),alpha=False)
  im=Image.frombytes('RGB',[pix.width,pix.height],pix.samples)
  x=(n%4)*250;y=(n//4)*375;sheet.paste(im,(x,y+22));draw.text((x+6,y+5),str(i+1),fill='black')
 sheet.save(d/f'pdf-planche-{batch//12+1}.jpg')
for i in sample:pdf[i].get_pixmap(matrix=fitz.Matrix(1.1,1.1),alpha=False).save(d/f'page-{i+1:02}.png')
report={'pages':len(pdf),'tocEntries':len(pdf.get_toc()),'sizeBytes':(d/'BureauClair_Guide_complet_et_audit.pdf').stat().st_size,'issues':issues,'exports':exports,'pageStats':pages}
(d/'verification-pdf.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({k:v for k,v in report.items() if k!='pageStats'},ensure_ascii=True))

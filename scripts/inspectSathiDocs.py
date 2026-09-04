import os
import pypdf

docs_dir = 'c:/Users/Dell/Documents/sathi/sathi docs'
if not os.path.exists(docs_dir):
    docs_dir = 'c:/Users/Dell/Documents/sathi docs'

print(f"Scanning directory: {docs_dir}")
for f in os.listdir(docs_dir):
    fp = os.path.join(docs_dir, f)
    if f.endswith('.pdf'):
        try:
            reader = pypdf.PdfReader(fp)
            pages = len(reader.pages)
            text_sample = ''
            for p in reader.pages[:2]:
                text_sample += p.extract_text() or ''
            first_line = text_sample.strip().split('\n')[0] if text_sample else 'NO_TEXT'
            print(f"PDF: {f} | {pages} pages | Preview: {first_line[:75]}")
        except Exception as e:
            print(f"PDF: {f} | ERROR ({e})")
    elif f.endswith('.md') or f.endswith('.txt'):
        with open(fp, 'r', encoding='utf-8', errors='ignore') as fp_t:
            lines = [l.strip() for l in fp_t.readlines() if l.strip()]
        title = lines[0] if lines else 'EMPTY'
        print(f"TXT/MD: {f} | {len(lines)} lines | Title: {title[:75]}")

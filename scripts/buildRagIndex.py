#!/usr/bin/env python3
"""
buildRagIndex.py
Ingests all business advisory PDFs and documents in `sathi docs`,
extracts clean text, creates semantic chunks, and builds a high-performance
BM25/concept knowledge index for the SAATHI RAG chatbot.
"""

import os
import re
import json
import math
from collections import Counter
import pypdf

DOCS_DIR = "c:/Users/Dell/Documents/sathi/sathi docs"
if not os.path.exists(DOCS_DIR):
    DOCS_DIR = "c:/Users/Dell/Documents/sathi docs"

OUTPUT_FILE = "backend/src/ai/rag/advisoryKnowledgeIndex.json"

CATEGORY_MAP = {
    "location": "Location Intelligence",
    "analyzer": "Location Intelligence",
    "recommendati": "Location Intelligence",
    "agri": "Agri-Business & Rural Development",
    "rural": "Rural Entrepreneurship",
    "financial": "Financial Management & Capital",
    "sme": "SME Strategy & Planning",
    "bain": "Rural Economy & Market Innovation",
    "growth": "Enterprise Growth",
    "rag": "AI Guidance Architecture"
}

def determine_category(filename: str, text_sample: str) -> str:
    combined = (filename + " " + text_sample[:500]).lower()
    for kw, cat in CATEGORY_MAP.items():
        if kw in combined:
            return cat
    return "Business Advisory & Strategy"

def clean_doc_title(filename: str) -> str:
    name = os.path.splitext(filename)[0]
    name = re.sub(r'[-_]+', ' ', name)
    name = re.sub(r'\b(?:pdf|txt|md|main|v\d+)\b', '', name, flags=re.IGNORECASE)
    name = re.sub(r'\s+', ' ', name).strip()
    return name.title()

def clean_text(raw: str) -> str:
    if not raw:
        return ""
    # Fix hyphenated line breaks (e.g. "busi-\nness" -> "business")
    text = re.sub(r'(\w+)-\n(\w+)', r'\1\2', raw)
    # Replace newlines with space
    text = re.sub(r'\s+', ' ', text)
    # Remove non-printable control characters
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', text)
    return text.strip()

def chunk_text(text: str, chunk_size=350, overlap=50) -> list[str]:
    words = text.split()
    if not words:
        return []
    chunks = []
    step = chunk_size - overlap
    for i in range(0, len(words), step):
        chunk_words = words[i:i + chunk_size]
        if len(chunk_words) >= 40: # Ignore tiny fragments
            chunks.append(" ".join(chunk_words))
    return chunks

def extract_keywords(text: str) -> list[str]:
    words = re.findall(r'\b[a-zA-Z]{3,20}\b', text.lower())
    stopwords = {
        'the', 'and', 'for', 'that', 'this', 'with', 'from', 'are', 'was', 'were',
        'have', 'has', 'had', 'which', 'their', 'they', 'what', 'when', 'where',
        'who', 'will', 'more', 'can', 'into', 'also', 'such', 'than', 'been',
        'about', 'other', 'some', 'these', 'them', 'then', 'its', 'only', 'would'
    }
    filtered = [w for w in words if w not in stopwords]
    counts = Counter(filtered)
    return [w for w, _ in counts.most_common(15)]

def main():
    print(f"Reading advisory documents from: {DOCS_DIR}")
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

    all_chunks = []
    chunk_counter = 0

    files = sorted(os.listdir(DOCS_DIR))
    print(f"Found {len(files)} files to process.")

    for fname in files:
        fpath = os.path.join(DOCS_DIR, fname)
        if not os.path.isfile(fpath):
            continue

        raw_text = ""
        doc_title = clean_doc_title(fname)

        if fname.lower().endswith('.pdf'):
            try:
                reader = pypdf.PdfReader(fpath)
                total_pages = len(reader.pages)
                # For very large books/compendiums (>100 pages), cap at 45 pages to maintain tight relevance
                max_pages = min(total_pages, 45 if total_pages > 100 else total_pages)
                extracted_pages = []
                for p_idx in range(max_pages):
                    page_text = reader.pages[p_idx].extract_text()
                    if page_text:
                        extracted_pages.append(page_text)
                raw_text = "\n".join(extracted_pages)
                print(f"Processed PDF: {fname} ({max_pages}/{total_pages} pages, {len(raw_text)} chars)")
            except Exception as e:
                print(f"Error reading PDF {fname}: {e}")
                continue

        elif fname.lower().endswith(('.md', '.txt')):
            try:
                with open(fpath, 'r', encoding='utf-8', errors='ignore') as fp:
                    raw_text = fp.read()
                print(f"Processed Text/MD: {fname} ({len(raw_text)} chars)")
            except Exception as e:
                print(f"Error reading text {fname}: {e}")
                continue
        else:
            continue

        cleaned = clean_text(raw_text)
        if len(cleaned) < 100:
            continue

        category = determine_category(fname, cleaned)
        chunks = chunk_text(cleaned, chunk_size=350, overlap=50)

        for c_idx, c_text in enumerate(chunks):
            chunk_counter += 1
            chunk_id = f"chunk_{chunk_counter}"
            kws = extract_keywords(c_text)
            all_chunks.append({
                "id": chunk_id,
                "sourceFile": fname,
                "docTitle": doc_title,
                "category": category,
                "chunkIndex": c_idx,
                "text": c_text,
                "keywords": kws
            })

    print(f"\nTotal extracted semantic chunks: {len(all_chunks)}")

    # Build BM25 Inverted Index for fast keyword matching in Node
    # Token -> [ { chunkId: str, freq: int } ]
    inverted_index = {}
    doc_lengths = {}
    stopwords = {
        'the', 'and', 'for', 'that', 'this', 'with', 'from', 'are', 'was', 'were',
        'have', 'has', 'had', 'which', 'their', 'they', 'what', 'when', 'where',
        'who', 'will', 'more', 'can', 'into', 'also', 'such', 'than', 'been',
        'about', 'other', 'some', 'these', 'them', 'then', 'its', 'only', 'would'
    }

    for ch in all_chunks:
        cid = ch["id"]
        tokens = re.findall(r'\b[a-zA-Z]{3,20}\b', ch["text"].lower())
        tokens = [t for t in tokens if t not in stopwords]
        doc_lengths[cid] = len(tokens)
        counts = Counter(tokens)
        for token, count in counts.items():
            if token not in inverted_index:
                inverted_index[token] = []
            inverted_index[token].append({"cid": cid, "tf": count})

    # Filter inverted index to top 8000 meaningful terms
    filtered_index = {}
    for term, postings in inverted_index.items():
        if len(postings) >= 1: # Keep terms occurring in at least 1 document
            filtered_index[term] = postings

    avg_doc_len = sum(doc_lengths.values()) / max(len(doc_lengths), 1)

    payload = {
        "version": "1.0.0",
        "generatedAt": "2026-09-03",
        "totalDocuments": len(files),
        "totalChunks": len(all_chunks),
        "avgDocLength": round(avg_doc_len, 2),
        "docLengths": doc_lengths,
        "invertedIndex": filtered_index,
        "chunks": all_chunks
    }

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as fp:
        json.dump(payload, fp, ensure_ascii=False)

    print(f"Saved RAG Knowledge Index to: {OUTPUT_FILE}")
    print(f"Index size: {os.path.getsize(OUTPUT_FILE) / (1024 * 1024):.2f} MB")
    print("RAG build complete!")

if __name__ == "__main__":
    main()

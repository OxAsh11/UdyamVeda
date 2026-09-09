import json
import sys

import pdfplumber


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")

    pdf_path = sys.argv[1]
    pages = []
    with pdfplumber.open(pdf_path) as pdf:
        for number, page in enumerate(pdf.pages, start=1):
            pages.append({"page": number, "text": page.extract_text() or ""})

    if not any(page["text"].strip() for page in pages):
        raise RuntimeError("PDF contains no extractable text")

    print(json.dumps({"pages": pages}, ensure_ascii=False))


if __name__ == "__main__":
    main()

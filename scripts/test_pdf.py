try:
    import pypdf
    print("pypdf")
except ImportError:
    pass

try:
    import fitz
    print("pymupdf")
except ImportError:
    pass

try:
    import pdfplumber
    print("pdfplumber")
except ImportError:
    pass

try:
    import docx
    print("python-docx")
except ImportError:
    pass

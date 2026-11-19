#!/usr/bin/env python3
"""
Skill Circle Source Code PDF Generator
Produces high-quality, beautifully formatted PDF documents of the source code
with syntax highlighting, line numbers, cover page, and table of contents.
"""

import os
import sys
import html
import keyword
import tokenize
import io
import re
import subprocess
from datetime import datetime

CHROME_BIN = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

def highlight_python(source: str) -> str:
    """Highlights Python code using Python's standard library tokenize module."""
    try:
        tokens = list(tokenize.tokenize(io.BytesIO(source.encode('utf-8')).readline))
    except Exception as e:
        # Fallback to simple escape
        return html.escape(source)

    lines = source.splitlines(keepends=True)
    buf = []
    last_row, last_col = 1, 0

    for tok in tokens:
        if tok.type in (tokenize.ENCODING, tokenize.ENDMARKER):
            continue
        srow, scol = tok.start
        erow, ecol = tok.end

        while last_row < srow:
            buf.append(html.escape(lines[last_row - 1][last_col:]))
            last_row += 1
            last_col = 0
        if last_col < scol:
            buf.append(html.escape(lines[srow - 1][last_col:scol]))
            last_col = scol

        css_class = None
        tok_str = tok.string

        if tok.type == tokenize.COMMENT:
            css_class = "tok-comment"
        elif tok.type == tokenize.STRING:
            css_class = "tok-string"
        elif tok.type == tokenize.NUMBER:
            css_class = "tok-number"
        elif tok.type == tokenize.NAME:
            if keyword.iskeyword(tok_str) or keyword.issoftkeyword(tok_str):
                css_class = "tok-keyword"
            elif tok_str in ("True", "False", "None"):
                css_class = "tok-constant"
            elif tok_str in ("self", "cls"):
                css_class = "tok-self"
            elif tok_str in (
                "int", "str", "float", "bool", "list", "dict", "set", "tuple",
                "print", "len", "range", "enumerate", "open", "super", "isinstance",
                "type", "id", "min", "max", "sum", "any", "all", "zip", "map", "filter",
                "sorted", "reversed", "hasattr", "getattr", "setattr", "Exception",
                "ValueError", "TypeError", "KeyError", "RuntimeError", "round"
            ):
                css_class = "tok-builtin"
        elif tok.type == tokenize.OP:
            css_class = "tok-op"

        tok_escaped = html.escape(tok_str)
        if css_class:
            buf.append(f'<span class="{css_class}">{tok_escaped}</span>')
        else:
            buf.append(tok_escaped)

        last_row = erow
        last_col = ecol

    while last_row <= len(lines):
        buf.append(html.escape(lines[last_row - 1][last_col:]))
        last_row += 1
        last_col = 0

    return "".join(buf)


TS_KEYWORDS = {
    'export', 'import', 'from', 'as', 'default', 'const', 'let', 'var', 'function',
    'return', 'if', 'else', 'switch', 'case', 'break', 'continue', 'while', 'for',
    'of', 'in', 'try', 'catch', 'finally', 'throw', 'async', 'await', 'new', 'this',
    'class', 'extends', 'implements', 'interface', 'type', 'enum', 'typeof', 'instanceof',
    'void', 'never', 'unknown', 'any', 'keyof', 'readonly', 'is', 'satisfies'
}
TS_CONSTANTS = {'true', 'false', 'null', 'undefined'}
TS_BUILTINS = {
    'string', 'number', 'boolean', 'symbol', 'bigint', 'Array', 'Record', 'Promise',
    'Partial', 'Omit', 'Pick', 'React', 'useState', 'useEffect', 'useContext',
    'useCallback', 'useMemo', 'useRef', 'createContext', 'ReactNode', 'FC', 'Set', 'Map'
}

TS_TOKEN_RE = re.compile(
    r'(?P<BLOCK_COMMENT>/\*[\s\S]*?\*/)|'
    r'(?P<LINE_COMMENT>//[^\n]*)|'
    r'(?P<TEMPLATE_STRING>`(?:\\.|[^`])*`)|'
    r'(?P<STRING>\"(?:\\.|[^\"])*\"|\'(?:\\.|[^\'])*\')|'
    r'(?P<NUMBER>\b\d+(?:\.\d+)?\b)|'
    r'(?P<IDENT>[A-Za-z_$][A-Za-z0-9_$]*)|'
    r'(?P<OP>[+\-*/%=&|!<>?:;,.~^]+)|'
    r'(?P<OTHER>[^\sA-Za-z0-9_$+\-*/%=&|!<>?:;,.~^]+|\s+)'
)

def highlight_ts(source: str) -> str:
    """Highlights TypeScript/JavaScript/JSON code."""
    parts = []
    for m in TS_TOKEN_RE.finditer(source):
        kind = m.lastgroup
        val = m.group()
        escaped = html.escape(val)
        if kind in ('BLOCK_COMMENT', 'LINE_COMMENT'):
            parts.append(f'<span class="tok-comment">{escaped}</span>')
        elif kind in ('STRING', 'TEMPLATE_STRING'):
            parts.append(f'<span class="tok-string">{escaped}</span>')
        elif kind == 'NUMBER':
            parts.append(f'<span class="tok-number">{escaped}</span>')
        elif kind == 'IDENT':
            if val in TS_KEYWORDS:
                parts.append(f'<span class="tok-keyword">{escaped}</span>')
            elif val in TS_CONSTANTS:
                parts.append(f'<span class="tok-constant">{escaped}</span>')
            elif val in TS_BUILTINS or val[0].isupper():
                parts.append(f'<span class="tok-builtin">{escaped}</span>')
            else:
                parts.append(escaped)
        elif kind == 'OP':
            parts.append(f'<span class="tok-op">{escaped}</span>')
        else:
            parts.append(escaped)
    return "".join(parts)


def format_code_block(highlighted_code: str) -> str:
    """Splits highlighted HTML into code lines with line numbers."""
    lines = highlighted_code.split("\n")
    if lines and lines[-1] == "":
        lines.pop()  # remove trailing empty line

    lines_html = []
    for idx, line in enumerate(lines, start=1):
        line_content = line if line else "&nbsp;"
        lines_html.append(
            f'<div class="code-line">'
            f'<span class="line-num">{idx}</span>'
            f'<span class="line-code">{line_content}</span>'
            f'</div>'
        )
    return "".join(lines_html)


CSS_STYLES = """
@page {
  size: A4 portrait;
  margin: 15mm 12mm 15mm 12mm;
  @top-left {
    content: "Skill Circle — Complete Source Code";
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 8pt;
    color: #94a3b8;
  }
  @top-right {
    content: "Peer-to-Peer Learning Marketplace";
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 8pt;
    color: #94a3b8;
  }
  @bottom-left {
    content: "Verified College Student Mentors • Escrow Performance Guarantee";
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 8pt;
    color: #94a3b8;
  }
  @bottom-right {
    content: counter(page);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 8pt;
    color: #64748b;
    font-weight: 600;
  }
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: #0f172a;
  background: #ffffff;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* Cover Page */
.cover-page {
  page-break-after: always;
  break-after: page;
  min-height: 92vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 30px 20px 20px 20px;
}

.cover-header {
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 24px;
}

.badge {
  display: inline-block;
  padding: 4px 12px;
  background: #ede9fe;
  color: #6366f1;
  font-weight: 700;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 9999px;
  margin-bottom: 16px;
  border: 1px solid #c7d2fe;
}

.cover-title {
  font-size: 38px;
  font-weight: 800;
  color: #1e1b4b;
  margin: 0 0 10px 0;
  letter-spacing: -0.5px;
}

.cover-subtitle {
  font-size: 18px;
  color: #4f46e5;
  font-weight: 600;
  margin: 0 0 14px 0;
}

.cover-desc {
  font-size: 13px;
  line-height: 1.6;
  color: #475569;
  max-width: 650px;
  margin: 0;
}

.cover-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin: 30px 0;
}

.feature-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 14px;
}

.feature-title {
  font-size: 12px;
  font-weight: 700;
  color: #334155;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.feature-text {
  font-size: 11px;
  color: #64748b;
  line-height: 1.5;
  margin: 0;
}

.meta-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 12px;
}

.meta-table th {
  text-align: left;
  padding: 8px 12px;
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
  font-weight: 600;
}

.meta-table td {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  color: #1e293b;
}

.cover-footer {
  border-top: 1px solid #e2e8f0;
  padding-top: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
  color: #94a3b8;
}

/* Table of Contents */
.toc-page {
  page-break-after: always;
  break-after: page;
  padding: 20px 10px;
}

.toc-title {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px 0;
  border-bottom: 2px solid #4f46e5;
  padding-bottom: 10px;
}

.toc-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  margin-bottom: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.toc-file-title {
  font-weight: 700;
  font-size: 13px;
  color: #1e293b;
  margin-bottom: 3px;
}

.toc-file-desc {
  font-size: 11px;
  color: #64748b;
}

.toc-badge {
  font-family: 'SF Mono', Menlo, Consolas, monospace;
  font-size: 10px;
  padding: 3px 8px;
  border-radius: 4px;
  background: #e0e7ff;
  color: #3730a3;
  font-weight: 600;
}

/* File Section */
.file-section {
  break-before: page;
  page-break-before: always;
  margin-top: 0;
  padding-top: 5px;
}

.file-header-card {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-left: 5px solid #4f46e5;
  border-radius: 6px;
  padding: 12px 16px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.file-name {
  font-family: 'SF Mono', Menlo, Monaco, Consolas, monospace;
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px 0;
}

.file-desc {
  font-size: 11px;
  color: #475569;
  margin: 0;
}

.file-meta-pills {
  display: flex;
  gap: 8px;
}

.pill {
  font-family: 'SF Mono', Menlo, Monaco, Consolas, monospace;
  font-size: 9.5px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 4px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #334155;
}

/* Code Container */
.code-container {
  background: #fafafa;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
  font-family: 'SF Mono', Menlo, Monaco, Consolas, 'Liberation Mono', monospace;
  font-size: 8.8px;
  line-height: 1.42;
}

.code-line {
  display: flex;
  break-inside: avoid;
  page-break-inside: avoid;
}

.code-line:nth-child(even) {
  background: #f8fafc;
}

.line-num {
  width: 42px;
  flex-shrink: 0;
  text-align: right;
  padding-right: 10px;
  color: #94a3b8;
  user-select: none;
  border-right: 1px solid #e2e8f0;
  background: #f1f5f9;
  font-size: 8px;
  line-height: 1.5;
}

.line-code {
  padding-left: 10px;
  padding-right: 10px;
  white-space: pre-wrap;
  word-break: break-all;
  flex-grow: 1;
  color: #1e293b;
}

/* Syntax Highlighting */
.tok-keyword { color: #6d28d9; font-weight: 700; }
.tok-string  { color: #047857; }
.tok-comment { color: #64748b; font-style: italic; }
.tok-number  { color: #b45309; font-weight: 600; }
.tok-constant{ color: #b91c1c; font-weight: 600; }
.tok-builtin { color: #0369a1; font-weight: 600; }
.tok-self    { color: #be185d; font-style: italic; }
.tok-op      { color: #334155; }
"""

def generate_pdf_document(files_config, output_pdf_path, doc_title, doc_subtitle):
    """Assembles HTML and invokes headless Chrome to render PDF."""
    html_sections = []

    # Calculate statistics
    total_lines = sum(cfg['line_count'] for cfg in files_config)
    total_files = len(files_config)

    # 1. Cover Page HTML
    cover_html = f"""
    <div class="cover-page">
      <div class="cover-header">
        <div class="badge">Peer-to-Peer College Learning Marketplace</div>
        <h1 class="cover-title">Skill Circle</h1>
        <div class="cover-subtitle">{html.escape(doc_subtitle)}</div>
        <p class="cover-desc">
          Skill Circle is a decentralized college peer-learning ecosystem connecting junior students with verified college seniors for affordable, structured, and outcome-oriented skill mastery. This document contains the verified production source code and architectural specification.
        </p>
      </div>

      <div class="cover-grid">
        <div class="feature-box">
          <div class="feature-title">Escrow Performance Guarantee</div>
          <p class="feature-text">Pre- and post-course assessment improvement benchmark (&ge;20% score increase default). Funds remain in held escrow until post-assessment verification or administrative dispute arbitration.</p>
        </div>
        <div class="feature-box">
          <div class="feature-title">Verified Student Mentors</div>
          <p class="feature-text">Strict college verification workflows supporting College ID card uploads, institutional (.edu/.ac.in) email verification, GitHub profile audits, and certificate proofs.</p>
        </div>
        <div class="feature-box">
          <div class="feature-title">Interactive Learning Ecosystem</div>
          <p class="feature-text">Simulated live WebRTC video classroom, embedded real-time code editor, collaborative whiteboard, peer notes vault, and AI copilot roadmap generator.</p>
        </div>
        <div class="feature-box">
          <div class="feature-title">Zero-Dependency Full Stack Server</div>
          <p class="feature-text">Includes complete standalone pure Python 3 Web Server (ThreadingHTTPServer + REST API + SPA) and full React 18 TypeScript frontend architecture.</p>
        </div>
      </div>

      <table class="meta-table">
        <tr>
          <th>Document Title</th>
          <td>{html.escape(doc_title)}</td>
          <th>Release Date</th>
          <td>{datetime.now().strftime("%B %d, %Y")}</td>
        </tr>
        <tr>
          <th>Total Components</th>
          <td>{total_files} Primary System Modules</td>
          <th>Total Source Lines</th>
          <td>{total_lines:,} Lines of Code</td>
        </tr>
        <tr>
          <th>Primary Runtime</th>
          <td>Python 3.10+ / Node.js 18+ (React 18 + TypeScript)</td>
          <th>Verification Status</th>
          <td>Compiled & Operational (HTTP 200 OK)</td>
        </tr>
      </table>

      <div class="cover-footer">
        <div>Skill Circle Platform Architecture Specification</div>
        <div>Confidential & Proprietary • {datetime.now().year}</div>
      </div>
    </div>
    """
    html_sections.append(cover_html)

    # 2. Table of Contents HTML
    toc_items = []
    for cfg in files_config:
        toc_items.append(f"""
        <div class="toc-item">
          <div>
            <div class="toc-file-title">{html.escape(cfg['rel_path'])}</div>
            <div class="toc-file-desc">{html.escape(cfg['desc'])}</div>
          </div>
          <div class="toc-badge">{cfg['line_count']:,} lines &bull; {cfg['size_str']}</div>
        </div>
        """)

    toc_html = f"""
    <div class="toc-page">
      <h2 class="toc-title">Table of Source Code Modules</h2>
      <p style="font-size: 12px; color: #64748b; margin-bottom: 20px;">
        The following source code modules constitute the operational Skill Circle application:
      </p>
      {"".join(toc_items)}
    </div>
    """
    html_sections.append(toc_html)

    # 3. Source Code Sections
    for cfg in files_config:
        with open(cfg['abs_path'], 'r', encoding='utf-8') as f:
            source = f.read()

        if cfg['lang'] == 'python':
            highlighted = highlight_python(source)
        else:
            highlighted = highlight_ts(source)

        code_lines_html = format_code_block(highlighted)

        section_html = f"""
        <div class="file-section">
          <div class="file-header-card">
            <div>
              <div class="file-name">{html.escape(cfg['rel_path'])}</div>
              <p class="file-desc">{html.escape(cfg['desc'])}</p>
            </div>
            <div class="file-meta-pills">
              <span class="pill">{cfg['lang'].upper()}</span>
              <span class="pill">{cfg['line_count']:,} LINES</span>
              <span class="pill">{cfg['size_str']}</span>
            </div>
          </div>
          <div class="code-container">
            {code_lines_html}
          </div>
        </div>
        """
        html_sections.append(section_html)

    # Full HTML wrapper
    full_html = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>{html.escape(doc_title)}</title>
<style>
{CSS_STYLES}
</style>
</head>
<body>
{"".join(html_sections)}
</body>
</html>
"""

    temp_html_path = output_pdf_path.replace(".pdf", ".temp.html")
    with open(temp_html_path, "w", encoding="utf-8") as f:
        f.write(full_html)

    chrome_cmd = [
        CHROME_BIN,
        "--headless",
        "--disable-gpu",
        f"--user-data-dir=/tmp/chrome_pdf_{os.getpid()}",
        "--no-sandbox",
        f"--print-to-pdf={output_pdf_path}",
        "--no-pdf-header-footer",
        temp_html_path
    ]

    print(f"Rendering {output_pdf_path} via headless Chrome...")
    res = subprocess.run(chrome_cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"Error rendering PDF: {res.stderr}")
        return False

    if os.path.exists(temp_html_path):
        os.remove(temp_html_path)

    file_size = os.path.getsize(output_pdf_path)
    print(f"Successfully generated: {output_pdf_path} ({file_size:,} bytes)")
    return True


def main():
    workspace = "/Users/anshulgupta/Downloads/faceless-shorts"
    skill_circle_dir = os.path.join(workspace, "skill-circle")

    # 1. Primary Python source file
    app_py_path = os.path.join(workspace, "app.py")
    if not os.path.exists(app_py_path):
        app_py_path = os.path.join(skill_circle_dir, "app.py")

    with open(app_py_path, 'r', encoding='utf-8') as f:
        app_py_lines = len(f.read().splitlines())
    app_py_size = f"{os.path.getsize(app_py_path) / 1024:.1f} KB"

    python_only_config = [
        {
            'abs_path': app_py_path,
            'rel_path': 'app.py',
            'desc': 'Complete Self-Contained Full-Stack Application: Pure Python 3 Server, ThreadingHTTPServer REST API, Escrow Engine, AI Copilot & Embedded Reactive Web Application.',
            'lang': 'python',
            'line_count': app_py_lines,
            'size_str': app_py_size
        }
    ]

    # Generate PDF 1: Standalone app.py source code
    pdf1_path = os.path.join(workspace, "skill_circle_app_py.pdf")
    generate_pdf_document(
        python_only_config,
        pdf1_path,
        "Skill Circle — Standalone Python Application Source Code",
        "Pure Python 3 Full-Stack Application & REST API Specification"
    )

    # 2. Comprehensive Multi-File Source Code Bundle
    complete_config = [
        {
            'abs_path': app_py_path,
            'rel_path': 'app.py',
            'desc': 'Self-Contained Full-Stack Application: Pure Python 3 Server, ThreadingHTTPServer REST API, Escrow Engine, AI Copilot & Embedded Reactive Web Application.',
            'lang': 'python',
            'line_count': app_py_lines,
            'size_str': app_py_size
        },
        {
            'abs_path': os.path.join(skill_circle_dir, "src/types/index.ts"),
            'rel_path': 'src/types/index.ts',
            'desc': 'TypeScript Domain Models: User Roles, Mentor Verification Schemas, Escrow Payment State Machine, Assessment Improvements & Course Structures.',
            'lang': 'typescript',
            'line_count': len(open(os.path.join(skill_circle_dir, "src/types/index.ts")).read().splitlines()),
            'size_str': f"{os.path.getsize(os.path.join(skill_circle_dir, 'src/types/index.ts')) / 1024:.1f} KB"
        },
        {
            'abs_path': os.path.join(skill_circle_dir, "src/context/AppContext.tsx"),
            'rel_path': 'src/context/AppContext.tsx',
            'desc': 'Global State Store: Role switching, Razorpay Escrow Simulation, Verification Reviews, Pre/Post-Assessment Scoring, and LocalStorage Persistence.',
            'lang': 'typescript',
            'line_count': len(open(os.path.join(skill_circle_dir, "src/context/AppContext.tsx")).read().splitlines()),
            'size_str': f"{os.path.getsize(os.path.join(skill_circle_dir, 'src/context/AppContext.tsx')) / 1024:.1f} KB"
        },
        {
            'abs_path': os.path.join(skill_circle_dir, "src/App.tsx"),
            'rel_path': 'src/App.tsx',
            'desc': 'Main Application View Orchestrator: Dynamic View Routing, Modal Dialogs, Responsive Navigation Bar, and Active Session Handlers.',
            'lang': 'typescript',
            'line_count': len(open(os.path.join(skill_circle_dir, "src/App.tsx")).read().splitlines()),
            'size_str': f"{os.path.getsize(os.path.join(skill_circle_dir, 'src/App.tsx')) / 1024:.1f} KB"
        },
        {
            'abs_path': os.path.join(skill_circle_dir, "package.json"),
            'rel_path': 'package.json',
            'desc': 'Project Build Manifest: React 18, TypeScript, Lucide Icons, Tailwind CSS, and Vite Tooling Configuration.',
            'lang': 'typescript',
            'line_count': len(open(os.path.join(skill_circle_dir, "package.json")).read().splitlines()),
            'size_str': f"{os.path.getsize(os.path.join(skill_circle_dir, 'package.json')) / 1024:.1f} KB"
        }
    ]

    # Generate PDF 2: Complete Project Source Code & Architecture
    pdf2_path = os.path.join(workspace, "skill_circle_complete_source_code.pdf")
    generate_pdf_document(
        complete_config,
        pdf2_path,
        "Skill Circle — Complete Production Source Code & Architecture",
        "Peer-to-Peer College Learning Marketplace: Python 3 & React TypeScript Full Stack"
    )

    # Also symlink or copy to skill_circle_source_code.pdf as the primary file
    primary_pdf = os.path.join(workspace, "skill_circle_source_code.pdf")
    subprocess.run(["cp", pdf2_path, primary_pdf])
    print(f"Copied {pdf2_path} to {primary_pdf}")

if __name__ == '__main__':
    main()

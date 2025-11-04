/*
  QR-only access:
  - Each document has a fixed secret token.
  - A valid URL must include ?doc=<key>&k=<token>.
  - If token is missing/invalid, the page shows an error and hides the PDF.

  You already printed QR codes: ensure they use the URLs below exactly.
  If you want to (re)print, encode each full URL into a QR.
*/

const DOCS = {
  registration: {
    file: 'docs/registration_document.pdf',
    dept: 'Registration',
    token: 'r9d-7p2x'  // <-- keep as-is or change & reprint QR
  },
  admission: {
    file: 'docs/addmision_document.pdf', // exact filename you provided
    dept: 'Admission',
    token: 'a4q-z1km'
  },
  finance: {
    file: 'docs/finance_document.pdf',
    dept: 'Finance',
    token: 'f3n-h8vv'
  }
};

// Build a short readable ID like REG-2K9F-6H3Q
function makeId(prefix) {
  const rand = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g,'').slice(2,10);
  return `${prefix}-${rand.slice(0,4)}-${rand.slice(4,8)}`;
}

function qp(name){ return new URLSearchParams(window.location.search).get(name); }

document.addEventListener('DOMContentLoaded', () => {
  const key = (qp('doc') || '').toLowerCase();
  const token = qp('k') || '';
  const item = DOCS[key];

  const titleEl = document.getElementById('docTitle');
  const msgEl = document.getElementById('authMsg');
  const frameEl = document.getElementById('pdfFrame');
  const dlEl = document.getElementById('downloadWrap');
  const errEl = document.getElementById('errorBox');
  const pillEl = document.getElementById('deptPill');

  // Invalid doc
  if(!item){
    titleEl.textContent = 'Document not found';
    document.getElementById('viewerWrap').style.display = 'none';
    errEl.style.display = 'block';
    errEl.textContent = 'Invalid link. Please scan a valid QR code.';
    pillEl.textContent = 'Unknown Department';
    return;
  }

  // Token check (QR-only)
  if(token !== item.token){
    titleEl.textContent = `${item.dept} Document`;
    document.getElementById('viewerWrap').style.display = 'none';
    errEl.style.display = 'block';
    errEl.textContent = 'Invalid or expired QR link. Please scan the official QR code for this document.';
    pillEl.textContent = item.dept;
    return;
  }

  // OK: render
  pillEl.textContent = item.dept;
  titleEl.textContent = `${item.dept} Document`;

  const prefix = item.dept.toUpperCase().slice(0,3); // REG/ADM/FIN
  const id = makeId(prefix);

  msgEl.textContent = `This document was authorized by the department of ${item.dept} ID number: ${id}`;

  frameEl.src = item.file;

  // Optional: download button
  const a = document.createElement('a');
  a.href = item.file;
  a.download = '';
  a.className = 'button';
  a.textContent = 'Download PDF';
  dlEl.appendChild(a);
});

/*
  Example QR URLs to encode (use your Live Server or deployed base):
    http://127.0.0.1:5500/view.html?doc=registration&k=r9d-7p2x
    http://127.0.0.1:5500/view.html?doc=admission&k=a4q-z1km
    http://127.0.0.1:5500/view.html?doc=finance&k=f3n-h8vv
  IMPORTANT: Replace the base with your actual served domain/host before printing.
*/

let mermaidInitialized = false;

function collectMermaidContainers() {
  const created = [];

  // Case 1: superfences outputs <pre class="mermaid"><code>...</code></pre>
  document.querySelectorAll('pre.mermaid').forEach((pre, idx) => {
    const code = pre.querySelector('code');
    const text = code ? code.textContent : pre.textContent;
    if (!text) return;

    const div = document.createElement('div');
    div.className = 'mermaid';
    div.id = `mermaid-pre-${idx}-${Date.now()}`;
    div.textContent = text;
    div.dataset.mermaidRendered = '0';

    pre.replaceWith(div);
    created.push(div);
  });

  // Case 2: regular fenced code outputs <pre><code class="language-mermaid">...</code></pre>
  document.querySelectorAll('pre code.language-mermaid').forEach((code, idx) => {
    const pre = code.parentElement;
    if (!pre) return;

    const div = document.createElement('div');
    div.className = 'mermaid';
    div.id = `mermaid-code-${idx}-${Date.now()}`;
    div.textContent = code.textContent || '';
    div.dataset.mermaidRendered = '0';

    pre.replaceWith(div);
    created.push(div);
  });

  // Already-converted containers that still need rendering
  document
    .querySelectorAll('.mermaid:not([data-mermaid-rendered="1"])')
    .forEach((el) => {
      if (!el.dataset.mermaidRendered) el.dataset.mermaidRendered = '0';
      created.push(el);
    });

  // Deduplicate
  return Array.from(new Set(created));
}

async function renderMermaid() {
  if (!window.mermaid) return;

  if (!mermaidInitialized) {
    window.mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose',
      theme: 'default'
    });
    mermaidInitialized = true;
  }

  const targets = collectMermaidContainers().filter(
    (el) => el.dataset.mermaidRendered === '0'
  );
  if (targets.length === 0) return;

  try {
    await window.mermaid.run({ nodes: targets });
    targets.forEach((el) => {
      el.dataset.mermaidRendered = '1';
    });
  } catch (err) {
    console.error('Mermaid render failed:', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  void renderMermaid();
});

if (window.document$) {
  window.document$.subscribe(() => {
    void renderMermaid();
  });
}

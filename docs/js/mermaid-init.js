let mermaidInitialized = false;

async function renderMermaid() {
  if (!window.mermaid) return;

  const blocks = document.querySelectorAll('pre code.language-mermaid');
  blocks.forEach((code, idx) => {
    const pre = code.parentElement;
    if (!pre) return;

    const container = document.createElement('div');
    container.className = 'mermaid';
    container.id = `mermaid-${idx}-${Date.now()}`;
    container.textContent = code.textContent || '';
    container.dataset.mermaidRendered = '0';

    pre.replaceWith(container);
  });

  if (!mermaidInitialized) {
    window.mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose',
      theme: 'default'
    });
    mermaidInitialized = true;
  }

  const targets = Array.from(
    document.querySelectorAll('.mermaid[data-mermaid-rendered="0"]')
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

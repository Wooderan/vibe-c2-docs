function renderMermaid() {
  if (!window.mermaid) return;

  const blocks = document.querySelectorAll('pre code.language-mermaid');
  blocks.forEach((code, idx) => {
    const pre = code.parentElement;
    if (!pre || pre.dataset.mermaidProcessed === '1') return;

    const container = document.createElement('div');
    container.className = 'mermaid';
    container.id = `mermaid-${idx}-${Date.now()}`;
    container.textContent = code.textContent || '';

    pre.replaceWith(container);
  });

  window.mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    theme: 'default'
  });

  window.mermaid.run({ querySelector: '.mermaid' });
}

document.addEventListener('DOMContentLoaded', renderMermaid);
if (window.document$) {
  window.document$.subscribe(renderMermaid);
}

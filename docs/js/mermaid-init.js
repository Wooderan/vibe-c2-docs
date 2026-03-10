window.mermaidConfig = {
  startOnLoad: true,
  securityLevel: 'loose',
  theme: 'default'
};

if (window.mermaid) {
  window.mermaid.initialize(window.mermaidConfig);
}

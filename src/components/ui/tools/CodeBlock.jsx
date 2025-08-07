
import { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';


export default function CodeBlock({ language = '', code = '' }) {
  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  return (
    <pre className="rounded-xl p-4 bg-[#1e1e1e] overflow-auto text-sm leading-relaxed">
      <code className={`language-${language}`}>
        {code.trim()}
      </code>
    </pre>
  );
}

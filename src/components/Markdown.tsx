import { marked } from "marked";
import DOMPurify from "dompurify";
export default function MarkdownRenderer({ body }: { body: string }) {
  const html = marked.parse(body, { async: false }) as string;
  let index = 0;
  const indexed = html.replace(/<h2>/g, () => `<h2 id="section-${index++}">`);
  return (
    <div
      className="prose"
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(indexed) }}
    />
  );
}

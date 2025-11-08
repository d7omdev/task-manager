import { marked } from 'marked';

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

export function markdownToHtml(markdown: string): string {
  if (!markdown.trim()) {
    return '';
  }

  return marked.parse(markdown, { breaks: true, gfm: true }) as string;
}

export function ensureHtmlContent(input: string): string {
  if (!input?.trim()) {
    return '';
  }

  const maybeHtml = input.trim();
  if (/</.test(maybeHtml) && />/.test(maybeHtml)) {
    return maybeHtml;
  }

  const escaped = maybeHtml
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return `<p>${escaped}</p>`;
}

export function htmlToPlainText(html: string): string {
  if (!html?.trim()) {
    return '';
  }

  let output = html;

  output = output.replace(/<\/?(h1|h2|h3|p|div)[^>]*>/gi, '\n');
  output = output.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, content) => `\n• ${content}`);
  output = output.replace(/<br\s*\/?>(?=\s*<)/gi, '\n');
  output = output.replace(/<br\s*\/?>(?!\n)/gi, '\n');
  output = output.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, content) => `\n> ${content}\n`);
  output = output.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (_, content) => `\n${content}\n`);
  output = output.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_, content) => content);
  output = output.replace(/<[^>]+>/g, '');
  output = output.replace(/\n{3,}/g, '\n\n');

  return decodeHtmlEntities(output).trim();
}

export function htmlToMarkdown(html: string): string {
  if (!html?.trim()) {
    return '';
  }

  let markdown = html;

  markdown = markdown.replace(/<\/?strong>/gi, '**');
  markdown = markdown.replace(/<\/?b>/gi, '**');
  markdown = markdown.replace(/<\/?em>/gi, '_');
  markdown = markdown.replace(/<\/?i>/gi, '_');
  markdown = markdown.replace(/<\/?u>/gi, '');
  markdown = markdown.replace(/<\/?strike>/gi, '~~');
  markdown = markdown.replace(/<\/?s>/gi, '~~');
  markdown = markdown.replace(/<\/?del>/gi, '~~');
  markdown = markdown.replace(/<br\s*\/?>(?=\s*<)/gi, '\n');
  markdown = markdown.replace(/<br\s*\/?>(?!\n)/gi, '\n');

  markdown = markdown.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (_, content) => {
    const inner = decodeHtmlEntities(content).trim();
    return `\n\n\u0060\u0060\u0060\n${inner}\n\u0060\u0060\u0060\n\n`;
  });

  markdown = markdown.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_, content) => {
    const inner = decodeHtmlEntities(content).trim();
    return `\u0060${inner}\u0060`;
  });

  markdown = markdown.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, content) => {
    const inner = htmlToMarkdown(content)
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => `> ${line}`)
      .join('\n');
    return `\n${inner}\n`;
  });

  markdown = markdown.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, content) => {
    const items = content.match(/<li[^>]*>[\s\S]*?<\/li>/gi);
    if (!items) {
      return '';
    }
    return `\n${items
      .map((item) => {
        const text = htmlToMarkdown(item.replace(/<\/?li[^>]*>/gi, ''));
        return `- ${text.trim()}`;
      })
      .join('\n')}\n`;
  });

  markdown = markdown.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, content) => {
    const items = content.match(/<li[^>]*>[\s\S]*?<\/li>/gi);
    if (!items) {
      return '';
    }
    return `\n${items
      .map((item, index) => {
        const text = htmlToMarkdown(item.replace(/<\/?li[^>]*>/gi, ''));
        return `${index + 1}. ${text.trim()}`;
      })
      .join('\n')}\n`;
  });

  markdown = markdown.replace(/<h([1-3])[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level, content) => {
    const prefix = '#'.repeat(Number(level));
    const inner = htmlToMarkdown(content).trim();
    return `\n${prefix} ${inner}\n`;
  });

  markdown = markdown.replace(/<\/?p[^>]*>/gi, '\n');
  markdown = markdown.replace(/<\/?div[^>]*>/gi, '\n');

  markdown = markdown.replace(/<[^>]+>/g, '');
  markdown = decodeHtmlEntities(markdown);
  markdown = markdown.replace(/\n{3,}/g, '\n\n');

  return markdown.trim();
}

export function truncatePlainText(text: string, maxLength = 160): string {
  if (!text) {
    return '';
  }

  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  return `${cleaned.slice(0, maxLength - 1)}…`;
}

export function normalizeRichTextHtmlForRender(html: string): string {
  if (!html?.trim()) {
    return '';
  }

  let output = html;

  output = output.replace(
    /<strike\b[^>]*>([\s\S]*?)<\/strike>/gi,
    (_match, content = '') => `<del>${content}</del>`,
  );

  output = output.replace(
    /<span\b([^>]*?)style="([^"]*?text-decoration\s*:\s*line-through[^"]*?)"([^>]*)>([\s\S]*?)<\/span>/gi,
    (_match, before = '', style = '', after = '', content = '') => {
      const filteredStyle = style
        .split(';')
        .map((part: string) => part.trim())
        .filter((part: string) => part && !/^text-decoration\s*:\s*line-through/i)
        .join('; ');

      const styleAttr = filteredStyle ? ` style="${filteredStyle}"` : '';
      return `<span${before}${styleAttr}${after}><del>${content}</del></span>`;
    },
  );

  return output;
}



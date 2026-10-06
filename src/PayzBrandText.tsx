import type { ReactNode } from 'react';

const payzWord = /^(Payz|payZ|payz)$/;

export default function PayzBrandText({ text }: { text: string }) {
  const parts = text.split(/\b(Payz|payZ|payz)\b/g);
  return parts.map((part, index): ReactNode =>
    payzWord.test(part)
      ? <strong className="payz-brand-word" key={index}>payz</strong>
      : part,
  );
}

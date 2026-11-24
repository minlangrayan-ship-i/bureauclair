import { useEffect, useState } from "react";
import type { InputHTMLAttributes } from "react";

type Props = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
> & { value: string; onQuery: (value: string) => void };

/** Keep keystrokes synchronous; update shareable URL criteria after a short pause. */
export default function QueryInput({ value, onQuery, ...props }: Props) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  useEffect(() => {
    if (draft === value) return;
    const timer = setTimeout(() => onQuery(draft), 180);
    return () => clearTimeout(timer);
  }, [draft, value, onQuery]);
  return (
    <input
      {...props}
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
    />
  );
}

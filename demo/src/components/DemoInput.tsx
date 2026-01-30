import type { InputHTMLAttributes } from 'react';

export function DemoInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className="demo-input-styled" {...props} />;
}

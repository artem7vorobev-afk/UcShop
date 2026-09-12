'use client';

import { useState } from 'react';
import { Gamepad2 } from 'lucide-react';

interface ServiceIconProps {
  slug: string;
  name: string;
  color?: string;
}

export function ServiceIcon({ slug, name, color }: ServiceIconProps) {
  const [error, setError] = useState(false);

  if (error) {
    return <Gamepad2 className="h-6 w-6 text-foreground/80" strokeWidth={1.8} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://cdn.simpleicons.org/${slug}${color ? `/${color}` : ''}`}
      alt={name}
      className="h-6 w-6 object-contain"
      loading="lazy"
      onError={() => setError(true)}
    />
  );
}

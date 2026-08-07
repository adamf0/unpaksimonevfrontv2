'use client';

import React from 'react';

export default function Icon({
  name = "",
  className = "",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { name?: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined leading-none ${className}`}
      {...props}
    >
      {name}
    </span>
  );
}
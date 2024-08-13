import React, { useState } from 'react';

export function DropdownMenu({ children }) {
  return <div className="relative">{children}</div>;
}

export function DropdownMenuTrigger({ children, asChild }) {
  return React.cloneElement(children, {
    className: `${children.props.className} cursor-pointer`,
  });
}

export function DropdownMenuContent({ children, align = 'center', isOpen }) {
  return (
    <div
      className={`absolute shadow-lg rounded mt-2 p-2 ${
        align === 'end' ? 'right-0' : 'left-0'
      } ${isOpen ? 'block' : 'hidden'}`}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({ children, onClick }) {
  return (
    <div className="px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={onClick}>
      {children}
    </div>
  );
}

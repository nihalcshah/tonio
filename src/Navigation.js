import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navigation() {
  return <header className="app-header">
    <NavLink to="/" className="brand" aria-label="Tone.io home"><img src="/tonio.png" alt="" />Tone.io</NavLink>
    <nav aria-label="Main navigation">
      <NavLink to="/customize">Color studio</NavLink>
      <NavLink to="/recolor">Photo recolor</NavLink>
    </nav>
  </header>;
}

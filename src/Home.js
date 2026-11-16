import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';

export default function Home() {
  return <><Navigation /><main className="home-content">
    <div className="home-intro"><h1>A color worth<br />building around.</h1>
      <p>Find a shade, make it your own, and take it into your next project.</p>
    </div>
    <div className="tool-grid">
      <Link to="/customize" className="tool-link">
        <div className="swatch-art" aria-hidden="true"><div style={{ background: '#a3b899' }} /><div style={{ background: '#d5a66c' }} /><div style={{ background: '#687fa5' }} /></div>
        <h2>Color studio</h2><p>Explore shades, check text contrast, and download a color card. Save a link to pick up where you left off.</p><span className="tool-action">Create a swatch</span>
      </Link>
      <Link to="/recolor" className="tool-link">
        <div className="recolor-art" aria-hidden="true"><div /><div /></div>
        <h2>Photo recolor</h2><p>Try a new color on a wall, chair, or other surface in your photo. Compare the result and save a PNG.</p><span className="tool-action">Try a photo</span>
      </Link>
    </div>
    <p className="privacy-note">No account needed. Photos are processed in your browser and never uploaded.</p>
    <Link className="text-sm underline text-stone-600" to="/agents">Image API guide</Link>
  </main></>;
}

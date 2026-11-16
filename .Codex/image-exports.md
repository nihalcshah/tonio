# Image export maintenance

Keep the shared renderer in an ES module `.js` file. This Create React App build treats imported `.cjs` files as media URLs, which passes compilation but breaks browser calls. Validate the production build in a real browser and check rendered text pixels, dimensions, and repeated data URLs before deploying image changes.

When concurrent chats edit the same UI files, isolate before copying implementation files; verify exported interfaces in the isolated snapshot before testing.

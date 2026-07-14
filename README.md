# Tone.io by CJ Shah
## A Tone-matching and tone finder system built with React ([tone.cjshah.org](tone.cjshah.org))

### Now with Netlify Python Serverless Functions!
<img width="952" alt="image" src="https://github.com/user-attachments/assets/77533f7b-31a2-4439-9838-2cb995410518">

### Find Randomized Colors (Updated Daily)
<div style="display:flex;">
<img width="500" alt="image" src="https://github.com/user-attachments/assets/27b9c2b0-cd93-4da9-96ef-8a85cb71049c">

<div>Color Selection: You can choose from a variety of colors like *Dove Gray*, *Ebony Clay*, *Screamin’ Green*, and more.</div>
</div>
<br/>
<hr/>
<img t width="500" alt="image" src="https://github.com/user-attachments/assets/9fc7fd90-d123-4f74-8b25-7734e29ea9af">

## Serverless Functions

This project now includes Python serverless functions that run on Netlify:

- Visit `/serverless` in the application to test the serverless functionality
- The demo function is available at `/api/hello` and accepts an optional `name` parameter

### Local Development with Serverless Functions

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Start the development server with Netlify functions
netlify dev
```

### Serverless Function Structure

- `/netlify/functions` - Contains all Python serverless functions
- `netlify.toml` - Configures Netlify build settings and API redirects

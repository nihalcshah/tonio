# Netlify Python Serverless Functions

This directory contains Python serverless functions that can be deployed to Netlify.

## Current Functions

### `hello.py`

A simple example function that returns a greeting message.

- **Endpoint**: `/api/hello`
- **Parameters**: `name` (optional) - Personalize the greeting
- **Example**: `/api/hello?name=John`

## Local Development

To test these functions locally, you'll need the Netlify CLI:

```bash
npm install -g netlify-cli
```

Then run the development server:

```bash
netlify dev
```

This will start both your React application and the serverless functions.

## Deployment

When you deploy to Netlify, the functions will be automatically deployed. Make sure your `netlify.toml` file is configured correctly:

```toml
[build]
  command = "npm run build"
  publish = "build"
  functions = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

## Adding New Functions

To add a new Python function:

1. Create a new `.py` file in this directory
2. Implement the `handler(event, context)` function
3. Return a response object with the required structure
4. Add any Python dependencies to `requirements.txt`

## Accessing from Frontend

You can access the functions from your React components using the `/api/` prefix:

```javascript
const response = await fetch('/api/hello?name=World');
const data = await response.json();
```

See the `ServerlessDemo.js` component for a complete example.
import json

# Netlify function handler
def handler(event, context):
    """This is the main function that Netlify will call when the endpoint is accessed."""
    # This is the function Netlify will call
    # Get request parameters if any
    try:
        params = event.get('queryStringParameters') or {}
        name = params.get('name', 'World')
    except (AttributeError, TypeError):
        name = 'World'
    
    # Create response
    response = {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
        },
        "body": json.dumps({
            "message": f"Hello, {name}! This is a response from a Python serverless function.",
            "timestamp": __import__('datetime').datetime.now().isoformat()
        })
    }
    
    return response

# This is required for Netlify to properly identify the handler function
lambda_handler = handler
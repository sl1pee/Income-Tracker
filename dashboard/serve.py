# serve.py

import http.server
import socketserver
import os

# Define the directory name you want to serve (change if your directory name is different)
DIRECTORY = "dashboard"

# Get the absolute path of the current directory
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))

# Change directory to serve
os.chdir(os.path.join(CURRENT_DIR, DIRECTORY))

# Set up the HTTP server to serve the current directory
Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", 8000), Handler) as httpd:
    print("Serving at http://localhost:8000/")
    httpd.serve_forever()

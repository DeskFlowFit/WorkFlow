from flask import Flask
import os

app = Flask(__name__)

@app.route('/')
def index():
    html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>WorkFlow</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial; }
            iframe { width: 100vw; height: 100vh; border: none; }
        </style>
    </head>
    <body>
        <iframe src="https://ai.studio/apps/drive/1uoOUa92s8yhqOVDnZUr-2o2C8RFwidz7"></iframe>
    </body>
    </html>
    """
    return html

@app.route('/<path:path>')
def catch_all(path):
    return index()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False)

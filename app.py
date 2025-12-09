from flask import Flask
import os

app = Flask(__name__)

@app.route('/')
def home():
    return '''<!DOCTYPE html>
<html>
<head>
    <title>WorkFlow - DeskFlow</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
        }
        .container {
            text-align: center;
            background: white;
            padding: 60px 40px;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            max-width: 500px;
        }
        h1 { color: #333; margin: 0 0 20px 0; font-size: 36px; }
        p { color: #666; margin: 0 0 30px 0; font-size: 16px; }
        a {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 15px 40px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            font-size: 16px;
            transition: background 0.3s;
        }
        a:hover { background: #764ba2; }
        .status { color: #28a745; font-size: 14px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 WorkFlow</h1>
        <p>Access your DeskFlow application</p>
        <a href="https://ai.studio/apps/drive/1uoOUa92s8yhqOVDnZUr-2o2C8RFwidz7" target="_blank">
            Open DeskFlow →
        </a>
        <div class="status">✓ Powered by Google Cloud Run</div>
    </div>
</body>
</html>'''

@app.route('/<path:path>')
def catch_all(path):
    return home()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False, threaded=True)

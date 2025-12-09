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
        body { width: 100%; height: 100vh; }
        iframe { width: 100%; height: 100%; border: none; }
    </style>
</head>
<body>
    <iframe src="https://ai.studio/apps/drive/1uoOUa92s8yhqOVDnZUr-2o2C8RFwidz7" allowfullscreen></iframe>
</body>
</html>'''

@app.route('/<path:path>')
def catch_all(path):
    return home()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False, threaded=True)

from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return '''<!DOCTYPE html>
<html>
<head>
    <title>WorkFlow</title>
    <style>
        * { margin: 0; padding: 0; }
        body { font-family: Arial; }
        iframe { width: 100vw; height: 100vh; border: none; }
    </style>
</head>
<body>
    <iframe src="https://ai.studio/apps/drive/1uoOUa92s8yhqOVDnZUr-2o2C8RFwidz7"></iframe>
</body>
</html>'''

@app.errorhandler(404)
def not_found(e):
    return home()

if __name__ == '__main__':
    app.run()

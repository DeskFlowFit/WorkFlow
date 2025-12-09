from flask import Flask, render_template_string
import os

app = Flask(__name__, static_folder='out', static_url_path='')

@app.route('/')
def index():
    try:
        with open('out/index.html', 'r') as f:
            return f.read()
    except:
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <title>WorkFlow</title>
            <style>
                body { font-family: Arial; text-align: center; padding: 50px; }
                h1 { color: #333; }
                iframe { width: 100%; height: 100vh; border: none; }
            </style>
        </head>
        <body>
            <h1>WorkFlow App</h1>
            <iframe src="https://ai.studio/apps/drive/1uoOUa92s8yhqOVDnZUr-2o2C8RFwidz7" allowfullscreen></iframe>
        </body>
        </html>
        """

@app.route('/<path:path>')
def catchall(path):
    return render_template_string(index())

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)), debug=False)

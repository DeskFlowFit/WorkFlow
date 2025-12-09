from flask import Flask, send_from_directory
import os

app = Flask(__name__, static_folder='dist', static_url_path='/')

@app.route('/')
def index():
    return send_from_directory('dist', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    filepath = os.path.join('dist', path)
    if os.path.isfile(filepath):
        return send_from_directory('dist', path)
    return send_from_directory('dist', 'index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False)

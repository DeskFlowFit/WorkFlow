from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__, static_folder='dist', static_url_path='', template_folder='dist')

@app.route('/')
def index():
    return send_from_directory('dist', 'index.html')

@app.route('/<path:path>')
def serve_file(path):
    if os.path.exists(f'dist/{path}'):
        return send_from_directory('dist', path)
    return send_from_directory('dist', 'index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False, threaded=True)

from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/health')
def health():
    return jsonify({'status': 'ok', 'test': True})

if __name__ == '__main__':
    print("Test server running on http://localhost:5000")
    app.run(port=5000, debug=True)
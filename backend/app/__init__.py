from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)
    from .routes.hello import hello_bp
    app.register_blueprint(hello_bp, url_prefix = '/api/v1')
    return app
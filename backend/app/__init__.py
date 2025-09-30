from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)

    from .routes.hello import hello_bp
    app.register_blueprint(hello_bp, url_prefix = '/api/v1')

    @app.errorhandler(404)
    def not_found(e):
        return {"error": "Resource not found"}, 404

    @app.errorhandler(500)
    def server_error(e):
        return {"error": "Internal server error"}, 500

    return app
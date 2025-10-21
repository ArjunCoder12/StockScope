from flask import Flask, jsonify
from werkzeug.exceptions import BadRequest, NotFound, InternalServerError
from flask_cors import CORS
from .routes.price import price_bp
from .routes.fundamentals import fundamentals_bp
from .routes.stocks import stock_list_bp
from .routes.chart import chart_bp
from .routes.sentiment import sentiment_bp
from .routes.watchlist import watchlist_bp
from .routes.news import news_bp

def create_app():
    app = Flask(__name__)
    CORS(app)
    from .routes.hello import hello_bp
    app.register_blueprint(hello_bp, url_prefix = '/api/v1')
    app.register_blueprint(price_bp, url_prefix = '/api/v1')
    app.register_blueprint(fundamentals_bp, url_prefix = '/api/v1')
    app.register_blueprint(stock_list_bp, url_prefix = '/api/v1')
    app.register_blueprint(chart_bp, url_prefix = '/api/v1')
    app.register_blueprint(sentiment_bp, url_prefix = '/api/v1')
    app.register_blueprint(watchlist_bp, url_prefix = '/api/v1')
    app.register_blueprint(news_bp, url_prefix = '/api/v1')

    @app.errorhandler(BadRequest)
    def handle_400(e):
        return jsonify({
            "error": "Bad Request",
            "message": e.description or "Your request was invalid or malformed."
        }), 400

    @app.errorhandler(NotFound)
    def handle_404(e):
        return jsonify({
            "error": "Not Found",
            "message": e.description or "The requested resource could not be found."
        }), 404

    @app.errorhandler(InternalServerError)
    def handle_500(e):
        return jsonify({
            "error": "Internal Server Error",
            "message": "An unexpected error occurred on the server."
        }), 500
    return app

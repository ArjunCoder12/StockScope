from flask import Blueprint, jsonify

bp = Blueprint('hello', __name__)

@bp.route('/health', methods=['GET'])
def health():
    """Health check endpoint.
    Returns a small JSON object indicating service health.
    """
    return jsonify(status='healthy', service='StockScope Backend')

@bp.route('/hello', methods=['GET'])
def hello():
    """Hello endpoint.
    Returns a small JSON object with a greeting message.
    """
    return jsonify(message='Hello StockScope', status='success')
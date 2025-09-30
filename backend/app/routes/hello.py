from flask import Blueprint, jsonify

hello_bp = Blueprint('hello', __name__)

@hello_bp.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "service": "StockScope Backend"})

@hello_bp.route('/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hello StockScope", "status": "success"})
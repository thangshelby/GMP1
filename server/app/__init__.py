from flask import Flask
from flask_cors import CORS
def create_app():
    app = Flask(__name__)
    CORS(app)

    from app.routes import stock,report,company

    # Register routes
    app.register_blueprint(stock.stock_bp, url_prefix='/stocks')
   
    app.register_blueprint(report.report_bp, url_prefix='/reports')
    
    app.register_blueprint(company.company_bp, url_prefix='/company')
    
    return app

from flask import Flask
from flask_cors import CORS

from app.utils.utils import prepare_data_for_market_review


def create_app():
    app = Flask(__name__)
    CORS(
    app,
    resources={r"/*": {"origins": ["https://stockviz-aj878j5tu-thangs-projects-50c49ca7.vercel.app", "http://localhost:3000"]}},
    supports_credentials=True)



    from app.routes import company, market, news, report, screener, stock
    
    # Register routes
    app.register_blueprint(stock.stock_bp, url_prefix='/stocks')    
   
    app.register_blueprint(report.report_bp, url_prefix='/reports') 
    
    app.register_blueprint(company.company_bp, url_prefix='/company')
    
    app.register_blueprint(market.market_bp, url_prefix='/market')
    
    app.register_blueprint(news.news_bp, url_prefix='/news')
    
    app.register_blueprint(screener.screener_bp, url_prefix='/screener')

    # Use a flag in app.config to ensure prepare_data_for_market_review runs only once
    if not app.config.get('DATA_PREPARED', False):
        prepare_data_for_market_review()
        app.config['DATA_PREPARED'] = True
    
    return app

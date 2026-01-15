from flask import Flask
from flask_hot_reload import HotReload
from dashboard.routes import dashboard_bp
from dashboard.v3_routes import dashboard_v3_bp, dashboard_v3_api_bp
from config import DATA_DIR, SESSION_LOGS_DIR
import os
import time


def create_app():
    # Templates and static are in brain/templates and brain/static
    # This file is in brain/dashboard/app.py
    # So we look up one level
    base_dir = os.path.dirname(os.path.abspath(__file__))
    brain_dir = os.path.dirname(base_dir)  # brain/
    template_dir = os.path.join(brain_dir, "templates")

    static_dir = os.path.join(brain_dir, "static")

    app = Flask(__name__, template_folder=template_dir, static_folder=static_dir)
    app.config["TEMPLATES_AUTO_RELOAD"] = True
    app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0  # Disable static cache during debug

    # Serve React App
    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_react(path):
        if path.startswith("api/"):
            return "API not found", 404
            
        # 1. Check if file exists at exact path (e.g. /react/assets/foo.js -> static/react/assets/foo.js)
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return app.send_static_file(path)
            
        # 2. Check if file exists inside react folder (e.g. /favicon.png -> static/react/favicon.png)
        react_path = os.path.join("react", path)
        if path != "" and os.path.exists(os.path.join(app.static_folder, react_path)):
            return app.send_static_file(react_path)
            
        # 3. Fallback to index.html for client-side routing
        return app.send_static_file("react/index.html")

    # Initialize Flask Hot Reload - automatically watches templates, static, and Python files
    # HotReload(app) # Causing crash with static files (RuntimeError: direct passthrough)

    # Add cache-busting headers for all responses
    @app.after_request
    def add_header(response):
        # Prevent caching of all responses in development
        response.headers["Cache-Control"] = (
            "no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0"
        )
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "-1"
        return response

    # Add timestamp to all templates for cache busting
    @app.context_processor
    def inject_cache_buster():
        return dict(cache_bust=int(time.time()))

    # Register Blueprint
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(dashboard_v3_bp)
    app.register_blueprint(dashboard_v3_api_bp)
    
    # Register the Hybrid Adapter (Node.js API emulation)
    from dashboard.api_adapter import adapter_bp
    app.register_blueprint(adapter_bp)

    return app

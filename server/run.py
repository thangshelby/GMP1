from app import create_app

app = create_app()

# Liệt kê routes
for rule in app.url_map.iter_rules():
    print(f"{rule.endpoint:30s} {rule.methods} {rule}")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

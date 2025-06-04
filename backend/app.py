from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)                    # allow React dev server to call us

items = []                   # in-memory “DB”
next_id = 1

# ────────────── CREATE ──────────────
@app.route("/items", methods=["POST"])
def create_item():
    global next_id
    data = request.get_json(True)
    item = {"id": next_id, "text": data.get("text", "")}
    next_id += 1
    items.append(item)
    return jsonify(item), 201

# ────────────── READ ALL ─────────────
@app.route("/items", methods=["GET"])
def get_all_items():
    return jsonify(items)

# ────────────── READ ONE ─────────────
@app.route("/items/<int:item_id>", methods=["GET"])
def get_item(item_id):
    item = next((i for i in items if i["id"] == item_id), None)
    return (jsonify(item) if item else ("", 404))

# ────────────── UPDATE ───────────────
@app.route("/items/<int:item_id>", methods=["PUT"])
def update_item(item_id):
    data = request.get_json(True)
    for item in items:
        if item["id"] == item_id:
            item["text"] = data.get("text", item["text"])
            return jsonify(item)
    return "", 404

# ────────────── DELETE ───────────────
@app.route("/items/<int:item_id>", methods=["DELETE"])
def delete_item(item_id):
    idx = next((k for k, v in enumerate(items) if v["id"] == item_id), None)
    if idx is None:
        return "", 404
    items.pop(idx)
    return "", 204

if __name__ == "__main__":
    app.run(debug=True)
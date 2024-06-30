from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import gzip
from PIL import Image
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
UPLOAD_FOLDER = 'uploads'
COMPRESSED_FOLDER = 'compressed'
DECOMPRESSED_FOLDER = 'decompressed'

# Ensure folders exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(COMPRESSED_FOLDER, exist_ok=True)
os.makedirs(DECOMPRESSED_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return '''
    <!doctype html>
    <title>Upload File</title>
    <h1>Upload File</h1>
    <form method=post enctype=multipart/form-data action="/compress">
      <input type=file name=file>
      <input type=submit value=Upload>
    </form>
    '''

@app.route('/compress', methods=['POST'])
def compress_file():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(file_path)

            compressed_path = os.path.join(COMPRESSED_FOLDER, filename + '.gz')

            # Check file type for compression method
            if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
                compress_image(file_path, compressed_path)
            else:
                compress_general_file(file_path, compressed_path)

            return jsonify({"file_url": f"/download/{filename}.gz", "decompress_url": f"/decompress/{filename}.gz"})
        else:
            return jsonify({"error": "Invalid file type"}), 400
    except Exception as e:
        app.logger.error(f"Error during file compression: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

@app.route('/decompress/<filename>', methods=['GET'])
def decompress_file(filename):
    try:
        compressed_path = os.path.join(COMPRESSED_FOLDER, filename)
        decompressed_path = os.path.join(DECOMPRESSED_FOLDER, filename[:-3])  # Remove .gz extension

        if filename.lower().endswith(('.png.gz', '.jpg.gz', '.jpeg.gz')):
            decompress_image(compressed_path, decompressed_path)
        else:
            decompress_general_file(compressed_path, decompressed_path)

        return send_file(decompressed_path, as_attachment=True)
    except Exception as e:
        app.logger.error(f"Error during file decompression: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

@app.route('/download/<filename>')
def download_file(filename):
    try:
        file_path = os.path.join(COMPRESSED_FOLDER, filename)
        if os.path.exists(file_path):
            return send_file(file_path, as_attachment=True)
        else:
            return jsonify({"error": "File not found"}), 404
    except Exception as e:
        app.logger.error(f"Error during file download: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

def compress_general_file(input_path, output_path):
    with open(input_path, 'rb') as f_in, gzip.open(output_path, 'wb') as f_out:
        f_out.writelines(f_in)

def decompress_general_file(input_path, output_path):
    with gzip.open(input_path, 'rb') as f_in, open(output_path, 'wb') as f_out:
        f_out.write(f_in.read())

def compress_image(input_path, output_path):
    with Image.open(input_path) as img:
        img.save(output_path, format='JPEG', quality=85, optimize=True)

def decompress_image(input_path, output_path):
    with gzip.open(input_path, 'rb') as f_in:
        with open(output_path, 'wb') as f_out:
            f_out.write(f_in.read())

def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

if __name__ == '__main__':
    app.run(debug=True)

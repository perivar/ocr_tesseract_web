from flask import Flask, request, jsonify, render_template
from PIL import Image
import io
import traceback

from ocr import process_image, process_image2

app = Flask(__name__)
_VERSION = 1  # API version


@app.route('/')
def main():
    return render_template('index.html')


@app.route('/v{}/ocr'.format(_VERSION), methods=["POST"])
def ocr():
    print('--call ocr processing --')
    try:
        if request.files.get("image"):
            print('--read image --')
            # read the image in PIL format
            image = request.files["image"].read()
            image = Image.open(io.BytesIO(image))
            print('RECV:', image.format, image.size, image.mode)

            output = process_image2(image)
            return jsonify({"output": output})
        else:
            return jsonify({"error": "only .jpg files, please"})
    except Exception as e:
        print('ocr processing exception:', e)
        print(traceback.format_exc())
        return jsonify(
            {"error": str(e)}
        )


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000, threaded=True)
    print("--end--")

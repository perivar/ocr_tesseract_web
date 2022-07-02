var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var is_mobile = null;
$(function () {
    // hide buttons
    $("#retry").hide();
    $("#results").hide();
    // is_mobile = check_mobile();
    is_mobile = true;
    if (is_mobile) {
        document.getElementById("pc_fileupload").style.display = "none";
        var submit = document.getElementById('submit');
        if (submit != null) {
            submit.value = "capture and text extraction";
        }
        init_mob_cam();
    }
    else {
        document.getElementById("mob_camera").style.display = "none";
    }
    // event handler for form submission
    setSubmitEvent();
    setRetryEvent();
});
var loadFile = function (event) {
    var image = document.getElementById('image');
    if (image != null) {
        image.src = URL.createObjectURL(event.target.files[0]);
    }
};
function check_mobile() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // true for mobile device
        return true;
    }
    else {
        // false for not mobile device
        return false;
    }
}
// https://discuss.dizzycoding.com/how-do-i-take-picture-from-client-sidehtml-and-save-it-to-server-sidepython/
function setSubmitEvent() {
    $("#submit").on("click", function (event) {
        $("#results").hide();
        var data = new FormData();
        if (is_mobile) {
            var captureFile = getCaptureImg();
            data.append("image", captureFile);
        }
        else {
            var fileInput = $("#file")[0];
            if (fileInput != null) {
                var uploadFile = fileInput.files[0];
                data.append("image", uploadFile);
            }
        }
        $.ajax({
            type: "POST",
            url: "/v1/ocr",
            enctype: "multipart/form-data",
            data: data,
            processData: false,
            contentType: false,
            cache: false,
            timeout: 600000,
            success: function (result) {
                console.log(result);
                $("#post-form").hide();
                $("#retry").show();
                $("#results").show();
                $("#results-data").html("<div class='well'>" + result["output"] + "</div>");
            },
            error: function (error) {
                console.log(error);
            },
        });
    });
}
function setRetryEvent() {
    $("#retry").on("click", function () {
        $("input").val("").show();
        $("#post-form").show();
        $("#retry").hide();
        $("#results").html("");
    });
}
////////////////////////////////////////////////////
// Mobile - Iphone 7 checked!
////////////////////////////////////////////////////
// Set constraints for the video stream
var cameraView = null;
var cameraCapture = null;
var constraints;
// Define constants
function init_mob_cam() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            cameraView = document.querySelector("#camera--view");
            cameraCapture = document.querySelector("#camera--capture");
            constraints = { video: { facingMode: "user" }, audio: false };
            cameraStart();
            return [2 /*return*/];
        });
    });
}
// Access the device camera and stream to cameraView
function cameraStart() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            navigator.mediaDevices
                .getUserMedia(constraints)
                .then(function (stream) {
                cameraView.srcObject = stream;
            })
                .catch(function (error) {
                console.error("Oops. Something is broken.", error);
            });
            return [2 /*return*/];
        });
    });
}
function capture_predict_mob() {
    cameraCapture.width = cameraView.videoWidth;
    cameraCapture.height = cameraView.videoHeight;
    cameraCapture.getContext("2d").drawImage(cameraView, 0, 0);
    return cameraCapture;
}
//https://samanoske.tistory.com/94
function extractImage(canvas) {
    var imgDataUrl = canvas.toDataURL("image/jpeg");
    var blobBin = atob(imgDataUrl.split(",")[1]); // base64 data decoding
    var array = [];
    for (var i = 0; i < blobBin.length; i++) {
        array.push(blobBin.charCodeAt(i));
    }
    var file = new Blob([new Uint8Array(array)], { type: "image/jpeg" }); // Blob produce
    // var formData = new FormData(); // formData produce
    // formData.append("image", file); // file data add
    // return formData;
    return file;
}
function getCaptureImg() {
    var canvas = capture_predict_mob();
    var cFile = extractImage(canvas);
    return cFile;
}
////////////////////////////////////////////////////////
//end Mobile
////////////////////////////////////////////////////////
//# sourceMappingURL=script.js.map
var is_mobile = null;
$(function () {
  // hide buttons
  $("#retry").hide();
  $("#results").hide();

  // is_mobile = check_mobile();
  is_mobile = true;

  if (is_mobile) {
    document.getElementById("pc_fileupload").style.display = "none";

    const submit = document.getElementById('submit') as HTMLInputElement | null;
    if (submit != null) {
      submit.value = "capture and text extraction";

    }

    init_mob_cam();
  } else {
    document.getElementById("mob_camera").style.display = "none";
  }

  // event handler for form submission
  setSubmitEvent();
  setRetryEvent();
});

var loadFile = function (event) {
  const image = document.getElementById('image') as HTMLInputElement | null;

  if (image != null) {
    image.src = URL.createObjectURL(event.target.files[0]);
  }
};

function check_mobile() {
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    // true for mobile device
    return true;
  } else {
    // false for not mobile device
    return false;
  }
}

// https://discuss.dizzycoding.com/how-do-i-take-picture-from-client-sidehtml-and-save-it-to-server-sidepython/
function setSubmitEvent() {
  $("#submit").on("click", function (event) {
    $("#results").hide();
    const data = new FormData();

    if (is_mobile) {
      const captureFile = getCaptureImg();
      data.append("image", captureFile);
    } else {
      const fileInput = $("#file")[0] as HTMLInputElement | null;
      if (fileInput != null) {
        const uploadFile = fileInput.files[0];
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
        $("#results-data").html(
          "<div class='well'>" + result["output"] + "</div>"
        );
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
async function init_mob_cam() {
  cameraView = document.querySelector("#camera--view");
  cameraCapture = document.querySelector("#camera--capture");

  constraints = { video: { facingMode: "user" }, audio: false };
  cameraStart();
}

// Access the device camera and stream to cameraView
async function cameraStart(): Promise<void> {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      cameraView.srcObject = stream;
    })
    .catch(function (error) {
      console.error("Oops. Something is broken.", error);
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

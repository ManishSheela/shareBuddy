// email confirmation popup model close
$(".signup_success_btn").click(function () {
  $(".signup_success").fadeOut(5000);
});

// to show .tab-container --use--> display = "block" otherwise --> display = "none"

//  to show section  --use--> display = "flex"    otherwise --> display = "none"

//  to show .signup_success  --use--> display = "flex"  otherwise --> display = "none"

const dropZone = document.querySelector(".drop-zone");
const fileInput = document.querySelector("#fileinput");
const uploadBtn = document.querySelector(".uploadBtn");

const progressArea = document.querySelector(".progress-area");
const progress = document.querySelector(".progress");
const percentDiv = document.querySelector(".percent");

const tabContainer = document.querySelector(".tab-container");
const sectionWrapper = document.querySelector(".section-wrapper");

const fileURLInput = document.querySelector("#fileURL");
const sharingContainer = document.querySelector(".sharing-container");
const copyBtn = document.querySelector("#copyBtn");
const maxAllowedSize = 100 * 1024 * 1024;
const emailForm = document.querySelector("#emailForm");

const host = "http://localhost:3000";
const uploadURL = `${host}/api/files`;
const emailURL = `${host}/api/files/send`;

// file selecting functions
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  if (!uploadBtn.classList.contains("uploadActive")) {
    uploadBtn.classList.add("uploadActive");
  }
});

dropZone.addEventListener("dragleave", () => {
  uploadBtn.classList.remove("uploadActive");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadBtn.classList.remove("uploadActive");
  const files = e.dataTransfer.files;
  if (files.length) {
    fileInput.files = files;
    uploadFile();
  }
});

fileInput.addEventListener("change", () => {
  // const file = event.target.files[0].name; // holds the information about file
  uploadFile();
});

// file selection funciton end here

// reset the file input after file upload
const resetFileInput = () => {
  fileInput.value = null;
  progressArea.style.display = "none";
};

function resetForm() {
  document.getElementById("myForm").reset();
}

// uploading file to  the server
const uploadFile = () => {
  progressArea.style.display = "block";
  if (fileInput.files.length > 1) {
    resetFileInput();
    showToast("Error", "Please upload only 1 file");
    return;
  }
  const file = fileInput.files[0];
  const filename = file.name;
  if (file.size > maxAllowedSize) {
    showToast("Error", "can't upload more than 100 MB");
    resetFileInput();
    return;
  }

  const formData = new FormData();
  formData.append("myfile", file);

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    // console.log(xhr.readyState);
    if (xhr.readyState === XMLHttpRequest.DONE) {
      //   console.log(xhr.response);
      setTimeout(onUploadSuccess(JSON.parse(xhr.response)), 2000);
    }
  };

  xhr.upload.onprogress = updateProgress(filename, this);

  xhr.upload.onerror = () => {
    resetFileInput();
    showToast("Error", `Error in upload: ${xhr.statusText}`);
  };
  xhr.open("POST", uploadURL);
  xhr.send(formData);
};

// submit the email data form
function submitForm(event) {
  event.preventDefault(); // Prevent form submission
  $(document).ready(function () {
    $(".expires").text("Please be patient as we send the mail");
  });
  // Get form values
  const to = document.getElementById("to").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;
  const url = fileURLInput.value;

  // Construct request body
  const data = {
    uuid: url.split("/").splice(-1, 1)[0],
    emailTo: to,
    subject,
    message,
  };
  // Send HTTP request
  fetch(emailURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        // Handle successful response
        showToast("Success", "Email has been sent!");
      } else {
        response.json().then((jsonData) => {
          // Access and handle error information from jsonData
          showToast("Error", jsonData.error);
        });
      }
      $(document).ready(function () {
        $(".expires").text("Expires within 24 hours");
      });
    })
    .catch((error) => {
      // Handle network error
      showToast("Error", "We're sorry, please give it another shot later.");
    });
}

const updateProgress = (filename, e) => {
  const percent = Math.round((e.loaded / e.total) * 100);
  progress.style.width = `${percent}%`;
  percentDiv.innerText = percent;
  $(".name").text(filename);
};

const onUploadSuccess = ({ file: url }) => {
  tabContainer.style.display = "block";
  resetFileInput();
  //   emailForm[2].removeAttribute("disabled");
  sectionWrapper.style.display = "none";
  fileURLInput.value = url;
};
$(".close-tab").click(function () {
  resetFileInput();
  $(".tab-container").hide(() => {
    $(".section-wrapper").show();
  }); // or use $(".tab-container").fadeOut();
});

copyBtn.addEventListener("click", () => {
  fileURLInput.select();
  document.execCommand("copy");
  showToast("Success", "Link Copied");
});

// toast script goes hear
const toastIcon = document.querySelector("#toastIcon"),
  text1 = document.querySelector(".text-1"),
  text2 = document.querySelector(".text-2");

let x;
let toast = document.getElementById("toast");
function showToast(event, message) {
  if (event === "Error") {
    toast.style.borderLeft = "6px solid red";
    toastIcon.classList.add("fa-circle-exclamation");
    toastIcon.classList.remove("fa-circle-check");
    toastIcon.style.color = "red";
  } else {
    toastIcon.classList.add("fa-circle-check");
    toastIcon.classList.remove("fa-circle-exclamation");
    toastIcon.style.color = "#74C365";
    toast.style.borderLeft = "6px solid #74C365";
  }
  text1.innerText = event;
  text2.innerText = message;

  clearTimeout(x);
  toast.style.transform = "translateX(-20px)";
  x = setTimeout(() => {
    toast.style.transform = "translateX(400px)";
  }, 4000);
}
function closeToast() {
  toast.style.transform = "translateX(400px)";
}

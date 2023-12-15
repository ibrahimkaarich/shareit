let result;
let chunks = [];
let finalData;
let file;

console.log("triggred !!");

const forms = document.querySelectorAll(".needs-validation");
const fullname = document.querySelector("input[input-1='full-name']");
const email = document.querySelector("input[input-2='email']");
const pass1 = document.querySelector("input[input-3='password']");
const pass2 = document.querySelector("input[input-4='password-confirmation']");
const fileInput = document.querySelector("input[input-5='file']");

const validTip = document.querySelector(".valid-tooltip-custom");
const InvalidTip = document.querySelector(".invalid-tooltip-custom");
  
let stateForm = false;
const regExpression = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])\S{8,}$/
function passValidation() {
  const passState = regExpression.test(pass1.value);
  if (pass1.value !== pass2.value) {
    pass2.nextElementSibling.style.display = "block";
    return false
  } else if(!passState) {
    return false
  } {
    return true
  }
}

function regExpressionPass() {
  const pass1State = regExpression.test(pass1.value);
  if (!pass1State && pass1.value.length > 1) {
    pass1.nextElementSibling.textContent = "At least an UPPERCASE, DIGIT, Character and more than 8 characters are required.";
    pass1.nextElementSibling.style.display = "block";
  } else {
    pass1.nextElementSibling.style.display = "none";
    pass1.nextElementSibling.textContent = "Please provide a valid password.";
  }
}

pass2.onchange = () => {  
  if (pass1.value === pass2.value) {
    InvalidTip.style.display = "none";
    validTip.style.display = "block";
  } else {
    validTip.style.display = "none";
    InvalidTip.style.display = "block"
  }
}

(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to      
  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        stateForm = form.checkValidity();
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

forms[0].onsubmit =  async (form)=> {
file = fileInput.files[0];
  if (stateForm && passValidation()) {
    if (file) {
      try {
        console.log(file);
        streams = file.stream();
        streamsFile = streams.getReader();

       if (!(result = await streamsFile.read()).done) {
            chunks.push(result.value)
       }
       const finalData = new Blob(chunks, {type : file.type});
       // Send the file data to the server
       sendFileData(finalData);

   } catch (error) {
       console.error('Error streaming file:', error);
      }
    } else {
   alert('Please select a file.');
}
  } else {
    form.preventDefault();
    regExpressionPass();
    alert("Check the form fields instructions");
    }
}

function sendFileData(blob) {
    fetch('http://127.0.0.1:1234/upload', {
        method: 'POST',
        body: blob,
        headers: {
          'Content-Type': 'application/octet-stream',
          email: email.value,
          password: pass1.value,
          fullname: fullname.value,
          filename : file.name
        }
    })
    .then(response => response.json())
    .then(message => {
        console.log(message);
        // Handle the server response as needed
    })
    .catch(error => {
        console.error('Error uploading file:', error);
    });
}
const forms = document.querySelectorAll(".needs-validation");
const username = document.querySelector("input[type='email']").value;
const password = document.querySelector("input[type='password']").value;
let stateForm = false;

function login(email, password) {
  fetch("http://127.0.0.1:1234/login", {
    method : "POST",
    headers : {
      "Content-Type" : "application/json"
    },
    body : JSON.stringify({email, password})
  })
  .then(response => {
    response.json()
  })
  .then(data => {
    console.log(data)
  })
}

forms[0].onsubmit = () => {
  login(email, password);
};

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
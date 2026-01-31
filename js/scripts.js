// ===============================
// Pokemon Repository Module (IIFE)
// ===============================
let pokemonRepository = (function () {
  // List to store all pokemon objects
  let pokemonList = [];
  // API URL to fetch pokemon data
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=80";

  // Add a new pokemon to the list
  function add(pokemon) {
    pokemonList.push(pokemon);
  }

  // Get all pokemon from the list
  function getAll() {
    return pokemonList;
  }

  // Load details from the API, then call to display the modal
  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {
      // Show modal with name, height, and image
      ModalValidation.showModal(
        pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
        "Height: " + pokemon.height + "m",
        pokemon.imageUrl
      );
    });
  }

  // Create and add a list item (button) for each pokemon
  function addListItem(pokemon) {
    let ulpokelist = document.querySelector("ul");

    //Assign Bootstrap list-group class to ul
    ulpokelist.classList.add("list-group"); 

    let listItem = document.createElement("li");
    // Add Bootstrap list-group-item class to li
    listItem.classList.add("list-group-item-action");


    let button = document.createElement("button");

    // Add Bootstrap btn and btn-primary classes to button
    button.classList.add("btn", "btn-primary");

    // Set text and class. Capitalize first letter of name
    button.innerText =
      pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    button.classList.add("button");

    // Append button to list item, and list item to ul
    listItem.appendChild(button);
    ulpokelist.appendChild(listItem);

    // Add event listener to show details modal on click
    button.addEventListener("click", function () {
      showDetails(pokemon);
    });
  }

  // Load the list of pokemon from the API
  function loadList() {
    return fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        json.results.forEach(function (item) {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url,
          };
          add(pokemon);
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // Load details for a specific pokemon
  function loadDetails(item) {
    let url = item.detailsUrl;
    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (details) {
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // Return public functions to access outside of the IIFE
  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails,
  };
})(); // IIFE ends

// ===============================
// Main App Initialization
// ===============================
// Use forEach loop to iterate over all pokemon and add them to the UI
pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});

// ===============================
// Form Validation Module (IIFE)
// ===============================
let formValidation = (function () {
  let form = document.querySelector("#register-form");
  let emailInput = document.querySelector("#email");
  let passwordInput = document.querySelector("#password");

  function showErrorMessage(input, message) {
    let container = input.parentElement; // The .input-wrapper

    // Remove an existing error
    let error = container.querySelector(".error-message");
    if (error) {
      container.removeChild(error);
    }

    // Now add the error, if the message is not empty
    if (message) {
      let error = document.createElement("div");
      error.classList.add("error-message");
      error.innerText = message;
      container.appendChild(error);
    }
  }

  function validateEmail() {
    let value = emailInput.value; 

    if (!value) {
      showErrorMessage(emailInput, "Email is a required field.");
      return false;
    }

    if (value.indexOf("@") === -1) {
      showErrorMessage(emailInput, "You must enter a valid email address.");
      return false;
    }

    if (value.indexOf(".") === -1) {
      showErrorMessage(emailInput, "You must enter a valid email address.");
      return false;
    }

    showErrorMessage(emailInput, null);
    return true;
  }

  function validatePassword() {
    let value = passwordInput.value;

    if (!value) {
      showErrorMessage(passwordInput, "Password is a required field.");
      return false;
    }

    if (value.length < 8) {
      showErrorMessage(
        passwordInput,
        "The password needs to be at least 8 characters long."
      );
      return false;
    }

    showErrorMessage(passwordInput, null);
    return true;
  }

  function validateForm() {
    let isValidEmail = validateEmail();
    let isValidPassword = validatePassword();
    return isValidEmail && isValidPassword;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Do not submit to the server
    if (validateForm()) {
      alert("Success!");
    }
  });

  emailInput.addEventListener("input", validateEmail);
  passwordInput.addEventListener("input", validatePassword);

  // THE RETURN STATEMENT HERE
})();

// ===============================
// Form Validation Module (IIFE)
// ===============================
  let ModalValidation = (function () {
  // Show a modal with title, text, and optional image
  function showModal(title, text, imageUrl) {
    let modalContainer = document.querySelector("#modal-container");
    modalContainer.innerText = "";

    let modal = document.createElement("div");
    modal.classList.add("modal");

    let closeButtonElement = document.createElement("button");
    closeButtonElement.classList.add("modal-close");
    closeButtonElement.innerText = "close";
    closeButtonElement.addEventListener("click", hideModal);

    let titleElement = document.createElement("h1");
    titleElement.innerText = title;

    let contentElement = document.createElement("p");
    contentElement.innerText = text;

    modal.appendChild(closeButtonElement);
    modal.appendChild(titleElement);

    // Only add image if imageUrl is provided
    if (imageUrl) {
      let imageElement = document.createElement("img");
      imageElement.src = imageUrl;
      imageElement.alt = title;
      modal.appendChild(imageElement);
    }

    modal.appendChild(contentElement);
    modalContainer.appendChild(modal);

    modalContainer.classList.add("is-visible");

    // Hide modal when clicking outside of it
    modalContainer.addEventListener("click", (e) => {
      let target = e.target;
      if (target === modalContainer) {
        hideModal();
      }
    });
  }

  // Show a sample modal when clicking the button
  document.querySelector("#show-modal").addEventListener("click", () => {
    showModal("modal title", "This is the modal content!", null);
  });

  let dialogPromiseReject;

  // Hide the modal
  function hideModal() {
    let modalContainer = document.querySelector("#modal-container");
    modalContainer.classList.remove("is-visible");

    if (dialogPromiseReject) {
      dialogPromiseReject();
      dialogPromiseReject = null;
    }
  }

  // Show a dialog with confirm/cancel buttons
  function showDialog(title, text) {
    showModal(title, text);

    let modalContainer = document.querySelector("#modal-container");
    let modal = document.querySelector(".modal");

    let confirmButton = document.createElement("button");
    confirmButton.classList.add("modal-confirm");
    confirmButton.innerText = "confirm";

    let cancelButton = document.createElement("button");
    cancelButton.classList.add("modal-cancel");
    cancelButton.innerText = "cancel";

    modal.appendChild(confirmButton);
    modal.appendChild(cancelButton);
    modalContainer.appendChild(modal);

    confirmButton.focus();

    return new Promise((resolve, reject) => {
      cancelButton.addEventListener("click", hideModal);
      confirmButton.addEventListener("click", () => {
        dialogPromiseReject = null;

        hideModal();
        resolve();
      });
      dialogPromiseReject = resolve;
    });
  }

  // Show dialog when clicking the button
  document.querySelector("#show-dialog").addEventListener("click", () => {
    showDialog("confirm action", "Are you sure you want to do this?").then(
      function () {
        alert("confirmed!");
      },
      () => {
        alert("not confirmed");
      }
    );
  });

  // Hide modal on Escape key
  window.addEventListener("keydown", (e) => {
    let modalContainer = document.querySelector("#modal-container");
    if (e.key === "Escape" && modalContainer.classList.contains("is-visible")) {
      hideModal();
    }
  });

  // Expose public functions
  return {
    showModal: showModal,
    hideModal: hideModal,
    showDialog: showDialog,
  };
})();

import "./style.css";
import { initializeAnimations } from "./animate.js";

// Initialize animations and get memes on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  initializeAnimations();
  getMeme();
});

const memeSection = document.getElementById("meme-section");
const imageModal = document.getElementById("image-modal");
const modalImage = document.getElementById("modal-image");
const closeModal = document.getElementById("close-modal");

let currentMemeCount = 0; // Track the number of memes already displayed
const memesPerPage = 5;

// Function to show loading indicator
function showLoading() {
  memeSection.innerHTML += `<div id="loading" class="text-white text-center">Loading memes...</div>`;
}

// Function to hide loading indicator
function hideLoading() {
  const loadingElement = document.getElementById("loading");
  if (loadingElement) {
    loadingElement.remove();
  }
}

// API call to get memes
async function getMeme() {
  const url = "https://programming-memes-images.p.rapidapi.com/v1/memes";
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
      "x-rapidapi-host": import.meta.env.VITE_RAPIDAPI_HOST,
    },
  };

  showLoading(); // Show loading indicator

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.text();
    const parsedResult = JSON.parse(result);

    displayMemes(parsedResult);
  } catch (error) {
    console.error("Error fetching memes:", error);
    memeSection.innerHTML += `<div class="text-white text-center">Sorry... 🤐 There is some error in getting images.</div>`;
  } finally {
    hideLoading(); // Hide loading indicator
  }
}

function displayMemes(memes) {
  const start = currentMemeCount;
  const end = start + memesPerPage;
  const memesToDisplay = memes.slice(start, end);

  memesToDisplay.forEach((meme) => {
    const memeElement = document.createElement("div");
    memeElement.className = "relative mb-4 overflow-hidden group";
    memeElement.innerHTML = `
      <div class="relative mb-4 overflow-hidden group">
        <img src="${meme.image}" alt="meme_image_${meme.id}" class="w-full h-auto rounded-lg shadow-lg transition duration-300 cursor-pointer" onclick="showModal('${meme.image}')" />
        <div class="absolute -bottom-10 duration-200 group-hover:bottom-0 left-0 w-full">
          <div class="flex items-center justify-between px-4 py-2 bg-gray-900/40 rounded-b-lg">
            <div class="flex gap-4">
              <i onclick="shareOnLinkedIn('${meme.image}')" class="text-white/85 cursor-pointer text-md fa-brands fa-linkedin"></i>
              <i onclick="shareOnFacebook('${meme.image}')" class="text-white/85 cursor-pointer text-md fa-brands fa-facebook"></i>
            </div>
            <button onclick="downloadImage('${meme.image}', 'downloaded-image-${meme.id}')" class="text-white/75 cursor-pointer text-md">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
    memeElement.querySelector("img").addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent event bubbling
      showModal(meme.image);
    });
    memeSection.appendChild(memeElement);
  });

  currentMemeCount += memesToDisplay.length; // Update the count of displayed memes
}

function showModal(imageUrl) {
  modalImage.src = imageUrl;
  imageModal.classList.remove("hidden");
}

function closeModalHandler() {
  imageModal.classList.add("hidden");
  modalImage.src = "";
}
window.showModal = showModal;

closeModal.addEventListener("click", closeModalHandler);
imageModal.addEventListener("click", (e) => {
  if (e.target === imageModal) {
    closeModalHandler();
  }
});

function loadMoreMemes() {
  getMeme();
}

// Expose functions to the global scope
window.loadMoreMemes = loadMoreMemes;

window.downloadImage = (url, filename) => {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      return response.blob();
    })
    .then((blob) => {
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename || "downloaded-image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    })
    .catch((error) => console.error("Error downloading image:", error));
};

// Initialize EmailJS with your public key
emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

function sendEmail(e) {
  e.preventDefault();

  // Get form data
  const fromName = document.getElementById("from_name").value;
  const message = document.getElementById("message").value;

  // Send email using EmailJS
  emailjs
    .send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        from_name: fromName,
        message: message,
        to_name: "ARslan Ahmad", // Your name
      }
    )
    .then(
      function (response) {
        console.log("SUCCESS!", response.status, response.text);
        alert("Thank you for your feedback!");
        document.getElementById("feedback-form").reset();
      },
      function (error) {
        console.log("FAILED...", error);
        alert("Failed to send feedback. Please try again.");
      }
    );

  return false;
}

// Add to global scope
window.sendEmail = sendEmail;

window.shareOnLinkedIn = function (imageUrl) {
  const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
    imageUrl
  )}&title=Check%20out%20this%20meme!`;
  window.open(linkedInUrl, "_blank");
};

window.shareOnFacebook = function (imageUrl) {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    imageUrl
  )}&quote=Check%20out%20this%20meme!`;
  window.open(facebookUrl, "_blank");
};

import "./style.css";
import { initializeAnimations } from "./animate.js";
import emailjs from "@emailjs/browser"; // Importing emailjs library

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
        <div class="absolute flex items-center justify-between px-4 py-2 bg-gray-900/50 rounded-b-lg -bottom-10 duration-200 group-hover:bottom-0 left-0 w-full">
            <div class="flex gap-4">
            <span class="cursor-pointer" onclick="shareOnLinkedIn('${meme.image}')">
              <svg width="18px" fill="#e8eaed" height="18px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/>
              </svg>
            </span>
              <span class="cursor-pointer" onclick="shareOnFacebook('${meme.image}')">
                <svg width="18px" fill="#e8eaed" height="18px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z"/>
                </svg>
            </span>
            </div>
            <button onclick="downloadImage('${meme.image}', 'downloaded-image-${meme.id}')" class="text-white/75 cursor-pointer text-md">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
              </svg>
            </button>
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

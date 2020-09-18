// Unsplash API
const photoReturnCount = 30;
const apiKey = '';
const apiURL = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${photoReturnCount}`;

// DOM Elements
const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let unsplashPhotoArr = [];
let ready = false;
let imagesLoaded = 0;
let totalImages = 0;

// Check whether all images from the last pull are loaded
function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        ready = true;
        loader.hidden = true;
    }
}

// Helper service for setting attributes on DOM elements
function setAttributes(element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

// Create elements for photo display
function displayPhotos() {
    imagesLoaded = 0;
    totalImages = unsplashPhotoArr.length;
    // Run this function for each element in the photos array from Unsplash
    unsplashPhotoArr.forEach((photo) => {
        // Create blank anchor tag and set its attributes to the right values
        const item = document.createElement('a');
        setAttributes(item, {
            href: photo.links.html,
            target: '_blank'
        });
        // Create blank img element to hold each photo
        const img = document.createElement('img');
        setAttributes(img, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description
        });
        // Add listener for when each image has finished loading on the page
        img.addEventListener('load', imageLoaded);
        // Append img to anchor tag, and append both to the image container on the page
        item.appendChild(img);
        imageContainer.appendChild(item);
    });
}

async function getUnsplashPhotos() {
    try {
        const response = await fetch(apiURL);
        unsplashPhotoArr = await response.json();
        displayPhotos();
    } catch(error) {
        console.log('There was an error getting photos.', error);
    }
}

// Scroll monitor
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight-1000 && ready) {
        ready = false;
        getUnsplashPhotos();
    }
});

getUnsplashPhotos();
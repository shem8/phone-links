// Initialize phone input
let phoneInput;

document.addEventListener('DOMContentLoaded', function() {
    const input = document.querySelector("#phoneNumber");
    // Initialize international telephone input
    phoneInput = window.intlTelInput(input, {
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
        separateDialCode: true,
        preferredCountries: ["il", "us", "gb"],
        initialCountry: "il",
        formatOnDisplay: true
    });

    // Initialize dark mode
    const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
    toggleSwitch.addEventListener('change', switchTheme);

    // Check for saved theme preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            toggleSwitch.checked = true;
        }
    }
});

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
}

function formatPhoneNumber(phoneNumber) {
    return phoneNumber.replace(/\D/g, '');
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Copied to clipboard!');
    } catch (err) {
        showToast('Failed to copy');
    }
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function generateLinks() {
    try {
        const input = document.querySelector("#phoneNumber");
        const linksContainer = document.getElementById('links');
        const qrContainer = document.getElementById('qrcode');

        // Get the full number with country code
        const phoneNumber = phoneInput.getNumber();
        console.log('Phone number:', phoneNumber); // Debug log

        if (!phoneNumber) {
            showToast('Please enter a phone number');
            return;
        }

        // Clear previous content
        linksContainer.innerHTML = '';
        qrContainer.innerHTML = '';

        // Create WhatsApp link
        const whatsappUrl = `https://wa.me/${formatPhoneNumber(phoneNumber)}`;
        const whatsappLink = document.createElement('div');
        whatsappLink.className = 'link-button whatsapp';
        whatsappLink.innerHTML = `
            <a href="${whatsappUrl}" target="_blank">
                <i class="fab fa-whatsapp"></i>
                Open in WhatsApp
            </a>
            <button class="copy-button" onclick="copyToClipboard('${whatsappUrl}')">
                <i class="fas fa-copy"></i>
            </button>
        `;

        // Create phone link
        const phoneUrl = `tel:${phoneNumber}`;
        const phoneLink = document.createElement('div');
        phoneLink.className = 'link-button phone';
        phoneLink.innerHTML = `
            <a href="${phoneUrl}">
                <i class="fas fa-phone"></i>
                Call or Save Contact
            </a>
            <button class="copy-button" onclick="copyToClipboard('${phoneUrl}')">
                <i class="fas fa-copy"></i>
            </button>
        `;

        // Generate QR Codes
        qrContainer.className = 'qr-container active';
        
        // WhatsApp QR
        const whatsappQRDiv = document.createElement('div');
        whatsappQRDiv.className = 'qr-code-item';
        const whatsappQRTitle = document.createElement('h3');
        whatsappQRTitle.textContent = 'WhatsApp Chat';
        whatsappQRDiv.appendChild(whatsappQRTitle);
        const whatsappQRCode = document.createElement('div');
        whatsappQRDiv.appendChild(whatsappQRCode);
        
        // Contact QR
        const contactQRDiv = document.createElement('div');
        contactQRDiv.className = 'qr-code-item';
        const contactQRTitle = document.createElement('h3');
        contactQRTitle.textContent = 'Phone Contact';
        contactQRDiv.appendChild(contactQRTitle);
        const contactQRCode = document.createElement('div');
        contactQRDiv.appendChild(contactQRCode);
        
        // Add QR containers
        qrContainer.appendChild(whatsappQRDiv);
        qrContainer.appendChild(contactQRDiv);

        // Generate WhatsApp QR
        new QRCode(whatsappQRCode, {
            text: whatsappUrl,
            width: 128,
            height: 128,
            colorDark: "#128C7E",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        // Generate Contact QR (vCard format)
        const vCard = generateVCard(phoneNumber);
        new QRCode(contactQRCode, {
            text: vCard,
            width: 128,
            height: 128,
            colorDark: "#2B6CB0",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        // Add elements with animation
        linksContainer.appendChild(whatsappLink);
        linksContainer.appendChild(phoneLink);

        // Add animations
        whatsappLink.style.animation = 'fadeIn 0.5s ease-in';
        phoneLink.style.animation = 'fadeIn 0.5s ease-in 0.2s';
        qrContainer.style.animation = 'fadeIn 0.5s ease-in 0.4s';
    } catch (error) {
        console.error('Error generating links:', error);
        showToast('Error generating links. Please try again.');
    }
}

function generateVCard(phoneNumber) {
    const vCard = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        'FN:New Contact',
        `TEL;TYPE=CELL:${phoneNumber}`,
        'END:VCARD'
    ].join('\n');
    
    return vCard;
}

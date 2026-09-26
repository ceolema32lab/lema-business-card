/**
 * ============================================================================
 * AMANA LEMA — DIGITAL BUSINESS CARD CONFIGURATION & LOGIC
 * ============================================================================
 * 
 * To update your permanent card URL or contact details, simply edit the values below.
 * When you change CARD_URL, the on-screen QR code and all sharing functions
 * will automatically update.
 */

// Permanent Digital Card URL (Encoded into QR code & share links)
const CARD_URL = "https://lema-business-card.vercel.app/card";

// Contact Details Configuration Object
const CONTACT = {
  name: "Amana Lema",
  title: "CTO • Technology & Digital Solutions",
  company: "BREDEN TECH SOLUTIONS",
  location: "Arusha, Tanzania",
  
  // Enter phone with country code (e.g. "+255XXXXXXXXX")
  phone: "",
  
  // Enter WhatsApp number (e.g. "+255XXXXXXXXX" or "255XXXXXXXXX")
  whatsapp: "",
  
  // Enter professional email (e.g. "amana@bredentech.com")
  email: "",
  
  // Enter official website URL (e.g. "https://bredentech.com")
  website: "",
  
  // Enter LinkedIn profile URL (e.g. "https://linkedin.com/in/username")
  linkedin: "",
  
  // Enter Instagram profile URL (e.g. "https://instagram.com/username")
  instagram: ""
};

/**
 * Bio Note used in vCard
 */
const PROFESSIONAL_BIO = "Technology entrepreneur and software developer focused on building practical digital solutions, business systems, websites, and technology products for businesses and organizations.";

/**
 * Resolves the effective card URL to encode into the QR code.
 * If CARD_URL is set to production domain, it uses that exact domain.
 * If still set to the default placeholder during local development / testing,
 * it automatically uses the active browser location so scanning with another phone
 * immediately connects to the working page.
 */
function getEffectiveCardUrl() {
  if (CARD_URL && !CARD_URL.includes("YOUR-DOMAIN.com")) {
    return CARD_URL;
  }
  if (typeof window !== "undefined" && window.location && window.location.href && !window.location.href.startsWith("about:")) {
    // Return clean URL without hash or search params
    return window.location.origin + window.location.pathname;
  }
  return CARD_URL;
}

// ============================================================================
// DOM INITIALIZATION & DYNAMIC BINDINGS
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
  initContactButtons();
  initSaveContactAction();
  initQRCodeSection();
  initFooterSocials();
  initShareAction();
});

/**
 * Configure and bind all contact action buttons.
 * Gracefully hides any button whose configuration is empty.
 */
function initContactButtons() {
  // 1. WhatsApp
  const btnWhatsapp = document.getElementById("btn-whatsapp");
  if (btnWhatsapp) {
    if (CONTACT.whatsapp && CONTACT.whatsapp.trim() !== "") {
      const cleanWa = CONTACT.whatsapp.replace(/[^\d+]/g, "").replace(/^\+/, "");
      btnWhatsapp.href = `https://wa.me/${cleanWa}`;
      btnWhatsapp.style.display = "";
    } else {
      btnWhatsapp.style.display = "none";
    }
  }

  // 2. Call / Phone
  const btnCall = document.getElementById("btn-call");
  if (btnCall) {
    if (CONTACT.phone && CONTACT.phone.trim() !== "") {
      const cleanPhone = CONTACT.phone.replace(/\s+/g, "");
      btnCall.href = `tel:${cleanPhone}`;
      btnCall.style.display = "";
    } else {
      btnCall.style.display = "none";
    }
  }

  // 3. Email
  const btnEmail = document.getElementById("btn-email");
  if (btnEmail) {
    if (CONTACT.email && CONTACT.email.trim() !== "") {
      btnEmail.href = `mailto:${encodeURIComponent(CONTACT.email.trim())}`;
      btnEmail.style.display = "";
    } else {
      btnEmail.style.display = "none";
    }
  }

  // 4. Website
  const btnWebsite = document.getElementById("btn-website");
  if (btnWebsite) {
    if (CONTACT.website && CONTACT.website.trim() !== "") {
      let webUrl = CONTACT.website.trim();
      if (!/^https?:\/\//i.test(webUrl)) {
        webUrl = "https://" + webUrl;
      }
      btnWebsite.href = webUrl;
      btnWebsite.style.display = "";
    } else {
      btnWebsite.style.display = "none";
    }
  }

  // 5. LinkedIn
  const btnLinkedin = document.getElementById("btn-linkedin");
  if (btnLinkedin) {
    if (CONTACT.linkedin && CONTACT.linkedin.trim() !== "") {
      let linkedUrl = CONTACT.linkedin.trim();
      if (!/^https?:\/\//i.test(linkedUrl)) {
        linkedUrl = "https://" + linkedUrl;
      }
      btnLinkedin.href = linkedUrl;
      btnLinkedin.style.display = "";
    } else {
      btnLinkedin.style.display = "none";
    }
  }

  // 6. Instagram
  const btnInstagram = document.getElementById("btn-instagram");
  if (btnInstagram) {
    if (CONTACT.instagram && CONTACT.instagram.trim() !== "") {
      let instaUrl = CONTACT.instagram.trim();
      if (!/^https?:\/\//i.test(instaUrl)) {
        instaUrl = "https://" + instaUrl;
      }
      btnInstagram.href = instaUrl;
      btnInstagram.style.display = "";
    } else {
      btnInstagram.style.display = "none";
    }
  }
}

/**
 * Setup Save Contact button to generate and trigger .VCF vCard download
 */
function initSaveContactAction() {
  const saveBtn = document.getElementById("save-contact-btn");
  const statusToast = document.getElementById("save-status");
  if (!saveBtn) return;

  saveBtn.addEventListener("click", () => {
    try {
      downloadVCard();

      // Micro-interaction: button feedback
      const originalText = saveBtn.querySelector(".btn-save-text").textContent;
      saveBtn.querySelector(".btn-save-text").textContent = "✓ CONTACT READY";
      saveBtn.style.filter = "brightness(1.15)";

      if (statusToast) {
        statusToast.textContent = "Contact downloaded. Tap the file to add to phone!";
        statusToast.className = "save-status-toast visible success";
      }

      setTimeout(() => {
        saveBtn.querySelector(".btn-save-text").textContent = originalText;
        saveBtn.style.filter = "";
        if (statusToast) {
          statusToast.className = "save-status-toast";
        }
      }, 3500);
    } catch (err) {
      console.error("Error generating vCard:", err);
      if (statusToast) {
        statusToast.textContent = "Could not generate contact file.";
        statusToast.className = "save-status-toast visible";
      }
    }
  });
}

/**
 * Builds standard compliant vCard 3.0 data string and triggers download
 * Works across iOS Safari, Android Chrome, Apple Contacts, Google Contacts, Outlook
 */
function downloadVCard() {
  const vcardLines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "N:Lema;Amana;;;",
    `FN:${CONTACT.name || "Amana Lema"}`,
    `ORG:${CONTACT.company || "BREDEN TECH SOLUTIONS"}`,
    `TITLE:${CONTACT.title || "CTO • Technology & Digital Solutions"}`,
    "ADR;TYPE=WORK:;;Arusha;Tanzania;;;"
  ];

  // Only include phone if configured
  if (CONTACT.phone && CONTACT.phone.trim() !== "") {
    vcardLines.push(`TEL;TYPE=CELL,VOICE:${CONTACT.phone.trim()}`);
  }

  // Only include email if configured
  if (CONTACT.email && CONTACT.email.trim() !== "") {
    vcardLines.push(`EMAIL;TYPE=PREF,INTERNET:${CONTACT.email.trim()}`);
  }

  // Only include website if configured
  if (CONTACT.website && CONTACT.website.trim() !== "") {
    let siteUrl = CONTACT.website.trim();
    if (!/^https?:\/\//i.test(siteUrl)) siteUrl = "https://" + siteUrl;
    vcardLines.push(`URL:${siteUrl}`);
  }

  // Add notes / bio
  vcardLines.push(`NOTE:${PROFESSIONAL_BIO}`);
  vcardLines.push(`REV:${new Date().toISOString()}`);
  vcardLines.push("END:VCARD");

  const vcardString = vcardLines.join("\r\n");

  // Create Blob with standard MIME type
  const blob = new Blob([vcardString], { type: "text/vcard;charset=utf-8;" });
  const filename = "Amana_Lema_BREDEN_TECH.vcf";

  // Check for msSaveOrOpenBlob (legacy Edge/IE)
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, filename);
    return;
  }

  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.setAttribute("download", filename);
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  downloadLink.click();

  // Cleanup
  setTimeout(() => {
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  }, 250);
}

/**
 * ============================================================================
 * REAL FUNCTIONAL QR CODE GENERATION & ACTIONS
 * ============================================================================
 */
function initQRCodeSection() {
  const qrContainer = document.getElementById("qrcode-display");
  const toast = document.getElementById("qr-toast");
  const shareBtn = document.getElementById("btn-qr-share");
  const copyBtn = document.getElementById("btn-qr-copy");
  const downloadBtn = document.getElementById("btn-qr-download");

  if (!qrContainer) return;

  const targetUrl = getEffectiveCardUrl();

  // 1. Generate High-Resolution QR Code (512x512 Canvas for High-DPI Sharpness)
  try {
    if (typeof QRCode !== "undefined") {
      new QRCode(qrContainer, {
        text: targetUrl,
        width: 512,
        height: 512,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    } else {
      console.warn("QRCode library not loaded, attempting fallback render.");
      renderFallbackQR(qrContainer, targetUrl);
    }
  } catch (err) {
    console.error("QR Code generation error:", err);
    renderFallbackQR(qrContainer, targetUrl);
  }

  // 2. Share Card Button Action
  if (shareBtn) {
    shareBtn.addEventListener("click", async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: "Amana Lema | CTO • Technology & Digital Solutions",
            text: "Scan or open Amana Lema's Digital Business Card:",
            url: targetUrl
          });
          return;
        } catch (err) {
          if (err.name === "AbortError") return;
        }
      }

      // Fallback: Copy link
      copyTextToClipboard(targetUrl, () => {
        showQrToast("Card link copied!");
      });
    });
  }

  // 3. Copy Link Action
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      copyTextToClipboard(targetUrl, () => {
        showQrToast("Card link copied!");
      });
    });
  }

  // 4. Download QR Code as High-Resolution PNG
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      downloadQRCodePNG();
    });
  }

  function showQrToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.className = "qr-toast visible";
    setTimeout(() => {
      toast.className = "qr-toast";
    }, 2800);
  }
}

/**
 * Downloads the generated QR code as a clean, high-resolution PNG with quiet zone padding.
 */
function downloadQRCodePNG() {
  const qrContainer = document.getElementById("qrcode-display");
  if (!qrContainer) return;

  const existingCanvas = qrContainer.querySelector("canvas");
  if (!existingCanvas) {
    console.error("Canvas element not found for QR download");
    return;
  }

  // Create an export canvas with clean white quiet-zone padding (600x600)
  const exportCanvas = document.createElement("canvas");
  const exportSize = 640;
  const padding = 50;
  exportCanvas.width = exportSize;
  exportCanvas.height = exportSize;

  const ctx = exportCanvas.getContext("2d");
  // Fill solid white background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, exportSize, exportSize);

  // Draw the QR code centered with quiet-zone padding
  ctx.drawImage(existingCanvas, padding, padding, exportSize - (padding * 2), exportSize - (padding * 2));

  // Trigger download
  const link = document.createElement("a");
  link.download = "amana-lema-business-card-qr.png";
  link.href = exportCanvas.toDataURL("image/png");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  const toast = document.getElementById("qr-toast");
  if (toast) {
    toast.textContent = "QR Code downloaded (PNG)";
    toast.className = "qr-toast visible";
    setTimeout(() => {
      toast.className = "qr-toast";
    }, 2800);
  }
}

/**
 * Fallback QR code renderer using standard SVG/image endpoint if local script fails
 */
function renderFallbackQR(container, url) {
  const img = document.createElement("img");
  img.src = `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(url)}&margin=1`;
  img.alt = "Amana Lema Digital Business Card QR Code";
  img.width = 224;
  img.height = 224;
  container.innerHTML = "";
  container.appendChild(img);
}

/**
 * Helper to copy text to clipboard with fallback
 */
function copyTextToClipboard(text, onSuccess) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(onSuccess).catch(() => {
      fallbackCopy(text, onSuccess);
    });
  } else {
    fallbackCopy(text, onSuccess);
  }
}

function fallbackCopy(text, onSuccess) {
  const input = document.createElement("input");
  input.value = text;
  document.body.appendChild(input);
  input.select();
  try {
    document.execCommand("copy");
    if (onSuccess) onSuccess();
  } catch (e) {
    console.error("Fallback copy failed", e);
  }
  document.body.removeChild(input);
}

/**
 * Dynamically populate footer social icons only if URLs are provided
 */
function initFooterSocials() {
  const container = document.getElementById("footer-socials");
  if (!container) return;
  container.innerHTML = "";

  const socials = [
    {
      key: "whatsapp",
      title: "WhatsApp",
      getUrl: (val) => `https://wa.me/${val.replace(/[^\d+]/g, "").replace(/^\+/, "")}`,
      svg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"></path><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"></path></svg>'
    },
    {
      key: "linkedin",
      title: "LinkedIn",
      getUrl: (val) => /^https?:\/\//i.test(val) ? val : "https://" + val,
      svg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>'
    },
    {
      key: "instagram",
      title: "Instagram",
      getUrl: (val) => /^https?:\/\//i.test(val) ? val : "https://" + val,
      svg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>'
    },
    {
      key: "website",
      title: "Website",
      getUrl: (val) => /^https?:\/\//i.test(val) ? val : "https://" + val,
      svg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>'
    }
  ];

  socials.forEach(item => {
    const val = CONTACT[item.key];
    if (val && val.trim() !== "") {
      const a = document.createElement("a");
      a.className = "footer-social-link";
      a.href = item.getUrl(val.trim());
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.setAttribute("aria-label", `Amana Lema ${item.title}`);
      a.innerHTML = item.svg;
      container.appendChild(a);
    }
  });
}

/**
 * Setup Header Share Card modal and Web Share API
 */
function initShareAction() {
  const shareBtn = document.getElementById("share-card-btn");
  const modal = document.getElementById("share-modal");
  const closeBtn = document.getElementById("close-modal-btn");
  const urlInput = document.getElementById("share-url-input");
  const copyBtn = document.getElementById("copy-url-btn");
  const feedback = document.getElementById("copy-feedback");

  if (!shareBtn || !modal) return;

  const currentUrl = getEffectiveCardUrl();
  if (urlInput) urlInput.value = currentUrl;

  shareBtn.addEventListener("click", async () => {
    // Attempt native mobile share sheet if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Amana Lema | CTO • Technology & Digital Solutions",
          text: "Connect with Amana Lema — CTO at BREDEN TECH SOLUTIONS",
          url: currentUrl
        });
        return;
      } catch (err) {
        if (err.name !== "AbortError") {
          console.warn("Native share error, falling back to modal", err);
        } else {
          return;
        }
      }
    }

    // Modal fallback
    if (typeof modal.showModal === "function") {
      modal.showModal();
    } else {
      modal.setAttribute("open", "true");
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      if (typeof modal.close === "function") {
        modal.close();
      } else {
        modal.removeAttribute("open");
      }
    });
  }

  // Close when clicking modal backdrop
  modal.addEventListener("click", (e) => {
    const rect = modal.getBoundingClientRect();
    const isInDialog = (
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width
    );
    if (!isInDialog) {
      if (typeof modal.close === "function") modal.close();
      else modal.removeAttribute("open");
    }
  });

  // Copy link inside modal
  if (copyBtn && urlInput) {
    copyBtn.addEventListener("click", () => {
      copyTextToClipboard(urlInput.value, () => {
        if (feedback) feedback.textContent = "Link copied to clipboard!";
        copyBtn.textContent = "Copied!";
        setTimeout(() => {
          if (feedback) feedback.textContent = "";
          copyBtn.textContent = "Copy";
        }, 2500);
      });
    });
  }
}

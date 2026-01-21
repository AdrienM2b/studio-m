(() => {
  const STORAGE_KEY = "cookie_consent_status";
  const ACCEPTED = "accepted";
  const REJECTED = "rejected";
  const BANNER_ID = "cookie-consent-banner";
  const STYLE_ID = "cookie-consent-banner-style";

  const getConsent = () => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  };

  const setConsent = (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (error) {
      // Ignore storage errors (private mode, blocked storage, etc.).
    }
  };

  const injectStyles = () => {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #${BANNER_ID} {
        position: fixed;
        left: 16px;
        right: 16px;
        bottom: 16px;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 16px 18px;
        color: #f5f5f5;
        background: rgba(16, 18, 20, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 14px;
        box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
        font-family: inherit;
        font-size: 0.95rem;
        line-height: 1.4;
        backdrop-filter: blur(10px);
        transition: opacity 0.2s ease, transform 0.2s ease;
      }

      #${BANNER_ID}.is-hidden {
        opacity: 0;
        transform: translateY(10px);
      }

      #${BANNER_ID} .cookie-consent__content {
        display: grid;
        gap: 6px;
        max-width: 640px;
      }

      #${BANNER_ID} .cookie-consent__title {
        font-weight: 600;
        font-size: 1rem;
      }

      #${BANNER_ID} .cookie-consent__link {
        color: #f7d774;
        text-decoration: none;
        font-weight: 600;
      }

      #${BANNER_ID} .cookie-consent__link:hover {
        text-decoration: underline;
      }

      #${BANNER_ID} .cookie-consent__actions {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
      }

      #${BANNER_ID} .cookie-consent__btn {
        border: none;
        border-radius: 10px;
        padding: 10px 14px;
        font-weight: 600;
        font-size: 0.9rem;
        cursor: pointer;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }

      #${BANNER_ID} .cookie-consent__btn:focus-visible {
        outline: 2px solid #f7d774;
        outline-offset: 2px;
      }

      #${BANNER_ID} .cookie-consent__btn-accept {
        color: #141618;
        background: #f7d774;
        box-shadow: 0 10px 20px rgba(247, 215, 116, 0.35);
      }

      #${BANNER_ID} .cookie-consent__btn-accept:hover {
        transform: translateY(-1px);
      }

      #${BANNER_ID} .cookie-consent__btn-reject {
        color: #f5f5f5;
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.24);
      }

      @media (max-width: 720px) {
        #${BANNER_ID} {
          flex-direction: column;
          align-items: stretch;
        }

        #${BANNER_ID} .cookie-consent__actions {
          width: 100%;
        }

        #${BANNER_ID} .cookie-consent__btn {
          flex: 1;
          text-align: center;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        #${BANNER_ID} {
          transition: none;
        }

        #${BANNER_ID} .cookie-consent__btn {
          transition: none;
        }
      }
    `;
    document.head.appendChild(style);
  };

  const buildBanner = () => {
    if (document.getElementById(BANNER_ID)) return;

    injectStyles();

    const banner = document.createElement("div");
    banner.id = BANNER_ID;
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-live", "polite");
    banner.innerHTML = `
      <div class="cookie-consent__content">
        <div class="cookie-consent__title">Cookies</div>
        <div>
          Nous utilisons des cookies pour mesurer l'audience et ameliorer votre experience.
          Vous pouvez accepter ou refuser.
          <a class="cookie-consent__link" href="confidentialite.html">En savoir plus</a>.
        </div>
      </div>
      <div class="cookie-consent__actions">
        <button class="cookie-consent__btn cookie-consent__btn-reject" type="button" data-action="reject">
          Refuser
        </button>
        <button class="cookie-consent__btn cookie-consent__btn-accept" type="button" data-action="accept">
          Accepter
        </button>
      </div>
    `;

    const acceptButton = banner.querySelector('[data-action="accept"]');
    const rejectButton = banner.querySelector('[data-action="reject"]');

    const closeBanner = () => {
      banner.classList.add("is-hidden");
      window.setTimeout(() => banner.remove(), 200);
    };

    if (acceptButton) {
      acceptButton.addEventListener("click", () => {
        setConsent(ACCEPTED);
        closeBanner();
      });
    }

    if (rejectButton) {
      rejectButton.addEventListener("click", () => {
        setConsent(REJECTED);
        closeBanner();
      });
    }

    document.body.appendChild(banner);
  };

  const initBanner = () => {
    if (getConsent()) return;

    if (!document.body) {
      window.setTimeout(initBanner, 50);
      return;
    }

    buildBanner();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBanner);
  } else {
    initBanner();
  }
})();

(function () {
  const doc = window.document;

  const spaClickHandler = async (e) => {
    const link = e.target.closest("a");
    if (!link) return;

    // Ignore external links, hash links, or links with target="_blank"
    const url = new URL(link.href);
    if (url.origin !== window.location.origin || link.hash || link.target === "_blank" || link.hasAttribute("data-no-spa")) {
      return;
    }

    e.preventDefault();

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      const html = await response.text();

      const parser = new DOMParser();
      const newDoc = parser.parseFromString(html, "text/html");

      // Requesting to replace everything, so we target documentElement
      doc.documentElement.replace(newDoc.documentElement);

      // Update history
      window.history.pushState({}, "", url);
    } catch (error) {
      console.error("EasyJS SPA Error:", error);
      window.location.href = url;
    }
  };

  const spaPopstateHandler = async () => {
    try {
      const response = await fetch(window.location.href);
      if (!response.ok) throw new Error("Network response was not ok");
      const html = await response.text();

      const parser = new DOMParser();
      const newDoc = parser.parseFromString(html, "text/html");

      doc.documentElement.replace(newDoc.documentElement);
    } catch (error) {
      console.error("EasyJS SPA Error (popstate):", error);
      window.location.reload();
    }
  };

  window.enableSPA = function () {
    doc.addEventListener("click", spaClickHandler);
    window.addEventListener("popstate", spaPopstateHandler);
  };

  window.disableSPA = function () {
    doc.removeEventListener("click", spaClickHandler);
    window.removeEventListener("popstate", spaPopstateHandler);
  };

  if (document.documentElement.hasAttribute("spa")) {
    window.enableSPA();
  }
})();

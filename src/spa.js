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
      window.dispatchEvent(new Event("load"));
      window.dispatchEvent(new Event("DOMContentLoaded"));
      document.dispatchEvent(new Event("DOMContentLoaded"));
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Update history
      window.history.pushState({}, "", url);
    } catch (error) {
      console.error("EasyJS SPA Error:", error);
      window.location.href = url;
    }
  };

  const spaPopstateHandler = async (e) => {
    // If the state object contains a hash, it means we might be navigating to a hash on the current page.
    // However, the spaClickHandler explicitly ignores hash links, so popstate should primarily handle full URL changes.
    // If the URL only changed its hash, the browser typically handles scrolling, and we don't need to refetch the page.
    // We only proceed with fetching if the pathname or search parameters have changed.
    const currentPath = window.location.pathname + window.location.search;
    const previousPath = e.state ? e.state.path : null; // Assuming we store path in state when pushing

    if (previousPath && currentPath === previousPath && window.location.hash) {
      // This scenario implies a popstate event where only the hash changed,
      // which is unlikely if spaClickHandler ignores hash links.
      // If it happens, the browser's default scroll-to-hash behavior should suffice.
      return;
    }

    try {
      const response = await fetch(window.location.href);
      if (!response.ok) throw new Error("Network response was not ok");
      const html = await response.text();

      const parser = new DOMParser();
      const newDoc = parser.parseFromString(html, "text/html");

      doc.documentElement.replace(newDoc.documentElement);
      window.dispatchEvent(new Event("load"));
      window.dispatchEvent(new Event("DOMContentLoaded"));
      document.dispatchEvent(new Event("DOMContentLoaded"));
      window.scrollTo({ top: 0, behavior: "smooth" });
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

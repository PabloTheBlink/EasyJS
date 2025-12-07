(function () {
  HTMLElement.prototype.replace = function (newContent) {
    let newElement;
    if (typeof newContent === "string") {
      const temp = document.createElement("div");
      temp.innerHTML = newContent;
      newElement = temp.firstElementChild;
    } else if (newContent instanceof HTMLElement) {
      newElement = newContent;
    } else {
      console.error("EasyJS: replace expects a string or HTMLElement");
      return;
    }

    if (!newElement) return;

    if (this.tagName !== newElement.tagName) {
      this.replaceWith(newElement);
      return;
    }

    updateElementNode(this, newElement);
  };

  function updateElementNode(originalChild, updatedChild) {
    updateAttributes(originalChild, updatedChild);
    updateChildren(originalChild, updatedChild);
  }

  function updateAttributes(originalChild, updatedChild) {
    Array.from(originalChild.attributes || []).forEach((attr) => {
      if (updatedChild.hasAttribute(attr.name)) return;
      originalChild.removeAttribute(attr.name);
    });

    Array.from(updatedChild.attributes || []).forEach((attr) => {
      if (!originalChild.hasAttribute(attr.name) || originalChild.getAttribute(attr.name) !== attr.value) {
        originalChild.setAttribute(attr.name, attr.value);
      }
    });
  }

  function updateChildren(container, clone) {
    const originalChildren = container.childNodes;
    const updatedChildren = clone.childNodes;
    let maxLength = Math.max(originalChildren.length, updatedChildren.length);

    for (let i = 0; i < maxLength; i++) {
      const originalChild = originalChildren[i];
      const updatedChild = updatedChildren[i];

      if (!originalChild && updatedChild) {
        const newChild = updatedChild.nodeType === Node.ELEMENT_NODE && updatedChild.tagName === "SCRIPT" ? createExecutableScript(updatedChild) : updatedChild.cloneNode(true);
        container.appendChild(newChild);
      } else if (originalChild && !updatedChild) {
        originalChild.remove();
        i--;
        maxLength--;
      } else if (originalChild && updatedChild) {
        updateChild(originalChild, updatedChild);
      }
    }
  }

  function updateChild(originalChild, updatedChild) {
    if (originalChild.nodeType === Node.TEXT_NODE && updatedChild.nodeType === Node.TEXT_NODE) {
      if (originalChild.textContent !== updatedChild.textContent) {
        originalChild.textContent = updatedChild.textContent;
      }
    } else if (originalChild.nodeType === Node.ELEMENT_NODE && updatedChild.nodeType === Node.ELEMENT_NODE) {
      if (originalChild.tagName === updatedChild.tagName) {
        updateElementNode(originalChild, updatedChild);
      } else {
        const clonedNode = updatedChild.tagName === "SCRIPT" ? createExecutableScript(updatedChild) : updatedChild.cloneNode(true);
        originalChild.replaceWith(clonedNode);
      }
    } else {
      const clonedNode = updatedChild.nodeType === Node.ELEMENT_NODE && updatedChild.tagName === "SCRIPT" ? createExecutableScript(updatedChild) : updatedChild.cloneNode(true);
      originalChild.replaceWith(clonedNode);
    }
  }

  function createExecutableScript(oldScript) {
    const newScript = document.createElement("script");
    Array.from(oldScript.attributes).forEach((attr) => newScript.setAttribute(attr.name, attr.value));
    newScript.textContent = oldScript.textContent;
    return newScript;
  }
})();

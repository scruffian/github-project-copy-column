// ==UserScript==
// @name         GitHub Project Copy Column
// @namespace    https://github.com/scruffian/github-project-copy-column
// @version      0.1
// @description  Grab links from a GitHub project column and copy them to the clipboard for easy pasting into a PR or issue description.
// @author       Scriffian
// @match        https://github.com/*
// @icon         https://raw.githubusercontent.com/xthexder/wide-github/master/icons/icon.png
// @grant        none
// @licence      GPLv2 or later
// ==/UserScript==

(function () {
  "use strict";
  const copyToClipboardHelper = (textToCopy) => {
    let finalText = textToCopy;

    if (textToCopy.current) {
      const parentElement = textToCopy.current.parentElement;
      const savedDisplay = parentElement.style.display;
      parentElement.style.display = "block";
      finalText = textToCopy.current.innerText.replace(/([0-9]+)/g, "\r\n$1. ");
      parentElement.style.display = savedDisplay;
    }

    const textarea = document.createElement("textarea");
    textarea.value = finalText;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  };

  const columns = document.querySelectorAll("div[data-board-column]");
  columns.forEach(function (column) {
    const titleDiv = column.querySelector("div > div");
    const number = column.querySelector(
      "div > div [data-testid=column-items-counter]"
    );
    let link = document.createElement("span");

    number.title = "Copy URLs of all cards";
    number.onclick = function () {
      const scrollableArea = column.querySelector(".column-drop-zone");
      scrollableArea.scrollTop = 0;
      const allLinks = [];

      const getLinks = setInterval(function () {
        if (
          scrollableArea.scrollTop + scrollableArea.offsetHeight + 1 >=
          scrollableArea.scrollHeight
        ) {
          clearInterval(getLinks);
          const uniqueLinks = new Set(allLinks);
          const linksString = Array.from(uniqueLinks).join("\n\n");
          copyToClipboardHelper(linksString);
          alert("Copied " + uniqueLinks.size + " links to clipbard");
        }
        scrollableArea.scrollTop =
          scrollableArea.scrollTop + scrollableArea.offsetHeight;
        const linksForScrollPoint = column.querySelectorAll(
          "[data-testid=board-view-column-card] a"
        );
        linksForScrollPoint.forEach(function (link) {
          if (link.href) {
            allLinks.push(link.href);
          }
        });
      }, 150);
    };
  });
})();

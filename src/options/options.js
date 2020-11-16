// Saves options to chrome.storage
function save_options() {
  var autoScroll = {
    stackoverflow: document.getElementById("stackoverflow-auto-scroll").checked,
    github: document.getElementById("github-auto-scroll").checked,
  };

  chrome.storage.sync.set(
    {
      autoScroll,
    },
    function () {
      // Update status to let user know options were saved.
      var status = document.getElementById("status");
      status.textContent = "Options saved!";
      setTimeout(function () {
        status.textContent = "";
      }, 1000);
    }
  );
}

function restore_options() {
  chrome.storage.sync.get(
    {
      autoScroll: {
        github: false,
        stackoverflow: false
      },
    },
    function (items) {
      const autoScroll = items.autoScroll;
      document.getElementById("stackoverflow-auto-scroll").checked = autoScroll.stackoverflow;
      document.getElementById("github-auto-scroll").checked = autoScroll.github;
    }
  );
}
document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save-options-button").addEventListener("click", save_options);

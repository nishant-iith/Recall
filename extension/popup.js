const RECALL_URL = "https://recall-alpha.vercel.app";

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('card-form');
  const submitBtn = document.getElementById('submit-btn');
  const statusDiv = document.getElementById('status');
  const hierarchySelect = document.getElementById('hierarchy');
  const authWarning = document.getElementById('auth-warning');
  const questionInput = document.getElementById('question');
  const answerInput = document.getElementById('answer');

  // Load selection if available
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "getSelection"}, function(response) {
      if (response && response.selection) {
        answerInput.value = response.selection;
      }
    });
  });

  // Fetch Hierarchy
  try {
    const res = await fetch(`${RECALL_URL}/api/hierarchy`, {
        credentials: 'include' // Important: Send cookies!
    });
    if (res.status === 401) {
      authWarning.style.display = 'block';
      submitBtn.disabled = true;
      return;
    }
    const data = await res.json();
    if (data.hierarchy) {
      data.hierarchy.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = `${item.type === 'field' ? '' : (item.type === 'topic' ? '- ' : '-- ')}${item.name}`;
        hierarchySelect.appendChild(option);
      });
    }
  } catch (err) {
    statusDiv.textContent = "Failed to connect to Recall. Is localhost:3000 running?";
    statusDiv.className = "status error";
  }

  // Handle Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = "Saving...";
    statusDiv.style.display = 'none';

    try {
      const res = await fetch(`${RECALL_URL}/api/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important: Send cookies!
        body: JSON.stringify({
          question: questionInput.value,
          answer: answerInput.value,
          hierarchy_id: hierarchySelect.value || null
        })
      });

      if (res.ok) {
        statusDiv.textContent = "Saved!";
        statusDiv.className = "status success";
        setTimeout(() => window.close(), 1000);
      } else {
        const err = await res.json();
        throw new Error(err.error || "Failed");
      }
    } catch (err) {
      statusDiv.textContent = err.message;
      statusDiv.className = "status error";
      submitBtn.textContent = "Add Flashcard";
      submitBtn.disabled = false;
    }
  });
});

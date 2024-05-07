const form = document.getElementById('submission-form');
const calculateButton = document.getElementById('calculate-button');

form.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent form submission
  const blockchainAddress = document.getElementById('blockchain-address').value;
  const cryptocurrency = document.getElementById('cryptocurrency').value;
  const textileMaterial = document.getElementById('textile-material').value;
  const textileWeight = document.getElementById('textile-weight').value;
  
  // Gather any additional data from other form fields as needed
  
  // Example of sending data to server using fetch
  fetch('/contribute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ blockchainAddress, cryptocurrency, textileMaterial, textileWeight }) // Include any additional data here
  })
  .then(response => {
    if (response.ok) {
      console.log('Submission successful!');
      // Optionally, provide feedback to the user
    } else {
      console.error('Submission failed.');
      // Optionally, provide feedback to the user
    }
  })
  .catch(error => {
    console.error('Error submitting data:', error);
    // Optionally, provide feedback to the user
  });
});

calculateButton.addEventListener('click', async () => {
  const cryptocurrency = document.getElementById('cryptocurrency').value;
  const textileMaterial = document.getElementById('textile-material').value;
  const textileWeight = document.getElementById('textile-weight').value;

  try {
    const response = await fetch('/calculateIncentive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cryptocurrency, textileMaterial, textileWeight }),
    });
    const data = await response.json();
    const incentiveReward = data.incentiveReward;
    displayIncentiveReward(incentiveReward);
  } catch (error) {
    console.error('Error calculating incentive:', error);
  }
});

function displayIncentiveReward(incentiveReward) {
  const incentiveRewardField = document.getElementById('incentive-reward-container');
  incentiveRewardField.textContent = `Incentive Reward: ${incentiveReward} USD`;
}

const popup = document.getElementById("popup");

function showPopup() {
  popup.classList.remove("hidden");
}

function hidePopup() {
  popup.classList.add("hidden");
}

document.getElementById("submission-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  // Send the form data to the server using fetch or XMLHttpRequest
  // ...

  // Show the pop-up window
  showPopup();
});
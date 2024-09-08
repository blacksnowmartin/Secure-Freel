
// Handle anonymous profile creation
document.getElementById('profile-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const role = document.getElementById('role').value;

    document.getElementById('profile-output').innerHTML = `<p>Profile Created: ${username} (${role})</p>`;
});

// Handle placing a bid on a project
function placeBid(projectName) {
    document.getElementById('bid-output').innerHTML = `<p>You placed a bid on: ${projectName}</p>`;
}

// Handle M-Pesa payment submission
document.getElementById('payment-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const amount = document.getElementById('amount').value;

    document.getElementById('payment-output').innerHTML = `<p>Payment of KES ${amount} via M-Pesa successful!</p>`;
});

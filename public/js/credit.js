document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('credit-form');
    const amountInput = document.getElementById('credit-amount');
    const amountError = document.getElementById('credit-amount-error');
    const acknowledgment = document.getElementById('acknowledgment');

    //function to send transaction data

    async function sendTransactionData(url, data) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            console.log(result.message);
        } catch (error) {
            console.error('Error:', error);
        }
    }
//Submission Handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        //Validation of credit amount

        const amount = parseFloat(amountInput.value);
        if (isNaN(amount) || amount <= 0 || amount > 500000) {
            amountError.textContent = 'The amount cannot be credited. Maximum limit is ₹500,000.';
            return;
        }

        amountError.textContent = '';
        //Updating the balance and Displaying the acknowledgement

        const currentBalance = parseFloat(localStorage.getItem('balance') || '0');
        const newBalance = currentBalance + amount;
        localStorage.setItem('balance', newBalance.toString());

        acknowledgment.textContent = `Amount ₹${amount} successfully credited to your account. Your new balance is ₹${newBalance}.`;

        // Send transaction data to the server
        await sendTransactionData('/api/transactions/credit', { amount });

        // Reset form
        form.reset();
    });
});

// The beforeunload event listener has been removed, so the alert box will no longer appear.

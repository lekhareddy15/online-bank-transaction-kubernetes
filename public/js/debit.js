document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('debit-form');
    const acknowledgment = document.getElementById('acknowledgment');

    const fields = [
        { id: 'user-name', regex: /[A-Za-z\s]{3,30}$/, error: 'User Name must be 3 to 30 letters.' },
        { id: 'account-number', regex: /^\d{12}$/, error: 'Account Number must be 12 digits.' },
        { id: 'retype-account-number', regex: /^\d{12}$/, error: 'Re-enter recipient account number' },
        { id: 'ifsc-code', regex: /^[A-Z]{4}0[A-Z0-9]{6}$/, error: 'Invalid IFSC Code.' },
        { id: 'phone-number', regex: /^\d{10}$/, error: 'Phone Number must be 10 digits.' },
        { id: 'email', regex: /^[^\s@]+@[^\s@]+\.com$/, error: 'Invalid email address.' },
        { id: 'debit-amount', regex: /^\d+(\.\d{1,2})?$/, error: 'Invalid amount.' }
    ];

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

    // Add event listeners for real-time validation
    fields.forEach(field => {
        const input = document.getElementById(field.id);
        input.addEventListener('input', () => validateField(field));
    });

    // Add event listener for account number matching
    const retypeAccountNumber = document.getElementById('retype-account-number');
    retypeAccountNumber.addEventListener('input', validateAccountMatch);

    // Add event listener for IFSC code uppercase conversion
    const ifscCodeInput = document.getElementById('ifsc-code');
    ifscCodeInput.addEventListener('input', () => {
        ifscCodeInput.value = ifscCodeInput.value.toUpperCase();
    });

    // Add input restrictions for account number, re-type account number, and phone number
    const restrictInputToDigits = (inputElement) => {
        inputElement.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    };

    restrictInputToDigits(document.getElementById('account-number'));
    restrictInputToDigits(document.getElementById('retype-account-number'));
    restrictInputToDigits(document.getElementById('phone-number'));

    // Prevent numbers in user name field
    const userNameInput = document.getElementById('user-name');
    userNameInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[0-9]/g, '');
    });

    // Convert email to lowercase
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.toLowerCase();
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (validateForm()) {
            const amount = parseFloat(document.getElementById('debit-amount').value);
            const currentBalance = parseFloat(localStorage.getItem('balance') || '0');
            const accountNumber = document.getElementById('account-number').value;

            // Check if the account number is the same as the user's account
            if (accountNumber === '562123459856') {
                document.getElementById('account-number-error').textContent = 'Cannot transfer to the same account.';
                return;
            }

            if (amount > currentBalance) {
                document.getElementById('debit-amount-error').textContent = 'Insufficient balance.';
                return;
            }

            const newBalance = currentBalance - amount;
            localStorage.setItem('balance', newBalance.toString());

            acknowledgment.textContent = `The amount ₹${amount} has been debited successfully from your account. Your new balance is ₹${newBalance}.`;

            // Send transaction data to the server
            const formData = {
                amount,
                userName: document.getElementById('user-name').value,
                accountNumber: accountNumber,
                ifscCode: document.getElementById('ifsc-code').value,
                phoneNumber: document.getElementById('phone-number').value,
                email: document.getElementById('email').value
            };
            await sendTransactionData('/api/transactions/debit', formData);

            form.reset();
            fields.forEach(field => {
                document.getElementById(`${field.id}-error`).textContent = '';
            });
        }
    });

    function validateField(field) {
        const input = document.getElementById(field.id);
        const error = document.getElementById(`${field.id}-error`);

        if (!field.regex.test(input.value)) {
            error.textContent = field.error;
            return false;
        } else {
            error.textContent = '';
            return true;
        }
    }

    function validateAccountMatch() {
        const accountNumber = document.getElementById('account-number').value;
        const retypeAccountNumber = document.getElementById('retype-account-number').value;
        const error = document.getElementById('retype-account-number-error');

        if (retypeAccountNumber.length !== 12) {
            error.textContent = 'Recipient Account Number must be 12 digits.';
            return false;
        } else if (accountNumber !== retypeAccountNumber) {
            error.textContent = 'Recipient number doesn\'t match.';
            return false;
        } else {
            error.textContent = '';
            return true;
        }
    }

    function validateForm() {
        let isValid = true;

        fields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        if (!validateAccountMatch()) {
            isValid = false;
        }

        return isValid;
    }
});
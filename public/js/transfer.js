document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('transfer-form');
    const acknowledgment = document.getElementById('acknowledgment');

    const fields = [
        { id: 'recipient-name', regex: /[A-Za-z\s]{3,30}$/, error: 'Recipient Name must be 3 to 30 letters.' },
        { id: 'recipient-account-number', regex: /^\d{12}$/, error: 'Recipient Account Number must be 12 digits.' },
        { id: 're-enter-recipient-account-number', regex: /^\d{12}$/, error: 'Re-enter Recipient Account Number ' },
        { id: 'recipient-ifsc-code', regex: /^[A-Z]{4}0[A-Z0-9]{6}$/, error: 'Invalid IFSC Code.' },
        { id: 'pan-number', regex: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, error: 'Invalid PAN Card Number.' },
        { id: 'account-type', regex: /.+/, error: 'Please select an account type.' },
        { id: 'transfer-amount', regex: /^\d+(\.\d{1,2})?$/, error: 'Invalid amount.' }
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

    fields.forEach(field => {
        const input = document.getElementById(field.id);
        if (field.id === 'pan-number') {
            input.addEventListener('input', () => {
                input.value = input.value.toUpperCase(); // Convert to uppercase
                validateField(field);
            });
        } else if (field.id === 're-enter-recipient-account-number') {
            input.addEventListener('input', () => validateReEnteredAccountNumber());
        } else {
            input.addEventListener('input', () => validateField(field));
        }
    });

    // Add input restrictions for recipient account number fields
    const restrictInputToDigits = (inputElement) => {
        inputElement.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    };

    restrictInputToDigits(document.getElementById('recipient-account-number'));
    restrictInputToDigits(document.getElementById('re-enter-recipient-account-number'));

    // Prevent numbers in recipient name field
    const recipientNameInput = document.getElementById('recipient-name');
    recipientNameInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[0-9]/g, '');
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            const amount = parseFloat(document.getElementById('transfer-amount').value);
            const currentBalance = parseFloat(localStorage.getItem('balance') || '0');
            
            if (amount > currentBalance) {
                document.getElementById('transfer-amount-error').textContent = 'Insufficient balance.';
                return;
            }

            const newBalance = currentBalance - amount;
            localStorage.setItem('balance', newBalance.toString());

            const recipientName = document.getElementById('recipient-name').value;
            acknowledgment.textContent = `Amount ₹${amount} successfully transferred from your account to ${recipientName}'s account. Your new balance is ₹${newBalance}.`;
            
            // Send transaction data to the server
            const formData = {
                amount,
                recipientName,
                recipientAccountNumber: document.getElementById('recipient-account-number').value,
                recipientIfscCode: document.getElementById('recipient-ifsc-code').value,
                panNumber: document.getElementById('pan-number').value,
                accountType: document.getElementById('account-type').value
            };
            await sendTransactionData('/api/transactions/transfer', formData);

            form.reset();
            fields.forEach(field => {
                document.getElementById(`${field.id}-error`).textContent = '';
            });
            document.getElementById('user-account-number').value = '562123459856';
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

    function validateReEnteredAccountNumber() {
        const recipientAccountNumber = document.getElementById('recipient-account-number').value;
        const reEnterRecipientAccountNumber = document.getElementById('re-enter-recipient-account-number');
        const error = document.getElementById('re-enter-recipient-account-number-error');

        if (reEnterRecipientAccountNumber.value.length < 12) {
            error.textContent = 'Re-enter recipient account number';
            return false;
        } else if (recipientAccountNumber !== reEnterRecipientAccountNumber.value) {
            error.textContent = "Recipient number doesn't match.";
            return false;
        } else {
            error.textContent = '';
            return true;
        }
    }

    function validateForm() {
        let isValid = true;

        fields.forEach(field => {
            if (field.id !== 're-enter-recipient-account-number' && !validateField(field)) {
                isValid = false;
            }
        });

        if (!validateReEnteredAccountNumber()) {
            isValid = false;
        }

        const userAccountNumber = document.getElementById('user-account-number').value;
        const recipientAccountNumber = document.getElementById('recipient-account-number').value;
        const recipientAccountError = document.getElementById('recipient-account-number-error');

        if (userAccountNumber === recipientAccountNumber) {
            recipientAccountError.textContent = 'Recipient account number cannot be the same as your account number.';
            isValid = false;
        }

        return isValid;
    }
});
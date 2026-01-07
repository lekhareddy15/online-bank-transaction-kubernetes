document.addEventListener('DOMContentLoaded', () => {
    const balance = localStorage.getItem('balance');
    if (balance) {
        document.getElementById('balance').textContent = balance;
    } else {
        localStorage.setItem('balance', '100000');
    }
});
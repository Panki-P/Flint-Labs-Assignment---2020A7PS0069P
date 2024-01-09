document.addEventListener('DOMContentLoaded', function () {
    const contractAddresses = {
        Mantle: '0xDCBc586cAb42a1D193CaCD165a81E5fbd9B428d7',
        Linea: '0xDCBc586cAb42a1D193CaCD165a81E5fbd9B428d7',
        Kroma: '0x7afb9de72A9A321fA535Bb36b7bF0c987b42b859',
    };

    // Replace 'YOUR_API_ENDPOINT' with the actual API endpoint to fetch balance and change.
    const apiEndpoint = 'YOUR_API_ENDPOINT';

    const ctx = document.getElementById('balanceChart').getContext('2d');
    const balanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Token Balance',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                data: [],
            }],
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                },
                y: {
                    beginAtZero: true,
                },
            },
        },
    });

    function fetchBalance(contractAddress) {
        fetch(apiEndpoint + '?contract=' + contractAddress)
            .then(response => response.json())
            .then(data => {
                const balanceData = {
                    balance: data.balance,
                    change: data.change,
                };

                displayBalance(balanceData.balance);
                displayChange(balanceData.change);
                updateChart(balanceData.balance);

                if (balanceData.change <= -10) {
                    showAlert(contractAddress);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    function displayBalance(balance) {
        document.getElementById('balance').textContent = `Balance: ${balance} tokens`;
    }

    function displayChange(change) {
        document.getElementById('change').textContent = `Change (last 12 hours): ${change}%`;
    }

    function updateChart(balance) {
        const timeLabel = new Date().toLocaleTimeString();
        balanceChart.data.labels.push(timeLabel);
        balanceChart.data.datasets[0].data.push(balance);

        if (balanceChart.data.labels.length > 10) {
            balanceChart.data.labels.shift();
            balanceChart.data.datasets[0].data.shift();
        }

        balanceChart.update();
    }

    function showAlert(contractAddress) {
        Toastify({
            text: `Warning: Balance for contract ${contractAddress} reduced by 10% or more in the last 12 hours!`,
            backgroundColor: 'linear-gradient(to right, #FF8C00, #FFD700)',
        }).showToast();
    }

    for (const chain in contractAddresses) {
        fetchBalance(contractAddresses[chain]);
    }

    setInterval(() => {
        for (const chain in contractAddresses) {
            fetchBalance(contractAddresses[chain]);
        }
    }, 300000);
});

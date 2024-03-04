document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('productionPlanChart').getContext('2d');
    fetch('/api/production-plan')
        .then(response => response.json())
        .then(data => {
            const labels = data.data.datasets[0].data.map(item => item.x.toString());
            const datasets = [{
                label: 'Vehicle Production Plan',
                data: data.data.datasets[0].data.map(item => item.y),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }];
            const myChart = new Chart(ctx, {
                type: data.type,
                data: { labels, datasets },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error fetching production plan data:', error.message, error.stack);
        });
});
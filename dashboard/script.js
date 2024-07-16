document.addEventListener('DOMContentLoaded', () => {
    fetch('http://127.0.0.1:8080/income')
        .then(response => response.json())
        .then(data => {
            const incomeDataDiv = document.getElementById('income-data');
            if (data.entries.length > 0) {
                const table = document.createElement('table');
                const thead = document.createElement('thead');
                thead.innerHTML = '<tr><th>Source</th><th>Amount</th><th>Date</th><th>Notes</th></tr>';
                table.appendChild(thead);

                const tbody = document.createElement('tbody');
                data.entries.forEach(entry => {
                    const row = document.createElement('tr');
                    row.innerHTML = `<td>${entry.source}</td><td>${entry.amount}</td><td>${entry.date}</td><td>${entry.notes || ''}</td>`;
                    tbody.appendChild(row);
                });
                table.appendChild(tbody);

                incomeDataDiv.appendChild(table);
            } else {
                incomeDataDiv.textContent = 'No income data available.';
            }
        })
        .catch(error => {
            console.error('Error fetching income data:', error);
            const incomeDataDiv = document.getElementById('income-data');
            incomeDataDiv.textContent = 'Error loading income data.';
        });

    const form = document.getElementById('transaction-form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const entry = {
            date: formData.get('date'),
            amount: parseFloat(formData.get('amount')),
            source: formData.get('source'),
            notes: formData.get('notes')
        };

        fetch('http://127.0.0.1:8080/income', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entry)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
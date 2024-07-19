document.addEventListener('DOMContentLoaded', () => {
    // Fetch income data
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

    // Handle form submission
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
            location.reload(); // Reload to update the transaction list
        })
        .catch(error => {
            console.error('Error adding transaction:', error);
        });
    });

    // Dark mode toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    darkModeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode', darkModeToggle.checked);
    });

    // Add source functionality
    const addSourceButton = document.getElementById('add-source-button');
    addSourceButton.addEventListener('click', () => {
        const newSource = document.getElementById('new-source').value;
        if (newSource) {
            const sourceSelect = document.getElementById('source');
            const option = document.createElement('option');
            option.value = newSource;
            option.textContent = newSource;
            sourceSelect.appendChild(option);

            const removeSourceSelect = document.getElementById('remove-source');
            const removeOption = document.createElement('option');
            removeOption.value = newSource;
            removeOption.textContent = newSource;
            removeSourceSelect.appendChild(removeOption);

            document.getElementById('new-source').value = '';
        }
    });

    // Remove source functionality
    const removeSourceButton = document.getElementById('remove-source-button');
    removeSourceButton.addEventListener('click', () => {
        const sourceToRemove = document.getElementById('remove-source').value;
        const sourceSelect = document.getElementById('source');
        const removeSourceSelect = document.getElementById('remove-source');

        [...sourceSelect.options].forEach(option => {
            if (option.value === sourceToRemove) {
                sourceSelect.removeChild(option);
            }
        });

        [...removeSourceSelect.options].forEach(option => {
            if (option.value === sourceToRemove) {
                removeSourceSelect.removeChild(option);
            }
        });
    });
});

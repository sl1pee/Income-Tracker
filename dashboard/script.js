document.addEventListener('DOMContentLoaded', () => {
    const fetchIncomeData = () => {
        fetch('http://127.0.0.1:8080/income')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch income data');
                }
                return response.json();
            })
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

                    incomeDataDiv.innerHTML = ''; 
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
    };

    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', () => {
            document.body.classList.toggle('dark-mode', darkModeToggle.checked);
        });
    }

    const addSourceButton = document.getElementById('add-source-button');
    if (addSourceButton) {
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
    }

    const removeSourceButton = document.getElementById('remove-source-button');
    if (removeSourceButton) {
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
    }

    const form = document.getElementById('transaction-form');
    if (form) {
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
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add transaction');
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                fetchIncomeData(); 
            })
            .catch(error => {
                console.error('Error adding transaction:', error);
            });
        });
    }

    fetchIncomeData(); 
});

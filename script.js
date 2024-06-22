document.getElementById('lookup-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const pincode = document.getElementById('pincode').value;
    const resultsDiv = document.getElementById('results');
    const errorMessageDiv = document.getElementById('error-message');
    const loader = document.getElementById('loader');
    const filterInput = document.getElementById('filter');

    // Clear previous results and error messages
    resultsDiv.innerHTML = '';
    errorMessageDiv.textContent = '';
    filterInput.value = '';

    // Validate pincode
    if (pincode.length !== 6 || isNaN(pincode)) {
        errorMessageDiv.textContent = 'Please enter a valid 6-digit pincode.';
        return;
    }

    // Show loader
    loader.style.display = 'block';

    fetch(`https://api.postalpincode.in/pincode/${pincode}`)
        .then(response => response.json())
        .then(data => {
            loader.style.display = 'none';

            if (data[0].Status !== 'Success') {
                errorMessageDiv.textContent = data[0].Message || 'Error fetching pincode data.';
                return;
            }

            const postOffices = data[0].PostOffice;
            if (!postOffices || postOffices.length === 0) {
                errorMessageDiv.textContent = 'No details found for this pincode.';
                return;
            }

            postOffices.forEach(postOffice => {
                const div = document.createElement('div');
                div.className = 'result-item';
                div.innerHTML = `
                    <p><strong>Post Office Name:</strong> ${postOffice.Name}</p>
                    <p><strong>Pincode:</strong> ${postOffice.Pincode}</p>
                    <p><strong>District:</strong> ${postOffice.District}</p>
                    <p><strong>State:</strong> ${postOffice.State}</p>
                `;
                resultsDiv.appendChild(div);
            });

            // Filter functionality
            filterInput.addEventListener('input', function() {
                const filterValue = filterInput.value.toLowerCase();
                const filteredPostOffices = postOffices.filter(postOffice => postOffice.Name.toLowerCase().includes(filterValue));

                resultsDiv.innerHTML = '';
                if (filteredPostOffices.length > 0) {
                    filteredPostOffices.forEach(postOffice => {
                        const div = document.createElement('div');
                        div.className = 'result-item';
                        div.innerHTML = `
                            <p><strong>Post Office Name:</strong> ${postOffice.Name}</p>
                            <p><strong>Pincode:</strong> ${postOffice.Pincode}</p>
                            <p><strong>District:</strong> ${postOffice.District}</p>
                            <p><strong>State:</strong> ${postOffice.State}</p>
                        `;
                        resultsDiv.appendChild(div);
                    });
                } else {
                    resultsDiv.innerHTML = 'Couldn’t find the postal data you’re looking for…';
                }
            });
        })
        .catch(error => {
            loader.style.display = 'none';
            errorMessageDiv.textContent = 'An error occurred while fetching the data.';
        });
});

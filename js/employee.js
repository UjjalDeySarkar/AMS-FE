const apiUrl = 'https://c71ed82fbf3a.ngrok-free.app/api/employees';
const sessionCookie = document.cookie.match(/JSESSIONID=([^;]+)/)?.[0] || '';

// Create employee
const form = document.getElementById('employeeForm');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionCookie,
        "ngrok-skip-browser-warning": "true"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error('Failed to create employee');
    alert('Employee created successfully');
    form.reset();
    fetchEmployees();
  } catch (err) {
    alert(err.message);
  }
});

// Fetch all employees
async function fetchEmployees() {
  try {
    const res = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionCookie,
        "ngrok-skip-browser-warning": "true"
      }
    });

    const data = await res.json();
    const tableBody = document.getElementById('employeeList');
    tableBody.innerHTML = '';

    data.forEach(emp => {
      const row = document.createElement('tr');
      row.className = "hover:bg-gray-50";
      row.innerHTML = `
        <td class="px-4 py-2">
          <div class="relative group inline-block">
            <span class="cursor-pointer text-primary font-semibold hover:text-accent transition-colors">${emp.employeeCode}</span>
            <div class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] hidden group-hover:block transition-opacity duration-200 opacity-0 group-hover:opacity-100">
              <div class="bg-white border-2 border-primary rounded-lg shadow-xl p-6 backdrop-blur-sm">
                <div class="text-center mb-3 text-base font-medium text-gray-700">Employee QR Code</div>
                <img src="data:image/png;base64,${emp.qrCodeBase64}" alt="QR for ${emp.employeeCode}" class="w-64 h-64 object-contain" />
                <div class="text-center mt-3 text-sm text-gray-600">${emp.employeeCode}</div>
              </div>
            </div>
          </div>
        </td>
        <td class="px-4 py-2">${emp.name}</td>
        <td class="px-4 py-2">${emp.email}</td>
        <td class="px-4 py-2">${emp.phone}</td>
      `;
      tableBody.appendChild(row);
    });
  } catch (err) {
    alert('Error fetching employee list');
  }
}

// Initial fetch
fetchEmployees();

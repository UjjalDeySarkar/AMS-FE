// Common headers to skip ngrok warning
const headers = {
  'ngrok-skip-browser-warning': 'true'
};

// Fetch and display total employees
fetch('https://3d54dc2d3efa.ngrok-free.app/api/employees', {
  headers: headers
})
  .then(response => response.json())
  .then(employees => {
    document.getElementById('totalEmployees').textContent = employees.length;
  })
  .catch(error => {
    console.error('Failed to fetch employee data:', error);
  });

// Fetch and display today's attendance summary
fetch('https://3d54dc2d3efa.ngrok-free.app/api/attendances/summary/today', {
  headers: headers
})
  .then(response => response.json())
  .then(attendanceData => {
    const tbody = document.getElementById('attendanceBody');
    tbody.innerHTML = '';

    let presentCount = 0;

    attendanceData.forEach((entry) => {
      const inTime = entry.firstInTime ? new Date(entry.firstInTime).toLocaleTimeString() : '-';
      const outTime = entry.lastOutTime ? new Date(entry.lastOutTime).toLocaleTimeString() : '-';
      const duration = `${entry.totalHours}h ${entry.totalMinutes}m ${entry.totalSeconds}s`;

      let status = 'Absent';
      if (entry.firstInTime) {
        status = 'Present';
        presentCount++;
      }

      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">${entry.employeeName}</td>
        <td class="px-6 py-4 whitespace-nowrap">${inTime}</td>
        <td class="px-6 py-4 whitespace-nowrap">${outTime}</td>
        <td class="px-6 py-4 whitespace-nowrap font-semibold">${duration}</td>
      `;
      tbody.appendChild(row);
    });

    // Update summary counts
    document.getElementById('presentToday').textContent = presentCount;
    document.getElementById('absentToday').textContent = Math.max(0, attendanceData.length - presentCount);
    document.getElementById('lateToday').textContent = 0; // No longer showing late count
  })
  .catch(error => {
    console.error('Failed to fetch attendance summary:', error);
  });

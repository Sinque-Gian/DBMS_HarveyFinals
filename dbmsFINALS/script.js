document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('attendanceForm');
    const addStudentBtn = document.getElementById('addStudentBtn');
    const attendanceTableBody = document.getElementById('attendanceTableBody');
    const submitBtn = document.getElementById('submitBtn');

    let isEdit = false;
    let editId = null;

    // Fetch and display records
    const fetchRecords = () => {
        fetch('crud.php?read=true')
            .then(response => response.json())
            .then(data => {
                attendanceTableBody.innerHTML = '';
                data.forEach(record => {
                    const rowClass = record.status === 'Present' ? 'present' : 'absent';
                    const row = `
                        <tr class="${rowClass}">
                            <td>${record.id}</td>
                            <td>${record.name}</td>
                            <td>${record.date}</td>
                            <td>${record.status}</td>
                            <td>
                                <button onclick="editRecord(${record.id}, '${record.name}', '${record.date}', '${record.status}')">Edit</button>
                                <button onclick="deleteRecord(${record.id})">Delete</button>
                            </td>
                        </tr>
                    `;
                    attendanceTableBody.insertAdjacentHTML('beforeend', row);
                });
            });
    };

    // Add another student entry
    addStudentBtn.addEventListener('click', () => {
        const newEntry = document.createElement('div');
        newEntry.classList.add('student-entry');
        newEntry.innerHTML = `
            <input type="text" class="name" placeholder="Name" required>
            <input type="date" class="date" required>
            <select class="status" required>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
            </select>
        `;
        document.getElementById('students').appendChild(newEntry);
    });

    // Add or update record
    form.addEventListener('submit', event => {
        event.preventDefault();
        const entries = document.querySelectorAll('.student-entry');
        const attendances = [];

        entries.forEach(entry => {
            const name = entry.querySelector('.name').value;
            const date = entry.querySelector('.date').value;
            const status = entry.querySelector('.status').value;

            attendances.push({ name, date, status });
        });

        const formData = new FormData();
        formData.append('attendances', JSON.stringify(attendances));

        if (isEdit) {
            formData.append('update', true);
            formData.append('id', editId);
        } else {
            formData.append('create', true);
        }

        fetch('crud.php', {
            method: 'POST',
            body: formData
        }).then(() => {
            form.reset();
            document.getElementById('students').innerHTML = `
                <div class="student-entry">
                    <input type="text" class="name" placeholder="Name" required>
                    <input type="date" class="date" required>
                    <select class="status" required>
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                    </select>
                </div>
            `;
            isEdit = false;
            editId = null;
            submitBtn.textContent = 'Submit';
            fetchRecords();
        });
    });

    // Delete record
    window.deleteRecord = (id) => {
        if (confirm('Are you sure you want to delete this record?')) {
            let formData = new FormData();
            formData.append('id', id);
            formData.append('delete', true);

            fetch('crud.php', {
                method: 'POST',
                body: formData
            }).then(() => fetchRecords());
        }
    };

    // Edit record
    window.editRecord = (id, name, date, status) => {
        document.querySelector('.student-entry .name').value = name;
        document.querySelector('.student-entry .date').value = date;
        document.querySelector('.student-entry .status').value = status;
        submitBtn.textContent = 'Update';
        isEdit = true;
        editId = id;
    };

    // Fetch records initially
    fetchRecords();
});

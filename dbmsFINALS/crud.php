<?php
include 'db.php';

// Create
if (isset($_POST['create'])) {
    $attendances = json_decode($_POST['attendances'], true);

    foreach ($attendances as $attendance) {
        $name = $attendance['name'];
        $date = $attendance['date'];
        $status = $attendance['status'];

        $sql = "INSERT INTO attendances (name, date, status) VALUES ('$name', '$date', '$status')";
        if ($conn->query($sql) !== TRUE) {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    }
    echo "New records created successfully";
}

// Read
if (isset($_GET['read'])) {
    $sql = "SELECT * FROM attendances";
    $result = $conn->query($sql);

    $attendances = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $attendances[] = $row;
        }
    }
    echo json_encode($attendances);
}

// Update
if (isset($_POST['update'])) {
    $id = $_POST['id'];
    $attendances = json_decode($_POST['attendances'], true);

    foreach ($attendances as $attendance) {
        $name = $attendance['name'];
        $date = $attendance['date'];
        $status = $attendance['status'];

        $sql = "UPDATE attendances SET name='$name', date='$date', status='$status' WHERE id=$id";
        if ($conn->query($sql) !== TRUE) {
            echo "Error updating record: " . $conn->error;
        }
    }
    echo "Records updated successfully";
}

// Delete
if (isset($_POST['delete'])) {
    $id = $_POST['id'];

    $sql = "DELETE FROM attendances WHERE id=$id";
    if ($conn->query($sql) === TRUE) {
        echo "Record deleted successfully";
    } else {
        echo "Error deleting record: " . $conn->error;
    }
}

$conn->close();
?>

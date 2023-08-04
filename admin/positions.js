let alertT = document.querySelector('.alert')
let alertSpan = alertT.querySelector('span')

let allPositions;

function getAllPositions() {
    $.ajax({
        url: `${server}/index.php?q=getAllPositions`,
        success: function (response) {
            // console.log(response)
            response = JSON.parse(response)
            let positions = response.data
            allPositions = positions
            let tbody = document.querySelector('tbody#positions')
            tbody.innerHTML = ""
            if (positions.length > 0) {
                positions.forEach(position => {
                    tbody.innerHTML += `
                <tr>
                    <td>${position.id}</td>
                    <td>${position.position_name}</td>
                    <td>
                        <button class="btn btn-sm btn-info" onclick="editPosition(${position.id})" data-bs-toggle="modal" data-bs-target="#editPositionModal">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="delPosition(${position.id})">Delete</button>
                    </td>
                </tr>
                `
                });
            } else {
                tbody.innerHTML = `
            <tr>
                <td colspan="3">No Positions available</td>
            </tr>
            `
            }
        }
    })
}

getAllPositions()

function editPosition(PID) {
    let position = allPositions.find((p) => p.id == PID)
    $("#editPositionName").val(position.position_name)
    $("#editPositionId").val(position.id)
}

function delPosition(PID){
    let confirmDel = confirm("Confirm deleting position.")
    if(confirmDel){
        $.ajax({
            url: `${server}/index.php?q=deletePosition&PID=${PID}`,
            success: function (response) {
                // Handle the response from the server
                // console.log(response);
                response = JSON.parse(response)
                getAllPositions()
                if (response.status) {
                    alertT.classList.remove('d-none')
                    alertT.classList.add('alert-info')
                    alertT.classList.remove('alert-danger')
                    alertSpan.innerHTML = response.message
                } else {
                    alertT.classList.remove('d-none')
                    alertT.classList.add('alert-danger')
                    alertT.classList.remove('alert-info')
                    alertSpan.innerHTML = response.message
                }
            },
            error: function (xhr, status, error) {
                // Handle the error
                console.error(error);
            }
        });
    }
}

$("#addPositionForm").on('submit', function (e) {
    e.preventDefault()

    let formData = new FormData(this)

    $.ajax({
        url: `${server}/index.php?q=addPosition`,
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            // Handle the response from the server
            // console.log(response);
            $("#closeAddModal").click()
            $("#addPositionForm").get(0).reset();
            response = JSON.parse(response)
            getAllPositions()
            if (response.status) {
                alertT.classList.remove('d-none')
                alertT.classList.add('alert-info')
                alertT.classList.remove('alert-danger')
                alertSpan.innerHTML = response.message
            } else {
                alertT.classList.remove('d-none')
                alertT.classList.add('alert-danger')
                alertT.classList.remove('alert-info')
                alertSpan.innerHTML = response.message
            }
        },
        error: function (xhr, status, error) {
            // Handle the error
            console.error(error);
        }
    });

})

$("#editPositionForm").on('submit', function (e) {
    e.preventDefault()

    let formData = new FormData(this)

    $.ajax({
        url: `${server}/index.php?q=editPosition`,
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            // Handle the response from the server
            // console.log(response);
            $("#closeEditModal").click()
            $("#editPositionForm").get(0).reset();
            response = JSON.parse(response)
            getAllPositions()
            if (response.status) {
                alertT.classList.remove('d-none')
                alertT.classList.add('alert-info')
                alertT.classList.remove('alert-danger')
                alertSpan.innerHTML = response.message
            } else {
                alertT.classList.remove('d-none')
                alertT.classList.add('alert-danger')
                alertT.classList.remove('alert-info')
                alertSpan.innerHTML = response.message
            }
        },
        error: function (xhr, status, error) {
            // Handle the error
            console.error(error);
        }
    });

})
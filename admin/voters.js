let alertT = document.querySelector('.alert')
let alertSpan = alertT.querySelector('span')

document.getElementById('generateCodeBtn').addEventListener('click', function () {
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var accessCode = '';

    for (var i = 0; i < 6; i++) {
        accessCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    document.getElementById('accessCode').value = accessCode;
});

document.getElementById('editGenerateCodeBtn').addEventListener('click', function () {
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var accessCode = '';

    for (var i = 0; i < 6; i++) {
        accessCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    document.getElementById('editAccessCode').value = accessCode;
});

let allVoters;

function getVoters() {
    $.ajax({
        url: `${server}/index.php?q=getAllVoters`,
        success: function (response) {
            response = JSON.parse(response)
            let voters = response.voters
            allVoters = voters
            if (voters.length < 1) {
                $("#votersTable").html('<tr><td colspan="5">No Voters found.</td></tr>')
            } else {
                let i = 1
                $("#votersTable").html("")
                voters.forEach(voter => {
                    $("#votersTable").append(`
                <tr>
                <td> ${i} </td>
                <td style="text-transform:uppercase;"> ${voter.voter_id} </td>
                <td> ${voter.voter_name} </td>
                <td> ${voter.access_code} </td>
                <td>
                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editVoterModal" onclick="editVoter(${voter.id})"><i class="fa-regular fa-pen-to-square"></i></button>
                <button class="btn btn-danger" onclick="deleteVoter(${voter.id})"><i class="fa-solid fa-trash"></i></button>
            </td>
                </tr>
                `)
                    i++
                });

            }
        }
    })
}

getVoters()

function editVoter(votersId) {
    let voter = allVoters.find((v) => v.id == votersId)
    $("#editVoterId").val(voter.voter_id)
    $("#editVoterName").val(voter.voter_name)
    $("#editAccessCode").val(voter.access_code)
    $("#rowId").val(voter.id)
}

function deleteVoter(votersId) {
    let confirmDel = confirm("Confirm this action.")
    if (confirmDel) {
        $.ajax({
            url: `${server}/index.php?q=deleteVoter&rowId=${votersId}`,
            success: function (response) {
                response = JSON.parse(response)

                getVoters()
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
            }
        })
    }
}

$("#addVoterForm").on('submit', function (e) {
    e.preventDefault()

    let formData = new FormData(this)

    $.ajax({
        url: `${server}/index.php?q=addVoter`,
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            // Handle the response from the server
            // console.log(response);

            $("#addVoterForm").get(0).reset();
            $("#closeAddModal").click()
            getVoters()
            response = JSON.parse(response)
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

$("#editVoterForm").on('submit', function (e) {
    e.preventDefault()

    let formData = new FormData(this)

    $.ajax({
        url: `${server}/index.php?q=editVoter`,
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            // Handle the response from the server
            // console.log(response);

            $("#editVoterForm").get(0).reset();
            $("#closeEditModal").click()
            getVoters()
            response = JSON.parse(response)
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
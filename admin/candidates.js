let alertT = document.querySelector('.alert')
let alertSpan = alertT.querySelector('span')

function getAllPositions() {
    $.ajax({
        url: `${server}/index.php?q=getAllPositions`,
        success: function (response) {
            // console.log(response)
            response = JSON.parse(response)
            let positions = response.data
            let positionSelect = document.querySelector('#positionSelect')
            let editPositionSelect = document.querySelector('#editPositionSelect')
            if (positions.length > 0) {
                positions.forEach(position => {
                    positionSelect.innerHTML += `
                <option value="${position.id}">${position.position_name}</option>
                `
                    editPositionSelect.innerHTML += `
                <option value="${position.id}">${position.position_name}</option>
                `
                });
            }
        }
    })
}

getAllPositions()


// Add event listener to the candidateImage input for image preview
const candidateImageInput = document.getElementById("candidateImage");
const imagePreviewContainer = document.getElementById("imagePreview");

candidateImageInput.addEventListener("change", function () {
    const file = this.files[0];

    if (file) {
        const reader = new FileReader();

        reader.addEventListener("load", function () {
            // Create an <img> element for the preview
            const imagePreview = document.createElement("img");
            imagePreview.src = reader.result;
            imagePreview.classList.add("img-prev");
            imagePreview.classList.add("img-thumbnail");

            // Clear previous preview (if any)
            imagePreviewContainer.innerHTML = "";

            // Append the image preview to the container
            imagePreviewContainer.appendChild(imagePreview);
        });

        reader.readAsDataURL(file);
    }
});

const editCandidateImageInput = document.getElementById("editCandidateImage");
const editImagePreviewContainer = document.getElementById("editImagePreview");

editCandidateImageInput.addEventListener("change", function () {
    const file = this.files[0];

    if (file) {
        const reader = new FileReader();

        reader.addEventListener("load", function () {
            // Create an <img> element for the preview
            const imagePreview = document.createElement("img");
            imagePreview.src = reader.result;
            imagePreview.classList.add("img-prev");
            imagePreview.classList.add("img-thumbnail");

            // Clear previous preview (if any)
            editImagePreviewContainer.innerHTML = "";

            // Append the image preview to the container
            editImagePreviewContainer.appendChild(imagePreview);
        });

        reader.readAsDataURL(file);
    }
});

$("#addCandidateForm").on('submit', function (e) {
    e.preventDefault()

    let formData = new FormData(this)

    $.ajax({
        url: `${server}/index.php?q=addCandidate`,
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            // Handle the response from the server
            // console.log(response);

            $("#addCandidateForm").get(0).reset();
            $("#imagePreview").html('')
            $("#closeAddModal").click()
            getCandidates()
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

let allCandidates;

function getCandidates() {
    $.ajax({
        url: `${server}/index.php?q=getAllCandidates`,
        success: function (response) {
            response = JSON.parse(response)
            // console.log(response)
            let candidates = response.candidates
            allCandidates = candidates
            if (candidates.length < 1) {
                $("#candidatesTbody").html('<tr><td colspan="6"> No candidates added </td> </tr>')
            } else {

                let i = 1

                $("#candidatesTbody").html("")

                candidates.forEach((candidate) => {
                    $("#candidatesTbody").append(`
                <tr>
                <td>${i}</td>
                <td> <img src="${server}/${candidate.candidate_image}" width="50" height="50" class="img-thumbnail" /> </td>
                <td> ${candidate.candidate_name} </td>
                <td> ${candidate.position_name} </td>
                <td> ${candidate.tagline} </td>
                <td>
                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editCandidateModal" onclick="editCandidate(${candidate.id})"><i class="fa-regular fa-pen-to-square"></i></button>
                <button class="btn btn-danger" onclick="deleteCandidate(${candidate.id})"><i class="fa-solid fa-trash"></i></button>
            </td>
                </tr>
                `)
                    i++
                })

            }
        }
    })
}

getCandidates()

function editCandidate(candidateId) {

    let candidate = allCandidates.find((can) => candidateId == can.id)

    $("#editCandidateName").val(candidate.candidate_name)
    $("#editPositionSelect").val(candidate.position_id)
    $("#editCandidateDescription").val(candidate.tagline)
    $("#candidateID").val(candidate.id)
    $("#editImagePreview").html(`<img class="img-prev img-thumbnail" src="${server}/${candidate.candidate_image}" />`)

}

function deleteCandidate(candidateId) {
    let confirmDel = confirm("Confirm you want to delete this candidate?")

    if (confirmDel) {
        $.ajax({
            url : `${server}/index.php?q=deleteCandidate&candidateId=${candidateId}`,
            success : function(response){
                getCandidates()
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
            }
        })
    }
}

$("#editCandidateForm").on('submit', function (e) {
    e.preventDefault()

    let formData = new FormData(this)

    $.ajax({
        url: `${server}/index.php?q=editCandidate`,
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            // Handle the response from the server
            // console.log(response);

            // $("#addCandidateForm").get(0).reset();
            // $("#imagePreview").html('')
            $("#closeEditModal").click()
            getCandidates()
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
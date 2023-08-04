let server = "/duc/backend"

let voterId = localStorage.getItem("voterId");

if (!voterId) {
    alert("Please login to vote")
    location.href = "index.html"
} else {
    $.ajax({
        url: `${server}/index.php?q=checkVoter&voterId=${voterId}`,
        success: function (response) {
            response = JSON.parse(response)
            console.log(response)
            if (response.status) {
                let voterDetails = document.getElementsByClassName('voterDetails')
                voterDetails[0].innerHTML = response.voterDetails.voter_name
                voterDetails[1].innerHTML = response.voterDetails.voter_id
            } else {
                alert("Please login to vote")
                location.href = "index.html"
            }
        }
    })
}

function toggleIcon(input) {
    const radioInputs = document.getElementsByName(input.name);

    for (let i = 0; i < radioInputs.length; i++) {
        const radioInput = radioInputs[i];
        const label = radioInput.parentNode;
        const selectedIcon = label.querySelector('.selected-icon');
        const unselectedIcon = label.querySelector('.unselected-icon');

        if (radioInput.checked) {
            selectedIcon.classList.remove('d-none');
            unselectedIcon.classList.add('d-none');
        } else {
            selectedIcon.classList.add('d-none');
            unselectedIcon.classList.remove('d-none');
        }
    }
}

let selectedSectionId = 0

let totalSections = 0

let sectionTitles = []

function displaySection() {
    let selectedSection = document.getElementById(`section${selectedSectionId}`);
    selectedSection.classList.remove('d-none');
    let sectionTitle = document.getElementById("sectionTitle")
    let progress = document.querySelector('.progress-bar')
    let progressPercent = (selectedSectionId + 1) / totalSections * 100

    progress.innerHTML = `${parseInt(progressPercent)}%`
    progress.style.width = `${progressPercent}%`

    sectionTitle.innerHTML = sectionTitles[selectedSectionId]

    let i = 0
    while (i < totalSections) {
        if (i != selectedSectionId) {
            let sectionsId = document.getElementById(`section${i}`)
            sectionsId.classList.add("d-none")
        }
        i++
    }
}

function navigateToNextSection() {
    let section = document.getElementById(`section${selectedSectionId}`);
    let sectionRadios = section.querySelectorAll(`input:checked`);

    // Check if at least one radio button is selected
    // if (sectionRadios.length == 0) {
    //     alert('Please select a candidate to continue.');
    //     return;
    // }

    selectedSectionId++;
    displaySection();
}


function navigateToPrevSection() {
    selectedSectionId--
    displaySection()
}

let form = document.querySelector('form')

function getPositionsAndCandidates() {
    $.ajax({
        url: `${server}/index.php?q=getPositionsAndCandidates`,
        success: function (response) {
            response = JSON.parse(response)
            // console.log(response)

            totalSections = response.data.length

            response.data.forEach((positions, index) => {
                sectionTitles.push(positions.name)
                let prepareContainer = `
 <div id="section${index}" class="animate__animated animate__backInLeft">
                    <div id="innerSection${index}" class="row">
                     
                    </div>
                  </div>    
 `

                form.innerHTML += prepareContainer

                let innerSection = document.getElementById(`innerSection${index}`)
                let section = document.getElementById(`section${index}`)
                positions.candidates.forEach((candidate, index) => {
                    let candidateContainer = `
<div class="col-md-6 mb-3">
<div class="card align-items-center d-flex flex-row">
  <img src="${server}/${candidate.image}" class="card-img img-thumbnail" style="width: 20%;" alt="Candidate 1">
  <div class="card-body">
    <h5 class="card-title">${candidate.name}</h5>
    <p class="card-text">${candidate.description}</p>
    <div class="form-check">
      <input hidden class="form-check-input" type="radio" name="position${positions.id}" value="${candidate.id}" id="voteCandidate${candidate.id}" onclick="toggleIcon(this)">
      <label class="form-check-label btn btn-info" for="voteCandidate${candidate.id}">
        <span class="far fa-circle unselected-icon"></span> <!-- Unselected icon -->
        <span class="d-none fas fa-check-circle selected-icon"></span> <!-- Selected icon -->
        Vote
      </label>
    </div>
  </div>
</div>
</div>
`

                    innerSection.innerHTML += candidateContainer
                })

                let btns

                if (index == 0) {
                    btns = `
                    <div class="mt-3 text-end">
                          <button type="button" class="btn btn-dark" onclick="navigateToNextSection()">
                            Next
                            <i class="fa-solid fa-circle-chevron-right"></i>
                          </button>
                        </div>`
                } else if (index === response.data.length - 1) {
                    btns = `<div class="d-flex mt-3 justify-content-between">
                    <button type="button" onclick="navigateToPrevSection()" class="btn btn-secondary">
                        <i class="fa-solid fa-circle-arrow-left"></i>
                        Previous
                    </button>
                    <button type="submit" class="btn btn-info">
                    <i class="fa-regular fa-thumbs-up"></i>
                        Cast your vote
                    </button>
                  </div>`
                }
                else {
                    btns = `<div class="d-flex mt-3 justify-content-between">
                    <button type="button" onclick="navigateToPrevSection()" class="btn btn-secondary">
                        <i class="fa-solid fa-circle-arrow-left"></i>
                        Previous
                    </button>
                    <button onclick="navigateToNextSection()" type="button" class="btn btn-dark">
                        Next
                        <i class="fa-solid fa-circle-chevron-right"></i>
                    </button>
                  </div>`
                }

                section.innerHTML += btns
            });

            displaySection()

        }
    })
}

getPositionsAndCandidates()

// Function to show the success message modal
function showSuccessModal() {
    const modal = new bootstrap.Modal(document.getElementById('voteModal'));
    const icon = document.getElementById('voteStatusIcon');
    const message = document.getElementById('voteStatusMessage');

    icon.className = 'fas fa-check-circle fa-3x fa-flip text-success';
    message.innerHTML = 'Your vote was casted successfully. <br> Thanks for voting!';

    modal.show();
}

// Function to show the error message modal
function showErrorModal(msg) {
    const modal = new bootstrap.Modal(document.getElementById('voteModal'));
    const icon = document.getElementById('voteStatusIcon');
    const message = document.getElementById('voteStatusMessage');

    icon.className = 'fas fa-times-circle fa-3x fa-flip text-danger';
    message.innerHTML = msg;

    modal.show();
}

form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get all the input fields inside the form
    const inputFields = form.querySelectorAll('input');

    // Create a new FormData object
    const formData = new FormData();

    // Create an array to store the checked values
    const checkedData = [];

    // Loop through each input field and check if it's a radio button and is checked
    inputFields.forEach((input) => {
        if (input.type === 'radio' && input.checked) {
            checkedData.push(input.value);
        }
    });

    // Append the voterId and checkedData array as a single value to the FormData object
    formData.append('voterId', voterId);
    formData.append('selectedCandidates', JSON.stringify(checkedData));

    // Log the formData object
    console.log(formData.get('selectedCandidates'));

    // Send the formData using Ajax
    $.ajax({
        type: "POST",
        url: `${server}/index.php?q=castVote`,
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            // Handle the success response
            response = JSON.parse(response)

            if (response.status) {
                showSuccessModal()
                $('#voteModal').modal('show');
                setTimeout(() => {
                    location.href = "index.html"
                }, 2000);
            } else {
                showErrorModal(response.message)
                $('#voteModal').modal('show');
            }

        }
    });
});


$.ajax({
    url : `${server}/index.php?q=getPositionCandidatesAndVotes`,
    success : function(response){
        response = JSON.parse(response)
        console.log(response)
        if(response.status){
            const results = response.positionsData;
                const resultsContainer = document.getElementById("resultsContainer");

                results.forEach(positionData => {
                    const position = positionData.name;
                    const candidates = positionData.candidates;
                    const totalVotes = candidates.reduce((total, candidate) => total + candidate.votes, 0);

                    const table = document.createElement("table");
                    table.classList.add("table", "table-bordered", "mt-2","text-center");

                    const tableHeader = document.createElement("thead");
                    tableHeader.innerHTML = `
                        <tr>
                            <th>Candidate</th>
                            <th>Votes</th>
                            <th>Percentage</th>
                        </tr>
                    `;
                    table.appendChild(tableHeader);

                    const tableBody = document.createElement("tbody");
                    candidates.forEach(candidate => {
                        const candidateRow = document.createElement("tr");
                        candidateRow.innerHTML = `
                            <td>${candidate.name}</td>
                            <td>${candidate.votes}</td>
                            <td>${candidate.percentage}%</td>
                        `;
                        tableBody.appendChild(candidateRow);
                    });

                    table.appendChild(tableBody);

                    const positionHeader = document.createElement("h4");
                    positionHeader.classList.add("mt-4")
                    positionHeader.textContent = position;

                    // Add a button for viewing the chart
                    const viewChartButton = document.createElement("button");
                    viewChartButton.textContent = "View Chart";
                    viewChartButton.classList.add("btn", "btn-primary", "mt-1","d-inline");
                    viewChartButton.addEventListener("click", () => showChart(position, candidates));

                    const viewChartButtonContainer = document.createElement("div")
                    viewChartButtonContainer.classList.add("d-flex","justify-content-end")
                    viewChartButtonContainer.appendChild(viewChartButton)

                    resultsContainer.appendChild(positionHeader);
                    resultsContainer.appendChild(table);
                    resultsContainer.appendChild(viewChartButtonContainer);
                });

        }
    }
})

function showChart(position, candidates) {
    const candidateNames = candidates.map(candidate => candidate.name);
    const voteCounts = candidates.map(candidate => candidate.percentage);

    const ctx = document.createElement("canvas").getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: candidateNames,
            datasets: [{
                label: "Votes Percentage (%)",
                data: voteCounts,
                backgroundColor: ["rgba(54, 162, 235, 0.8)", "rgba(255, 99, 132, 0.8)", "rgba(75, 192, 192, 0.8)"],
                borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)", "rgba(75, 192, 192, 1)"],
                borderWidth: 5,
                borderRadius : 10
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max : 100
                }
            }
        }
    });

    const chartModal = new bootstrap.Modal(document.getElementById("chartModal"));
    document.getElementById("chartModalLabel").textContent = `${position} - Vote Distribution`;
    document.getElementById("chartModalBody").innerHTML = ""
    document.getElementById("chartModalBody").appendChild(ctx.canvas);
    chartModal.show();
}
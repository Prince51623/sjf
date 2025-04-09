let processCountInput = document.getElementById('processCount');
let processesContainer = document.getElementById('processesContainer');
let resultTable = document.getElementById('resultTable');
let averageTurnaroundTime = document.getElementById('averageTurnaroundTime');
let averageWaitingTime = document.getElementById('averageWaitingTime');

function generateProcesses() {
    let numProcesses = parseInt(processCountInput.value);
    processesContainer.innerHTML = '';

    for (let i = 0; i < numProcesses; i++) {
        let processItem = document.createElement('div');
        processItem.classList.add('process-item');
        processItem.innerHTML = `
            <label>Process ${i + 1} - Arrival Time: </label>
            <input type="number" id="arrivalTime${i}" placeholder="Arrival Time" min="0" required>
            <label>Process ${i + 1} - Burst Time: </label>
            <input type="number" id="burstTime${i}" placeholder="Burst Time" min="1" required>
        `;
        processesContainer.appendChild(processItem);
    }
}

function calculateSJF() {
    let numProcesses = parseInt(processCountInput.value);
    let processes = [];

    for (let i = 0; i < numProcesses; i++) {
        let arrivalTime = parseInt(document.getElementById(`arrivalTime${i}`).value);
        let burstTime = parseInt(document.getElementById(`burstTime${i}`).value);
        processes.push({ processId: i + 1, arrivalTime, burstTime, remainingTime: burstTime });
    }

    // Sort processes by Arrival Time first, then by Burst Time (Shortest Job First)
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime || a.burstTime - b.burstTime);

    let currentTime = 0;
    let completedProcesses = 0;
    let totalTurnaroundTime = 0;
    let totalWaitingTime = 0;
    let result = [];

    while (completedProcesses < numProcesses) {
        let eligibleProcesses = processes.filter(p => p.arrivalTime <= currentTime && p.remainingTime > 0);

        if (eligibleProcesses.length > 0) {
            // Sort by burst time, pick the one with the shortest burst time
            eligibleProcesses.sort((a, b) => a.burstTime - b.burstTime);

            let currentProcess = eligibleProcesses[0];
            currentProcess.remainingTime = 0; // Process is completed
            currentTime += currentProcess.burstTime;

            // Calculate Completion Time, Turnaround Time, Waiting Time, Response Time
            let completionTime = currentTime;
            let turnaroundTime = completionTime - currentProcess.arrivalTime;
            let waitingTime = turnaroundTime - currentProcess.burstTime;
            let responseTime = waitingTime; // As this is non-preemptive, response time is same as waiting time

            totalTurnaroundTime += turnaroundTime;
            totalWaitingTime += waitingTime;

            result.push({
                processId: currentProcess.processId,
                burstTime: currentProcess.burstTime,
                arrivalTime: currentProcess.arrivalTime,
                completionTime,
                turnaroundTime,
                waitingTime,
                responseTime
            });

            completedProcesses++;
        } else {
            // No process is eligible to execute yet, so we move forward in time
            currentTime++;
        }
    }

    // Clear previous results
    resultTable.innerHTML = '';

    // Add the results to the table
    result.forEach(process => {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${process.processId}</td>
            <td>${process.burstTime}</td>
            <td>${process.arrivalTime}</td>
            <td>${process.completionTime}</td>
            <td>${process.turnaroundTime}</td>
            <td>${process.waitingTime}</td>
            <td>${process.responseTime}</td>
        `;
        resultTable.appendChild(row);
    });

    let avgTurnaroundTime = totalTurnaroundTime / numProcesses;
    let avgWaitingTime = totalWaitingTime / numProcesses;

    averageTurnaroundTime.innerHTML = `Average Turnaround Time: ${avgTurnaroundTime.toFixed(2)} units`;
    averageWaitingTime.innerHTML = `Average Waiting Time: ${avgWaitingTime.toFixed(2)} units`;
}

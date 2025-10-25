// static/js/script.js

let currentAnalysisText = "";
let scatterChart = null;
const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#00FFFF', '#FFA07A', '#7FFF00', '#DA70D6'];

/**
 * Initiates the K-Means clustering by calling the Flask API.
 */
async function runClustering() {
    const k = document.getElementById('k_input').value;
    const ttsButton = document.getElementById('tts-button');
    ttsButton.disabled = true;
    document.getElementById('analysis-text-output').textContent = "Running K-Means and generating analysis...";
    
    try {
        const response = await fetch('/api/cluster', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ k: parseInt(k) })
        });
        
        const data = await response.json();

        if (data.success) {
            currentAnalysisText = data.analysis_text;
            document.getElementById('analysis-text-output').textContent = currentAnalysisText;
            updateVisualization(data.plot_data);
            updateCentroidsTable(data.centroids);
            ttsButton.disabled = false;
        } else {
            alert("Clustering failed: " + data.error);
            document.getElementById('analysis-text-output').textContent = "Error: Clustering failed.";
        }
    } catch (error) {
        console.error('Error running clustering:', error);
        alert('An error occurred while connecting to the backend.');
        document.getElementById('analysis-text-output').textContent = "Error: Cannot connect to server.";
    }
}

/**
 * Updates the scatter plot using Chart.js.
 */
function updateVisualization(plot_data) {
    // We will plot the first two features: Temperature (C) vs Humidity
    const X_FEAT = 'Temperature (C)';
    const Y_FEAT = 'Humidity';
    const k = document.getElementById('k_input').value;

    const datasets = [];
    
    for (let i = 0; i < k; i++) {
        datasets.push({
            label: `Cluster ${i}`,
            data: plot_data.filter(p => p.Cluster === i).map(p => ({
                x: p[X_FEAT], // Scaled Temperature
                y: p[Y_FEAT]  // Scaled Humidity
            })),
            backgroundColor: colors[i % colors.length] + '80', 
            borderColor: colors[i % colors.length],
            pointRadius: 5
        });
    }

    const ctx = document.getElementById('scatterPlot').getContext('2d');
    if (scatterChart) {
        scatterChart.destroy();
    }
    
    scatterChart = new Chart(ctx, {
        type: 'scatter',
        data: { datasets: datasets },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: `Scaled ${X_FEAT}` } }, 
                y: { title: { display: true, text: `Scaled ${Y_FEAT}` } }
            },
            plugins: { title: { display: true, text: 'K-Means Clusters Visualization' } }
        }
    });
}

/**
 * Updates the Centroids Analysis table.
 */
function updateCentroidsTable(centroids) {
    const tableContainer = document.getElementById('centroids-table');
    tableContainer.innerHTML = '';
    
    if (centroids.length === 0) return;

    // Create Table Header
    let header = '<tr><th>Cluster ID</th>';
    const features = Object.keys(centroids[0]).filter(key => key !== 'Cluster');
    features.forEach(feature => {
        header += `<th>Avg. ${feature}</th>`;
    });
    header += '</tr>';
    tableContainer.innerHTML += header;

    // Create Table Rows
    centroids.forEach(centroid => {
        let row = `<tr><td>**${centroid.Cluster}**</td>`;
        features.forEach(feature => {
            row += `<td>${centroid[feature].toFixed(3)}</td>`;
        });
        row += '</tr>';
        tableContainer.innerHTML += row;
    });
}

/**
 * Calls the API to get the TTS audio and plays it.
 */
async function playAnalysis() {
    if (!currentAnalysisText) return;

    const ttsButton = document.getElementById('tts-button');
    ttsButton.textContent = "Generating Audio...";
    ttsButton.disabled = true;
    
    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ analysis_text: currentAnalysisText })
        });
        
        if (response.ok) {
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            const audioPlayer = document.getElementById('audio-player');
            
            audioPlayer.src = audioUrl;
            audioPlayer.style.display = 'block';
            audioPlayer.play();
            
            audioPlayer.onended = () => {
                ttsButton.textContent = "Play Analysis";
                ttsButton.disabled = false;
            };
        } else {
            const errorText = await response.text();
            alert("Failed to play audio: " + errorText);
            ttsButton.textContent = "Play Analysis";
            ttsButton.disabled = false;
        }

    } catch (error) {
        console.error('Error playing analysis:', error);
        alert('An error occurred while streaming audio.');
        ttsButton.textContent = "Play Analysis";
        ttsButton.disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', runClustering);
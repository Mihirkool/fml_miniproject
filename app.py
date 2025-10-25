# app.py

import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from flask import Flask, request, jsonify, render_template, send_file
from gtts import gTTS
import io

# --- 1. Data Loading, Sampling, and Preprocessing ---
FILE_PATH = 'archive (1).zip/weatherHistory.csv'
FEATURES = ['Temperature (C)', 'Humidity', 'Wind Speed (km/h)']
SAMPLE_SIZE = 10000 

# Load data and handle large size
try:
    df_raw = pd.read_csv(FILE_PATH)
except FileNotFoundError:
    # Fallback path if the nested structure is not maintained
    df_raw = pd.read_csv('weatherHistory.csv') 

df_clean = df_raw.dropna(subset=FEATURES)
df = df_clean.sample(n=SAMPLE_SIZE, random_state=42)
X = df[FEATURES]

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
X_scaled_df = pd.DataFrame(X_scaled, columns=FEATURES)

app = Flask(__name__)

# --- 2. ML & Analysis Functions ---

def perform_kmeans(data, n_clusters=4):
    """Runs K-Means clustering and returns results and cluster centroids."""
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init='auto')
    kmeans.fit(data)
    
    clustered_df = X.copy()
    clustered_df['Cluster'] = kmeans.labels_
    cluster_centroids_orig = clustered_df.groupby('Cluster').mean().reset_index()
    
    return kmeans.labels_.tolist(), cluster_centroids_orig.to_dict('records')

def interpret_weather_cluster(centroid):
    """Provides a human-readable description for a weather cluster."""
    temp = centroid['Temperature (C)']
    humidity = centroid['Humidity']
    wind = centroid['Wind Speed (km/h)']
    
    # Simple thresholds for interpretation
    temp_desc = "Hot" if temp > 20 else ("Warm" if temp > 10 else "Cold")
    humidity_desc = "Humid" if humidity > 0.8 else ("Moderate" if humidity > 0.6 else "Dry")
    wind_desc = "Windy" if wind > 15 else "Calm"
    
    return f"{temp_desc} and {humidity_desc} with {wind_desc} conditions."

def generate_analysis_text(n_clusters, centroids_data):
    """Generates a text summary of the clustering results."""
    
    text = f"The K-Means algorithm was run with {n_clusters} clusters on {SAMPLE_SIZE} weather records. "
    text += "The features used were Temperature, Humidity, and Wind Speed. "
    
    for centroid in centroids_data:
        cluster_id = centroid['Cluster']
        interpretation = interpret_weather_cluster(centroid)
        temp = centroid['Temperature (C)']
        humidity = centroid['Humidity']
        wind = centroid['Wind Speed (km/h)']
        
        text += (
            f"Cluster {int(cluster_id)} analysis: This cluster is characterized as {interpretation}. "
            f"Average Temperature is {temp:.1f} degrees Celsius, Humidity is {humidity:.2f}, and Wind Speed is {wind:.1f} kilometers per hour. "
        )
    
    text += "This segmentation successfully identifies distinct atmospheric states, which can be useful for forecasting and operational planning."
    
    return text

def text_to_speech(text):
    """Converts a text string to an MP3 file using gTTS."""
    tts = gTTS(text=text, lang='en')
    mp3_fp = io.BytesIO()
    tts.write_to_fp(mp3_fp)
    mp3_fp.seek(0)
    return mp3_fp


# --- 3. Flask Routes ---

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/cluster', methods=['POST'])
def cluster():
    """API to run clustering and return results."""
    try:
        data = request.json
        n_clusters = int(data.get('k', 4)) 
        
        cluster_labels, centroids = perform_kmeans(X_scaled_df, n_clusters)
        
        plot_data = X_scaled_df.copy()
        plot_data['Cluster'] = cluster_labels
        
        analysis_text = generate_analysis_text(n_clusters, centroids)
        
        response = {
            'success': True,
            'labels': cluster_labels,
            'centroids': centroids,
            'plot_data': plot_data.to_dict('records'),
            'analysis_text': analysis_text,
            'features': FEATURES
        }
        return jsonify(response)

    except Exception as e:
        print(f"Clustering Error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/analyze', methods=['POST'])
def analyze():
    """API to convert text analysis to speech and stream the audio."""
    try:
        data = request.json
        analysis_text = data.get('analysis_text', 'No analysis provided.')
        mp3_file = text_to_speech(analysis_text)
        return send_file(mp3_file, mimetype='audio/mp3', as_attachment=False)
    except Exception as e:
        print(f"TTS Error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
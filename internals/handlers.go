package handler

import (
	"encoding/json"
	"fmt"
	"html/template"
	"io"
	"net/http"
	"os"
	"sort"
	"strconv"
)

type Player struct {
	Name  string `json:"name"`
	Rank  string `json:"rank"`
	Time  string `json:"time"`
	Score int    `json:"score"`
}

func HomeHandler(w http.ResponseWriter, r *http.Request) {
	temp, err := template.ParseFiles("index.html")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	temp.Execute(w, nil) // nil is passed as data to the template.
}

func PostScoresHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	var details Player
	err := json.NewDecoder(r.Body).Decode(&details)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	fmt.Printf("Received details: Name=%s, Time=%s, Score=%d\n", details.Name, details.Time, details.Score)

	// Open or create the scores.json file
	file, err := os.OpenFile("scores.json", os.O_RDWR|os.O_CREATE, 0o644)
	if err != nil {
		http.Error(w, "Unable to open scores file", http.StatusInternalServerError)
		return
	}
	defer file.Close()

	// Read existing data
	var existingDetails []Player
	decoder := json.NewDecoder(file)
	if err := decoder.Decode(&existingDetails); err != nil && err != io.EOF {
		http.Error(w, "Unable to read scores file", http.StatusInternalServerError)
		return
	}

	// Append new player data
	existingDetails = append(existingDetails, details)

	// Sort players by score (descending order)
	sort.Slice(existingDetails, func(i, j int) bool {
		return existingDetails[i].Score > existingDetails[j].Score
	})

	// Assign ranks
	for i := range existingDetails {
		if i == 0 {
			existingDetails[i].Rank = "1"
		} else {
			if existingDetails[i].Score == existingDetails[i-1].Score {
				existingDetails[i].Rank = existingDetails[i-1].Rank
			} else {
				existingDetails[i].Rank = strconv.Itoa(i + 1)
			}
		}
	}

	// Reset file pointer and truncate
	if _, err := file.Seek(0, 0); err != nil {
		http.Error(w, "Unable to seek in scores file", http.StatusInternalServerError)
		return
	}
	if err := file.Truncate(0); err != nil {
		http.Error(w, "Unable to truncate scores file", http.StatusInternalServerError)
		return
	}

	// Write updated data
	encoder := json.NewEncoder(file)
	if err := encoder.Encode(existingDetails); err != nil {
		http.Error(w, "Unable to write to scores file", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func ReturnHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}
	//  Open or create the scores.json file
	file, err := os.OpenFile("scores.json", os.O_RDWR|os.O_CREATE, 0o644)
	if err != nil {
		http.Error(w, "Unable to open scores file", http.StatusInternalServerError)
		return
	}
	defer file.Close()

	// Read existing data
	var existingDetails []Player
	decoder := json.NewDecoder(file)
	if err := decoder.Decode(&existingDetails); err != nil && err != io.EOF {
		http.Error(w, "Unable to read scores file", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(existingDetails)
}

func NotFoundHandler(w http.ResponseWriter, r *http.Request) {
    w.WriteHeader(http.StatusNotFound)
    w.Header().Set("Content-Type", "text/html")
    
    html := `
    <!DOCTYPE html>
    <html>
    <head>
        <title>404 - Page Not Found</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                background-color: #000;
                color: #fff;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                overflow: hidden;
            }
            
            .container {
                text-align: center;
                padding: 40px;
                background: linear-gradient(145deg, #2a2a2a, #222);
                border-radius: 15px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                max-width: 600px;
            }
            
            .error-code {
                font-size: 8em;
                font-weight: bold;
                margin: 0;
                background: linear-gradient(45deg, #ff0000, #00ff00, #0000ff, #ffff00);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                animation: glow 2s infinite alternate;
            }
            
            .message {
                font-size: 1.5em;
                margin: 20px 0;
                color: #ccc;
            }
            
            .home-button {
                background: linear-gradient(145deg, #444, #333);
                color: #fff;
                border: none;
                padding: 12px 30px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 1px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                text-decoration: none;
                display: inline-block;
                margin-top: 20px;
            }
            
            .home-button:hover {
                background: linear-gradient(145deg, #555, #444);
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
            }
            
            @keyframes glow {
                from {
                    text-shadow: 0 0 10px rgba(255,255,255,0.3);
                }
                to {
                    text-shadow: 0 0 20px rgba(255,255,255,0.6);
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1 class="error-code">404</h1>
            <p class="message">Page not found in the matrix</p>
            <p class="message">The tetromino you're looking for has disappeared!</p>
            <a href="/" class="home-button">Return to Game</a>
        </div>
    </body>
    </html>
    `
    
    fmt.Fprint(w, html)
}
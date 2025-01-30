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
		handler.ServerErrorHandler(w, r)
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
		handler.ServerErrorHandler(w, r)
			return
	}
	defer file.Close()

	// Read existing data
	var existingDetails []Player
	decoder := json.NewDecoder(file)
	if err := decoder.Decode(&existingDetails); err != nil && err != io.EOF {
		handler.ServerErrorHandler(w, r)
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
		handler.ServerErrorHandler(w, r)
			return
	}
	if err := file.Truncate(0); err != nil {
		handler.ServerErrorHandler(w, r)
			return
	}

	// Write updated data
	encoder := json.NewEncoder(file)
	if err := encoder.Encode(existingDetails); err != nil {
		handler.ServerErrorHandler(w, r)
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
		handler.ServerErrorHandler(w, r)
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
        <link rel="stylesheet" href="static/css/error.css">
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

func NotFoundHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusInternalServerError)
	w.Header().Set("Content-Type", "text/html")

	html := `
    <!DOCTYPE html>
    <html>
    <head>
        <title>500 - Internal Server error</title>
        <link rel="stylesheet" href="static/css/error.css">
    </head>
    <body>
        <div class="container">
            <h1 class="error-code">500</h1>
            <p class="message">Something is wrong in the matrix</p>
            <p class="message">A tetromino is broken, It's not your fault though</p>
            <a href="/" class="home-button">Return to Game</a>
        </div>
    </body>
    </html>
    `

	fmt.Fprint(w, html)
}

func BadRequestHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusBadRequest)
	w.Header().Set("Content-Type", "text/html")

	html := `
    <!DOCTYPE html>
    <html>
    <head>
        <title>400 - Bad Request</title>
        <link rel="stylesheet" href="static/css/error.css">
    </head>
    <body>
        <div class="container">
            <h1 class="error-code">400</h1>
            <p class="message">Something is wrong in the matrix</p>
            <p class="message">A tetromino is broken, It's not your fault though</p>
            <a href="/" class="home-button">Return to Game</a>
        </div>
    </body>
    </html>
    `

	fmt.Fprint(w, html)
}

func WrongMethodHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusMethodNotAllowed)
	w.Header().Set("Content-Type", "text/html")

	html := `
    <!DOCTYPE html>
    <html>
    <head>
        <title>400 - Bad Request</title>
        <link rel="stylesheet" href="static/css/error.css">
    </head>
    <body>
        <div class="container">
            <h1 class="error-code">400</h1>
            <p class="message">Something is wrong in the matrix</p>
            <p class="message">A tetromino is broken, It's not your fault though</p>
            <a href="/" class="home-button">Return to Game</a>
        </div>
    </body>
    </html>
    `

	fmt.Fprint(w, html)
}


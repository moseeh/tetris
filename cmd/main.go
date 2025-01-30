package main

import (
	"fmt"
	"log"
	"net/http"
	"text/template"
)

func main() {
	http.HandleFunc("/", HomeHandler)
	http.HandleFunc("/scores", PostScoresHandler)
	http.HandleFunc("/return", ReturnHandler)
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static")))) // Serve static files from the./static directory.

	fmt.Println("Server started http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func HomeHandler(w http.ResponseWriter, r *http.Request) {
	temp, err := template.ParseFiles("index.html")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	temp.Execute(w, nil) // nil is passed as data to the template.
}

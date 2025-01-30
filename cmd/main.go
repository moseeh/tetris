package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/", HomeHandler)
	http.HandleFunc("/scores", PostScoresHandler)
	http.HandleFunc("/return", ReturnHandler)
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static")))) // Serve static files from the./static directory.

	fmt.Println("Server started http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

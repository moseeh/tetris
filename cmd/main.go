package main

import (
	"fmt"
	"log"
	"net/http"

	handler "tetris/internals"
)

func main() {
	http.HandleFunc("/", handler.HomeHandler)
	http.HandleFunc("/scores", handler.PostScoresHandler)
	http.HandleFunc("/return", handler.ReturnHandler)
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static")))) // Serve static files from the./static directory.

	fmt.Println("Server started http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

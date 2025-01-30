package main

import (
	"fmt"
	"net/http"
	"strings"
	handler "tetris/internals"
)

var allowedRoutes = map[string]bool{
	"/":       true,
	"/scores": true,
	"/return": true,
}

func main() {
	mux := http.NewServeMux()
	RegisterRoutes(mux)

	wrappedMux := RouteChecker(mux)

	server := &http.Server{
		Addr:    ":8080",
		Handler: wrappedMux,
	}

	fmt.Println("server running @http://localhost:8080\nTo stop server type 'exit'\n=====================================")
	err := server.ListenAndServe()
	if err != nil {
		fmt.Println("error starting server: ", err)
	}
}

func RouteChecker(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasPrefix(r.URL.Path, "/static/") {
			// Static(w,r)
			next.ServeHTTP(w, r)
			return
		}

		if _, ok := allowedRoutes[r.URL.Path]; !ok {
			handler.NotFoundHandler(w, r)
			return
		}
		next.ServeHTTP(w, r)
	})
}

// RegisterRoutes manages the routes
func RegisterRoutes(mux *http.ServeMux) {
	mux.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		handler.HomeHandler(w, r)
	})

	mux.HandleFunc("/scores", func(w http.ResponseWriter, r *http.Request) {
		handler.PostScoresHandler(w, r)
	})

	mux.HandleFunc("/return", func(w http.ResponseWriter, r *http.Request) {
		handler.ReturnHandler(w, r)
	})
}

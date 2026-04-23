package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/livekit/protocol/auth"
)

func main() {
	apiKey := os.Getenv("LIVEKIT_API_KEY")
	apiSecret := os.Getenv("LIVEKIT_API_SECRET")
	frontendURL := os.Getenv("FRONTEND_URL")

	if apiKey == "" || apiSecret == "" {
		log.Fatal("LIVEKIT_API_KEY and LIVEKIT_API_SECRET must be set")
	}

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{frontendURL, "http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		AllowCredentials: true,
	}))

	r.GET("/get-token", func(c *gin.Context) {
		room := c.Query("room")
		identity := c.Query("identity")

		if room == "" || identity == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "room and identity are required"})
			return
		}

		at := auth.NewAccessToken(apiKey, apiSecret)
		grant := &auth.VideoGrant{RoomJoin: true, Room: room}
		at.SetVideoGrant(grant).SetIdentity(identity).SetValidFor(time.Hour)

		token, err := at.ToJWT()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"token": token})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}

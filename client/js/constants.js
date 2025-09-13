// Game constants - shared between client and server
const GAME_CONSTANTS = {
    // Player configuration
    PLAYER: {
        SPEED: 10,
        HEALTH: 100,
        HEIGHT: 1.8,
        SENSITIVITY: 0.002,
    },

    // World configuration  
    WORLD: {
        SIZE: 200,
        GRAVITY: 9.8,
        GROUND_LEVEL: 0,

    },

    // Weapon configuration
    WEAPONS: {
        RIFLE: {
            DAMAGE: 25,
            AMMO: 30,
            BULLET_SPEED: 100,
        }
    },

    NETWORKS: {
        UPDATE_RATE: 20,
        SERVER_PORT: 3000,
        MAX_PLAYERS: 20,
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GAME_CONSTANTS; // For Node.js server
} else {
    window.GAME_CONSTANTS = GAME_CONSTANTS; // For browser client
}
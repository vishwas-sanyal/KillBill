// utils.js - Helper functions for FPS game

// Make sure constants are loaded first
if (typeof GAME_CONSTANTS === 'undefined') {
    console.error('GAME_CONSTANTS not found! Make sure constants.js loads before utils.js');
}

// Main utilities object
const GameUtils = {

    // ==========================================
    // MATH HELPERS
    // ==========================================
    math: {

        // Convert degrees to radians
        // Usage: GameUtils.math.degToRad(90) returns 1.57...
        degToRad(degrees) {
            return degrees * (Math.PI / 180);
        },

        // Convert radians to degrees  
        // Usage: GameUtils.math.radToDeg(1.57) returns 90
        radToDeg(radians) {
            return radians * (180 / Math.PI);
        },

        // Calculate distance between two 3D points
        // Usage: GameUtils.math.distance3D(playerPos, enemyPos)
        distance3D(pos1, pos2) {
            const dx = pos2.x - pos1.x;
            const dy = pos2.y - pos1.y;
            const dz = pos2.z - pos1.z;
            return Math.sqrt(dx * dx + dy * dy + dz * dz);
        },

        // Calculate distance between two 2D points (for UI)
        // Usage: GameUtils.math.distance2D(mousePos, buttonPos)
        distance2D(pos1, pos2) {
            const dx = pos2.x - pos1.x;
            const dy = pos2.y - pos1.y;
            return Math.sqrt(dx * dx + dy * dy);
        },

        // Clamp a number between min and max values
        // Usage: GameUtils.math.clamp(playerHealth, 0, 100)
        clamp(value, min, max) {
            return Math.min(Math.max(value, min), max);
        },

        // Linear interpolation between two values
        // Usage: GameUtils.math.lerp(currentPos, targetPos, 0.1) for smooth movement
        lerp(start, end, factor) {
            return start + (end - start) * factor;
        },

        // Generate random number between min and max
        // Usage: GameUtils.math.randomRange(5, 15) returns number like 8.3
        randomRange(min, max) {
            return Math.random() * (max - min) + min;
        },

        // Generate random integer between min and max (inclusive)
        // Usage: GameUtils.math.randomInt(1, 6) returns 1, 2, 3, 4, 5, or 6
        randomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        // Normalize an angle to be between 0 and 2π
        // Usage: GameUtils.math.normalizeAngle(someAngle)
        normalizeAngle(angle) {
            while (angle < 0) angle += Math.PI * 2;
            while (angle >= Math.PI * 2) angle -= Math.PI * 2;
            return angle;
        },

        // Check if number is approximately equal (for floating point comparison)
        // Usage: GameUtils.math.approximately(0.1 + 0.2, 0.3) returns true
        approximately(a, b, tolerance = 0.0001) {
            return Math.abs(a - b) < tolerance;
        }
    },

    // ==========================================
    // VECTOR OPERATIONS
    // ==========================================
    vector: {

        // Create a new vector3 object
        // Usage: const myVector = GameUtils.vector.create(1, 2, 3);
        create(x = 0, y = 0, z = 0) {
            return { x, y, z };
        },

        // Add two vectors
        // Usage: GameUtils.vector.add(vectorA, vectorB)
        add(vec1, vec2) {
            return {
                x: vec1.x + vec2.x,
                y: vec1.y + vec2.y,
                z: vec1.z + vec2.z
            };
        },

        // Subtract two vectors
        // Usage: GameUtils.vector.subtract(vectorA, vectorB)
        subtract(vec1, vec2) {
            return {
                x: vec1.x - vec2.x,
                y: vec1.y - vec2.y,
                z: vec1.z - vec2.z
            };
        },

        // Multiply vector by scalar
        // Usage: GameUtils.vector.multiply(velocity, deltaTime)
        multiply(vec, scalar) {
            return {
                x: vec.x * scalar,
                y: vec.y * scalar,
                z: vec.z * scalar
            };
        },

        // Get length/magnitude of vector
        // Usage: const speed = GameUtils.vector.length(velocity);
        length(vec) {
            return Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
        },

        // Normalize vector (make it length 1)
        // Usage: const direction = GameUtils.vector.normalize(someVector);
        normalize(vec) {
            const len = this.length(vec);
            if (len === 0) return { x: 0, y: 0, z: 0 };
            return {
                x: vec.x / len,
                y: vec.y / len,
                z: vec.z / len
            };
        },

        // Calculate dot product of two vectors
        // Usage: const angle = GameUtils.vector.dot(directionA, directionB);
        dot(vec1, vec2) {
            return vec1.x * vec2.x + vec1.y * vec2.y + vec1.z * vec2.z;
        },

        // Calculate cross product of two vectors
        // Usage: const perpendicular = GameUtils.vector.cross(vectorA, vectorB);
        cross(vec1, vec2) {
            return {
                x: vec1.y * vec2.z - vec1.z * vec2.y,
                y: vec1.z * vec2.x - vec1.x * vec2.z,
                z: vec1.x * vec2.y - vec1.y * vec2.x
            };
        }
    },

    // ==========================================
    // COLLISION DETECTION
    // ==========================================
    collision: {

        // Check if point is inside sphere
        // Usage: GameUtils.collision.pointInSphere(bulletPos, playerPos, playerRadius)
        pointInSphere(point, sphereCenter, radius) {
            return GameUtils.math.distance3D(point, sphereCenter) <= radius;
        },

        // Check if point is inside box
        // Usage: GameUtils.collision.pointInBox(playerPos, boxMin, boxMax)
        pointInBox(point, boxMin, boxMax) {
            return point.x >= boxMin.x && point.x <= boxMax.x &&
                point.y >= boxMin.y && point.y <= boxMax.y &&
                point.z >= boxMin.z && point.z <= boxMax.z;
        },

        // Ray-sphere intersection (for bullet-player collision)
        // Usage: GameUtils.collision.raySphere(bulletStart, bulletDir, playerPos, playerRadius)
        raySphere(rayOrigin, rayDirection, sphereCenter, radius) {
            const oc = GameUtils.vector.subtract(rayOrigin, sphereCenter);
            const a = GameUtils.vector.dot(rayDirection, rayDirection);
            const b = 2.0 * GameUtils.vector.dot(oc, rayDirection);
            const c = GameUtils.vector.dot(oc, oc) - radius * radius;
            const discriminant = b * b - 4 * a * c;

            if (discriminant < 0) {
                return null; // No intersection
            }

            const t = (-b - Math.sqrt(discriminant)) / (2 * a);
            if (t > 0) {
                return {
                    hit: true,
                    distance: t,
                    point: GameUtils.vector.add(rayOrigin, GameUtils.vector.multiply(rayDirection, t))
                };
            }

            return null;
        },

        // Check if two spheres intersect
        // Usage: GameUtils.collision.sphereSphere(player1Pos, player1Radius, player2Pos, player2Radius)
        sphereSphere(center1, radius1, center2, radius2) {
            const distance = GameUtils.math.distance3D(center1, center2);
            return distance <= (radius1 + radius2);
        }
    },

    // ==========================================
    // GENERAL UTILITIES
    // ==========================================
    general: {

        // Format number to specific decimal places
        // Usage: GameUtils.general.formatNumber(123.456, 2) returns "123.46"
        formatNumber(num, decimals = 0) {
            return parseFloat(num.toFixed(decimals));
        },

        // Format time as MM:SS
        // Usage: GameUtils.general.formatTime(125) returns "2:05"
        formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        },

        // Generate unique ID
        // Usage: const playerId = GameUtils.general.generateId();
        generateId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        },

        // Deep clone an object
        // Usage: const playerCopy = GameUtils.general.deepClone(originalPlayer);
        deepClone(obj) {
            return JSON.parse(JSON.stringify(obj));
        },

        // Check if object is empty
        // Usage: GameUtils.general.isEmpty(someObject)
        isEmpty(obj) {
            return Object.keys(obj).length === 0;
        },

        // Debounce function (prevent rapid repeated calls)
        // Usage: const debouncedShoot = GameUtils.general.debounce(shootFunction, 100);
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Throttle function (limit call frequency)
        // Usage: const throttledUpdate = GameUtils.general.throttle(updateFunction, 16);
        throttle(func, limit) {
            let inThrottle;
            return function () {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }
    },

    // ==========================================
    // COLOR UTILITIES
    // ==========================================
    color: {

        // Convert hex color to RGB
        // Usage: GameUtils.color.hexToRgb("#ff0000") returns {r: 255, g: 0, b: 0}
        hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },

        // Convert RGB to hex
        // Usage: GameUtils.color.rgbToHex(255, 0, 0) returns "#ff0000"
        rgbToHex(r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        },

        // Interpolate between two colors
        // Usage: GameUtils.color.lerpColor("#ff0000", "#00ff00", 0.5) returns middle color
        lerpColor(color1, color2, factor) {
            const c1 = this.hexToRgb(color1);
            const c2 = this.hexToRgb(color2);

            if (!c1 || !c2) return color1;

            const r = Math.round(GameUtils.math.lerp(c1.r, c2.r, factor));
            const g = Math.round(GameUtils.math.lerp(c1.g, c2.g, factor));
            const b = Math.round(GameUtils.math.lerp(c1.b, c2.b, factor));

            return this.rgbToHex(r, g, b);
        }
    },

    // ==========================================
    // GAME-SPECIFIC UTILITIES
    // ==========================================
    game: {

        // Calculate damage based on distance
        // Usage: const damage = GameUtils.game.calculateDamage(baseDamage, distance);
        calculateDamage(baseDamage, distance) {
            if (typeof GAME_CONSTANTS === 'undefined') return baseDamage;

            const maxRange = GAME_CONSTANTS.WEAPONS?.MAX_RANGE || 100;
            const falloffStart = GAME_CONSTANTS.WEAPONS?.FALLOFF_START || 50;

            if (distance <= falloffStart) {
                return baseDamage; // Full damage at close range
            }

            if (distance >= maxRange) {
                return 0; // No damage at max range
            }

            // Linear falloff
            const falloffFactor = 1 - ((distance - falloffStart) / (maxRange - falloffStart));
            return Math.round(baseDamage * falloffFactor);
        },

        // Check if position is within world bounds
        // Usage: GameUtils.game.isInBounds(playerPosition)
        isInBounds(position) {
            if (typeof GAME_CONSTANTS === 'undefined') return true;

            const worldSize = GAME_CONSTANTS.WORLD?.SIZE || 200;
            const halfSize = worldSize / 2;

            return position.x >= -halfSize && position.x <= halfSize &&
                position.z >= -halfSize && position.z <= halfSize;
        },

        // Clamp position to world bounds
        // Usage: const safePos = GameUtils.game.clampToBounds(playerPos);
        clampToBounds(position) {
            if (typeof GAME_CONSTANTS === 'undefined') return position;

            const worldSize = GAME_CONSTANTS.WORLD?.SIZE || 200;
            const halfSize = worldSize / 2;

            return {
                x: GameUtils.math.clamp(position.x, -halfSize, halfSize),
                y: position.y, // Don't clamp Y (vertical)
                z: GameUtils.math.clamp(position.z, -halfSize, halfSize)
            };
        },

        // Calculate health percentage for UI
        // Usage: const healthPercent = GameUtils.game.getHealthPercentage(currentHealth, maxHealth);
        getHealthPercentage(currentHealth, maxHealth) {
            return GameUtils.math.clamp((currentHealth / maxHealth) * 100, 0, 100);
        }
    }
};

// Make utils available globally
window.GameUtils = GameUtils;

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameUtils;
}
import { createSeededRandom } from '../Utils';

export interface TrackSegment {
    x: number;
    y: number;
    radius: number;
}



export class Track {
    segments: TrackSegment[] = [];
    canvasWidth: number;
    canvasHeight: number;
    private asphaltTexture: HTMLCanvasElement | null = null;
    private grassTexture: HTMLCanvasElement | null = null;
    private dirtTexture: HTMLCanvasElement | null = null;
    private random: () => number;
    
    // Wall and collision settings
    private readonly wallThickness = 250; // Wall thickness in pixels
    private readonly grassThickness = this.wallThickness - 20; // Grass thickness in pixels
    private readonly dirtThickness = 20; // Dirt thickness in pixels
    
    // Checkpoint tracking
    private lastCarSegment = -1; // Track which segment the car was last in

    constructor(width: number, height: number, seed: number) {
        console.log('Track constructor called with seed:', seed);
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.random = createSeededRandom(seed);
        this.generateRandomLoop();
        this.createAsphaltTexture();
        this.createGrassTexture();
        this.createDirtTexture();
    }

    private generateRandomLoop() {
        const numPoints = Math.floor(this.random() * 12) + 9; // 10 to 21 points for more complex shapes
        const centerX = this.canvasWidth / 2; // Fixed center for larger track
        const centerY = this.canvasHeight / 2;
        const baseRadius = 600; // Larger base radius for bigger track
        const variation = baseRadius * 1.6; // Increased variation for more dynamic shapes
        const angleJitter = (2 * Math.PI / numPoints) * 0.2; // Increased jitter for twisty shapes
        const baseTrackRadius = 50; // Slightly wider base half-width

        for (let i = 0; i < numPoints; i++) {
            const angle = (i * 2 * Math.PI) / numPoints + (this.random() - 0.5) * angleJitter;
            const dist = baseRadius + (this.random() - 0.5) * variation;
            const x = centerX + dist * Math.cos(angle);
            const y = centerY + dist * Math.sin(angle);
            const radius = baseTrackRadius + (this.random() - 0.5) * 25; // 37.5 to 62.5 for varied thickness
            this.segments.push({ x, y, radius });
        }
    }


    private createAsphaltTexture() {
        const textureSize = 100;
        this.asphaltTexture = document.createElement('canvas');
        this.asphaltTexture.width = textureSize;
        this.asphaltTexture.height = textureSize;
        const ctx = this.asphaltTexture.getContext('2d')!;
        ctx.fillStyle = '#333';
        ctx.fillRect(0, 0, textureSize, textureSize);
        const imageData = ctx.getImageData(0, 0, textureSize, textureSize);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const noise = this.random() * 20 - 10;
            data[i] = Math.min(255, Math.max(0, 51 + noise));
            data[i + 1] = Math.min(255, Math.max(0, 51 + noise));
            data[i + 2] = Math.min(255, Math.max(0, 51 + noise));
            data[i + 3] = 255;
        }
        ctx.putImageData(imageData, 0, 0);
    }

    private createGrassTexture() {
        const textureSize = 100;
        this.grassTexture = document.createElement('canvas');
        this.grassTexture.width = textureSize;
        this.grassTexture.height = textureSize;
        const ctx = this.grassTexture.getContext('2d')!;
        ctx.fillStyle = '#228B22';
        ctx.fillRect(0, 0, textureSize, textureSize);
        const imageData = ctx.getImageData(0, 0, textureSize, textureSize);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const noise = this.random() * 30 - 15;
            data[i] = Math.min(255, Math.max(0, 34 + noise)); // Red channel
            data[i + 1] = Math.min(255, Math.max(0, 139 + noise)); // Green channel  
            data[i + 2] = Math.min(255, Math.max(0, 34 + noise)); // Blue channel
            data[i + 3] = 255;
        }
        ctx.putImageData(imageData, 0, 0);
    }

    private createDirtTexture() {
        const textureSize = 100;
        this.dirtTexture = document.createElement('canvas');
        this.dirtTexture.width = textureSize;
        this.dirtTexture.height = textureSize;
        const ctx = this.dirtTexture.getContext('2d')!;
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, 0, textureSize, textureSize);
        const imageData = ctx.getImageData(0, 0, textureSize, textureSize);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const noise = this.random() * 40 - 20; // More variation for pebble effect
            data[i] = Math.min(255, Math.max(0, 139 + noise)); // Red channel
            data[i + 1] = Math.min(255, Math.max(0, 69 + noise)); // Green channel  
            data[i + 2] = Math.min(255, Math.max(0, 19 + noise)); // Blue channel
            data[i + 3] = 255;
        }
        ctx.putImageData(imageData, 0, 0);
    }

    draw(ctx: CanvasRenderingContext2D, offsetX: number = 0, offsetY: number = 0, carX?: number, carY?: number) {
        if (this.segments.length === 0 || !this.asphaltTexture || !this.grassTexture || !this.dirtTexture) return;

        ctx.save();
        ctx.translate(offsetX, offsetY); // Apply camera offset

        // Layer 1: Black walls
        ctx.strokeStyle = '#000000';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.miterLimit = 10;
        for (let i = 0; i < this.segments.length; i++) {
            const s1 = this.segments[i];
            const s2 = this.segments[(i + 1) % this.segments.length];
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.lineWidth = (s1.radius + s2.radius) + this.wallThickness;
            ctx.stroke();
        }

        // Layer 2: Grass with noise texture
        ctx.strokeStyle = ctx.createPattern(this.grassTexture, 'repeat') || '#228B22';
        for (let i = 0; i < this.segments.length; i++) {
            const s1 = this.segments[i];
            const s2 = this.segments[(i + 1) % this.segments.length];
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.lineWidth = (s1.radius + s2.radius) + this.grassThickness;
            ctx.stroke();
        }

        // Layer 3: Dirt border with pebble texture
        ctx.strokeStyle = ctx.createPattern(this.dirtTexture, 'repeat') || '#8B4513';
        for (let i = 0; i < this.segments.length; i++) {
            const s1 = this.segments[i];
            const s2 = this.segments[(i + 1) % this.segments.length];
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.lineWidth = (s1.radius + s2.radius) + this.dirtThickness;
            ctx.stroke();
        }

        // Layer 4: Asphalt track
        ctx.strokeStyle = ctx.createPattern(this.asphaltTexture, 'repeat') || '#333';
        for (let i = 0; i < this.segments.length; i++) {
            const s1 = this.segments[i];
            const s2 = this.segments[(i + 1) % this.segments.length];
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.lineWidth = Math.min(s1.radius + s2.radius, 125);
            ctx.stroke();
        }

        // Layer 5: Road markings
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 4;
        ctx.setLineDash([20, 20]);
        for (let i = 0; i < this.segments.length; i++) {
            const s1 = this.segments[i];
            const s2 = this.segments[(i + 1) % this.segments.length];
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.stroke();
        }
        ctx.setLineDash([]);

        // Draw start line (checkered pattern)
        this.drawStartLine(ctx);

        // Draw checkpoint markers every 4 segments
        this.drawCheckpoints(ctx);

        // Debug: Draw line from car to closest track point
        if (carX !== undefined && carY !== undefined) {
            let minDistance = Infinity;
            let closestPoint = { x: 0, y: 0 };
            
            for (let i = 0; i < this.segments.length; i++) {
                const s1 = this.segments[i];
                const s2 = this.segments[(i + 1) % this.segments.length];
                const dist = this.distanceToLineSegment(carX, carY, s1.x, s1.y, s2.x, s2.y);
                
                if (dist < minDistance) {
                    minDistance = dist;
                    // Calculate closest point on line segment
                    const dx = s2.x - s1.x;
                    const dy = s2.y - s1.y;
                    const len2 = dx * dx + dy * dy;
                    if (len2 > 0) {
                        let t = ((carX - s1.x) * dx + (carY - s1.y) * dy) / len2;
                        t = Math.max(0, Math.min(1, t));
                        closestPoint.x = s1.x + t * dx;
                        closestPoint.y = s1.y + t * dy;
                    } else {
                        closestPoint.x = s1.x;
                        closestPoint.y = s1.y;
                    }
                }
            }
            
            // Draw debug line
            ctx.strokeStyle = '#ffff00'; // Yellow debug line
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(carX, carY);
            ctx.lineTo(closestPoint.x, closestPoint.y);
            ctx.stroke();
            
            // Draw debug circle at closest point
            ctx.fillStyle = '#ff0000'; // Red circle
            ctx.beginPath();
            ctx.arc(closestPoint.x, closestPoint.y, 4, 0, 2 * Math.PI);
            ctx.fill();
        }

        ctx.restore();
    }

    private drawStartLine(ctx: CanvasRenderingContext2D) {
        if (this.segments.length < 2) return;

        const s1 = this.segments[0];
        const s2 = this.segments[1];
        
        // Calculate midpoint of first segment
        const midX = (s1.x + s2.x) / 2;
        const midY = (s1.y + s2.y) / 2;
        
        // Calculate direction vector and perpendicular
        const dx = s2.x - s1.x;
        const dy = s2.y - s1.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        
        if (length === 0) return;
        
        const nx = dx / length;
        const ny = dy / length;
        const perpX = -ny;
        const perpY = nx;
        
        // Calculate track width (average of both segments)
        const trackWidth = (s1.radius + s2.radius) / 1.2;
        
        // Calculate start and end points of the start line (full track width)
        const halfWidth = trackWidth / 2;
        const startX = midX - perpX * halfWidth;
        const startY = midY - perpY * halfWidth;
        const endX = midX + perpX * halfWidth;
        const endY = midY + perpY * halfWidth;
        
        // Draw 2 rows of checkers
        const checkerSize = trackWidth / 8; // Make checkers 1/8 of track width
        const numColumns = Math.floor(trackWidth / checkerSize);
        const rowHeight = checkerSize;
        
        ctx.save();
        
        // Draw first row (closer to start)
        for (let col = 0; col < numColumns; col++) {
            const colOffset = (col - numColumns / 2) * checkerSize;
            const checkerX = midX + perpX * colOffset;
            const checkerY = midY + perpY * colOffset;
            
            // Calculate checker rectangle corners
            const corner1X = checkerX - perpX * (checkerSize / 2) - nx * (rowHeight / 2);
            const corner1Y = checkerY - perpY * (checkerSize / 2) - ny * (rowHeight / 2);
            const corner2X = checkerX + perpX * (checkerSize / 2) - nx * (rowHeight / 2);
            const corner2Y = checkerY + perpY * (checkerSize / 2) - ny * (rowHeight / 2);
            const corner3X = checkerX + perpX * (checkerSize / 2) + nx * (rowHeight / 2);
            const corner3Y = checkerY + perpY * (checkerSize / 2) + ny * (rowHeight / 2);
            const corner4X = checkerX - perpX * (checkerSize / 2) + nx * (rowHeight / 2);
            const corner4Y = checkerY - perpY * (checkerSize / 2) + ny * (rowHeight / 2);
            
            // Alternate between black and white
            ctx.fillStyle = (col % 2 === 0) ? '#000000' : '#ffffff';
            
            ctx.beginPath();
            ctx.moveTo(corner1X, corner1Y);
            ctx.lineTo(corner2X, corner2Y);
            ctx.lineTo(corner3X, corner3Y);
            ctx.lineTo(corner4X, corner4Y);
            ctx.closePath();
            ctx.fill();
        }
        
        // Draw second row (further from start)
        for (let col = 0; col < numColumns; col++) {
            const colOffset = (col - numColumns / 2) * checkerSize;
            const checkerX = midX + perpX * colOffset;
            const checkerY = midY + perpY * colOffset;
            
            // Calculate checker rectangle corners (offset by rowHeight)
            const corner1X = checkerX - perpX * (checkerSize / 2) + nx * (rowHeight / 2);
            const corner1Y = checkerY - perpY * (checkerSize / 2) + ny * (rowHeight / 2);
            const corner2X = checkerX + perpX * (checkerSize / 2) + nx * (rowHeight / 2);
            const corner2Y = checkerY + perpY * (checkerSize / 2) + ny * (rowHeight / 2);
            const corner3X = checkerX + perpX * (checkerSize / 2) + nx * (rowHeight * 1.5);
            const corner3Y = checkerY + perpY * (checkerSize / 2) + ny * (rowHeight * 1.5);
            const corner4X = checkerX - perpX * (checkerSize / 2) + nx * (rowHeight * 1.5);
            const corner4Y = checkerY - perpY * (checkerSize / 2) + ny * (rowHeight * 1.5);
            
            // Alternate between black and white (offset by 1 for checkerboard pattern)
            ctx.fillStyle = ((col + 1) % 2 === 0) ? '#000000' : '#ffffff';
            
            ctx.beginPath();
            ctx.moveTo(corner1X, corner1Y);
            ctx.lineTo(corner2X, corner2Y);
            ctx.lineTo(corner3X, corner3Y);
            ctx.lineTo(corner4X, corner4Y);
            ctx.closePath();
            ctx.fill();
        }
        
        ctx.restore();
    }

    private drawCheckpoints(ctx: CanvasRenderingContext2D) {
        if (this.segments.length < 2) return;

        // Draw checkpoint every 4 segments (excluding the start line at segment 0)
        for (let i = 4; i < this.segments.length; i += 4) {
            const s1 = this.segments[i];
            const s2 = this.segments[(i + 1) % this.segments.length];
            
            // Calculate midpoint of segment
            const midX = (s1.x + s2.x) / 2;
            const midY = (s1.y + s2.y) / 2;
            
            // Calculate direction vector and perpendicular
            const dx = s2.x - s1.x;
            const dy = s2.y - s1.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            
            if (length === 0) continue;
            
            const nx = dx / length;
            const ny = dy / length;
            const perpX = -ny;
            const perpY = nx;
            
            // Calculate track width
            const trackWidth = (s1.radius + s2.radius) / 2;
            const halfWidth = trackWidth / 2;
            
            // Calculate checkpoint line endpoints (full track width)
            const startX = midX - perpX * halfWidth;
            const startY = midY - perpY * halfWidth;
            const endX = midX + perpX * halfWidth;
            const endY = midY + perpY * halfWidth;
            
            // Draw checkpoint line
            ctx.strokeStyle = '#FFFFFF'; // White checkpoint line
            ctx.lineWidth = 6;
            ctx.lineCap = 'square';
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
    }

    distanceToLineSegment(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len2 = dx * dx + dy * dy;
        if (len2 === 0) return Math.hypot(px - x1, py - y1);
        let t = ((px - x1) * dx + (py - y1) * dy) / len2;
        t = Math.max(0, Math.min(1, t));
        const projx = x1 + t * dx;
        const projy = y1 + t * dy;
        return Math.hypot(px - projx, py - projy);
    }

    checkCheckpointCollisions(carX: number, carY: number) {
        // Find the closest segment to the car
        let closestSegment = -1;
        let minDistance = Infinity;
        
        for (let i = 0; i < this.segments.length; i++) {
            const s1 = this.segments[i];
            const s2 = this.segments[(i + 1) % this.segments.length];
            const dist = this.distanceToLineSegment(carX, carY, s1.x, s1.y, s2.x, s2.y);
            
            if (dist < minDistance) {
                minDistance = dist;
                closestSegment = i;
            }
        }
        
        // Check if car moved to a new segment
        if (closestSegment !== this.lastCarSegment && this.lastCarSegment !== -1) {
            // Check if we crossed a checkpoint or start line
            if (closestSegment === 0) {
                console.log('🏁 Start/Finish Line crossed!');
            } else if (closestSegment % 4 === 0) {
                console.log(`🏁 Checkpoint ${closestSegment / 4} crossed!`);
            }
        }
        
        this.lastCarSegment = closestSegment;
    }

    isOnTrack(carX: number, carY: number): boolean {
        if (this.segments.length < 2) return false;

        for (let i = 0; i < this.segments.length; i++) {
            const s1 = this.segments[i];
            const s2 = this.segments[(i + 1) % this.segments.length];
            const dist = this.distanceToLineSegment(carX, carY, s1.x, s1.y, s2.x, s2.y);
            const segmentRadius = (s1.radius + s2.radius) / 2;
            if (dist <= segmentRadius) return true;
        }
        return false;
    }

    checkWallCollision(carX: number, carY: number, carWidth: number, carHeight: number): boolean {
        // Find the closest distance from car to any track segment
        let minDistance = Infinity;
        let closestSegmentRadius = 0;
        
        for (let i = 0; i < this.segments.length; i++) {
            const s1 = this.segments[i];
            const s2 = this.segments[(i + 1) % this.segments.length];
            const dist = this.distanceToLineSegment(carX, carY, s1.x, s1.y, s2.x, s2.y);
            if (dist < minDistance) {
                minDistance = dist;
                closestSegmentRadius = (s1.radius + s2.radius) / 2;
            }
        }
        
        // Wall collision if car is in the wall zone
        // Account for track radius + grass + wall
        const trackEdge = closestSegmentRadius; // Track edge
        const grassEdge = trackEdge + this.grassThickness / 2 - (this.wallThickness - this.grassThickness) + 25; // End of grass
        const wallEdge = trackEdge + this.wallThickness / 2; // End of wall
        
        // Collide if car is in the wall zone (between grass and wall)
        return minDistance > grassEdge && minDistance <= wallEdge;
    }

    getStartingPosition(clockwise: boolean = true): {x: number, y: number, angle: number} {
        // Return the position and angle for the start line
        if (this.segments.length >= 2) {
            const s1 = this.segments[0];
            const s2 = this.segments[1];
            
            // Calculate midpoint of first segment (start line position)
            const midX = (s1.x + s2.x) / 2;
            const midY = (s1.y + s2.y) / 2;
            
            // Calculate direction vector and perpendicular angle
            const dx = s2.x - s1.x;
            const dy = s2.y - s1.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            
            let angle = 0;
            let carX = midX;
            let carY = midY;
            
            if (length > 0) {
                const nx = dx / length;
                const ny = dy / length;
                const perpX = -ny;
                const perpY = nx;
                
                // Calculate track direction angle
                const trackDirectionAngle = Math.atan2(dy, dx) * (180 / Math.PI);
                
                if (clockwise) {
                    // Clockwise: car faces racing direction, positioned behind start line
                    angle = trackDirectionAngle; // Face down the track
                    const backDistance = 30;
                    carX = midX - nx * backDistance;
                    carY = midY - ny * backDistance;
                } else {
                    // Counterclockwise: car faces opposite direction, positioned ahead of start line
                    angle = trackDirectionAngle + 180; // Face opposite direction
                    const forwardDistance = 30;
                    carX = midX + nx * forwardDistance;
                    carY = midY + ny * forwardDistance;
                }
            }
            
            return {
                x: carX,
                y: carY,
                angle: angle
            };
        }
        
        // Fallback to first segment if only one exists
        if (this.segments.length > 0) {
            return {
                x: this.segments[0].x,
                y: this.segments[0].y,
                angle: 0
            };
        }
        
        // Fallback to canvas center if no segments
        return {
            x: this.canvasWidth / 2,
            y: this.canvasHeight / 2,
            angle: 0
        };
    }

}
let colors = [
    ['#8B949C', '#0C6377', '#C6C8D5', '#5BA5C1', '#81AEC6'],
    ['#25282F', '#8FB2CE', '#937687', '#AC8E73', '#9FA26E', '#2D3F22'],
    ['#954C2C', '#2B3D63', '#D4C3CD', '#5F1F14', '#52712B', '#552158', '#8A80B5'],
    ['#79607C', '#1B6BC4', '#8E5C62', '#2F3812', '#FFBAC5', '#20406D', '#D492D7']
]

let grid = []
let rects = []
let padding = 1
let space = 50
let xo = 0
let yo = 0
let rows, cols, scl, palette

function setup() {
    createCanvas(1000, 1000, WEBGL)
    camera(0, 0, 600)
    scl = width * 0.025
    rows = height / scl
    cols = width / scl
    palette = random(colors)
    
    for (let row = padding; row < rows - padding; row++) {
        let rowValues = []
        for (let col = padding; col < cols - padding; col++) {
            rowValues.push(true)
        }
        grid.push(rowValues)
    }
    
    fillMajority(3)
    fillMajority(4)
    fillMajority(5)
    fillRemainder()
    
    background(10)
    strokeWeight(2)
    lights()
    
    rotate(random(TAU))
    translate(-500, -500)

    rects.forEach(r => {
        push()
        translate(((r.c + padding) * scl) + ((r.w * scl) / 2), ((r.r + padding) * scl) + ((r.h * scl) / 2))
        fill(palette[floor(map(noise(r.c * scl * cos(r.c), r.r * scl * sin(r.r)), 0, 1, 0, palette.length))])
        box(r.w * scl, r.h * scl, random(5, 75))
        pop()
    })
    
}

function fillMajority(divisor) {
    let count = 0
    while(count < 1000) {
        let randRow = round(random(rows - (padding * 2) - 1))
        let rr = round(map(noise(xo, yo), 0, 1, 0, rows - (padding * 2) - 1))
        let randCol = round(random(cols - (padding * 2) - 1))
        let rc = round(map(noise(yo, xo), 0, 1, 0, cols - (padding * 2) - 1))

        let randHeight = round(random(1, (rows - padding - randRow) / divisor))
        let rh = round(map(noise(xo * sin(yo) * 35, yo * cos(xo) * 15), 0, 1, 1, (rows - padding - rc) / divisor))
        let rw = round(map(noise(yo * sin(xo) * 35, xo * cos(yo) * 15), 0, 1, 1, (cols - padding - rr) / divisor))
        console.log(rr, rc)

        let randWidth = round(random(1, (cols - padding - randCol) / divisor))
        if (fits(rr, rc, rh, rw)) {
            occupy(rr, rc, rh, rw)
            let newRect = new RectInfo(rr, rc, rh, rw)
            rects.push(newRect)
        }
        xo += 0.15
        yo += 0.35
        count++
    }
}

function fillRemainder() {
    for(let row = 0; row < rows - (padding * 2); row ++) {
        for (let col = 0; col < cols - (padding * 2); col++) {
            if (grid[row][col] == true) {
                let newRect = new RectInfo(row, col, 1, 1)
                rects.push(newRect)
            }
        }
    }
}

function fits(r, c, h, w) {
    for (let row = r; row < r + h; row++) {
        for (let col = c; col < c + w; col++) {
            if (grid[row][col] == false) {
                return false
            }
        }
    }
    return true
}

function occupy(r, c, h, w) {
    for (let row = r; row < r + h; row++) {
        for (let col = c; col < c + w; col++) {
            grid[row][col] = false
        }
    }
    return true
}

class RectInfo {
    constructor(r, c, h, w) {
        this.r = r
        this.c = c
        this.h = h
        this.w = w
    }
}

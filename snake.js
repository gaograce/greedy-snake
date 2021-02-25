let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')
let snake = [{x: 0, y: 0}, {x: 10, y: 0}, {x: 20, y: 0}]
let snakeMaxLen = 1000
let head = 2
let len = 3
let direction = [1, 0]
let directions = [[0, -1], [0, 1], [-1, 0], [1, 0]]
let food, score = 0, gameOver = false, paused = false, win = false
let speed = 5
let result = document.getElementById('result')
let snakeWidth = 10
let snakeXCnt = canvas.width / snakeWidth
let snakeYCnt = canvas.height / snakeWidth
refresh()
//drawSnakeImg()
function eatFoodCheck(x, y) {
  if (food && food.x > x && food.x < x + snakeWidth && food.y > y && food.y < y + snakeWidth) {
    food = undefined
    len++
    score += 10
    document.getElementById('score').innerText = score
    if(len === snakeMaxLen) {
      win = true
    }
  }
}

function boundaryCheck(x, y) {
  gameOver = x < 0 || y < 0 || x + snakeWidth > canvas.width || y + snakeWidth > canvas.height
}

function snakeCheck(x, y) {
  for(let i = len; i > 0; i--) {
    let idx = (i + head - len + snake.length) % snake.length
    if(x === snake[idx].x &&  y === snake[idx].y) {
      gameOver = true
      break
    }
  }
}

function refresh() {
  if(gameOver) {
    return
  }
  if(!paused) {
    let x = snake[head].x + snakeWidth * direction[0]
    let y = snake[head].y + snakeWidth * direction[1]
    eatFoodCheck(x, y)
    boundaryCheck(x, y)
    snakeCheck(x, y)
    if(win) {
      result.style.display = 'block'
      document.getElementById('fail').style.display = 'none'
      document.getElementById('success').style.display = 'block'
      return
    }
    if(gameOver) {
      result.style.display = 'block'
      document.getElementById('fail').style.display = 'block'
      document.getElementById('success').style.display = 'none'
      return
    }
    if(snake.length < snakeMaxLen) {
      snake.push({x: x, y: y})
      head++
    } else {
      head = (head + 1) % snake.length
      snake[head] = {x: x, y: y}
    }
    clearAll()
    drawSnake()
    drawFood()
  }
  setTimeout(refresh, 1000 / speed)
}

function isInSnake(x, y) {
  for(let i = len; i > 0; i--) {
    let idx = (i + head - len + snake.length) % snake.length
    if(x > snake[idx].x && x < snake[idx].x + snakeWidth && y > snake[idx].y && y < snake[idx].y + snakeWidth) {
      return true
    }
  }
  return false
}

function drawFood() {
  if(!food) {
    food = {}
    food.x = Math.floor(Math.random() * snakeXCnt) * snakeWidth + 5
    food.y = Math.floor(Math.random() * snakeYCnt) * snakeWidth + 5
    while(isInSnake(food.x, food.y)) {
      food.x = Math.floor(Math.random() * snakeXCnt) * snakeWidth + 5
      food.y = Math.floor(Math.random() * snakeYCnt) * snakeWidth + 5
    }
  }

  ctx.beginPath()
  ctx.arc(food.x, food.y, 4, 0, Math.PI * 2, true)
  ctx.fillStyle = 'orange'
  ctx.fill()
}

document.addEventListener('keyup', e => {
  if(gameOver || paused) {
    return
  }
  if(e.key === 'ArrowUp') {
    updateDirection(0)
  } else if(e.key === 'ArrowDown') {
    updateDirection(1)
  } else if(e.key === 'ArrowLeft') {
    updateDirection(2)
  } else if(e.key === 'ArrowRight') {
    updateDirection(3)
  }
})

function isOpposite(newDirect, direction) {
  return newDirect[0] + direction[0] === 0 && newDirect[1] + direction[1] === 0;
}

function updateDirection(idx) {
  let newDirect = directions[idx]
  if(!isOpposite(newDirect, direction)) {
    direction = newDirect
  }
}

function clearAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function drawSnake() {
  ctx.beginPath()
  for(let i = len; i > 0; i--) {
    let idx = (i + head - len + snake.length) % snake.length
    ctx.fillStyle = 'green'
    ctx.rect(snake[idx].x, snake[idx].y, snakeWidth, snakeWidth)
    ctx.fill()
  }
}

function restart() {
  snake = [{x: 0, y: 0}, {x: snakeWidth, y: 0}, {x: snakeWidth * 2, y: 0}]
  head = 2
  len = 3
  direction = [1, 0]
  food = undefined
  score = 0
  gameOver = false
  win = false
  speed = 5
  paused = false
  document.getElementById('pause').innerText = paused ? 'Resume' : 'Pause'
  document.getElementById('speed').innerText = speed
  document.getElementById('score').innerText = score
  result.style.display = 'none'
  refresh()
}

function pause() {
  paused = !paused
  document.getElementById('pause').innerText = paused ? 'Resume' : 'Pause'
}

function speedUp(increment) {
  if(speed + increment >= 1 && speed + increment <= 20) {
    speed += increment
    document.getElementById('speed').innerText = speed
  }
}
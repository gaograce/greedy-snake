let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')
let snakeWidth = 20
let snake = [{x: 0, y: snakeWidth}, {x: 10, y: snakeWidth}, {x: 20, y: snakeWidth}]
let snakeMaxLen = 1000
let head = 2
let len = 3
let directions = [[0, -1], [0, 1], [-1, 0], [1, 0]]
let direction = directions[3]
let food, score = 0, gameOver = false, paused = false, win = false
let speed = 5
let result = document.getElementById('result')
let snakeXCnt = canvas.width / snakeWidth
let snakeYCnt = canvas.height / snakeWidth
let colors = ['red', 'orange', 'blue', 'purple', 'pink', 'salmon', 'black']
refresh()

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
  gameOver = x < snakeWidth || y < snakeWidth || x + snakeWidth * 2 > canvas.width || y + snakeWidth * 2 > canvas.height
  if(gameOver) {
    console.log('boundary'+x+';'+y)
  }
}

function snakeCheck(x, y) {
  for(let i = len; i > 0; i--) {
    let idx = (i + head - len + snake.length) % snake.length
    if(x === snake[idx].x &&  y === snake[idx].y) {
      gameOver = true
      console.log('snake')
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
    drawBoundary()
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
    food.x = Math.floor(Math.random() * (snakeXCnt - 2) + 1) * snakeWidth + snakeWidth / 2
    food.y = Math.floor(Math.random() * (snakeYCnt - 2) + 1) * snakeWidth + snakeWidth / 2
    while(isInSnake(food.x, food.y)) {
      food.x = Math.floor(Math.random() * (snakeXCnt - 2) + 1) * snakeWidth + snakeWidth / 2
      food.y = Math.floor(Math.random() * (snakeYCnt - 2) + 1) * snakeWidth + snakeWidth / 2
    }
    food.color = randomAColor()
  }

  /*ctx.beginPath()
  ctx.arc(food.x, food.y, 4, 0, Math.PI * 2, true)
  ctx.fillStyle = 'orange'
  ctx.fill()*/
  drawFLower(food.x, food.y, food.color)
}

function randomAColor() {
  return colors[Math.floor(Math.random() * colors.length)]
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
  let last = null
  for(let i = len; i > 0; i--) {
    let idx = (i + head - len + snake.length) % snake.length
    //console.log(snake[idx])
    if(idx === head) {
      drawHead(snake[idx].x, snake[idx].y)
    } else {
      drawBody(snake[idx].x, snake[idx].y, {x: last.x - snake[idx].x, y: last.y - snake[idx].y})
    }
    last = snake[idx]
  }
}

function drawBoundary() {
  ctx.fillStyle = '#eeeeee'
  ctx.beginPath()
  ctx.rect(0,0,canvas.width, snakeWidth)
  ctx.fill()
  ctx.rect(0, canvas.height - snakeWidth,canvas.width, snakeWidth)
  ctx.fill()
  ctx.rect(0,0, snakeWidth, canvas.height)
  ctx.fill()
  ctx.rect(canvas.width - snakeWidth,0, snakeWidth, canvas.height)
  ctx.fill()
}

function restart() {
  snake = [{x: 0, y: snakeWidth}, {x: snakeWidth, y: snakeWidth}, {x: snakeWidth * 2, y: snakeWidth}]
  head = 2
  len = 3
  direction = directions[3]
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

function getRadialGradient(x,y,r) {
  var radial = ctx.createRadialGradient(x+r/2, y + r/2, r/4,x + r,y + r, r);
  radial.addColorStop(0,'rgb(108,172,108)')
  radial.addColorStop(0.9,'rgb(90,150,90)')
  radial.addColorStop(1, 'rgba(90,150,90,0)')
  return radial
}

function drawCircle(x, y, r) {
  ctx.beginPath()
  ctx.fillStyle = getRadialGradient(x,y,r)
  ctx.fillRect(x, y, 2*r, 2*r)
}

function drawHead(x, y) {
  drawCircle(x,y, snakeWidth / 2)

  let xC = x + snakeWidth / 2;
  let yC = y + snakeWidth / 2;
  let x1, y1, x2, y2
  if(direction === directions[3]) {
    x1 = xC + 2
    x2 = xC + 3
    y1 = y2 = yC

    x3 = x + 3 * snakeWidth / 2
    y3 = yC
    x4 = x + 3 * snakeWidth / 2
    y4 = y - snakeWidth / 2
    sA = 7/6 * Math.PI
    eA = 3/2 * Math.PI

  } else if(direction === directions[2]) {
    x1 = xC - 2
    x2 = xC - 3
    y1 = y2 = yC

    x3 = x - snakeWidth / 2
    y3 = yC
    x4 = x - snakeWidth / 2
    y4 = y - snakeWidth / 2
    sA = 3/2 * Math.PI
    eA = 11/6 * Math.PI
  } else if(direction === directions[1]) {
    y1 = yC + 2
    y2 = yC + 3
    x1 = x2 = xC

    x3 = xC
    y3 = y + 3 * snakeWidth / 2
    x4 = x + 3 * snakeWidth / 2
    y4 = y + 3 * snakeWidth / 2
    sA = 10/6 * Math.PI
    eA = 2 * Math.PI
  } else {
    y1 = yC - 2
    y2 = yC - 3
    x1 = x2 = xC

    x3 = xC
    y3 = y - snakeWidth / 2
    x4 = x + 3 * snakeWidth / 2
    y4 = y - snakeWidth / 2
    sA = 0
    eA = 1/3 * Math.PI

  }
  //眼睛
  ctx.fillStyle='white'
  ctx.arc(x1, y1,5,0, Math.PI * 2,true)
  ctx.fill()
  ctx.beginPath()
  ctx.fillStyle='black'
  ctx.arc(x2, y2,2,0,Math.PI*2,true)
  ctx.fill()

  //触角
  ctx.beginPath()
  ctx.arc(x3, y3, 20, sA, eA, false)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(x4, y4, 5, 0, 2 * Math.PI, false)
  ctx.fill()
}

function drawBody(x, y, direct) {
  let r = snakeWidth / 2 * 0.8
  if(direct.x > 0) {
    //right
    drawCircle(x + snakeWidth / 2,y + snakeWidth/ 2 - r, r)
    drawCircle(x, y + snakeWidth/ 2 - r, r)
  } else if(direct.x < 0) {
    // left
    drawCircle(x + snakeWidth/2 - 2 * r, y + snakeWidth/ 2 - r, r)
    drawCircle(x + snakeWidth - 2 * r, y + snakeWidth/ 2 - r, r)
  } else if (direct.y > 0) {
    //down
    drawCircle(x + snakeWidth / 2 - r, y + snakeWidth / 2, r)
    drawCircle(x + snakeWidth / 2 - r, y, r)
  } else {
    //up
    drawCircle(x + snakeWidth / 2 - r, y + snakeWidth/2 - 2 * r, r)
    drawCircle(x + snakeWidth / 2 - r, y + snakeWidth - 2 * r, r)
  }

}

function drawFLower(x, y, color = 'orange') {
  ctx.save()
  ctx.translate(x,y)
  ctx.scale(0.5,0.5)
  ctx.fillStyle = color
  ctx.rotate(72/180 * Math.PI);ctx.beginPath();ctx.arc(0, -10, 6, 0, 2 * Math.PI, true);ctx.fill()
  ctx.rotate(72/180 * Math.PI);ctx.beginPath();ctx.arc(0, -10, 6, 0, 2 * Math.PI, true);ctx.fill()
  ctx.rotate(72/180 * Math.PI);ctx.beginPath();ctx.arc(0, -10, 6, 0, 2 * Math.PI, true);ctx.fill()
  ctx.rotate(72/180 * Math.PI);ctx.beginPath();ctx.arc(0, -10, 6, 0, 2 * Math.PI, true);ctx.fill()
  ctx.rotate(72/180 * Math.PI);ctx.beginPath();ctx.arc(0, -10, 6, 0, 2 * Math.PI, true);ctx.fill()
  ctx.restore()
}



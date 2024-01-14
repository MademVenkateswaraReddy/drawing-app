const canvas = document.querySelector('canvas');
toolBtns = document.querySelectorAll('.tool');
fillColor = document.querySelector('#fill-color');
sizeSlider = document.querySelector('#size-slider');
colorBtns = document.querySelectorAll('.colors .option');
colorPicker = document.querySelector('#color-picker');
clearCanvas = document.querySelector('.clear-canvas');
saveImg = document.querySelector('.save-img');
ctx = canvas.getContext('2d')

let prevMouseX, prevMouseY, snapshot,
    isDrawing = false,
    selectedTool = 'brush',
    brushWidth = 3,
    selectedColor = '#000';


const setCanvasBackground = () =>{
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = selectedColor
    }

window.addEventListener('load', () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground()
});
const drawStraightLine = (e) => {
    ctx.putImageData(snapshot, 0, 0);
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
};
const drawCurvedLine = (e) => {
    ctx.putImageData(snapshot, 0, 0);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
};


const drawRect = (e) => {
    ctx.putImageData(snapshot, 0, 0);
    if (!fillColor.checked) {
        return ctx.strokeRect(prevMouseX, prevMouseY, e.offsetX - prevMouseX, e.offsetY - prevMouseY);
    } else {
        ctx.fillRect(prevMouseX, prevMouseY, e.offsetX - prevMouseX, e.offsetY - prevMouseY);
    }
};

const drawCircle = (e) =>{
    ctx.putImageData(snapshot, 0, 0);    
    ctx.beginPath();
        let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
        ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
        fillColor.checked ? ctx.fill() : ctx.stroke();        
}

const drawTriangle = (e)=>{
    ctx.putImageData(snapshot, 0, 0);
   ctx.beginPath();
   ctx.moveTo(prevMouseX, prevMouseY);
   ctx.lineTo(e.offsetX, e.offsetY);
   ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
   ctx.closePath();
   fillColor.checked ? ctx.fill() : ctx.stroke();
}

const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    snapshot = ctx.getImageData(0,0,canvas.width, canvas.height) 
    ctx.beginPath();
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
};

const drawing = (e) => {
    if (!isDrawing) return;

    
    if (selectedTool === 'brush' || selectedTool === 'eraser') {
        ctx.strokeStyle = selectedTool === 'eraser' ? '#fff' : selectedColor;
        ctx.putImageData(snapshot, 0, 0);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    } else if (selectedTool === 'st-line') {
        drawStraightLine(e);
    }else if (selectedTool === 'curve') {
        drawCurvedLine(e);
    }   else if (selectedTool === 'rectangle') {
        drawRect(e);
    } else if (selectedTool === 'circle') {
        drawCircle(e);
    } else if (selectedTool === 'triangle') {
        drawTriangle(e);
    }
};

toolBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelector('.options, .active').classList.remove('active');
        btn.classList.add('active');
        selectedTool = btn.id;
        console.log(selectedTool)
    });
});

sizeSlider.addEventListener('change', () => brushWidth = sizeSlider.value);
colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.options .selected').classList.remove('selected');
        btn.classList.add('selected');
        selectedColor = window.getComputedStyle(btn).getPropertyValue('background-color');
        
    });
});

colorPicker.addEventListener('input', () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener('click', (e)=>{
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    clearCanvas = document.querySelector('.clear-canvas');
})

saveImg.addEventListener('click', (e)=>{
    const link = document.createElement('a')
    link.download = `${Date.now()}.jpg`
    link.href = canvas.toDataURL()
    link.click()
})

canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mousemove', drawing);
canvas.addEventListener('mouseup', () => { isDrawing = false; });
canvas.addEventListener('contextmenu', (event) => {
    event.preventDefault(); // Prevent the context menu on right-click
});

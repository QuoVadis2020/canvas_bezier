class BezierCurve {
    constructor(c, container) {
        this.canvas = document.querySelector(c);
        this.ctx = this.canvas.getContext('2d');
        this.container = document.querySelector(container);

        this.rootY = this.canvas.height / 4 * 3;
        this.rightTopPoint = this.canvas.height / 4;

        this.controllerPosition = {
            p2: {x: 50, y: 250},
            p3: {x: 250, y: 250},
        }

        this.init();
    }

    init() {
        this.bindEvents();
        this.resetDrawer();
        const {p2, p3} = this.controllerPosition;
        this.drawBezierCurve(p2.x, p2.y, p3.x, p3.y)
    }

    resetDrawer() {
        this.clearDrawer();
        this.drawAxes();
    }

    clearDrawer() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    bindEvents() {
        this.canvas.addEventListener('mouseenter', this.onMouseenter.bind(this));
        this.canvas.addEventListener('mouseleave', this.onMouseleave.bind(this));
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    }

    drawAxes() {
        // 设置线条颜色和宽度
        this.ctx.strokeStyle = '#606060';
        this.ctx.lineWidth = 1;

        const _height = (this.rootY - this.rightTopPoint) / 15;


        // 绘制斑马背景 共15份 奇数份为白色 偶数份为灰色
        for (let i = 0; i < 15; i++) {
            if (i % 2 === 0) {
                this.ctx.fillStyle = '#fff';
            } else {
                this.ctx.fillStyle = '#f0f0f0';
            }
            this.ctx.fillRect(0, this.rightTopPoint + i * _height, this.canvas.width, _height);
        }

        // 绘制x轴
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.rootY);
        this.ctx.lineTo(this.canvas.width, this.rootY);
        this.ctx.stroke();

        // 绘制y轴
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.rightTopPoint);
        this.ctx.lineTo(0, this.rootY);
        this.ctx.stroke();

        this.ctx.lineWidth = 6;
        this.ctx.strokeStyle = "rgba(96,96,96,0.6)";
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.rootY);
        this.ctx.lineTo(this.canvas.width, this.rightTopPoint);
        this.ctx.stroke();
    }

    onMouseenter(event) {
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    onMouseleave(event) {
        this.canvas.removeEventListener('mousemove', this.onMouseMove.bind(this));
    }

    onMouseUp(event) {
        this.canvas.style.cursor = 'default';
    }

    onMouseDown(event) {
        this.canvas.style.cursor = 'pointer';
    }

    onMouseMove(event) {
        // console.log("move")
        this.canvas.style.cursor = 'default';
        let rect = this.canvas.getBoundingClientRect();
        let x = Math.max(event.clientX - rect.left, 0);

        const y = this.rootY - (event.clientY - rect.top)
        const percentY = (y / this.canvas.height * 2 * 100).toFixed();
        const percentX = (x / this.canvas.width * 100).toFixed();

        this.container.setAttribute('data-time', percentX)
        this.container.setAttribute('data-progression', percentY)

        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = 'black';

        // 显示坐标
        this.ctx.fillText(`x: ${percentX}, y: ${percentY}`, 10, 20);
    }

    setControllerPosition(cId, x, y) {
        this.controllerPosition[cId] = {x, y}

        const {p2, p3} = this.controllerPosition;
        this.drawBezierCurve(p2.x, p2.y, p3.x, p3.y)
    }

    drawBezierCurve(x1, y1, x2, y2) {
        this.resetDrawer();

        this.ctx.strokeStyle = '#000';
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.rootY);
        this.ctx.bezierCurveTo(x1, y1, x2, y2, this.canvas.width, 150);
        this.ctx.stroke();

        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#808080';
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.rootY);
        this.ctx.lineTo(x1, y1);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width, 150);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();

    }
}

const bezierCurve = new BezierCurve('#canvas', ".container")

class Draggable {
    constructor(elementId) {
        this.cId = elementId;
        this.boundDragMove = this.onMouseMove.bind(this);
        this.element = document.getElementById(elementId);
        this.element.addEventListener('mousedown', this.onMouseDown.bind(this));
    }

    onMouseDown(event) {
        this.startX = event.clientX;
        this.startY = event.clientY;
        this.startLeft = parseInt(this.element.style.left, 10);
        this.startTop = parseInt(this.element.style.top, 10);

        document.addEventListener('mousemove', this.boundDragMove);
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
    }

    onMouseMove(event) {
        const dx = event.clientX - this.startX;
        const dy = event.clientY - this.startY;

        this.element.style.left = `${this.startLeft + dx}px`;
        this.element.style.top = `${this.startTop + dy}px`;

        bezierCurve.setControllerPosition(this.cId, parseInt(this.element.style.left), parseInt(this.element.style.top))
    }

    onMouseUp() {
        document.removeEventListener('mousemove', this.boundDragMove);
    }
}

new Draggable('p2');
new Draggable('p3');
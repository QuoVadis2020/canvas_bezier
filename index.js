
class BezierCurve {
    constructor(c, container) {
        this.canvas = document.querySelector(c);
        this.ctx = this.canvas.getContext('2d');
        this.container = document.querySelector(container);

        this.rootY = this.canvas.height / 4 * 3;

        this.init();
    }

    init() {
        this.bindEvents();
        this.drawAxes();
    }

    bindEvents() {
        this.canvas.addEventListener('mouseenter', this.onMouseenter.bind(this));
        this.canvas.addEventListener('mouseleave', this.onMouseleave.bind(this));
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.canvas.addEventListener('mousedown', this.onMouseUp.bind(this));
    }

    drawAxes() {
        // 设置线条颜色和宽度
        this.ctx.strokeStyle = '#606060';
        this.ctx.lineWidth = 1;

        const coordinateYTop = this.canvas.height / 4;
        const coordinateYBottom = this.canvas.height / 4 * 3;
        const _height = (coordinateYBottom - coordinateYTop) / 15;


        // 绘制斑马背景 共15份 奇数份为白色 偶数份为灰色
        for (let i = 0; i < 15; i++) {
            if (i % 2 === 0) {
                this.ctx.fillStyle = '#fff';
            } else {
                this.ctx.fillStyle = '#f0f0f0';
            }
            this.ctx.fillRect(0, coordinateYTop + i * _height, this.canvas.width, _height);
        }

        // 绘制x轴
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height / 4 * 3);
        this.ctx.lineTo(this.canvas.width, this.canvas.height / 4 * 3);
        this.ctx.stroke();

        // 绘制y轴
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height / 4);
        this.ctx.lineTo(0, this.canvas.height / 4 * 3);
        this.ctx.stroke();

        this.ctx.lineWidth = 6;
        this.ctx.strokeStyle = "rgba(96,96,96,0.6)";
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.rootY);
        this.ctx.lineTo(this.canvas.width, this.canvas.height / 4);
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
        this.canvas.style.cursor = 'default';
        let rect = this.canvas.getBoundingClientRect();
        let x = Math.max(event.clientX - rect.left, 0);

        const y = this.rootY - (event.clientY - rect.top)
        const percentY = (y / this.canvas.height * 2 * 100).toFixed();
        const percentX = (x / this.canvas.width * 100).toFixed();

        this.container.setAttribute('data-time',percentX)
        this.container.setAttribute('data-progression',percentY)


        this.ctx.clearRect(0, 0, 300, 30);


        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = 'black';

        // 显示坐标
        this.ctx.fillText(`x: ${percentX}, y: ${percentY}`, 10, 20);
    }

}

const bezierCurve = new BezierCurve('#canvas', ".container")

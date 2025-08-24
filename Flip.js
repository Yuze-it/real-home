// Flipper 类和初始化逻辑
(function () {
    var Flipper = /** @Class */ (function () {
        function Flipper(node, currentTime, nextTime) {
            this.isFlipping = false;
            this.duration = 600;
            this.flipNode = node;
            this.frontNode = node.querySelector(".front");
            this.backNode = node.querySelector(".back");
            this.setFrontTime(currentTime);
            this.setBackTime(nextTime);
        }

        Flipper.prototype.setFrontTime = function (time) {
            this.frontNode.setAttribute("data-number", time);
            this.frontNode.textContent = time;
        };

        Flipper.prototype.setBackTime = function (time) {
            this.backNode.setAttribute("data-number", time);
            this.backNode.textContent = time;
        };

        Flipper.prototype.flip = function (currentTime, nextTime) {
            var _this = this;
            if (this.isFlipping) {
                return;
            }

            this.isFlipping = true;
            this.setBackTime(nextTime);
            this.flipNode.classList.add("running");

            setTimeout(function () {
                _this.flipNode.classList.remove("running");
                _this.setFrontTime(nextTime);
                _this.isFlipping = false;
            }, this.duration);
        };

        return Flipper;
    })();

    // 初始化 Flipper 实例
    var flipNodes = document.querySelectorAll(".flipNumber");
    var flippers = Array.from(flipNodes).map(function (node) {
        return new Flipper(node, "0", "1");
    });

    function updateTime() {
        var now = new Date();
        var hours = now.getHours();
        var minutes = now.getMinutes();
        var seconds = now.getSeconds();

        updateFlippers(flippers[0], Math.floor(hours / 10));
        updateFlippers(flippers[1], hours % 10);
        updateFlippers(flippers[2], Math.floor(minutes / 10));
        updateFlippers(flippers[3], minutes % 10);
        updateFlippers(flippers[4], Math.floor(seconds / 10));
        updateFlippers(flippers[5], seconds % 10);
    }

    function updateFlippers(flipper, newTime) {
        var currentTime = flipper.frontNode.getAttribute("data-number");
        if (currentTime !== String(newTime)) {
            flipper.flip(currentTime, newTime);
        }
    }

    setInterval(updateTime, 1000);
})();

// Wrap entire content in an IIFE to isolate scope
(function() {
    document.addEventListener('DOMContentLoaded', function() {
      const cursor = document.getElementById('custom-cursor');
      const cursorInner = document.querySelector('.cursor-inner');
      const cursorOuter = document.querySelector('.cursor-outer');
      
      // 添加光标元素存在性检查
      if (!cursor) {
          return; // 如果没有找到光标元素，不执行后续逻辑
      }
      
      // 显示自定义光标
      cursor.classList.add('visible');
      
      // 跟踪鼠标移动
      document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
      });
      
      // 处理鼠标离开窗口
      document.addEventListener('mouseleave', function() {
        cursor.classList.remove('visible');
      });
      
      // 处理鼠标进入窗口
      document.addEventListener('mouseenter', function() {
        cursor.classList.add('visible');
      });
      
      // 处理点击效果
      document.addEventListener('mousedown', function() {
        cursor.classList.add('clicked');
      });
      
      document.addEventListener('mouseup', function() {
        cursor.classList.remove('clicked');
      });
      
      // 检测元素交互状态
      function detectHover() {
        // 重置所有状态
        cursor.classList.remove(
          'link-hover', 
          'text-hover', 
          'button-hover',
          'waiting',
          'unavailable',
          'move-hover',
          'precision-hover',
          'resize-vertical',
          'resize-horizontal'
        );
        
        // 获取当前鼠标下的元素
        const x = parseInt(cursor.style.left) || 0;
        const y = parseInt(cursor.style.top) || parseInt(cursor.style.bottom) || parseInt(cursor.style.right) || parseInt(cursor.style.left) || 0;
        const hoveredElement = document.elementFromPoint(x, y);
        
        if (!hoveredElement) return;
        
        // 检测链接
        if (hoveredElement.tagName === 'A' || hoveredElement.closest('a')) {
          cursor.classList.add('link-hover');
        }
        // 检测文本输入
        else if (
          hoveredElement.tagName === 'INPUT' && 
          (hoveredElement.type === 'text' || 
           hoveredElement.type === 'password' || 
           hoveredElement.type === 'email') ||
          hoveredElement.tagName === 'TEXTAREA'
        ) {
          cursor.classList.add('text-hover');
        }
        // 检测按钮
        else if (
          hoveredElement.tagName === 'BUTTON' ||
          (hoveredElement.tagName === 'INPUT' && 
           (hoveredElement.type === 'button' || 
            hoveredElement.type === 'submit' || 
            hoveredElement.type === 'reset'))
        ) {
          cursor.classList.add('button-hover');
        }
        // 检测等待状态元素
        else if (
          hoveredElement.classList.contains('wait') ||
          hoveredElement.classList.contains('loading')
        ) {
          cursor.classList.add('waiting');
        }
        // 检测不可用元素
        else if (
          hoveredElement.classList.contains('unavailable') ||
          hoveredElement.disabled
        ) {
          cursor.classList.add('unavailable');
        }
        // 检测可移动元素
        else if (hoveredElement.classList.contains('move')) {
          cursor.classList.add('move-hover');
        }
        // 检测精度选择元素
        else if (hoveredElement.classList.contains('precision')) {
          cursor.classList.add('precision-hover');
        }
        // 检测调整大小元素
        else if (hoveredElement.classList.contains('resize-vertical')) {
          cursor.classList.add('resize-vertical');
        }
        else if (hoveredElement.classList.contains('resize-horizontal')) {
          cursor.classList.add('resize-horizontal');
        }
      }
      
      // 持续检测悬停状态
      setInterval(detectHover, 100);
    });
    
    // 光标状态映射 - 蓝色圆润鱼鳍光标
    const cursorStates = {
        default: {
            outerClass: '',
            url: './蓝色圆润鱼鳍光标/normal.ani'
        },
        link: {
            outerClass: 'cursor-link',
            url: './蓝色圆润鱼鳍光标/link.cur'
        },
        text: {
            outerClass: 'cursor-text',
            url: './蓝色圆润鱼鳍光标/text.cur'
        },
        button: {
            outerClass: 'cursor-button',
            url: './蓝色圆润鱼鳍光标/handwriting.cur'
        },
        move: {
            outerClass: 'cursor-move',
            url: './蓝色圆润鱼鳍光标/move.cur'
        },
        wait: {
            outerClass: 'cursor-wait',
            url: './蓝色圆润鱼鳍光标/busy.ani'
        },
        help: {
            outerClass: 'cursor-help',
            url: './蓝色圆润鱼鳍光标/help.ani'
        },
        resizeVertical: {
            outerClass: 'cursor-resize-vertical',
            url: './蓝色圆润鱼鳍光标/vertical.cur'
        },
        resizeHorizontal: {
            outerClass: 'cursor-resize-horizontal',
            url: './蓝色圆润鱼鳍光标/horizontal.cur'
        },
        resizeDiagonal: {
            outerClass: 'cursor-resize-diagonal',
            url: './蓝色圆润鱼鳍光标/diagonal1.cur'
        }
    };
    
    // 更新光标样式函数
    function updateCursorStyle(state) {
        const cursorState = cursorStates[state] || cursorStates.default;
        const outerElement = cursorElement.querySelector('.cursor-outer');
        
        // 移除所有状态类
        Object.values(cursorStates).forEach(s => {
            outerElement.classList.remove(s.outerClass);
        });
        
        // 添加当前状态类并更新光标图像
        outerElement.classList.add(cursorState.outerClass);
        outerElement.style.backgroundImage = `url('${cursorState.url}')`;
    }
})();
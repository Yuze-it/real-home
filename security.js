// 自定义右键菜单和开发者工具禁用功能
// 优化版本 - 使用Font Awesome图标

// 创建自定义右键菜单样式
function createCustomMenuStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .custom-menu {
            position: fixed;
            display: none;
            background-color: #fff;
            border: 1px solid #e1e5e9;
            border-radius: 8px;
            padding: 6px 0;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            min-width: 200px;
            backdrop-filter: blur(10px);
            background-color: rgba(255, 255, 255, 0.98);
            animation: menuFadeIn 0.15s ease-out;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        
        .dark-mode .custom-menu {
            background-color: rgba(33, 33, 33, 0.98);
            border-color: #444;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        
        .custom-menu button {
            width: 100%;
            padding: 10px 16px;
            text-align: left;
            background: none;
            border: none;
            cursor: pointer;
            font-size: 14px;
            color: #333;
            display: flex;
            align-items: center;
            transition: background-color 0.2s;
        }
        
        .dark-mode .custom-menu button {
            color: #f0f0f0;
        }
        
        .custom-menu button:hover {
            background-color: #f0f5ff;
        }
        
        .dark-mode .custom-menu button:hover {
            background-color: #2d2d2d;
        }
        
        .custom-menu .menu-icon {
            margin-right: 12px;
            width: 16px;
            text-align: center;
            font-size: 14px;
        }
        
        .menu-divider {
            height: 1px;
            background-color: #e1e5e9;
            margin: 6px 0;
        }
        
        .dark-mode .menu-divider {
            background-color: #444;
        }
        
        @keyframes menuFadeIn {
            from {
                opacity: 0;
                transform: translateY(-5px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        .context-menu-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: #4CAF50;
            color: white;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            opacity: 0;
            transform: translateY(-20px);
            transition: opacity 0.3s, transform 0.3s;
            z-index: 10001;
            pointer-events: none;
            font-size: 14px;
        }
        
        .context-menu-notification.show {
            opacity: 1;
            transform: translateY(0);
        }
        
        .context-menu-notification.error {
            background: #f44336;
        }
    `;
    document.head.appendChild(style);
}

// 创建自定义右键菜单
function createCustomMenu() {
    // 移除已存在的菜单（防止重复创建）
    const existingMenu = document.getElementById('customContextMenu');
    if (existingMenu) {
        existingMenu.remove();
    }
    
    // 创建菜单元素
    const menu = document.createElement('div');
    menu.className = 'custom-menu';
    menu.id = 'customContextMenu';
    menu.innerHTML = `
        <button id="menuBack"><span class="menu-icon"><i class="fas fa-arrow-left"></i></span>返回上一页</button>
        <button id="menuReload"><span class="menu-icon"><i class="fas fa-redo"></i></span>刷新页面</button>
        <button id="menuHome"><span class="menu-icon"><i class="fas fa-home"></i></span>返回首页</button>
        <div class="menu-divider"></div>
        <button id="menuDarkMode"><span class="menu-icon"><i class="fas fa-moon"></i></span>切换深色模式</button>
        <button id="menuCopyUrl"><span class="menu-icon"><i class="fas fa-link"></i></span>复制URL</button>
        <button id="menuSearch"><span class="menu-icon"><i class="fas fa-search"></i></span>搜索选中文本</button>
        <div class="menu-divider"></div>
        <button id="menuInspect"><span class="menu-icon"><i class="fas fa-search-plus"></i></span>检查元素</button>
    `;
    document.body.appendChild(menu);
    
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = 'context-menu-notification';
    notification.id = 'contextMenuNotification';
    document.body.appendChild(notification);
}

// 加载Font Awesome
function loadFontAwesome() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
    document.head.appendChild(link);
}

// 初始化禁用开发者工具
function initDisableDevtool() {
    // 检查是否在浏览器环境
    if (typeof window !== 'undefined') {
        try {
            // 动态导入disable-devtool库
            import('disable-devtool').then(DisableDevtool => {
                // 配置参数
                const options = {
                    md5: '', // 绕过禁用的md5值，默认不启用
                    url: '', // 关闭页面失败时的跳转页面
                    tkName: 'ddtk', // 绕过禁用时的url参数名称
                    interval: 200, // 定时器的时间间隔
                    disableMenu: true, // 禁用右键菜单
                    stopIntervalTime: 5000, // 移动端取消监视的等待时长
                    clearIntervalWhenDevOpenTrigger: false, // 触发后是否停止监控
                    detectors: [0, 1, 2, 3, 4, 5, 6, 7], // 启用所有检测器
                    clearLog: true, // 每次都清除log
                    disableSelect: false, // 不禁用选择文本
                    disableCopy: false, // 不禁用复制
                    disableCut: false, // 不禁用剪切
                    disablePaste: false, // 不禁用粘贴
                    ignore: null, // 不忽略任何情况
                    disableIframeParents: true, // iframe中禁用所有父窗口
                    ondevtoolopen: (type, next) => {
                        showNotification('检测到开发者工具，已自动关闭', true);
                        next(); // 关闭当前窗口
                    },
                    ondevtoolclose: () => {
                        console.log('开发者工具已关闭');
                    }
                };

                // 初始化禁用开发者工具
                DisableDevtool.default(options);
            }).catch(error => {
                console.error('Failed to load disable-devtool:', error);
                // 降级处理：如果动态导入失败，使用备用方案
                loadDisableDevtoolFallback();
            });
        } catch (error) {
            console.error('Error initializing disable-devtool:', error);
            loadDisableDevtoolFallback();
        }
    }
}

// 备用方案：如果npm包加载失败，使用CDN方式
function loadDisableDevtoolFallback() {
    const script = document.createElement('script');
    script.setAttribute('disable-devtool-auto', '');
    script.src = 'https://cdn.jsdelivr.net/npm/disable-devtool';
    document.head.appendChild(script);
}

// 禁用开发者工具功能
function disableDeveloperTools() {
    document.addEventListener('keydown', function(e) {
        // 禁用F12
        if (e.key === 'F12') {
            e.preventDefault();
            showNotification('开发者工具已禁用');
        }
        
        // 禁用Ctrl+Shift+I
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            e.preventDefault();
            showNotification('开发者工具已禁用');
        }
        
        // 禁用Ctrl+Shift+C
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            showNotification('开发者工具已禁用');
        }
        
        // 禁用Ctrl+U
        if (e.ctrlKey && e.key === 'U') {
            e.preventDefault();
            showNotification('查看页面源代码已禁用');
        }
    });
    
    // 防止右键菜单默认行为（已在setupCustomContextMenu中处理）
}

// 显示通知
function showNotification(message, isError = false) {
    const notification = document.getElementById('contextMenuNotification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.classList.remove('error');
    notification.classList.remove('show');
    
    if (isError) {
        notification.classList.add('error');
    }
    
    // 触发重排以便动画生效
    void notification.offsetWidth;
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

// 设置自定义右键菜单事件
function setupCustomContextMenu() {
    const customMenu = document.getElementById('customContextMenu');
    if (!customMenu) return;
    
    let selectedText = '';

    // 获取选中的文本
    document.addEventListener('selectionchange', function() {
        const selection = window.getSelection();
        selectedText = selection.toString().trim();
        
        // 根据是否有选中的文本来显示/隐藏搜索按钮
        const searchButton = document.getElementById('menuSearch');
        if (searchButton) {
            searchButton.style.display = selectedText.length > 0 ? 'flex' : 'none';
        }
    });

    // 阻止默认右键菜单并显示自定义菜单
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        
        // 调整菜单位置，防止超出屏幕
        let x = e.pageX;
        let y = e.pageY;
        const menuWidth = 200;
        const menuHeight = customMenu.offsetHeight || 320;
        
        if (x + menuWidth > window.innerWidth) {
            x = window.innerWidth - menuWidth - 10;
        }
        
        if (y + menuHeight > window.innerHeight) {
            y = window.innerHeight - menuHeight - 10;
        }
        
        customMenu.style.left = `${x}px`;
        customMenu.style.top = `${y}px`;
        customMenu.style.display = 'block';
    });

    // 点击页面其他区域隐藏菜单
    document.addEventListener('click', function(e) {
        if (customMenu.style.display === 'block' && !customMenu.contains(e.target)) {
            customMenu.style.display = 'none';
        }
    });

    // 菜单按钮事件处理 - 使用事件委托
    customMenu.addEventListener('click', function(e) {
        let target = e.target;
        let id = target.id;
        
        // 如果点击的是按钮内的图标，找到按钮元素
        while (target && !id.startsWith('menu')) {
            target = target.parentElement;
            if (!target) break;
            id = target.id;
        }
        
        if (!target || !id.startsWith('menu')) return;
        
        switch(id) {
            case 'menuBack':
                history.back();
                break;
            case 'menuReload':
                location.reload();
                break;
            case 'menuHome':
                location.href = window.location.origin;
                break;
            case 'menuDarkMode':
                document.body.classList.toggle('dark-mode');
                // 保存用户偏好
                localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
                showNotification(`已${document.body.classList.contains('dark-mode') ? '启用' : '禁用'}深色模式`);
                break;
            case 'menuCopyUrl':
                navigator.clipboard.writeText(window.location.href)
                    .then(() => showNotification('URL已复制到剪贴板'))
                    .catch(err => {
                        console.error('无法复制URL: ', err);
                        showNotification('复制失败，请重试', true);
                    });
                break;
            case 'menuSearch':
                if (selectedText) {
                    window.open(`https://www.google.com/search?q=${encodeURIComponent(selectedText)}`, '_blank');
                }
                break;
            case 'menuInspect':
                showNotification('检查元素功能已禁用', true);
                break;
        }
        
        customMenu.style.display = 'none';
    });

    // ESC键关闭菜单
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && customMenu.style.display === 'block') {
            customMenu.style.display = 'none';
        }
    });
}

// 初始化所有功能
function initCustomContextMenu() {
    // 检查是否已初始化
    if (window.hasCustomContextMenuInitialized) {
        return;
    }
    window.hasCustomContextMenuInitialized = true;
    
    // 添加深色模式样式
    const darkModeStyles = document.createElement('style');
    darkModeStyles.textContent = `
        .dark-mode {
            background-color: #1a1a1a;
            color: #f0f0f0;
        }
        
        .dark-mode a {
            color: #9e9eff;
        }
    `;
    document.head.appendChild(darkModeStyles);
    
    // 加载Font Awesome
    loadFontAwesome();
    // 初始化禁用开发者工具
    initDisableDevtool();
    
    // 初始化功能
    createCustomMenuStyles();
    createCustomMenu();
    disableDeveloperTools();
    setupCustomContextMenu();
    
    // 检查用户之前是否选择了深色模式
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
}

// DOM加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCustomContextMenu);
} else {
    initCustomContextMenu();
}

// 导出函数以便其他脚本可以使用
window.CustomContextMenu = {
    init: initCustomContextMenu,
    showNotification: showNotification
};
// 禁用开发者工具的安全脚本 (不含自定义右键菜单)

// 动态加载外部资源
function loadExternalResources() {
    // 加载Font Awesome
    loadFontAwesome();
    // 加载disable-devtool库
    loadDisableDevtool();
}

// 加载Font Awesome图标库
function loadFontAwesome() {
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css';
        document.head.appendChild(link);
    }
}

// 加载disable-devtool库
function loadDisableDevtool() {
    // 动态导入npm安装的disable-devtool库
    if (typeof importScripts === 'function') {
        try {
            import('disable-devtool').then(module => {
                const disableDevtool = module.default;
                initDisableDevtool(disableDevtool);
            }).catch(err => {
                console.error('Failed to import disable-devtool module:', err);
                fallbackToCDN();
            });
        } catch (err) {
            console.error('Error importing disable-devtool:', err);
            fallbackToCDN();
        }
    } else {
        fallbackToCDN();
    }
}

// CDN降级方案
function fallbackToCDN() {
    if (!document.querySelector('script[src*="disable-devtool"]')) {
        const script = document.createElement('script');
        script.setAttribute('disable-devtool-auto', '');
        script.src = 'https://cdn.jsdelivr.net/npm/disable-devtool';
        script.onerror = () => {
            console.error('Failed to load disable-devtool from CDN');
        };
        document.body.appendChild(script);
    }
}

// 初始化disable-devtool
function initDisableDevtool(disableDevtool) {
    if (disableDevtool) {
        disableDevtool({ 
            md5: 'your-md5-hash',
            url: 'about:blank',
            tkName: 'tk',
            ondevtoolopen: () => {
                // 开发者工具打开时的回调
                if (typeof alert === 'function') {
                    alert('检测到开发者工具，请关闭后刷新页面访问');
                }
                window.location.href = 'about:blank';
            },
            detector: [
                'devtool', 'contextmenu', 'debugger', 'cache', 
                'domain', 'iframe', 'websocket', 'error', 'variable'
            ]
        });
    }
}

// 禁用F12及相关按键
function disableDevToolsKeys() {
    document.addEventListener('keydown', function(e) {
        // F12、Ctrl+Shift+I、Ctrl+Shift+J、Ctrl+U
        const devToolsKeys = [
            { key: 'F12', keyCode: 123 },
            { key: 'I', keyCode: 73, ctrlKey: true, shiftKey: true },
            { key: 'J', keyCode: '74', ctrlKey: true, shiftKey: true },
            { key: 'U', keyCode: 85, ctrlKey: true },
            { key: 'S', keyCode: 83, ctrlKey: true, shiftKey: true },
            { key: 'C', keyCode: 67, ctrlKey: true, shiftKey: true },
            { key: 'K', keyCode: 75, ctrlKey: true, shiftKey: true }
        ];

        for (const keyConfig of devToolsKeys) {
            if (e.key === keyConfig.key || e.keyCode === keyConfig.keyCode) {
                if ((!keyConfig.ctrlKey || e.ctrlKey) && 
                    (!keyConfig.shiftKey || e.shiftKey) && 
                    (!keyConfig.altKey || e.altKey)) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
            }
        }
    }, { capture: true });
}

// 初始化安全脚本
function initSecurityScript() {
    disableDevToolsKeys();
    loadExternalResources();
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSecurityScript);
} else {
    initSecurityScript();
}
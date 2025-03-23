// ==UserScript==
// @name         微软Teams使用Ctrl+Enter发送消息(MS Teams Ctrl+Enter Sender)
// @namespace    https://github.com/emptybe
// @version      1.0(2025-03-20)
// @description  在微软Teams里面通过邮件输入模式输入消息,点击Enter不会发送,点击Ctrl+Enter才会发送;当鼠标点击微软Teams的消息输入框时,脚本会自动将文本输入模式变更为邮件输入模式,以此来达到Ctrl+Enter发送消息的目的(In Microsoft Teams through the mail input mode to enter the message, click Enter will not be sent, click Ctrl + Enter will be sent; when the mouse clicks on the Microsoft Teams message input box, the script will automatically change the text input mode to the mail input mode, in order to achieve the purpose of Ctrl + Enter to send the message.)
// @author       zero-empty
// @match        *://teams.live.com/*
// @icon         https://statics.teams.cdn.live.net/evergreen-assets/icons/microsoft_teams_logo_refresh.ico
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // 获取目标元素，例如输入框或document
    function waitForElement(css) {
        return new Promise((resolve) => {
            // 立即检查元素是否存在
            const element = document.querySelector(css);
            if (element) {
                resolve(element);
                return;
            }

            // 创建观察器监听DOM变化
            const observer = new MutationObserver(() => {
                const element = document.querySelector(css);
                if (element) {
                    observer.disconnect(); // 停止观察
                    resolve(element);
                }
            });

            // 配置观察选项：监听整个文档的子节点和子树变化
            observer.observe(document.documentElement, {
                childList: true,
                subtree: true,
            });
        });
    }

    waitForElement('[data-tid="ckeditor"]').then((elem) => {
        console.log('ckeditor loaded!', elem);
        elem.addEventListener('mousedown', (event) => {
            if (event.button === 0) {
                // 判断输入框是否为"邮件编辑模式"
                let FocusZone21 = document.querySelectorAll('div[data-tid="simplified-formatting-toolbar"]')[0].childNodes[0];
                if(FocusZone21){
                    if( FocusZone21.getAttribute('data-is-visible') && FocusZone21.getAttribute('data-is-visible')=== 'true'){
                        console.log('displayed email input model!');
                        return;
                    }
                }
                // 如果不是"邮件编辑模式", 创建ctrl+shift+x事件, 使其变为"邮件编辑模式"
                const dispatchInterval = setInterval(() => {
                    if(FocusZone21.getAttribute('data-is-visible')=== 'true'){
                        clearInterval(dispatchInterval);
                        console.log('change to email input model successfully!');
                        return;
                    }
                    let eventKeyDown = new KeyboardEvent('keydown', {
                        key: 'x',
                        code: 88,
                        ctrlKey: true,
                        shiftKey: true,
                    });
                    document.dispatchEvent(eventKeyDown);
                    console.log('try to change to email input model.');
                }, 100);
            }
        });
    });
})();

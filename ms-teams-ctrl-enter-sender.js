// ==UserScript==
// @name         微软Teams使用Ctrl+Enter发送消息(MS Teams Ctrl+Enter Sender)
// @namespace    https://github.com/emptybe
// @version      1.1(2025-03-24)
// @description  在微软Teams里面通过邮件输入模式输入消息,点击Enter不会发送,点击Ctrl+Enter才会发送;当鼠标点击微软Teams的消息输入框时,脚本会自动将文本输入模式变更为邮件输入模式,以此来达到Ctrl+Enter发送消息的目的(In Microsoft Teams through the mail input mode to enter the message, click Enter will not be sent, click Ctrl + Enter will be sent; when the mouse clicks on the Microsoft Teams message input box, the script will automatically change the text input mode to the mail input mode, in order to achieve the purpose of Ctrl + Enter to send the message.)
// @author       emptybe
// @match        *://teams.live.com/*
// @icon         https://statics.teams.cdn.live.net/evergreen-assets/icons/microsoft_teams_logo_refresh.ico
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const ckeditorCss = 'div[data-tid="ckeditor"]';
    const toolbarCss = 'div[data-tid="simplified-formatting-toolbar"]';
    const visibleAttr = 'data-is-visible';

    document.body.addEventListener('mousedown', (event) => {
        if (event.button === 0) {
            let ckeditorElem = event.target.closest(ckeditorCss);
            if(ckeditorElem){
                console.log('ckeditor loaded!', ckeditorElem);
                // 先找到那个被点击的输入框, 并得到它的index
                let ckeditorElements = document.querySelectorAll(ckeditorCss);
                let index = 0;
                for(let i=0;i<ckeditorElements.length;i++){
                    if(ckeditorElem === ckeditorElements[i]){
                        index = i;
                    }
                }
                // 输入框和工具栏有同样的index, 根据index获取工具栏, 并根据工具栏是否显示来判断输是否为"邮件编辑模式"
                let toolbarElem = document.querySelectorAll(toolbarCss)[index].childNodes[0];
                if(toolbarElem){
                    if( toolbarElem.getAttribute(visibleAttr) && toolbarElem.getAttribute(visibleAttr)=== 'true'){
                        console.log('displayed email input model!');
                        return;
                    }
                }
                // 如果不是"邮件编辑模式", 创建ctrl+shift+x事件, 使其变为"邮件编辑模式"
                const dispatchInterval = setInterval(() => {
                    if(toolbarElem.getAttribute(visibleAttr)=== 'true'){
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
                }, 50);
            }
        }
    });
})();

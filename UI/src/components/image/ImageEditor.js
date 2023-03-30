import React, { useEffect, createRef } from 'react';
import TuiImageEditor from 'tui-image-editor'
import 'tui-image-editor/dist/tui-image-editor.css'
import 'tui-color-picker/dist/tui-color-picker.css'


const options = {
    includeUI: {
        menu: ["shape", "filter", "text"],
        initMenu: "filter",
        uiSize: {
            width: "1000px",
            height: "700px"
        },
        menuBarPosition: "bottom"
    },
    theme: {
        'menu.normalIcon.color': '#8a8a8a',
        'menu.activeIcon.color': '#555555',
        'menu.disabledIcon.color': '#434343',
        'menu.hoverIcon.color': '#e9e9e9',
        'submenu.normalIcon.color': '#8a8a8a',
        'submenu.activeIcon.color': '#e9e9e9',
    },
    selectionStyle: {
        cornerSize: 20,
        rotatingPointOffset: 70
    },
    cssMaxWidth: 700,
    cssMaxHeight: 500,

};

function ImageEditor() {
    const inputRef = createRef()
    let imageEditorInst = null

    useEffect(() => {
        imageEditorInst = new TuiImageEditor(inputRef.current, {
            ...options
        });

        return () => {
            if (imageEditorInst !== null) {
                //imageEditorInst.detroy()
                imageEditorInst = null
            }
        }
    }, [])

    return (
        <div ref={inputRef}></div>
    )
}

function Video() {
    const props = {
        includeUI: {
            menu: ["shape", "filter", "text"],
            initMenu: "filter",
            uiSize: {
                width: "1000px",
                height: "700px"
            },
            menuBarPosition: "bottom"
        },
        theme: {
            'menu.normalIcon.color': '#8a8a8a',
            'menu.activeIcon.color': '#555555',
            'menu.disabledIcon.color': '#434343',
            'menu.hoverIcon.color': '#e9e9e9',
            'submenu.normalIcon.color': '#8a8a8a',
            'submenu.activeIcon.color': '#e9e9e9',
        },
        selectionStyle: {
            cornerSize: 20,
            rotatingPointOffset: 70
        },
        cssMaxWidth: 700,
        cssMaxHeight: 500,

    };

    return (
        <div>
            <ImageEditor {...props} />
        </div>
    );
}

export default ImageEditor
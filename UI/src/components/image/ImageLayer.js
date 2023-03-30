import React, {useState} from 'react'
import { LayeredImage } from "react-layered-image"

const ImageLayer = ({layers}) => {
    
    if(!layers){
        return null
    }
    const style = {
        // position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }

    // const layers = [
    //     "http://localhost:5000/api/img/show/destinyhero2210/P1/1st%20Folder/Image%203.jpg?q=0.5490561326195316",
    //     // "http://localhost:5000/api/img/show/destinyhero2210/P1/1st%20Folder/Image%201.jpg?q=0.2740997112446173",
    //     // "http://localhost:5000/api/img/show/destinyhero2210/P1/1st%20Folder/Image%202.jpg?q=0.27398759561374075",
    //     "https://llorca.github.io/react-layered-image/static/images/layer-2.png",
    //     "https://llorca.github.io/react-layered-image/static/images/layer-3.png",
    // ]

    return(
        <div style={style}>
          <LayeredImage layers={layers} style={{ 
              height: 270,
              width: 480
              }} />
        </div>
    )
}

export default ImageLayer
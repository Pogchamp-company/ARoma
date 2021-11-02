import * as React from "react"
import {HTMLAttributes} from "react";

interface PropsType extends HTMLAttributes<HTMLImageElement> {
    product: any
}

export function ProductPreviewImage({product, ...args} : PropsType) {
    let url
    if (product.Photos.length === 0) {
        url = `https://picsum.photos/id/${product.ID}/263/280`
    } else {
        url = product.Photos[0].Url
    }

    return <img src={url} {...args} alt={"Product"}/>
}

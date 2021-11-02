import * as React from "react";

export function TextWithSizeLimit({text, limit}: {text: string, limit: number}) {
    if (text.length > limit) {
        text = text.slice(0, limit - 3) + '...'
    }
    return (
        <>{text}</>
    )
}

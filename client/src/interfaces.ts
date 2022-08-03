import React from "react"

export interface Src {
    src: string,
    alt: string,
}

export interface Mode {
    mode: number,
}

export interface Cname {
    cname: string,
}

export interface Id {
    id: number,
}

export interface Text {
    text: string,
}

export interface URL {
    url: string,
}

export interface ClickEvent {
    click: (e: React.MouseEvent<HTMLElement>) => void,
}

export interface ClickEventIndex {
    click: (e: React.MouseEvent<HTMLElement>, i: number) => void
}


export interface None { }

export interface PMenuItem extends Cname, Id, Text, ClickEventIndex { }

export interface PMenuHam extends Cname, Id, ClickEvent { }

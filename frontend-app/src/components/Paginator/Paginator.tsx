import * as React from 'react'
import "./Paginator.scss"


export default function Paginator({setPage, page, pagesCount}: {page: number, setPage: (page: number) => void, pagesCount: number}) {
    return (
        <div className="pagination">
            <button onClick={() => {
                if (page - 1 >= 1) setPage(page - 1)
            }}>&laquo;</button>

            {Array.from({length: pagesCount}, (v, k) => k + 1).map(value => {
                return <button className={page === value ? "active" : ""} onClick={() => {
                    if (page !== value) setPage(value)
                }}>{value}</button>
            })}

            <button onClick={() => {
                if (page + 1 <= pagesCount) setPage(page + 1)
            }}>&raquo;</button>
        </div>
    )
}

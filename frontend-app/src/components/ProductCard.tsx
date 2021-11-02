import * as React from "react";
import {Link} from "react-router-dom";
import {deleteProduct} from "./utils/api";
import {useHistory} from "react-router-dom/cjs/react-router-dom";
import {TextWithSizeLimit} from "./TextWithSizeLimit";
import {PropsContext} from "./Context";
import {useContext} from "react";
import {ProductPreviewImage} from "./ProductPreviewImage";


function ProductCard({product, classList, catalog, index}: {product: any, classList: string | undefined, catalog: any, index: number}) {
    const context = useContext(PropsContext)
    const history = useHistory()

    function handleAddToCart(e, product) {
        if (context.cart.getAmount(product.ID) === product.QuantityInStock) return
        context.cart.addToCart(product, 1)

        const spanElem = document.getElementById('cart-icon-number')

        const btnRect = e.target.getBoundingClientRect()
        const rect = spanElem.parentElement.getBoundingClientRect()
        spanElem.style.transform = `translateX(${btnRect.left - rect.left}px) translateY(${btnRect.top - rect.top}px)`;

        spanElem.animate([
            // keyframes
            {
                transform: `translateX(${btnRect.left - rect.left}px) translateY(${btnRect.top - rect.top}px) scale(0.5)`,
            },
            {
                transform: 'translateX(0) translateY(0)  scale(1)',
            },
        ], {
            // timing options
            duration: 400,
            iterations: 1,
            easing: "ease-out",
            fill: "forwards",
        })
        document.getElementById('cart-icon').animate([
            // keyframes
            {transform: 'scale(0.7)'},
            {transform: 'scale(1)'},
            {transform: 'scale(1.1)'},
            {transform: 'scale(1)'},
        ], {
            // timing options
            duration: 400,
            iterations: 1,
            easing: "ease-in",
            delay: 450,
        })
    }

    return (
        <div className={classList !== undefined ? classList : "col-md-6 col-lg-4"}>
            <div key={product.ID.toString() + catalog}
                 className="card text-center card-product"
                 style={{'--index': index} as React.CSSProperties}>
                <div className="card-product__img">
                    <div className="flip-card">
                        <div className="flip-card-inner">
                            <div className="flip-card-front">
                                <ProductPreviewImage product={product} className={"card-front-img"}/>
                            </div>
                            <div className="flip-card-back">
                                <ProductPreviewImage product={product} className={"card-back-img"}/>

                                <ul className="card-product__imgOverlay">
                                    <li>
                                        <Link to={`/product/${product.ID}`}><i
                                            className="ti-search"/></Link>
                                    </li>
                                    {
                                        context.isAdmin() ? (
                                            <>
                                                <li>
                                                    <Link to={`/edit_product/${product.ID}`}><i
                                                        className="ti-pencil"/></Link>
                                                </li>
                                                <li>
                                                    <button onClick={() => {
                                                        deleteProduct(product.ID, context, history, () => {
                                                            window.location.reload()
                                                        })
                                                    }}><i className="ti-trash"/></button>
                                                </li>
                                            </>
                                        ) : (
                                            <li>
                                                <button
                                                    onClick={(e) => handleAddToCart(e, product)}>
                                                    <i className="ti-shopping-cart"/></button>
                                            </li>
                                        )
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <p>{product.Catalog.Title}</p>
                    <h4 className="card-product__title">
                        <Link to={`/product/${product.ID}`}>
                            <TextWithSizeLimit text={product.Title} limit={35}/>
                        </Link>
                    </h4>
                    <p className="card-product__price">${product.Price}</p>
                </div>
            </div>
        </div>
    )
}


export default function ProductsContainer({products, catalog, classList}) {
    return (
        <div className="row">
            {products.map((product, index) => (
                <ProductCard catalog={catalog}
                             classList={classList}
                             product={product}
                             index={index}/>
            ))}
        </div>
    )
}

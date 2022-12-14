import React, { useEffect } from "react";
import {
	deleteItemShoppingCart,
	addItemShoppingCart,
	emptyCart,
	getOrCreateShoppingCart,
	checkOut,
	deleteItemCompletedCart,
	createOrder
} from "../../redux/action";
import { useDispatch, useSelector } from "react-redux";
import NavBar from "../navbar/Navbar";
import swal from "sweetalert";
import Footter from "../footter/Footter";
import { Link } from "react-router-dom";
import { FaRegHandshake } from "react-icons/fa";
import "./ShoppingCart.css";

const ShoppingCart = () => {
	const dispatch = useDispatch();
	const cart = useSelector(state => state.cart);
	const user = useSelector(state => state.user);
	const checkoutCart = useSelector(state => state.checkOut);
	const localAccessToken = JSON.parse(localStorage.getItem("accessToken"));
	const [actualCart, setActualCart] = React.useState(false);

	useEffect(() => {
		if (localAccessToken) {
			setTimeout(() => {
				dispatch(getOrCreateShoppingCart(user.user.auth.id));
			}, 100);
		} else {
			swal({
				title: "You must be logged in to access your shopping cart",
				text: "You will be redirected to the menu",
				closeOnClickOutside: false,
				icon: "info",
				button: "Ok"
			}).then(() => {
				return (window.location.href = "/menu");
			});
		}
	}, [dispatch, user, localAccessToken, actualCart]);

	const handleAdd = e => {
		if (user.hasOwnProperty("user")) {
			dispatch(addItemShoppingCart({ idCart: cart.cartId, idProduct: e.idProduct }));
			if (actualCart === false) {
				setActualCart(true);
			} else {
				setActualCart(false);
			}
		}
	};
	const handleRemove = e => {
		if (user.hasOwnProperty("user")) {
			dispatch(deleteItemCompletedCart({ idCart: cart.cartId, idProduct: e.idProduct }));
			if (actualCart === false) {
				setActualCart(true);
			} else {
				setActualCart(false);
			}
			swal({
				title: "Product removed",
				text: "The product has been removed from the cart",
				icon: "success",
				button: "Ok"
			});
		}
	};
	const handleRemoveOne = e => {
		if (user.hasOwnProperty("user")) {
			dispatch(deleteItemShoppingCart({ idCart: cart.cartId, idProduct: e.idProduct }));
			if (actualCart === false) {
				setActualCart(true);
			} else {
				setActualCart(false);
			}
		}
	};
	const handleClear = () => {
		swal({
			text: `Are you sure you want to delete your entire cart ?`,
			buttons: ["cancel", "confirm"],
			dangerMode: true,
			closeOnClickOutside: false,
			icon: "warning"
		}).then(value => {
			if (value) {
				dispatch(emptyCart({ idCart: cart.cartId }));
				if (actualCart === false) {
					setActualCart(true);
				} else {
					setActualCart(false);
				}
				swal("Removed", {
					button: false,
					timer: 1500,
					icon: "success"
				});
			} else {
				swal("Operation cancelled", {
					button: false,
					timer: 1500,
					icon: "error"
				});
			}
		});
	};

	const handleCheckout = () => {
		if (user.hasOwnProperty("user")) {
			swal({
				text: `Are you sure you want to checkout your cart ?`,
				buttons: ["cancel", "confirm"],
				dangerMode: true,
				closeOnClickOutside: false,
				icon: "warning"
			}).then(value => {
				if (value) {
					dispatch(checkOut({ idUser: user.user.id, items: cart.items }));
					swal("Checkout", {
						button: false,
						timer: 1500,
						icon: "success"
					});
					dispatch(emptyCart({ idCart: cart.cartId }));
				} else {
					swal("Operation cancelled", {
						button: false,
						timer: 1500,
						icon: "error"
					});
				}
			});
		}
	};

	const headerCart = () => {
		if (!cart.items || cart.items.length === 0) {
			return (
				<div className="cartEmptySCC">
					<h1>Your cart is empty, go to menu to start adding products</h1>
					<Link to={"/menu"}>
						<button className="cartBtnESC">Menu</button>
					</Link>
				</div>
			);
		} else {
			return (
				<div className="headerCartSC">
					<div>
						<p className="titleCartSC">Added products</p>
						<h2>Total $ { Math.round(cart.cartTotal * 100) / 100 }</h2>
					</div>
					<div className="btnsDeletAndCheckCreSCC">
						<button className="deleteBtnAllCartSC" onClick={() => handleClear()}>
							Delete All
						</button>
						{checkoutCart ? (
							<a href={checkoutCart} className="btnMPShopingCartC">
								Pay with Mercado Pago <FaRegHandshake className="iconHandsMPSCC" />
							</a>
						) : (
							<button className="btnBCartTemp" onClick={() => handleCheckout()}>
								Create Order
							</button>
						)}
					</div>
				</div>
			);
		}
	};

	const cardsShopping = () => {
		const cartItems = cart.items?.sort((a, b) => {
    return b.name.localeCompare(a.name);
		})
		return cartItems?.map(e => (
			<div key={e.id} className="cardCartSC">
				<div className="titleCardSC">
					<h3>ud ${Math.round(e.price / e.qty * 100)/100}</h3>
					<h2>{e.name}</h2>
					<button className="removeBtnCardSC" onClick={() => handleRemove(e)}>
						X
					</button>
				</div>
				<img className="imgCardSC" src={e.image} alt={`Pic of ${e.name}`} />
				<div className="quantityCardSC">
					<h3>Qty</h3>
					<button className="removeOneBtnCardSC" onClick={() => handleRemoveOne(e)}>
						-
					</button>
					<h3>{e.qty}</h3>
					<button className="addBtnCardSC" onClick={() => handleAdd(e)}>
						+
					</button>
				</div>
				<div className="totalCardSC">
					<h2>Subtotal</h2>
					<h2>
						{e.discount === null ? e.price : Math.round(e.discountedPrice * 100) /100  } $
					</h2>
				</div>
			</div>
		));
	};

	return (
		<div className="shoppingCart">
			<NavBar />
			{headerCart()}
			<div className="cardsDivSCC">{cardsShopping()}</div>
			<Footter />
		</div>
	);
};

export default ShoppingCart;

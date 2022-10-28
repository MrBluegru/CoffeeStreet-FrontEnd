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
import "./ShoppingCart.css";

const ShoppingCart = () => {
	const dispatch = useDispatch();
	const cart = useSelector(state => state.cart);
	const user = useSelector(state => state.user);
	const localAccessToken = JSON.parse(localStorage.getItem("accessToken"));

	useEffect(() => {
		if (user.hasOwnProperty("user")) {
			dispatch(getOrCreateShoppingCart(user.user.auth.id));
		} else{
			swal({
				title: "You must be logged in to access your shopping cart",
				text: "You will be redirected to the menu",
				icon: "info",
				button: "Ok"
			}).then(() => {
				return window.location.href = "/menu";
			});
			}
	}, [ dispatch, user, localAccessToken ]);

	const handleAdd = e => {
		if (user.hasOwnProperty("user")) {
			dispatch(addItemShoppingCart({ idCart: cart.cartId, idProduct: e.idProduct }));
		}
	};

	const handleRemove = e => {
		if (user.hasOwnProperty("user")) {
			dispatch(deleteItemCompletedCart({ idCart: cart.cartId, idProduct: e.idProduct }));
			swal({
				title: "Product removed",
				text: "The product has been removed from the cart",
				icon: "success",
				button: "Ok",
			})
		}
	};
	const handleRemoveOne = e => {
		if (user.hasOwnProperty("user")) {
			dispatch(deleteItemShoppingCart({ idCart: cart.cartId, idProduct: e.idProduct }));
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
		swal({
			text: `Are you sure you want to confirm your purchase ?`,
			buttons: ["cancel", "confirm"],
			dangerMode: true,
			closeOnClickOutside: false,
			icon: "warning"
		}).then(value => {
			if (value) {
				console.log(user.user.auth.id, cart.items)
				dispatch(checkOut({ idUser: user.user.auth.id, items: cart.items }));
				swal("Purchase confirmed", {
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
			// dispatch(createOrder({ status: "pending", idUser: user.user.id, total: cart.cartTotal, ordersByProduct: cart.items}));
		});
	};

	return (
		<div className="shoppingCart">
			<NavBar />
			<div className="headerCartSC">
				<p className="titleCartSC">Added products</p>
				<button className="deleteBtnAllCartSC" onClick={() => handleClear()}>
					Delete All
				</button>
				<button className="btnBCartTemp" onClick={()=> handleCheckout()}>Buy</button>
			</div>
			<div className="containerCartSC">
				<h2>Total</h2>
				<h2>{cart.cartTotal}$</h2>
			</div>

			<div className="bodyCartSC">
				{cart.items?.map(e => (
					<div key={e.id} className="cardCartSC">
						<div className="titleCardSC">
							<h3>ud ${e.price / e.qty}</h3>
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
							<h2>{e.price}</h2>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default ShoppingCart;

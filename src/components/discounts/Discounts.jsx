import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardDiscount from "./cardDiscount/CardDiscount";
import {
	clearError,
	getProducts,
	updateDiscountProduct,
	filterByDiscount
} from "../../redux/action";
import ErrorSearch from "../errorSearch/ErrorSearch";
import swal from "sweetalert";
import NavbarDisc from "./navbarDiscount/NavbarDisc";
import "./discounts.css";

const Discounts = () => {
	const dispatch = useDispatch();
	const products = useSelector(state => state.products);
	const errorS = useSelector(state => state.errorSProducts);
	const [active, setActive] = useState("all");

	const handlerDiscount = v => {
		dispatch(filterByDiscount(v));
		setActive(v);
	};

	const changeDiscountP = (valueP, productId) => {
		swal({
			title: "Are you sure to apply a discount to this product?",
			icon: "info",
			buttons: ["cancel", "yes"],
			dangerMode: true,
			closeOnClickOutside: false,
			icon: "warning"
		}).then(value => {
			if (value) {
				dispatch(updateDiscountProduct(valueP, productId));
				swal("Applying discount", {
					button: false,
					timer: 1500,
					icon: "success"
				});
				setTimeout(() => {
					dispatch(getProducts());
				}, 500);
				setActive("all");
			} else {
				swal("The discount was not applied", {
					button: false,
					timer: 1200,
					icon: "success"
				});
			}
		});
	};

	const removeDiscountP = (valueP, productId) => {
		swal({
			title: "Are you sure you want to remove the discount on this product?",
			icon: "info",
			buttons: ["cancel", "yes"],
			dangerMode: true,
			closeOnClickOutside: false,
			icon: "warning"
		}).then(value => {
			if (value) {
				dispatch(updateDiscountProduct(valueP, productId));
				swal("Discount removed", {
					button: false,
					timer: 1500,
					icon: "success"
				});
				setTimeout(() => {
					dispatch(getProducts());
				}, 500);
				setActive("all");
			} else {
				swal("Operation cancelled", {
					button: false,
					timer: 1200,
					icon: "success"
				});
			}
		});
	};

	useEffect(() => {
		if (products.length === 0) {
			dispatch(getProducts());
		}
		dispatch(clearError());
	}, [dispatch, products]);

	const bodyDiscounts = () => {
		if (errorS === "There is no product with that name") {
			return <ErrorSearch />;
		} else {
			return (
				<div className="discountsCardsC">
					{products.map(product => {
						return (
							<CardDiscount
								product={product}
								changeDiscount={changeDiscountP}
								removeDiscount={removeDiscountP}
							/>
						);
					})}
				</div>
			);
		}
	};

	return (
		<div className="discountsDiC">
			<NavbarDisc handlerDiscount={handlerDiscount} active={active} />
			{bodyDiscounts()}
		</div>
	);
};

export default Discounts;

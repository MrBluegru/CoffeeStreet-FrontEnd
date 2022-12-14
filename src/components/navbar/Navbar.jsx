import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BsFillCartFill } from "react-icons/bs";
import LogOutAuth0 from "../logIn/logOutButtonAuth0/LogOutAuth0";
import { getOrCreateShoppingCart } from "../../redux/action";
import "./navbar.css";

const NavBar = () => {
	const statusCart = useSelector(state => state.cart);
	const user = useSelector(state => state.user.user);
	const [viewUser, setViewUser] = useState(false);
	const dispatch = useDispatch();
	const accessToken = useSelector(state => state.accessToken);

	useEffect(() => {
		if (accessToken) {
			setTimeout(() => {
				dispatch(getOrCreateShoppingCart(user.auth.id));
			}, 500);
		}
	}, [accessToken]);
	const handlerUser = () => {
		if (viewUser === false) {
			setViewUser(true);
		} else {
			setViewUser(false);
		}
	};

	return (
		<div className="navbarDivC">
			<Link to="/">
				<div className="logo"></div>
			</Link>

			<div className="btnNavbarDiv">
				<Link to="/home">
					<button className="btnNBCU">Home</button>
				</Link>
				<Link to="/menu">
					<button className="btnNBCU">Menu</button>
				</Link>

				<Link to={"/cart"}>
					<button className="btnNBCU">
						<BsFillCartFill /> {statusCart.items ? statusCart.items.length : null}
					</button>
				</Link>
				{user ? (
					<div className="menuUserNC">
						<img
							onClick={handlerUser}
							className="imgUserNC"
							srcSet={user.image}
							alt={user.name}
						/>
						{viewUser ? (
							<div className="menuUserOn">
								<p className="">
									{user.name} {user.surname}
								</p>
								<p className="">{user.role}</p>
								<hr />
								<Link to={`/${user.role}`}>
									<button className="btnUserNC"> My panel </button>
								</Link>

								<LogOutAuth0 />
							</div>
						) : null}
					</div>
				) : (
					<Link to="/signIn">
						<button className="btnNBCU">Sign in</button>
					</Link>
				)}
			</div>
		</div>
	);
};

export default NavBar;

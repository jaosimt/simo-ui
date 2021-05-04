import "./component.css";
import React, { Fragment, useState } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import InputText from "../InputText";
import { SnakeCase } from "../../scripts/utils";
import Home from "../Home";

export default function ContentContainer() {
	const history = useHistory();
	
	const [ selected, setSelected ] = useState(window.location.pathname === '/' ? 'home' : window.location.pathname.replace(/^\//, ""));
	const [ opacity, setOpacity ] = useState(1);
	
	const navClickHandler = (id) => {
		setOpacity(0);
		setTimeout(() => {
			setSelected(id);
			history.push(id === 'home' ? '/' : id);
			setTimeout(() => {
				window.simo.init.uiWidgets();
				setOpacity(1);
			}, 100);
		}, 100)
	}
	
	return <Fragment>
		<div className="left-panel">
			<div className="lp-logo">ui widgets</div>
			<div className="lp-menu">
				{
					[ 'Home', 'Input Text' ].map((m, i) => {
						const id = SnakeCase(m);
						return <span onClick={ () => navClickHandler(id) } key={ i }
						             className={ selected === id ? 'selected' : '' }
						             data-id={ id === 'home' ? '/' : id }>{ m }</span>
					})
				}
			
			</div>
		</div>
		<div className="right-panel">
			<div className="rp-header">
				ui widgets demo
			</div>
			<div style={ {
				opacity: opacity
			} } className="rp-content">
				<Switch>
					<Route exact path="/">
						<Home />
					</Route>
					<Route path="/input-text">
						<InputText history={ history } setMenuItem={ navClickHandler } />
					</Route>
				</Switch>
			</div>
		</div>
	</Fragment>
}

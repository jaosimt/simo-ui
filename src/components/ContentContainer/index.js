import "./component.css";
import React, { Fragment, useEffect, useState } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import InputText from "../InputText";
import { SnakeCase } from "../../scripts/utils";
import Home from "../Home";
import CheckBox from "../CheckBox";
import RadioButton from "../RadioButton";
import Button from "../Button";
import Select from "../Select";
import TitledDiv from "../TitledDiv";
import Modal from "../Modal";
import SwitchOption from "../SwitchOption";
import Notification from "../Notification";

export default function ContentContainer() {
	const history = useHistory();
	
	const [ selected, setSelected ] = useState(window.location.pathname === '/' ? 'home' : window.location.pathname.replace(/^\//, ""));
	const [ opacity, setOpacity ] = useState(1);
	
	useEffect(() => {
		if (window.location.pathname !== history.location.pathname) {
			setOpacity(0);
			history.push(window.location.pathname);
			setSelected(window.location.pathname.replace(/^\//, ""));
			setTimeout(()=>{
				if (window.simo && window.simo.init) window.simo.init.uiWidgets();
				setOpacity(1);
			}, 100)
		}
	}, [history])
	
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
					[
						'Home',
						'Input Text',
						'Checkbox',
						'Radio Button',
						'Button',
						'Select',
						'Titled Div Container',
						'Switch',
						'Modal',
						'Notification'
					].map((m, i) => {
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
						<InputText />
					</Route>
					<Route path="/checkbox">
						<CheckBox history={ history } setMenuItem={ navClickHandler } />
					</Route>
					<Route path="/radio-button">
						<RadioButton history={ history } setMenuItem={ navClickHandler } />
					</Route>
					<Route path="/button">
						<Button history={ history } setMenuItem={ navClickHandler } />
					</Route>
					<Route path="/select">
						<Select history={ history } setMenuItem={ navClickHandler } />
					</Route>
					<Route path="/titled-div-container">
						<TitledDiv history={ history } setMenuItem={ navClickHandler } />
					</Route>
					<Route path="/switch">
						<SwitchOption history={ history } setMenuItem={ navClickHandler } />
					</Route>
					<Route path="/modal">
						<Modal history={ history } setMenuItem={ navClickHandler } />
					</Route>
					<Route path="/notification">
						<Notification history={ history } setMenuItem={ navClickHandler } />
					</Route>
				</Switch>
			</div>
		</div>
	</Fragment>
}

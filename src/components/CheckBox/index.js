import "./component.css";
import { Fragment } from "react";
import PageNotFound from "../PageNotFound";

export default function CheckBox(props) {
	const { history, setMenuItem } = props;
	
	return <Fragment>
		<h1>Checkbox</h1>
		<div className="preview">
		
		</div>
		<div style={ { display: 'flex', justifyContent: 'center' } }>
			<PageNotFound
				setMenuItem={ setMenuItem }
				history={ history }
				isUnderConstruction={ true } />
		</div>
	</Fragment>
}

import "./component.css";
import { Fragment } from "react";
import PageNotFound from "../PageNotFound";

export default function InputText(props) {
	const { history, setMenuItem } = props;
	
	return <Fragment>
		<h1>Input Text</h1>
		<div style={ { display: 'flex', justifyContent: 'center' } }>
			<PageNotFound
				setMenuItem={ setMenuItem }
				history={ history }
				isUnderConstruction={ true } />
		</div>
	</Fragment>;
}

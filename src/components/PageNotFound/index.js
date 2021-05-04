import { Component } from "react";
import './pageNotFound.scss';
import underConstruction from './under-construction.png'

class PageNotFound extends Component {
	
	render() {
		const { history, isUnderConstruction, title, setMenuItem } = this.props;
		
		return <div className="PageNotFound">
			{
				title &&
				<span className="title">{ title }</span>
			}
			<span
				className={ `${ isUnderConstruction ? 'font-smaller ' : '' }bybyn` }>
				{ isUnderConstruction ? 'ᜊᜎᜒᜃ᜔ ᜎᜅ᜔ ᜉᜓᜑᜓᜈ᜔' : 'ᜇᜒᜎᜒ ᜋᜃᜒᜆ' }
			</span>
			<span className={ `message ${ !isUnderConstruction ? 'four-o-four' : '' }` }>{ isUnderConstruction ?
				<img height={ 175 }
				     src={ underConstruction }
				     alt="Under Construction" /> : '404' }</span>
			<span
				className="description-one">{ isUnderConstruction ? 'This Page Is Under Construction' : 'Oops! This Page Could Not Be Found' }</span>
			<span
				className="description-two">{ isUnderConstruction ? 'Please revisit this page some time soon.' : 'Sorry but the page you are looking for does not exist, have been removed, renamed or temporarily unavailable!' }</span>
			{
				history &&
				<button
					onClick={ () => {
						if (typeof setMenuItem === 'function') {
							setMenuItem('home');
						} else window.location = '/'
					} }>
					Go To Homepage
				</button>
			}
		</div>
	}
}

export default PageNotFound;

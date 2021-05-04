import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import ContentContainer from "./components/ContentContainer";

function App() {
	return (
		<div className="App">
			<Router>
				<ContentContainer />
			</Router>
		</div>
	);
}

export default App;

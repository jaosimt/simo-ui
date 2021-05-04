import { Fragment } from "react";
import "./component.css";

export default function Home() {
	return <Fragment>
		<h1>Welcome!</h1>
		<p><strong>sImo ui</strong> is a javascript library design to greatly help speed up web page development. The few ui components included in this library are ui components I found to be commonly or frequently used.
		</p>
		<span>Why? Undoubtedly there are tons of js library already and yes, I've seen them for the past 15 years or so.</span><br/>
		<span>What drives me to develop sImo ui is that, unlike the big names, sImo ui automatically loads supporting scripts and files that are necessary on your current page.</span><br/><br/>
		<span>For Instance:</span>
		<ul>
			<li>When all you ever needed in a page is a nicely designed div container, do you really need to load all other css scripts along with whatever images it may also have in there? <strong>sImo ui wont!</strong></li>
			<li>When your page doesn't have input text fields and only needing a nice toggle switch, mho, certainly all other css and whatnot are just extra baggage.</li>
		</ul>
		<span>I am sure that there are so many similar reasons out there and surely the above two are more than enough for me to say "nah", unless i need you, i don't want you!</span><br/>
		<span>So if you're kind of lazy like me 😂, yet needing to save whatever time, fell free. If you're not, then you're not.</span>
		<p><strong>sImo ui</strong> is free from/of anything! I will be adding a support page later on for anyone as far as comments, suggestions and violent reactions are concern.</p>
		<p>'till then, have fun... or don't.</p>
		<label className="snippet">Usage</label>
		<div className="code">
			<code>
				{`
<!DOCTYPE html>
<html>
   <head>
      <title>Page Title</title>
   </head>
   
   <body>
      <h1>This is a Heading</h1>
      <p>This is a paragraph.</p>
   </body>
   
   <script id="simo-ui" type="text/javascript" src="sImoJS/sImo.js"></script>
</html>
				`}
			</code>
		</div>
	</Fragment>
}

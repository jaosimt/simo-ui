import "./component.css";
import { Fragment } from "react";

export default function InputText(props) {
	return <Fragment>
		<h1>Input Text</h1>
		<div className="preview">
			<input type="text" className="rounded red" placeholder="Input Type Text" />
			<input type="text" className="rounded red" placeholder="Disabled Red Input Type Text" disabled="disabled" />
			<textarea className="rounded red" placeholder="Red Textarea" />
		</div>
		<label className="snippet">Code Snippet</label>
		<div className="code">
			<code>
				{
					`<style>
				   .preview textarea {
				      width: calc(60% + 10px);
				      height: 100px;
				   }
				
				   .preview input[type=text] {
				      width: 30%;
				   }
				</style>

				`
				}
				{ `<input type="text" class="rounded red" placeholder="Input Type Text" />
				` }
				{ `<input type="text" class="rounded red" placeholder="Disabled Red Input Type Text" disabled="disabled" />
				` }
				{ `<br />
				` }
				{ `<textarea class="rounded red" placeholder="Blue Textarea" />
				` }
			</code>
		
		</div>
		
		<label className="snippet">Parameters:</label>
		<table cellSpacing="0">
			<thead>
				<tr>
					<th>Name</th>
					<th>Type</th>
					<th>Value</th>
					<th>Example</th>
					<th>Necessity</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td />
					<td>css class</td>
					<td>rounded</td>
					<td>&lt;input type="text" class="rounded"/&gt;</td>
					<td />
				</tr>
				<tr>
					<td />
					<td />
					<td />
					<td>&lt;textarea class="rounded"/&gt;</td>
					<td>Optional</td>
				</tr>
				<tr>
					<td />
					<td>css class</td>
					<td>red | green | blue</td>
					<td>&lt;input type="text" class="blue"/&gt;</td>
					<td />
				</tr>
				<tr>
					<td />
					<td />
					<td />
					<td>&lt;textarea class="blue"/&gt;</td>
					<td>Optional</td>
				</tr>
			</tbody>
		</table>
		
		<label className="note">Note</label>
		<div className="note">
			Nothing special except for the reason to simply conform with the theme.
		</div>
	</Fragment>
}

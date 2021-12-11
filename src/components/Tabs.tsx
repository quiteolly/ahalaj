import { Link } from 'react-router-dom';
import { FormTab } from '../App';
import './Tabs.css';

interface TabsProps {
	tabs: FormTab[],
	currentTab: FormTab,
	onClickAddTab: () => void,
}

interface TabLinkProps {
	tab?: FormTab,
	currentTab?: FormTab,
	tabUrl?: string,
	tabText?: string,
	onClick?: () => void,
}

function TabLink({
	tab,
	currentTab,
	tabUrl,
	tabText,
	onClick,
}: TabLinkProps) {
	let tabLabel = '';
	if (tab !== undefined) {
		tabText = tab.name || `#${tab.id}`;
		if (tab.results.length > 0) {
			tabLabel = `${tab.itemCount}/${tab.results.length}`;
		}
		tabUrl = `/form/${tab.id}`;
	}

	if (tab !== undefined && tab === currentTab) {
		return (
			<strong className="Tabs__item Tabs__item--selected">
				{tabText}
				{tabLabel && <span className="Tabs__label">
					<span className="sr-only"> (</span>
					{tabLabel}
					<span className="sr-only">)</span>
				</span>}
			</strong>
		);
	}

	return (
		<Link to={`${tabUrl}`} className="Tabs__item" onClick={onClick}>
			{tabText}
			{tabLabel && <span className="Tabs__label">
				<span className="sr-only"> (</span>
				{tabLabel}
				<span className="sr-only">)</span>
			</span>}
		</Link>
	);
}

function Tabs({
	tabs,
	currentTab,
	onClickAddTab,
}: TabsProps) {
	return (
		<nav id="tabs" aria-labelledby="tabs-label">
			<h2 id="tabs-label" className="sr-only">Lists</h2>
			<ul className="Tabs">
				{tabs.map(tab => (
					<li key={tab.id}>
						<TabLink
							tab={tab}
							currentTab={currentTab}
						/>
					</li>
				))}
				<li>
					<button type="button" className="Tabs__item" onClick={onClickAddTab}>
						Add a list
					</button>
				</li>
			</ul>
		</nav>
	);
}

export default Tabs;
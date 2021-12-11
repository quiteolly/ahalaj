import { useState } from 'react';
import { FormTab } from '../App';

import './Results.css';

interface ResultsProps {
	data: FormTab[],
	currentTab: FormTab,
}

function getStyle(colour: string | undefined) {
	return {
		'--picked-background': colour,
	} as React.CSSProperties;
}

function Results({ data, currentTab }: ResultsProps) {
	const [showAllTabs, setShowAllTabs] = useState(false);

	const tabData = showAllTabs ? data : [currentTab];
	const tabsWithResults = data.filter(tab => tab.results.length > 0);

	function renderResult(tab: FormTab, id: number, index: number) {
		const isPicked = tab.itemCount > index;
		if (showAllTabs && !isPicked) {
			return null;
		}

		const item = tab.data.find(i => i.id === id);
		if (!item) return null;

		return (
			<li key={item.id} className={`Results__result${isPicked ? ' Results__result--chosen' : ''}`} aria-hidden={isPicked ? undefined : true}>
				{isPicked && (
					<strong className="Results__result-badge" aria-hidden={showAllTabs ? true : undefined}>
						Picked
					</strong>
				)}
				{item.text}
			</li>
		)
	}

	function renderTab(tab: FormTab) {
		if (tab.results.length === 0) return null;

		return (
			<>
				{showAllTabs && (
					<h3 className="Results__list-title">List: {tab.name} ({tab.itemCount} out of {tab.data.length})</h3>
				)}
				<ol className="Results__list" style={getStyle(tab.resultsColour)}>
					{tab.results.map((id, index) => renderResult(tab, id, index))}
				</ol>
			</>
		);
	}

	if (currentTab.results.length === 0) {
		return null;
	}

	return (
		<div className="Results">
			<div className="Results__header">
				<h2 className="Results__title">Results:</h2>
				{tabsWithResults.length > 1 && (
					<>
						<input
							type="checkbox"
							id="results-view"
							checked={showAllTabs}
							onChange={(e) => setShowAllTabs(Boolean(e.currentTarget.checked))}
						/>
						<label htmlFor="results-view" className="Results__toggle">
							Show all
							{' '}
							<span className="sr-only">results</span>
						</label>
					</>
				)}
			</div>
			{tabData.map(tab => renderTab(tab))}
		</div>
	);
}

export default Results;
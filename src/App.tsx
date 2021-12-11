import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { randoSequence } from '@nastyox/rando.js';

import 'modern-css-reset/dist/reset.css';
import './App.css';

import ItemForm, { ItemData } from './components/ItemForm';
import FormInput from './components/FormInput';
import Results from './components/Results';
import Tabs from './components/Tabs';

export type FormTab = {
	id: string,
	name: string,
	data: ItemData[],
	itemCount: number,
	results: number[],
	resultsColour?: string,
}

const Storage = localStorage;

function generateColour() {
	const hue = Math.floor(Math.random() * 360);
	return `hsl(${hue}, 100%, 70%)`;
}

function getNewFormTab(index: number): FormTab {
	return {
		id: Math.random().toString().replace('0.', ''),
		name: `List ${index}`,
		data: [
			{
				id: Math.random(),
				text: '',
			},
		],
		itemCount: 2,
		results: [],
	}
}

function getForms(): FormTab[] {
	let lsData = null;
	try {
		lsData = Storage.getItem('data');
	} catch(e) {
		alert(`Error when getting the data: ${e}`);
	}
	if (lsData !== null) {
		return JSON.parse(lsData);
	}

	return [
		getNewFormTab(1),
	];
}
const defaultTitle = document.querySelector('head title')?.getAttribute('data-title');

function App() {
	const params = useParams();
	const navigate = useNavigate();
	const location = useLocation();

	const [tabs, setTabs] = useState<FormTab[]>(() => getForms());
	const [autoFocus, setAutoFocus] = useState(false);

	const titleFocusRef = useRef<HTMLHeadingElement>(null);
	const resultsFocusRef = useRef<HTMLDivElement>(null);
	
	const currentTab = getCurrentTab();

	useEffect(() => {
		document.title = `${currentTab.name} | ${defaultTitle}`;
	}, [location, currentTab.name]);
	
	useEffect(() => {
		try {
			Storage.setItem('data', JSON.stringify(tabs));
		} catch(e) {
			alert(`Error when saving the data: ${e}`);
		}
	}, [tabs]);

	useEffect(() => {
		if (currentTab.id !== params.name) {
			navigate(`/form/${currentTab.id}`, {
				replace: true,
			});
		}
	}, [currentTab.id, navigate, params.name]);

	useEffect(() => {
		if (autoFocus) setAutoFocus(false);
	}, [autoFocus]);

	useEffect(() => {
		// Announce new page title to screen readers
		titleFocusRef.current?.focus();
	}, [currentTab.id]);

	function getTab(id: string): FormTab | undefined {
		return tabs.find(tab => tab.id === id);
	}

	function getCurrentTab() {
		const lastTab = tabs[tabs.length - 1];
		const id = params.name || lastTab.id;
		let result = getTab(id) ?? lastTab;
		
		if (result === undefined) {
			throw new TypeError(`Tab ${id} not found.`);
		}
		return result;
	}

	function setCurrentTab(tab: FormTab) {
		setTabs(tabs.map(t => t.id === currentTab.id ? tab : t));
	}

	function removeCurrentTab(e: React.MouseEvent) {
		let response = e.shiftKey ? true : false;
		if (!e.shiftKey) {
			response = window.confirm(
				`Do you want to remove the list "${currentTab.name}"?`
			);
		}
		
		if (response) {
			setTabs(tabs.filter(tab => tab.id !== currentTab.id));
		}
	}

	const onClickAddTab = () => {
		let count = tabs.length + 1;
		
		const newTab = getNewFormTab(count);
		setTabs([
			...tabs,
			newTab,
		]);
		navigate(`/form/${newTab.id}`);

		return count;
	}

	const onClickAddTabItem = () => {
		// Auto-number if needed
		const data = currentTab.data;
		const prevText = data[data.length - 1].text;
		let defaultText = '';
		if (!isNaN(parseInt(prevText))) {
			const number = parseInt(prevText);
			defaultText = prevText.replace(number.toString(), (number + 1).toString());
		}

		setCurrentTab({
			...currentTab,
			data: [
				...currentTab.data,
				{
					id: Math.random(),
					text: defaultText,
				}
			]
		});
		setAutoFocus(true);
	}

	function onItemChange(data: ItemData) {
		setCurrentTab({
			...currentTab,
			data: currentTab.data.map(item => item.id === data.id ? data : item),
		});
	}

	function onItemRemove(id: number) {
		setCurrentTab({
			...currentTab,
			data: currentTab.data.filter(item => item.id !== id),
		});
	}

	function onFormChange(e: React.ChangeEvent<HTMLInputElement>) {
		const target = e.target;
		let targetValue = target.value;
		const targetName = target.name;

		if (targetName === 'itemCount') {
			if (targetValue === '0' || !/^[0-9\b]+$/.test(targetValue)) return;
			
			setCurrentTab({
				...currentTab,
				[targetName]: parseInt(targetValue),
			});
		}

		if (targetName === 'name') {
			setCurrentTab({
				...currentTab,
				[targetName]: targetValue,
			});
		}
	}

	function onFormSubmit(e: React.SyntheticEvent) {
		e.preventDefault();

		const data = currentTab.data;
		let itemCount = currentTab.itemCount;
		if (data.length < 2) {
			onClickAddTabItem();
			return;
		}
		if (data.length <= 2 && itemCount === 2) {
			itemCount = 1;
		}

		const results = randoSequence(data.filter(item => item.text?.trim() !== ''))
			.map((item) => item.value.id);
		
		setCurrentTab({
			...currentTab,
			results,
			resultsColour: generateColour(),
			itemCount,
		});
		
		resultsFocusRef.current?.scrollIntoView();
		resultsFocusRef.current?.focus();
	}

	return (
		<div className="App">
			<div className={`App__logo App__logo--active`}>Ahalaj</div>
			<Tabs
				tabs={tabs}
				currentTab={currentTab}
				onClickAddTab={onClickAddTab}
			/>
			<h1 className="sr-always" tabIndex={-1} ref={titleFocusRef}>
				{currentTab.name} | {defaultTitle}
			</h1>
			<div className="App__container">
				<form onSubmit={onFormSubmit}>
					<h2 className="sr-only">Enter any number of items</h2>
					<div className="App__form">
						<div>
							{currentTab.data.map((item, index) => (
								<ItemForm
									key={item.id}
									item={item}
									index={index}
									count={currentTab.data.length}
									autoFocus={autoFocus && index === currentTab.data.length - 1}
									onChange={onItemChange}
									onRemove={onItemRemove}
								/>
							))}
							<button type="button" className="App__button" onClick={onClickAddTabItem}>Add another</button>
						</div>
						<div>
							<FormInput
								id="form-name"
								name="name"
								value={currentTab.name}
								onChange={onFormChange}
							>
								Form name
							</FormInput>
						</div>
						<div>
							<FormInput
								type="number"
								id="form-item-count"
								name="itemCount"
								value={currentTab.itemCount.toString()}
								onChange={onFormChange}
							>
								Pick… <span className="sr-only">a target number</span>
							</FormInput>
						</div>
						<div>
							<button type="submit" className="App__button App__button--primary">Randomise</button>
						</div>
						{tabs.length > 1 && <div>
							<button type="button" className="App__button" onClick={removeCurrentTab}>Remove this tab</button>
						</div>}
					</div>
				</form>
				<div tabIndex={-1} ref={resultsFocusRef}>
					<Results
						data={tabs}
						currentTab={currentTab}
					/>
				</div>
			</div>
		</div>
	);
}

export default App;

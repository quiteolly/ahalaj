import { useState } from 'react';
import './ItemForm.css';

import FormInput from './FormInput';

export type ItemData = {
	id: number,
	text: string,
}

interface ItemFormProps {
	item: ItemData,
	index: number,
	count: number,
	autoFocus: boolean,
	onChange: (data: ItemData) => void,
	onRemove: (id: number) => void,
}

function ItemForm({ item, index, count, autoFocus, onChange, onRemove }: ItemFormProps) {
	const [data, setData] = useState<ItemData>({
		id: item.id,
		text: item.text,
	});

	function handleChange(value: string) {
		const result = {
			...data,
			text: value,
		};

		setData(result);
		onChange(result);
	}

	return (
		<div className="ItemForm">
			<FormInput
				id={`text-${item.id}`}
				isLabelHidden={index !== 0}
				value={data.text}
				onChange={(e) => handleChange(e.currentTarget.value)}
				autoFocus={autoFocus}
				required={count <= 2}
			>
				<span aria-hidden="true">Enter some</span>
				{' '}
				text
			</FormInput>
			{count > 1 &&
				<button type="button" className="ItemForm__remove-button" onClick={() => onRemove(item.id)}>Remove</button>
			}
		</div>
	)
}

export default ItemForm;

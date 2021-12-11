import './FormInput.css';

interface FormInputProps {
	id: string,
	children: React.ReactNode,
	name?: string,
	type?: string,
	value?: string | undefined,
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
	isLabelHidden?: boolean,
	autoFocus?: boolean,
	required?: boolean,
}

function FormInput({
	id,
	children: label,
	isLabelHidden,
	name,
	type,
	value,
	onChange,
	autoFocus,
	required,
}: FormInputProps) {
	return (
		<>
			<label htmlFor={id} className={`FormInput__label${isLabelHidden ? ' sr-only' : ''}`}>
				{label}
			</label>
			<input
				type={type || "text"}
				className="FormInput__input"
				id={id}
				name={name || id}
				value={value}
				onChange={onChange}
				autoFocus={autoFocus}
				required={required}
			/>
		</>
	);
}

export default FormInput;
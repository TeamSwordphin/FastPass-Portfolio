type NameParts = {
	firstName: string;
	lastName: string;
};

export async function splitName(fullName: string): Promise<NameParts> {
	const parts = fullName.trim().split(/\s+/); // split by whitespace

	if (parts.length === 1) {
		return {
			firstName: parts[0],
			lastName: '',
		};
	}

	const lastName = parts.pop() ?? '';
	const firstName = parts.join(' ');

	return {
		firstName,
		lastName,
	};
}

export const setLocalStorage = (key: string, value: any) => {
	window.localStorage.setItem(key, JSON.stringify(value))
}

export const getLocalStorage = (key: string) => {
	const item = window.localStorage.getItem(key)
	return item ? JSON.parse(item) : null
}

export const removeLocalStorage = (key: string) => {
	window.localStorage.removeItem(key)
}

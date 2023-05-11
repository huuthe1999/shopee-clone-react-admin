enum ERoles {
	User = 'User',
	Admin = 'Admin'
}
export interface IUser {
	_id: string
	email: string
	name: string
	date_of_birth: Date | null
	address?: string
	phone?: string
	roles: ERoles[]
	createdAt?: Date
	updatedAt?: Date
}

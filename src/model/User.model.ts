import { ID, id } from '../repository/IRepository';

export class User implements ID {
	id: id;
	name: string;
	email: string;
	password: string;

	constructor(name: string, email: string, password: string, id?: id) {
		this.id = id || '';
		this.name = name;
		this.email = email;
		this.password = password;
	}

	getId(): id {
		return this.id;
	}
}

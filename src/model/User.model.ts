import { ROLE } from '../config/roles';
import { ID, id } from '../repository/IRepository';

export class User implements ID {
	id: id;
	name: string;
	email: string;
	password: string;
	role: string;

	constructor(name: string, email: string, password: string, role: ROLE= ROLE.user, id?: id) {
		this.id = id || '';
		this.name = name;
		this.email = email;
		this.password = password;
		this.role = role;
	}

	getId(): id {
		return this.id;
	}
}

create table users
(
	id uuid
		constraint users_pk
			primary key,
	email text not null,
	password text not null
);

create unique index users_email_uindex
	on users(email);

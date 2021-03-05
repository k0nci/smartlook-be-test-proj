create table items
(
	id bigint
		constraint items_pk
			primary key,
	type text not null,
	author text not null,
	created_at timestamp not null,
	content text not null,
	title text not null,
	parent bigint not null,
	kids bigint[] not null,
	url text
);

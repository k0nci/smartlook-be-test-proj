create table stories
(
	id bigint
		constraint stories_pk
			primary key,
	author text not null,
	created_at timestamp not null,
	title text not null,
	kids bigint[] not null,
	url text
);

create table comments
(
	id bigint
		constraint comments_pk
			primary key,
	author text not null,
	created_at timestamp not null,
	content text not null,
	parent bigint not null
		constraint comments_stories_id_fk
			references stories (id),
	kids bigint[] not null
);

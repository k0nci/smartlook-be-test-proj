create table collections
(
	id uuid
		constraint collections_pk
			primary key,
	name text not null,
	owner_id uuid not null
    constraint collections_users_owner_id_fk
        references users (id)
);

create table collections_stories
(
  collection_id uuid not null,
  story_id bigint not null,
  primary key (collection_id, story_id)
);

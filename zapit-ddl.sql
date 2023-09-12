create database zapit;

use zapit;

create table location_data
(
    id        integer auto_increment,
    latitude  decimal(13, 10) not null,
    longitude decimal(13, 10) not null,
    primary key (id)
);

create table users
(
    id           integer auto_increment,
    email        varchar(255) not null unique,
    display_name varchar(255) not null unique,
    password     varchar(255) not null,
    first_name   varchar(255),
    last_name    varchar(255),
    roles        varchar(255) not null default 'ROLE_USER',
    is_deleted   boolean      not null default false,
    created_on   timestamp    not null default current_timestamp,
    updated_on   timestamp on update current_timestamp,
    primary key (id)
);

# user settings tbc

create table merchants
(
    id         integer auto_increment,
    name       varchar(255) not null unique,
    website    varchar(255),
    address    varchar(255),
    post_code  varchar(255),
    is_deleted boolean      not null default false,
    created_by integer      not null unique,
    created_on timestamp    not null default current_timestamp,
    updated_on timestamp on update current_timestamp,
    primary key (id),
    foreign key (created_by) references users (id)
);

create table cards
(
    id         varchar(255),
    user       integer        not null,
    balance    decimal(13, 4) not null,
    is_deleted boolean        not null default false,
    issued_by  integer        not null,
    created_on timestamp      not null default current_timestamp,
    updated_on timestamp on update current_timestamp,
    primary key (id),
    foreign key (user) references users (id),
    foreign key (issued_by) references merchants (id)
);

create table transactions
(
    id            integer auto_increment,
    card          varchar(255)   not null,
    amount        decimal(13, 4) not null,
    status        boolean        not null default false,
    location_data integer,
    created_on    timestamp      not null default current_timestamp,
    updated_on    timestamp on update current_timestamp,
    primary key (id),
    foreign key (card) references cards (id),
    foreign key (location_data) references location_data (id)
);
select t.*, ld.*, m.* from transactions t join cards c on c.id = t.card join merchants m on m.id = c.issued_by left join location_data ld on ld.id = t.location_data where c.user = 1 and c.is_deleted = false order by t.created_on desc
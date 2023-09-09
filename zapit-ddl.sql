create database zapit;

use zapit;

create table users (
    id integer auto_increment,
    email_address varchar(255) not null unique,
    username varchar(255) not null unique,
    password varchar(255) not null,
    first_name varchar(255),
    last_name varchar(255),
    roles varchar(255) not null default 'ROLE_USER',
    is_deleted boolean not null default false,
    created_on integer not null default unix_timestamp(),
    updated_on integer,
    primary key (id)
);

# user settings tbc

create table merchants (
    id integer auto_increment,
    name varchar(255) not null unique,
    website varchar(255),
    address varchar(255),
    post_code varchar(255),
    is_deleted boolean not null default false,
    created_by integer not null unique,
    created_on integer not null default unix_timestamp(),
    updated_on integer,
    primary key (id),
    foreign key (created_by) references users(id)
);

create table transactions (
    id integer auto_increment,
    invoice binary(12) not null,
    is_claim_only boolean not null default true,
    created_by integer not null,
    created_on integer not null default unix_timestamp(),
    updated_on integer,
    primary key (id),
    foreign key (created_by) references users(id)
);

create table transaction_payments (
    id integer auto_increment,
    transaction integer not null,
    amount decimal(8,2) not null,
    method varchar(255) not null,
    status boolean not null default false,
    created_by integer not null,
    created_on integer not null default unix_timestamp(),
    updated_on integer,
    primary key (id),
    foreign key (created_by) references users(id)
);
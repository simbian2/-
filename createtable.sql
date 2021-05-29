create database homework;

use homework;

create table homework(
    id INTEGER(30) PRIMARY KEY,
    userid varchar(30),
    userpw varchar(30)
);

insert into homework (id, userid, userpw) values(1,'sha256', 'sha256');
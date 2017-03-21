drop table if exists user_t;
create table user_t
(
   id                   int(20) not null auto_increment comment '主键',
   user_name            varchar(256) comment '用户名',
   password             varchar(256) comment '密码',
   create_time          datetime default CURRENT_TIMESTAMP comment '创建时间',
   update_time          datetime default CURRENT_TIMESTAMP comment '更新时间',
   create_person        varchar(20) default 'system' comment '创建人',
   update_person        varchar(20) default 'system' comment '更新人',
   primary key (id)
);
alter table user_t comment '用户表';